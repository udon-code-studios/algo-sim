package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	// get PORT from environment
	port := os.Getenv("PORT")

	// if PORT not set, default to 8080
	if len(port) == 0 {
		port = "8080"
	}

	// set http handler functions
	http.HandleFunc("/bars", bars)
	http.HandleFunc("/", hello)

	// start server
	fmt.Println("AlgoSim backend listening on port", port)
	err := http.ListenAndServe(":"+port, nil)
	checkError(err)
}

func checkError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
