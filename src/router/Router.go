package main

import (
	"fmt"
	"log"
	"net"
	"os/exec"
)

type Router struct {
	iface *net.Interface
	ip    net.IP
	zlen  byte

	msec      *MSecLayer
	forwarder *Forwarder

	// controllers
	zoneCont *ZoneIDController
	unicCont *UnicastController
	multCont *MulticastController
	sarpCont *SARPController
}

func NewRouter(ifaceName, passphrase, locSocket string, zlen byte, mgrpFilePath string) (*Router, error) {
	// tell linux im a router
	addIptablesRule()
	if err := registerGateway(); err != nil {
		delIptablesRule()
		return nil, err
	}

	// get interface
	iface, err := net.InterfaceByName(ifaceName)
	if err != nil {
		return nil, fmt.Errorf("couldn't get interface %s, error: %s", ifaceName, err)
	}

	// get initial ip addresses
	ip, _, err := GetMyIPs(iface)
	ip = ip.To4()
	if err != nil {
		return nil, fmt.Errorf("failed to get iface ips, err: %s", err)
	}
	log.Println("iface ipv4: ", ip)

	msec := NewMSecLayer(passphrase)

	zoneCont, err := NewZoneIDController(locSocket, zlen)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize location agent, err: %s", err)
	}

	sarpCont, err := NewSARPController(ip, iface, msec)
	if err != nil {
		return nil, fmt.Errorf("failed to initiate sARP, err: %s", err)
	}

	unicCont, err := NewUnicastController(iface, ip, sarpCont.neighborsTable, sarpCont.neighborhoodUpdateSignal, msec, zlen)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize unicast controller, err: %s", err)
	}

	multCont, err := NewMulticastController(iface, ip, msec, mgrpFilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize unicast controller, err: %s", err)
	}

	forwarder, err := NewForwarder(iface, ip, msec, zlen, sarpCont.neighborsTable, multCont.GetMissingEntries)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize forwarder, err: %s", err)
	}

	return &Router{
		iface:     iface,
		msec:      msec,
		ip:        ip,
		zlen:      zlen,
		forwarder: forwarder,
		zoneCont:  zoneCont,
		unicCont:  unicCont,
		multCont:  multCont,
		sarpCont:  sarpCont,
	}, nil
}

func (r *Router) Start() error {
	r.zoneCont.AddListener(r.forwarder.OnZoneIDChanged)
	r.zoneCont.AddListener(r.unicCont.OnZoneIDChanged)

	// start controllers
	go r.sarpCont.Start()
	go r.zoneCont.Start()
	go r.unicCont.Start(r.forwarder.uniForwTable)
	go r.multCont.Start(r.forwarder.multiForwTable)
	go r.forwarder.Start(r.unicCont.inputChannel)

	return nil
}

func (r *Router) Close() {
	delIptablesRule()
	unregisterGateway()
}

// TODO: support parallelism and fan-out

func addIptablesRule() {
	exec.Command("iptables", "-t", "filter", "-D", "OUTPUT", "-j", "NFQUEUE", "-w").Run()
	cmd := exec.Command("iptables", "-t", "filter", "-A", "OUTPUT", "-j", "NFQUEUE", "-w", "--queue-num", "0")
	stdoutStderr, err := cmd.CombinedOutput()
	if err != nil {
		log.Panic("couldn't add iptables rule, err: ", err, ",stderr: ", string(stdoutStderr))
	}
	log.Println("added NFQUEUE rule to OUTPUT chain in iptables")
}

func delIptablesRule() {
	cmd := exec.Command("iptables", "-t", "filter", "-D", "OUTPUT", "-j", "NFQUEUE", "-w")
	stdoutStderr, err := cmd.CombinedOutput()
	if err != nil {
		log.Panic("couldn't remove iptables rule, err: ", err, ",stderr: ", string(stdoutStderr))
	}
	log.Println("remove NFQUEUE rule to OUTPUT chain in iptables")
}

func registerGateway() error {
	exec.Command("route", "del", "default", "gw", "localhost").Run()
	cmd := exec.Command("route", "add", "default", "gw", "localhost")
	stdoutStderr, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("couldn't add default gateway, err: %#v, stderr: %#v", err, string(stdoutStderr))
	}
	log.Println("added default gateway")
	return nil
}

func unregisterGateway() {
	cmd := exec.Command("route", "del", "default", "gw", "localhost")
	stdoutStderr, err := cmd.CombinedOutput()
	if err != nil {
		log.Panic("couldn't remove default gateway, err: ", err, ",stderr: ", string(stdoutStderr))
	}
	log.Println("remove default gateway")
}
