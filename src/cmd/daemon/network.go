package main

import (
	"bytes"
	"encoding/gob"
	"log"
	"net"
	"strconv"
	"strings"

	"github.com/mido3ds/C4IAN/src/models"
)

type onReceiveMsgCallback = func(models.Message)
type onReceiveAudioCallback = func(models.Audio)
type onReceiveVideoFragmentCallback = func(models.VideoFragment)
type onReceiveSensorsDataCallback = func(models.SensorData)

type NetworkManager struct {
	onReceiveMsg           onReceiveMsgCallback
	onReceiveAudio         onReceiveAudioCallback
	onReceiveVideoFragment onReceiveVideoFragmentCallback
	onReceiveSensorsData   onReceiveSensorsDataCallback
}

func NewNetworkManager(
	onReceiveMsg onReceiveMsgCallback,
	onReceiveAudio onReceiveAudioCallback,
	onReceiveVideoFragment onReceiveVideoFragmentCallback,
	onReceiveSensorsData onReceiveSensorsDataCallback,
) *NetworkManager {
	return &NetworkManager{
		onReceiveMsg:           onReceiveMsg,
		onReceiveAudio:         onReceiveAudio,
		onReceiveVideoFragment: onReceiveVideoFragment,
		onReceiveSensorsData:   onReceiveSensorsData,
	}
}

func (netManager *NetworkManager) Listen(port int) {
	go netManager.ListenTCP(port)
	go netManager.ListenUDP(port)
}

func (netManager *NetworkManager) SendTCP(dstAddrss string, dstPort int, payload interface{}) {
	// Get remote TCP address
	address, err := net.ResolveTCPAddr("tcp", dstAddrss+":"+strconv.Itoa(dstPort))
	if err != nil {
		log.Panic(err)
	}

	// Connect to remote TCP socket
	// TODO: Set timeout for dialing to abort
	conn, err := net.DialTCP("tcp", nil, address)
	if err != nil {
		// TODO: do not panice if connection is refused
		log.Panic(err)
	}
	defer conn.Close()

	encoder := gob.NewEncoder(conn)
	// Get the payload type and send it
	if _, ok := payload.(models.Message); ok {
		encoder.Encode(models.MessageType)
	} else if _, ok := payload.(models.Audio); ok {
		encoder.Encode(models.AudioType)
	} else {
		log.Panic("Unknown payload type")
	}

	// Send the payload
	err = encoder.Encode(payload)
	if err != nil {
		log.Panic(err)
	}
}

func (netManager *NetworkManager) ListenTCP(port int) {
	// Get local TCP address
	address, err := net.ResolveTCPAddr("tcp", ":"+strconv.Itoa(port))
	if err != nil {
		log.Panic(err)
	}

	// Listen for remote TCP connections
	listener, err := net.ListenTCP("tcp", address)
	if err != nil {
		log.Panic(err)
	}
	defer listener.Close()

	for {
		// Handle any incoming connections
		conn, err := listener.Accept()
		if err != nil {
			log.Println(err)
			continue
		}
		go netManager.handleTCPConnection(conn)
	}
}

func (netManager *NetworkManager) ListenUDP(port int) {
	// Get local UDP address
	address, err := net.ResolveUDPAddr("udp", ":"+strconv.Itoa(port))
	if err != nil {
		log.Panic(err)
	}

	// Listen for any remote UDP packets
	conn, err := net.ListenUDP("udp", address)
	if err != nil {
		log.Panic(err)
	}
	defer conn.Close()

	var packetType models.Type
	for {
		// Read any incoming UDP packet
		buffer := make([]byte, 1024)
		length, src, err := conn.ReadFromUDP(buffer)
		if err != nil {
			log.Panic(err)
		}
		decoder := gob.NewDecoder(bytes.NewBuffer(buffer[:length]))
		// Decode any packets in the buffer by reading the type then the payload, then make appropriate callbacks
		for decoder.Decode(&packetType) == nil {
			if packetType == models.SensorDataType {
				var sensorsData models.SensorData
				err := decoder.Decode(&sensorsData)
				if err != nil {
					log.Panic(err)
				}
				sensorsData.Src = src.IP.String()
				netManager.onReceiveSensorsData(sensorsData)
			} else {
				var videoFragment models.VideoFragment
				err := decoder.Decode(&videoFragment)
				if err != nil {
					log.Panic(err)
				}
				videoFragment.Src = src.IP.String()
				netManager.onReceiveVideoFragment(videoFragment)
			}
		}
	}
}

func (netManager *NetworkManager) handleTCPConnection(conn net.Conn) {
	// Decode the type of the packet
	decoder := gob.NewDecoder(conn)
	var packetType models.Type
	err := decoder.Decode(&packetType)
	if err != nil {
		log.Panic(err)
	}

	// Extract the IP address of the source
	srcIP := strings.Split(conn.RemoteAddr().String(), ":")[0]

	// Decode the payload of the packet and make appropriate callbacks
	if packetType == models.MessageType {
		var msg models.Message
		err := decoder.Decode(&msg)
		if err != nil {
			log.Panic(err)
		}
		msg.Src = srcIP
		netManager.onReceiveMsg(msg)
	} else {
		var audio models.Audio
		err := decoder.Decode(&audio)
		if err != nil {
			log.Panic(err)
		}
		audio.Src = srcIP
		netManager.onReceiveAudio(audio)
	}
	conn.Close()
}
