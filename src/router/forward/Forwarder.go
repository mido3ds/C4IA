package forward

import (
	"log"
	"net"

	"github.com/AkihiroSuda/go-netfilter-queue"
	. "github.com/mido3ds/C4IAN/src/router/flood"
	. "github.com/mido3ds/C4IAN/src/router/ip"
	. "github.com/mido3ds/C4IAN/src/router/mac"
	. "github.com/mido3ds/C4IAN/src/router/msec"
	. "github.com/mido3ds/C4IAN/src/router/tables"
	. "github.com/mido3ds/C4IAN/src/router/zhls/dzd"
	. "github.com/mido3ds/C4IAN/src/router/zhls/zid"
)

type Forwarder struct {
	iface          *net.Interface
	msec           *MSecLayer
	ip             net.IP
	zidMacConn     *MACLayerConn
	ipMacConn      *MACLayerConn
	ipConn         *IPLayerConn
	UniForwTable   *UniForwardTable
	MultiForwTable *MultiForwardTable
	neighborsTable *NeighborsTable
	dzdController  *DZDController
	ucFlooder      *GlobalFlooder

	// multicast controller callback
	mcGetMissingEntries func(grpIP net.IP) bool
	isInMCastGroup      func(grpIP net.IP) bool

	// Unicast controller callbacks
	updateUnicastForwardingTable func(ft *UniForwardTable)

	// braodcast
	bcFlooder *GlobalFlooder
}

func NewForwarder(iface *net.Interface, ip net.IP, msec *MSecLayer,
	neighborsTable *NeighborsTable, dzdController *DZDController,
	mcGetMissingEntries func(grpIP net.IP) bool,
	isInMCastGroup func(grpIP net.IP) bool,
	updateUnicastForwardingTable func(ft *UniForwardTable),
	timers *TimersQueue) (*Forwarder, error) {
	// connect to mac layer for ZID packets
	zidMacConn, err := NewMACLayerConn(iface, ZIDDataEtherType)
	if err != nil {
		return nil, err
	}

	// connect to mac layer for multicast IP packets
	ipMacConn, err := NewMACLayerConn(iface, IPv4EtherType)
	if err != nil {
		return nil, err
	}

	// connect to ip layer
	ipConn, err := NewIPLayerConn()
	if err != nil {
		return nil, err
	}

	UniForwTable := NewUniForwardTable()
	MultiForwTable := NewMultiForwardTable(timers)

	log.Println("initalized forwarder")

	return &Forwarder{
		iface:                        iface,
		msec:                         msec,
		ip:                           ip,
		zidMacConn:                   zidMacConn,
		ipMacConn:                    ipMacConn,
		ipConn:                       ipConn,
		UniForwTable:                 UniForwTable,
		neighborsTable:               neighborsTable,
		dzdController:                dzdController,
		MultiForwTable:               MultiForwTable,
		mcGetMissingEntries:          mcGetMissingEntries,
		updateUnicastForwardingTable: updateUnicastForwardingTable,
		isInMCastGroup:               isInMCastGroup,
		bcFlooder:                    NewGlobalFlooder(ip, iface, ZIDBroadcastEtherType, msec),
		ucFlooder:                    NewGlobalFlooder(ip, iface, ZIDFloodEtherType, msec),
	}, nil
}

func (f *Forwarder) Start() {
	go f.forwardFromIPLayer()
	go f.forwardZIDFromMACLayer()
	go f.forwardIPFromMACLayer()
	go f.forwardFloodedBroadcastMessages()
	go f.forwardFloodedUnicastMessages()
}

// forwardZIDFromMACLayer continuously receives messages from the interface,
// then either repeats it over loopback (if this is destination), or forwards it for another node.
// The messages may be up to the interface's MTU in size.
func (f *Forwarder) forwardZIDFromMACLayer() {
	log.Println("started receiving from MAC layer")

	for {
		packet := f.zidMacConn.Read()

		go func() {
			// decrypt and verify
			zid, valid := UnmarshalZIDHeader(f.msec.Decrypt(packet[:ZIDHeaderLen]))
			if !valid {
				log.Println("Received a packet with an invalid ZID header")
				return
			}

			ipHdr := f.msec.Decrypt(packet[ZIDHeaderLen : ZIDHeaderLen+IPv4HeaderLen])
			ip, valid := UnmarshalIPHeader(ipHdr)
			if !valid {
				log.Println("Received a packet with an invalid IP header")
				return
			}

			if imDestination(f.ip, ip.DestIP) {
				ipPayload := f.msec.Decrypt(packet[ZIDHeaderLen+IPv4HeaderLen:])
				ipPacket := append(ipHdr, ipPayload...)

				// receive message by injecting it in loopback
				err := f.ipConn.Write(ipPacket)
				if err != nil {
					log.Panic("failed to write to lo interface: ", err)
				}
			} else { // i'm a forwarder
				if valid := IPv4DecrementTTL(ipHdr); !valid {
					log.Println("ttl <= 0, drop packet")
					return
				}
				IPv4UpdateChecksum(ipHdr)

				// re-encrypt ip hdr
				copy(packet[ZIDHeaderLen:ZIDHeaderLen+IPv4HeaderLen], f.msec.Encrypt(ipHdr))

				myZone := MyZone()
				dstZone := Zone{ID: zid.DstZID, Len: zid.ZLen}

				if dstZone.Len == myZone.Len {
					f.forwardZIDToNextHop(packet, myZone.ID, dstZone.ID, ip.DestIP)
				} else if castedDstZID, intersects := dstZone.Intersection(myZone); !intersects {
					// not same area, but no intersection. safe to ignore difference in zlen
					f.forwardZIDToNextHop(packet, myZone.ID, castedDstZID, ip.DestIP)
				} else {
					// flood in biggest(dstzone, myzone)
					f.ucFlooder.Flood(packet)
				}
			}
		}()
	}
}

