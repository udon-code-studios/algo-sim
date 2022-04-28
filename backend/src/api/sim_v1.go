package api

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

	a "subparoprogramming.org/algosim-backend/alpaca"
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

	// pull bars from Alpaca to run simulation
	bars := a.GetBarsMinuteLast2Days(reqBody.Symbol, reqBody.Start, reqBody.End)

	unique := f.RandomHexString(20)

	var codeFilename, dataFilename, contents string
	var cmd *exec.Cmd

	// write bars to file
	dataFilename = fmt.Sprintf("%s.json", unique)
	b, err := json.Marshal(bars)
	f.CheckError(err)
	os.WriteFile(dataFilename, b, 0777)

	switch reqBody.Language {
	case "javascript":
		// create filename and file contents
		codeFilename = fmt.Sprintf("%s.js", unique)
		contents = `
// enum BUY, HOLD, SELL
const BUY = Symbol("buy");
const HOLD = Symbol("hold");
const SELL = Symbol("sell");` +

			reqBody.Code + `

var data = require('./` + unique + `.json');

// cash variables
const starting = 100.0;
let value = starting;
let lastBuyPrice = 0.0;
let change = 0.0;
let own = false;

// loop through each minute, starting on the second day (390 minutes in each trading day)
let minuteData;
for (let i = 390 * 2 + 1; i < data.length; i++) {
  // last 780 minutes of data + this minute
  minuteData = data.slice(i - 390 * 2 - 1, i);

  switch (tradeOnTheMinute(minuteData)) {
    case BUY:
      if (!own) {
        console.log(` + "`[ BUY  ] ${data[i].t} $${data[i].c}`" + `);
        lastBuyPrice = data[i].c;
        own = true;
      }
      break;
    case HOLD:
      // console.log(` + "`[ STATUS ] ${data[i].t} HOLD`" + `);
      break;
    case SELL:
      if (own) {
        console.log(` + "`[ SELL ] ${data[i].t} $${data[i].c}`" + `);
        change = (data[i].c - lastBuyPrice) / lastBuyPrice;
        value += change * value;
        own = false;
      }
      break;
    default:
      console.log("[ ERROR ] unknown action:", tradeOnTheMinute(minuteData));
      break;
  }
}

// calculate final value if not sold
if (own) {
  change = (data[data.length - 1].c - lastBuyPrice) / lastBuyPrice;
  value += change * value;
}

// calculate total change
change = (value - starting) / starting;
console.log('--- ` + unique + ` ---');
console.log(change.toFixed(4));`

		// create command
		cmd = exec.Command("node", codeFilename)
	default:
		http.Error(w, "{ \"error\": \"unrecognized language\" }", http.StatusBadRequest)
		return
	}

	// write user code to executable file
	err = os.WriteFile(codeFilename, []byte(contents), 0777)
	f.CheckError(err)

	// execute file and capture stdout and stdin
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stdout
	err = cmd.Run()

	// delete files
	os.Remove(codeFilename)
	os.Remove(dataFilename)

	// setparate program output from result
	splitStdout := strings.Split(stdout.String(), "--- "+unique+" ---\n")
	output := `--- stdout ---
` + splitStdout[0] + `
--- stderr ---
` + stderr.String()

	// extract result
	var gainLoss float64
	if len(splitStdout) > 1 {
		gainLoss, _ = strconv.ParseFloat(strings.Split(splitStdout[1], "\n")[0], 64)
		f.CheckError(err)
	} else {
		gainLoss = -1
	}

	// format and send response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(SimV1Response{Gain: gainLoss, Output: output})
}
