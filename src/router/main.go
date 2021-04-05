package main

import (
	"fmt"
	"log"
	"net"
	"os"

	"github.com/AkihiroSuda/go-netfilter-queue"
	"github.com/akamensky/argparse"
	"github.com/jsimonetti/rtnetlink/rtnl"

	"github.com/mdlayher/ethernet"
	"github.com/mdlayher/raw"
)

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds)

	// parse args
	parser := argparse.NewParser("router", "Sets forwarding table in linux to route packets in adhoc-network")
	ifaceName := parser.String("i", "iface", &argparse.Options{Required: true, Help: "Interface name"})
	loIfaceName := parser.String("", "lo", &argparse.Options{Required: false, Help: "Loopback interface name", Default: "lo"})
	queueNumber := parser.Int("q", "queue-num", &argparse.Options{Required: false, Help: "Packets queue number", Default: 0})

	err := parser.Parse(os.Args)
	if err != nil {
		fmt.Print(parser.Usage(err))
		os.Exit(1)
	}

	// start modules
	go startForwarder(*ifaceName, *loIfaceName, *queueNumber)
	startController()
}

func startController() {
	// TODO
	select {}
}

func startForwarder(ifaceName string, loIfaceName string, queueNumber int) {
	// get interfaces
	iface, err := net.InterfaceByName(ifaceName)
	if err != nil {
		log.Fatal("couldn't get interface ", ifaceName, " error:", err)
	}
	loIface, err := net.InterfaceByName(loIfaceName)
	if err != nil {
		log.Fatal("couldn't get interface ", loIfaceName, " error:", err)
	}

	// connect to rtnl
	rtnlConn, err := rtnl.Dial(nil)
	if err != nil {
		log.Fatal("can't establish netlink connection: ", err)
	}
	defer rtnlConn.Close()

	// open interface
	err = rtnlConn.LinkUp(iface)
	if err != nil {
		log.Fatal("can't link-up the interface", err)
	}
	log.Print(ifaceName, " is up")

	// open lo interface
	err = rtnlConn.LinkUp(loIface)
	if err != nil {
		log.Fatal("can't link-up lo interface", err)
	}
	log.Print(loIfaceName, " is up")

	// connect raw to iface
	ifaceRawConn, err := raw.ListenPacket(iface, mSecEtherType, nil)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	defer ifaceRawConn.Close()

	log.Println("initalized forwarder")

	go receiveFromMACLayer(ifaceRawConn, iface.MTU, loIface)
	receiveFromIPLayer(rtnlConn, iface, ifaceRawConn)
}

// Make use of an unassigned EtherType to differentiate between MSec traffic and other traffic
// https://www.iana.org/assignments/ieee-802-numbers/ieee-802-numbers.xhtml
const mSecEtherType = 0x7031

// receiveFromMACLayer continuously receives messages from the interface,
// then either repeats it over loopback (if this is destination), or forwards it for another node.
// The messages may be up to the interface's MTU in size.
func receiveFromMACLayer(ifaceRawConn net.PacketConn, mtu int, loIface *net.Interface) {
	var f ethernet.Frame
	b := make([]byte, mtu)

	loConn, err := raw.ListenPacket(loIface, mSecEtherType, nil)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	defer loConn.Close()

	log.Println("started receiving from MAC layer")
	for {
		// read from interface
		n, addr, err := ifaceRawConn.ReadFrom(b)
		if err != nil {
			log.Fatalf("failed to receive message: %v", err)
		}

		// unpack Ethernet II frame
		if err := (&f).UnmarshalBinary(b[:n]); err != nil {
			log.Fatalf("failed to unmarshal ethernet frame: %v", err)
		}

		// TODO: determine if to receive it or forward it
		packet := decrypt(f.Payload)

		// i'm destination, receive message by injecting it in loopback
		err = writeRaw(loConn, net.HardwareAddr(addr.Network()), ethernet.Broadcast, packet)
		if err != nil {
			log.Fatal("Couldn't write to lo interface:", err)
		}
	}
}

// receiveFromIPLayer periodically forwards packets from IP to MAC
// after encrypting them and determining their destination
func receiveFromIPLayer(rtnlConn *rtnl.Conn, iface *net.Interface, ifaceRawConn *raw.Conn) {
	// get packets from kernel
	nfq, err := netfilter.NewNFQueue(0, 200, netfilter.NF_DEFAULT_PACKET_SIZE)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	defer nfq.Close()

	packets := nfq.GetPackets()

	log.Println("started receiving from MAC layer")
	for {
		select {
		case p := <-packets:
			// steal packet
			p.SetVerdict(netfilter.NF_ACCEPT)
			packet := p.Packet.Data()

			// determine forwarding dest
			destIP, err := extractIP(packet)
			if err != nil {
				log.Println("Couldn't extract ip from packet, ignore it")
				continue
			}
			destHWAddr, err := getForwardDest(destIP)
			if err != nil {
				log.Fatal("Couldn't determine packets destination:", err)
			}

			// encrypt
			encryptedPacket := encrypt(packet)

			// hand it directly to the interface
			err = writeRaw(ifaceRawConn, iface.HardwareAddr, destHWAddr, encryptedPacket)
			if err != nil {
				log.Fatal("Couldn't write to the interface:", err)
			}
		}
	}
}

func extractIP(packet []byte) (net.IP, error) {
	// TODO
	return net.IPv4(0, 0, 0, 0), nil
}

func getForwardDest(packet []byte) (net.HardwareAddr, error) {
	// TODO: extract IP address
	// TODO: lookup forwarding table for given
	return ethernet.Broadcast, nil
}

// writeRaw sends a message over an interface, sourced from specified hardware address.
func writeRaw(ifaceRawConn net.PacketConn, source net.HardwareAddr, dest net.HardwareAddr, msg []byte) error {
	// Message is broadcast to all machines in same network segment.
	f := &ethernet.Frame{
		Destination: dest,
		Source:      source,
		EtherType:   mSecEtherType,
		Payload:     msg,
	}

	b, err := f.MarshalBinary()
	if err != nil {
		log.Fatalf("failed to marshal ethernet frame: %v", err)
	}

	// Required by Linux, even though the Ethernet frame has a destination.
	// Unused by BSD.
	addr := &raw.Addr{
		HardwareAddr: dest,
	}

	_, err = ifaceRawConn.WriteTo(b, addr)
	return err
}

func encrypt(msg []byte) []byte {
	msg[0]++
	return msg
}

func decrypt(msg []byte) []byte {
	msg[0]--
	return msg
}
