package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
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

type BarsRequest struct {
	Symbol string
	Start  time.Time
	End    time.Time
}

type BarsResponse struct {
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

	var reqBody BarsRequest

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
	json.NewEncoder(w).Encode(BarsResponse{Bars: bars})
}

type AddRequest struct {
	A        string
	B        string
	Language string
	Code     string
}

type AddResponse struct {
	C      int    `json:"c"`
	Output string `json:"output"`
}

// handler function for the /add endpoint
func add(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("[ STATUS ] request recieved (%s) %v\n", r.URL.Path, time.Now())

	// only process POST requests
	if r.Method != "POST" {
		fmt.Fprintf(w, "{ \"error\": \"only POST method is supported\" }")
		return
	}

	var reqBody AddRequest

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	unique := randomHexString(20)

	var filename, contents string
	var cmd *exec.Cmd

	switch reqBody.Language {
	case "javascript":
		// create filename and file contents
		filename = unique + ".js"
		contents = reqBody.Code + `
const c = add(` + reqBody.A + `, ` + reqBody.B + `);
console.log('--- ` + unique + ` ---');
console.log(c);`

		// create command
		cmd = exec.Command("node", filename)

	case "python":
		// create filename and file contents
		filename = unique + ".py"
		contents = reqBody.Code + `
c = add(` + reqBody.A + `, ` + reqBody.B + `)
print('--- ` + unique + ` ---')
print(c)`

		// create command
		cmd = exec.Command("python3", filename)

	default:
		http.Error(w, "{ \"error\": \"unrecognized language\" }", http.StatusBadRequest)
		return
	}

	// write user code to executable file
	err = os.WriteFile(filename, []byte(contents), 0777)
	checkError(err)

	// execute file and capture stdout and stdin
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stdout
	err = cmd.Run()

	// delete file
	os.Remove(filename)

	// setparate program output from result
	splitStdout := strings.Split(stdout.String(), "--- "+unique+" ---\n")
	output := `--- stdout ---
` + splitStdout[0] + `
--- stderr ---
` + stderr.String()

	// extract result
	var c int
	if len(splitStdout) > 1 {
		c, _ = strconv.Atoi(strings.Split(splitStdout[1], "\n")[0])
		checkError(err)
	} else {
		c = -1
	}

	// format and send response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(AddResponse{C: c, Output: output})
}
