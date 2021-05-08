package forward

import (
	"net"

	. "github.com/mido3ds/C4IAN/src/router/tables"
)

func imDestination(ip, destIP net.IP) bool {
	return destIP.Equal(ip) || destIP.IsLoopback()
}

func imInMulticastGrp(destGrpIP net.IP) bool {
	// TODO
	return false
}

func (forwarder *Forwarder) GetUnicastNextHop(dst NodeID) (net.HardwareAddr, bool) {
	// Destination is a direct neighbor, send directly to it
	ne, ok := forwarder.neighborsTable.Get(dst)
	if ok {
		return ne.MAC, true
	}

	// Otherwise look for the next hop in the forwarding table
	forwarder.updateUnicastForwardingTable(forwarder.UniForwTable)
	nextHopMAC, ok := forwarder.UniForwTable.Get(dst)
	if ok {
		return nextHopMAC, true
	}
	return nil, false
}
