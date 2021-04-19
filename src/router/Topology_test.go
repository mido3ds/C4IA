package main

import (
	"fmt"
	"net"
	"testing"
)

// Example : https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
func Benchmark_Topology(b *testing.B) {
	ip0 := net.IP([]byte{0x00, 0x00, 0x00, 0x00})
	ip1 := net.IP([]byte{0x00, 0x00, 0x00, 0x01})
	ip2 := net.IP([]byte{0x00, 0x00, 0x00, 0x02})
	ip3 := net.IP([]byte{0x00, 0x00, 0x00, 0x03})
	ip4 := net.IP([]byte{0x00, 0x00, 0x00, 0x04})
	ip5 := net.IP([]byte{0x00, 0x00, 0x00, 0x05})
	ip6 := net.IP([]byte{0x00, 0x00, 0x00, 0x06})
	ip7 := net.IP([]byte{0x00, 0x00, 0x00, 0x07})
	ip8 := net.IP([]byte{0x00, 0x00, 0x00, 0x08})

	topology := NewTopology()

	neighborsTable0 := NewNeighborsTable()
	neighborsTable0.Set(ip1, &NeighborEntry{cost: 4})
	neighborsTable0.Set(ip7, &NeighborEntry{cost: 8})
	topology.Update(ip0, neighborsTable0)

	neighborsTable1 := NewNeighborsTable()
	neighborsTable1.Set(ip2, &NeighborEntry{cost: 8})
	neighborsTable1.Set(ip7, &NeighborEntry{cost: 11})
	topology.Update(ip1, neighborsTable1)

	neighborsTable2 := NewNeighborsTable()
	neighborsTable2.Set(ip1, &NeighborEntry{cost: 8})
	neighborsTable2.Set(ip3, &NeighborEntry{cost: 7})
	neighborsTable2.Set(ip8, &NeighborEntry{cost: 2})
	topology.Update(ip2, neighborsTable2)

	neighborsTable3 := NewNeighborsTable()
	neighborsTable3.Set(ip2, &NeighborEntry{cost: 7})
	neighborsTable3.Set(ip4, &NeighborEntry{cost: 9})
	neighborsTable3.Set(ip5, &NeighborEntry{cost: 14})
	topology.Update(ip3, neighborsTable3)

	neighborsTable4 := NewNeighborsTable()
	neighborsTable4.Set(ip3, &NeighborEntry{cost: 9})
	neighborsTable4.Set(ip5, &NeighborEntry{cost: 10})
	topology.Update(ip4, neighborsTable4)

	neighborsTable5 := NewNeighborsTable()
	neighborsTable5.Set(ip2, &NeighborEntry{cost: 4})
	neighborsTable5.Set(ip3, &NeighborEntry{cost: 14})
	neighborsTable5.Set(ip4, &NeighborEntry{cost: 10})
	neighborsTable5.Set(ip6, &NeighborEntry{cost: 2})
	topology.Update(ip5, neighborsTable5)

	neighborsTable6 := NewNeighborsTable()
	neighborsTable6.Set(ip5, &NeighborEntry{cost: 2})
	neighborsTable6.Set(ip7, &NeighborEntry{cost: 1})
	neighborsTable6.Set(ip8, &NeighborEntry{cost: 6})
	topology.Update(ip6, neighborsTable6)

	neighborsTable7 := NewNeighborsTable()
	neighborsTable7.Set(ip0, &NeighborEntry{cost: 8})
	neighborsTable7.Set(ip1, &NeighborEntry{cost: 11})
	neighborsTable7.Set(ip6, &NeighborEntry{cost: 1})
	neighborsTable7.Set(ip8, &NeighborEntry{cost: 7})
	topology.Update(ip7, neighborsTable7)

	neighborsTable8 := NewNeighborsTable()
	neighborsTable8.Set(ip2, &NeighborEntry{cost: 2})
	neighborsTable8.Set(ip6, &NeighborEntry{cost: 6})
	neighborsTable8.Set(ip7, &NeighborEntry{cost: 7})
	topology.Update(ip8, neighborsTable8)

	nextHopTable := topology.Dijkstra(ip0)

	for item := range nextHopTable.Iter() {
		fmt.Println("dst:", UInt32ToIPv4(item.Key.(uint32)), " nextHop:", UInt32ToIPv4(item.Value.(uint32)))
	}

}
