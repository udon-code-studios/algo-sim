package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// handler function for the / endpoint
func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("[ STATUS ] request recieved (%s) %v\n", r.URL.Path, time.Now())

	if r.URL.Path != "/" {
		http.Error(w, "404 not found", http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":
		fmt.Fprintf(w, "{ \"hello\": \"world GET\" }")
	case "POST":
		fmt.Fprintf(w, "{ \"hello\": \"world POST\" }")
	default:
		fmt.Fprintf(w, "{ \"error\": \"only GET and POST methods are supported\" }")
	}
}

type BarRequest struct {
	Symbol string
	Start  time.Time
	End    time.Time
}

type BarResponse struct {
	Bars []Bar `json:"bars"`
}

// handler function for the /bars endpoint
func bars(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("[ STATUS ] request recieved (%s) %v\n", r.URL.Path, time.Now())

	// only process POST requests
	if r.Method != "POST" {
		fmt.Fprintf(w, "{ \"error\": \"only POST method is supported\" }")
		return
	}

	var reqBody BarRequest

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// get bars from Alpaca API
	bars := getBarsMinute(reqBody.Symbol, reqBody.Start, reqBody.End)

	// format and send response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(BarResponse{Bars: bars})
}
