package main

import (
	"fmt"
	"net/http"
	"os"

	"subparoprogramming.org/algosim-backend/api"
	"subparoprogramming.org/algosim-backend/funcs"
)

func main() {
	// get PORT from environment
	port := os.Getenv("PORT")

	// if PORT not set, default to 8080
	if len(port) == 0 {
		port = "8080"
	}

	// set http handler functions
	http.HandleFunc("/", api.Hello)
	http.HandleFunc("/bars", api.Bars)
	http.HandleFunc("/add", api.Add)
	http.HandleFunc("/sim-v1", api.SimV1)

	// start server
	fmt.Println("AlgoSim backend listening on port", port)
	err := http.ListenAndServe(":"+port, nil)
	funcs.CheckError(err)
}