func (f *Forwarder) forwardZIDToNextHop(packet []byte, myZID, dstZID ZoneID, dstIP net.IP) {
	var nextHopMAC net.HardwareAddr
	var inMyZone, reachable bool

	if dstZID == myZID {
		// The destination is in my zone, search in the forwarding table by its ip
		nextHopMAC, inMyZone = f.GetUnicastNextHop(ToNodeID(dstIP))
		if !inMyZone {
			// If the IP is not found in the forwarding table (my zone)
			// although the src claims that it is
			// then the dest may have moved out of this zone
			// or the src have an old cached value for the dst zone
			// discover its new zone
			dstZID, cached := f.dzdController.CachedDstZone(dstIP)
			if cached {
				nextHopMAC, reachable = f.GetUnicastNextHop(ToNodeID(dstZID))
				if !reachable {
					// TODO: Should we do anything else here?
					log.Println(dstZID, "is unreachable (Forwarder)")
					return
				}
			} else {
				// if dst zone isn't cached, search for it
				// and buffer this msg to be sent when dst zone response arrive
				f.dzdController.FindDstZone(dstIP)
				f.dzdController.BufferPacket(dstIP, packet, func(packet []byte, dstIP net.IP) {
					dstZoneID, cached := f.dzdController.CachedDstZone(dstIP)
					if cached {
						nextHopMAC, reachable = f.GetUnicastNextHop(ToNodeID(dstZoneID))
						if !reachable {
							// TODO: Should we do anything else here?
							log.Println(dstZoneID, "is unreachable (Forwarder)")
							return
						}
						f.zidMacConn.Write(packet, nextHopMAC)
					} else {
						log.Panicln("Dst Zone must be cached here")
					}
				})
				return
			}
		}
	} else {
		// The dst is in a different zone,
		// search in the forwarding table by its zone
		nextHopMAC, reachable = f.GetUnicastNextHop(ToNodeID(dstZID))
		if !reachable {
			// TODO: Should we do anything else here?
			log.Println(dstZID, "is unreachable (Forwarder)")
			return
		}
	}

	// hand it directly to the interface
	f.zidMacConn.Write(packet, nextHopMAC)
}

// forwardIPFromMACLayer continuously receives messages from the interface,
// then either repeats it over loopback (if this is destination), or forwards it for another node.
// The messages may be up to the interface's MTU in size.
func (f *Forwarder) forwardIPFromMACLayer() {
	log.Println("started receiving from MAC layer")

	for {
		packet := f.ipMacConn.Read()
		log.Printf("Node IP:%#v, fwd table: %#v\n", f.ip.String(), f.MultiForwTable.String())
		// TODO: speed up by goroutine workers

		// decrypt and verify
		ipHdr := f.msec.Decrypt(packet[:IPv4HeaderLen])
		ip, valid := UnmarshalIPHeader(ipHdr)
		if !valid {
			log.Printf("NOT valid header") // TODO delete
			continue
		}
		log.Printf("valid header") // TODO delete

		if f.isInMCastGroup(ip.DestIP) { // i'm destination,
			ipPayload := f.msec.Decrypt(packet[IPv4HeaderLen:])
			ipPacket := append(ipHdr, ipPayload...)

			// receive message by injecting it in loopback
			err := f.ipConn.Write(ipPacket)
			log.Println("recieved and destination") // TODO remove this
			if err != nil {
				log.Panic("failed to write to lo interface: ", err)
			}
		} else { // TODO remove
			log.Println("recieved but not destination")
		}

		if valid := IPv4DecrementTTL(ipHdr); !valid {
			log.Println("ttl <= 0, drop packet")
			continue
		}
		IPv4UpdateChecksum(ipHdr)

		// even if im destination, i may forward it
		es, exist := f.MultiForwTable.Get(ip.DestIP)

		if exist {
			// re-encrypt ip hdr
			copy(packet[:IPv4HeaderLen], f.msec.Encrypt(ipHdr))
			// write to device driver
			for item := range es.Items.Iter() {
				log.Printf("Forward packet to:%#v\n", item.Value.(*NextHopEntry).NextHop.String())
				f.ipMacConn.Write(packet, item.Value.(*NextHopEntry).NextHop)
			}
		}
	}
}

