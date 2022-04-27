package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	a "subparoprogramming.org/algosim-backend/alpaca"
	f "subparoprogramming.org/algosim-backend/funcs"
)

type BarsRequest struct {
	Symbol string
	Start  time.Time
	End    time.Time
}

type BarsResponse struct {
	Bars []a.Bar `json:"bars"`
}

// handler function for the /bars endpoint
func Bars(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("[ STATUS ] request recieved (%s) %v\n", r.URL.Path, time.Now())

	f.EnableCors(&w)

	// only process POST requests
	if r.Method != "POST" {
		fmt.Fprintf(w, "{ \"error\": \"only POST method is supported\" }")
		return
	}

	var reqBody BarsRequest

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// get bars from Alpaca API
	bars := a.GetBarsMinute(reqBody.Symbol, reqBody.Start, reqBody.End)

	// format and send response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(BarsResponse{Bars: bars})
}
