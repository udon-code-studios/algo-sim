package main

import (
	"fmt"
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
	http.HandleFunc("/", hello)
	http.HandleFunc("/bars", bars)
	http.HandleFunc("/add", add)

	// start server
	fmt.Println("AlgoSim backend listening on port", port)
	err := http.ListenAndServe(":"+port, nil)
	checkError(err)
}