// forwardFromIPLayer periodically forwards packets from IP to MAC
// after encrypting them and determining their destination
func (f *Forwarder) forwardFromIPLayer() {
	log.Println("started receiving from IP layer")

	for {
		p := f.ipConn.Read()

		go func() {
			packet := p.Packet.Data()

			// TODO: speed up by fanout netfilter feature

			ip, valid := UnmarshalIPHeader(packet)

			if !valid {
				log.Println("ip6 is not supported, drop packet")
				p.SetVerdict(netfilter.NF_DROP)
			} else if imDestination(f.ip, ip.DestIP) || f.isInMCastGroup(ip.DestIP) {
				p.SetVerdict(netfilter.NF_ACCEPT)
			} else { // to out
				// sender shall know the papcket is sent
				p.SetVerdict(netfilter.NF_DROP)

				// reset ttl if ip layer, weirdly, gave low ttl
				// doesn't work for traceroute
				IPv4ResetTTL(packet)
				IPv4UpdateChecksum(packet)

				switch iptype := GetIPAddrType(ip.DestIP); iptype {
				case UnicastIPAddr:
					f.sendUnicast(packet, ip.DestIP)
				case MulticastIPAddr:
					f.sendMulticast(packet, ip.DestIP)
				case BroadcastIPAddr:
					f.sendBroadcast(packet)
				default:
					log.Panic("got invalid ip address from ip layer")
				}
			}
		}()
	}
}

func (f *Forwarder) forwardFloodedBroadcastMessages() {
	f.bcFlooder.ListenForFloodedMsgs(func(encryptedPacket []byte) []byte {
		zidhdr := f.msec.Decrypt(encryptedPacket[:ZIDHeaderLen])
		zid, ok := UnmarshalZIDHeader(zidhdr)
		if !ok {
			// invalid zid header, stop here
			return nil
		}

		iphdr := f.msec.Decrypt(encryptedPacket[ZIDHeaderLen : ZIDHeaderLen+IPv4HeaderLen])
		ip, ok := UnmarshalIPHeader(iphdr)
		if !ok {
			// invalid ip header, stop here
			return nil
		}

		r1 := BroadcastRadius(ip.DestIP)
		r2 := MyZone().ID.DistTo(zid.SrcZID)
		if r2 > r1 {
			// out of zone broadcast, stop here
			return nil
		}

		go func() {
			// inject it into my ip layer
			payload := f.msec.Decrypt(encryptedPacket[ZIDHeaderLen+IPv4HeaderLen:])
			IPv4SetDest(iphdr, f.ip)
			f.ipConn.Write(append(iphdr, payload...))
		}()

		// continue flooding
		return encryptedPacket
	})
}

func (f *Forwarder) forwardFloodedUnicastMessages() {
	f.ucFlooder.ListenForFloodedMsgs(func(encryptedPacket []byte) []byte {
		zidhdr := f.msec.Decrypt(encryptedPacket[:ZIDHeaderLen])
		zid, ok := UnmarshalZIDHeader(zidhdr)
		if !ok {
			// invalid zid header, stop here
			return nil
		}

		myzone := MyZone()
		dstzone := Zone{ID: zid.DstZID, Len: zid.ZLen}
		if _, intersects := myzone.Intersection(dstzone); !intersects {
			// out of zone, stop here
			return nil
		}

		iphdr := f.msec.Decrypt(encryptedPacket[ZIDHeaderLen : ZIDHeaderLen+IPv4HeaderLen])
		ip, ok := UnmarshalIPHeader(iphdr)
		if !ok {
			// invalid ip header, stop here
			return nil
		}

		go func() {
			if ip.DestIP.Equal(f.ip) {
				// inject it into my ip layer
				payload := f.msec.Decrypt(encryptedPacket[ZIDHeaderLen+IPv4HeaderLen:])
				IPv4SetDest(iphdr, f.ip)
				f.ipConn.Write(append(iphdr, payload...))
			}
		}()

		// continue flooding
		return encryptedPacket
	})
}

func (f *Forwarder) Close() {
	f.zidMacConn.Close()
	f.ipMacConn.Close()
	f.ipConn.Close()

	f.ucFlooder.Close()
	f.bcFlooder.Close()
}
