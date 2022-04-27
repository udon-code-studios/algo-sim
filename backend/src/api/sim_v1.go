package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	f "subparoprogramming.org/algosim-backend/funcs"
)

type SimV1Request struct {
	Symbol   string
	Start    time.Time
	End      time.Time
	Language string
	Code     string
}

type SimV1Response struct {
	Gain   float64 `json:"g"` // +: gain, -: loss (e.g. -0.23 for -23% loss)
	Output string  `json:"output"`
}

// handler function for the /add endpoint
func SimV1(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("[ STATUS ] request recieved (%s) %v\n", r.URL.Path, time.Now())

	f.EnableCors(&w)

	// only process POST requests
	if r.Method != "POST" {
		fmt.Fprintf(w, "{ \"error\": \"only POST method is supported\" }")
		return
	}

	var reqBody SimV1Request

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// format and send response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(SimV1Response{Gain: -0.23, Output: "...placeholder output..."})
}
