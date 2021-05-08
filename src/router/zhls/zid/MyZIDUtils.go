package zid

import "sync"

// TODO: Is it okay to use global variables (package-level) here?
var myZoneMutex sync.RWMutex
var myZone Zone

func MyZone() Zone {
	myZoneMutex.RLock()
	defer myZoneMutex.RUnlock()
	return myZone
}

func MyZIDHeader(dstZID ZoneID) *ZIDHeader {
	return &ZIDHeader{ZLen: myZone.Len, SrcZID: myZone.ID, DstZID: dstZID}
}