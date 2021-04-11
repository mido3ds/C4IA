package odmrp

import "fmt"

type JoinQueryFound int

const (
	FOUND JoinQueryFound = iota
	FOUND_LONGER
	NOT_FOUND
)

type JoinQuerySlot struct {
	src       int
	prev_hop  int
	seqno     int
	hop_count int
	next      *JoinQuerySlot
}

type JoinQueryTable struct {
	hash_table []JoinQuerySlot
}

func newJoinQueryTable() JoinQueryTable {
	var jqt JoinQueryTable
	jqt.hash_table = make([]JoinQuerySlot, JQ_SRC_HASH_SIZE)
	for i := 0; i < len(jqt.hash_table); i++ {
		var new_jq_slot JoinQuerySlot
		new_jq_slot.next = nil
		new_jq_slot.src = -1
		new_jq_slot.seqno = 0
		jqt.hash_table[i] = new_jq_slot
	}
	return jqt
}

func (jqt *JoinQueryTable) Lookup(src_addr int, seqno int, hop_count int) JoinQueryFound {
	index := src_addr % len(jqt.hash_table)

	if jqt.hash_table[index].src == src_addr &&
		jqt.hash_table[index].seqno == seqno || jqt.hash_table[index].seqno > seqno {
		if jqt.hash_table[index].hop_count > hop_count {
			return FOUND_LONGER //TODO should we update to the new hop count and prev hop?
		}
		return FOUND
	} else {
		temp := jqt.hash_table[index].next
		for temp != nil {
			if temp.src == src_addr && (temp.seqno == seqno || temp.seqno > seqno) {
				if jqt.hash_table[index].hop_count > hop_count {
					return FOUND_LONGER
				}
				return FOUND
			}
			temp = temp.next
		}
	}
	return NOT_FOUND
}

func (jqt *JoinQueryTable) FindPrevHop(src_addr int) int {
	index := src_addr % len(jqt.hash_table)

	if jqt.hash_table[index].src == src_addr {
		return jqt.hash_table[index].prev_hop
	} else {
		temp := jqt.hash_table[index].next
		for temp != nil {
			if temp.src == src_addr {
				return temp.prev_hop
			}
			temp = temp.next
		}
	}

	return 0 // not found
}

func (jqt *JoinQueryTable) Insert(src_addr int, prev_hop int, seqno, hop_count int) bool {
	index := src_addr % len(jqt.hash_table)

	if jqt.hash_table[index].src == -1 || jqt.hash_table[index].src == src_addr {
		jqt.hash_table[index].src = src_addr
		jqt.hash_table[index].prev_hop = prev_hop
		jqt.hash_table[index].hop_count = hop_count
		jqt.hash_table[index].seqno = seqno
	} else if jqt.hash_table[index].next == nil {
		var new_jq_slot JoinQuerySlot
		new_jq_slot.src = src_addr
		new_jq_slot.prev_hop = prev_hop
		new_jq_slot.hop_count = hop_count
		new_jq_slot.seqno = seqno
		new_jq_slot.next = nil
		jqt.hash_table[index].next = &new_jq_slot
	} else {
		temp := jqt.hash_table[index].next

		if jqt.hash_table[index].next.src == src_addr {
			jqt.hash_table[index].next.seqno = seqno
			jqt.hash_table[index].next.prev_hop = prev_hop
			jqt.hash_table[index].next.hop_count = hop_count
			return true
		}

		for temp.next != nil {
			if temp.next.src == src_addr {
				temp.next.seqno = seqno
				temp.next.prev_hop = prev_hop
				temp.next.hop_count = hop_count
				return true
			}
			temp = temp.next
		}

		var new_jq_slot JoinQuerySlot
		new_jq_slot.src = src_addr
		new_jq_slot.seqno = seqno
		new_jq_slot.prev_hop = prev_hop
		new_jq_slot.hop_count = hop_count
		new_jq_slot.next = nil
		temp.next = &new_jq_slot
	}

	return true
}

func (jqt *JoinQueryTable) Clear() {
	jqt.hash_table = make([]JoinQuerySlot, JQ_SRC_HASH_SIZE)
}

func (jqt *JoinQueryTable) Remove(src_addr int) bool {
	// get index
	index := src_addr % len(jqt.hash_table)

	if jqt.hash_table[index].src == src_addr {
		if jqt.hash_table[index].next == nil {
			jqt.hash_table[index].src = -1
		} else {
			jqt.hash_table[index] = *jqt.hash_table[index].next
		}
		return true
	} else if jqt.hash_table[index].next == nil {
		return false
	} else {
		temp := &jqt.hash_table[index]

		for temp.next != nil {
			if temp.next.src != src_addr {
				temp = temp.next
			} else {
				temp.next = temp.next.next
				return true
			}
		}
	}

	return false

}

func (jqt *JoinQueryTable) Print() {
	fmt.Printf("\nJoin Query Table\n")

	for i := 0; i < len(jqt.hash_table); i++ {
		fmt.Printf("\nJoin Query Table\n")

		fmt.Printf("\n%d: ", i)
		fmt.Printf("\nJoin Query Table\n")

		if jqt.hash_table[i].src != 0 {
			fmt.Printf("%d ", jqt.hash_table[i].src)
			fmt.Printf(":%d ", jqt.hash_table[i].prev_hop)
			fmt.Printf(":%d ", jqt.hash_table[i].hop_count)
			fmt.Printf(":%d ", jqt.hash_table[i].seqno)

			if jqt.hash_table[i].next != nil {
				temp := jqt.hash_table[i].next

				for temp != nil {
					if temp.src != 0 {
						fmt.Printf(":%d ", temp.src)
						fmt.Printf(":%d ", temp.prev_hop)
						fmt.Printf(":%d ", temp.hop_count)
						fmt.Printf(":%d ", temp.seqno)
					}
					temp = temp.next
				}
			}
		}
	}
	fmt.Printf("\nEnd Join Query Table\n")
}
