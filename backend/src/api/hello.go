package api

import (
	"fmt"
	"net/http"
	"time"

	f "subparoprogramming.org/algosim-backend/funcs"
)

// handler function for the / endpoint
func Hello(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("[ STATUS ] request recieved (%s) %v\n", r.URL.Path, time.Now())

	f.EnableCors(&w)

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
