package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/signal"
	"strings"
	"time"

	"github.com/akamensky/argparse"
	_ "github.com/mattn/go-sqlite3"
	"github.com/mido3ds/C4IAN/src/models"
)

const storePathSuffix = ".db"

func main() {
	defer log.Println("finished cleaning up, closing")
	log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds)
	log.SetOutput(os.Stdout)

	args, err := parseArgs()
	if err != nil {
		fmt.Print(err)
		os.Exit(1)
	}

	units, groupMembers := parseConfig(args.UnitsPath, args.GroupsPath)
	dbManager := NewDatabaseManager(args.StorePath)
	dbManager.Initialize(units, groupMembers)
	api := NewAPI()
	videoFilesManager := NewVideoFilesManager(args.VideosPath)
	netManager := NewNetworkManager(
		// onReceiveMessage
		func(msg models.Message) {
			api.SendEvent(&msg)
			dbManager.AddReceivedMessage(&msg)
		},
		// onReceiveAudio
		func(audio models.Audio) {
			api.SendEvent(&audio)
			dbManager.AddReceivedAudio(&audio)
		},
		// onReceiveVideoFragment
		func(frag models.VideoFragment) {
			videoFilesManager.AddFragment(&frag)
			path := videoFilesManager.GetVideoPath(&frag)
			exists := dbManager.AddVideoIfNew(&frag, path)
			if !exists {
				api.SendEvent(&models.Video{ID: frag.ID, Time: frag.Time, Path: path})
			}
		},
		// onReceiveSensorsData
		func(data models.SensorData) {
			api.SendEvent(&data)
			dbManager.AddReceivedSensorsData(&data)
			dbManager.UpdateLastActivity(data.Src, data.Time)
		},
	)
	go api.Start(args.UIPort, args.UnitsPort, args.VideosPath, dbManager, netManager)
	netManager.Listen(args.Port)
	log.Println("finished initalizing all")
	waitSIGINT()
}

// Args store command line arguments
type Args struct {
	StorePath  string
	VideosPath string
	UnitsPath  string
	GroupsPath string
	Port       int
	UIPort     int
	UnitsPort  int
}

func parseArgs() (*Args, error) {
	parser := argparse.NewParser("cmd-daemon", "Command-Center client daemon")

	storePath := parser.String("s", "store", &argparse.Options{Help: "Path to archive data.",
		Default: time.Now().Format(time.RFC3339) + storePathSuffix})

	videosPath := parser.String("v", "videos-path", &argparse.Options{Default: "videos", Help: "Path to store videos received from units."})
	unitsPath := parser.String("u", "units-path", &argparse.Options{Default: "../../units.json", Help: "Path to units.json."})
	groupsPath := parser.String("g", "groups-path", &argparse.Options{Default: "../../groups.json", Help: "Path to groups.json."})

	port := parser.Int("p", "port", &argparse.Options{Default: 4170, Help: "Main port the client will bind to, to receive connections from other clients."})
	uiPort := parser.Int("", "ui-port", &argparse.Options{Default: 3170, Help: "UI port the client will bind to, to connect with its UI."})
	unitsPort := parser.Int("", "units-port", &argparse.Options{Default: 4070, Help: "Main port used in units."})

	err := parser.Parse(os.Args)
	if err != nil {
		return nil, errors.New(parser.Usage(err))
	}

	// Enforce .db extension to storePath
	if !strings.HasSuffix(*storePath, storePathSuffix) {
		*storePath = *storePath + storePathSuffix
	}

	return &Args{
		StorePath:  *storePath,
		VideosPath: *videosPath,
		UnitsPath:  *unitsPath,
		GroupsPath: *groupsPath,
		Port:       *port,
		UIPort:     *uiPort,
		UnitsPort:  *unitsPort,
	}, nil
}

func parseConfig(unitsPath string, groupsPath string) (units []models.Unit, groups map[string][]string) {
	data, err := ioutil.ReadFile(unitsPath)
	if err != nil {
		log.Println("failed to read units file, err:", err)
	}
	var result map[string][]models.Unit
	json.Unmarshal(data, &result)
	units = result["units"]

	data, err = ioutil.ReadFile(groupsPath)
	if err != nil {
		log.Println("failed to read groups file, err:", err)
	}
	json.Unmarshal(data, &groups)
	return
}

func waitSIGINT() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	<-c
}
