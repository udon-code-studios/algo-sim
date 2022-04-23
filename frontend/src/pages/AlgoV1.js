import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Line } from "react-chartjs-2";
import { ArrowSmLeftIcon } from "@heroicons/react/solid";
import * as constants from "../constants";

const defaultJavaScriptValue = `/**
 * tradeOnTheMinute will execute at the close of each minute
 * for the given stock. The bars argument is indexed with 
 * bars[bars.length] being the most recent minute and bars[0]
 * being the first minute of the previous trading day (relative
 * to the minute this function is being executed on).
 * 
 * e.g. If bars[length].t is 2022/04/20 2:43 PM EST,
 * then bars[0].t is 2022/04/19 9:30 AM EST.
 * 
 * @param {[
 *   {
 *     t: string, // timestamp
 *     o: number, // open price
 *     h: number, // high price
 *     l: number, // low price
 *     c: number, // close price
 *     v: number  // volume
 *   }, ...
 * ]} bars
 * 
 * enum Action {BUY, HOLD, SELL}
 * 
 * @returns {Action}
 */
function tradeOnTheMinute(bars) {
  // complete function
  return (BUY);
}`;
const defaultPythonValue = `def tradeOnTheMinute(bars):
  # Python has not been implemented yet. Please use javascript instead.
  return (-1)`;

export default function AlgoV1() {
  // render graph on page load
  useEffect(() => {
    handleGraphSubmit(null);
  });

  // graph form fields
  const [symbol, setSymbol] = useState("INTC");
  const [labelSymbol, setLabelSymbol] = useState("INTC");
  const [startDate, setStartDate] = useState(
    new Date(2022, 4 - 1, 6).toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date(2022, 4 - 1, 8).toISOString().substring(0, 10)
  );

  // graph results
  const [bars, setBars] = useState(null);

  // simulation form fields
  const [editor, setEditor] = useState(null);
  const [editorValue, setEditorValue] = useState(defaultJavaScriptValue);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  // simulation results
  const [output, setOutput] = useState(null);

  // change default editor value when new language is selected
  useEffect(() => {
    switch (language) {
      case "javascript":
        setEditorValue(defaultJavaScriptValue);
        break;
      case "python":
        setEditorValue(defaultPythonValue);
        break;
      default:
        console.log("[ ERROR ] - unknown language:", language);
        break;
    }
  }, [language]);

  // call backend to query stock bars on form submission
  function handleGraphSubmit(event) {
    console.log("[ STATUS ] making POST request to /bars -", Date());
    console.log(`[ STATUS ] BACKEND_URI: ${constants.BACKEND_URI}`);

    const start = new Date(Date.parse(startDate));
    start.setUTCHours(13, 30); // start of normal trading hours
    const end = new Date(Date.parse(endDate));
    end.setUTCHours(19, 59); // end of normal trading hours

    fetch(`${constants.BACKEND_URI}/bars`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: symbol, // string
        start: start.toISOString(), // string
        end: end.toISOString(), // string
      }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log("[ STATUS ] POST request to /bars succeeded -", Date());
          //console.log('[ DATA ] -', data);
          setLabelSymbol(symbol);
          setBars(data.bars);
        });
      } else {
        response.json().then((error) => {
          console.log("[ STATUS ] POST request to /bars failed -", Date());
          console.log("[ ERROR ] -", error);
        });
      }
    });

    // prevent default form submission
    if (event != null) {
      event.preventDefault();
    }
  }

  // call backend to execute code on form submission
  function handleCodeSubmit(event) {
    console.log("[ STATUS ] making POST request to /sim-v1 -", Date());

    const start = new Date(Date.parse(startDate));
    start.setUTCHours(13, 30); // start of normal trading hours
    const end = new Date(Date.parse(endDate));
    end.setUTCHours(19, 59); // end of normal trading hours

    fetch(`${constants.BACKEND_URI}/sim-v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: start.toISOString(), // string
        end: end.toISOString(), // string
        language: language, // string
        code: code, // string
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(
              "[ STATUS ] POST request to /sim-v1 succeeded -",
              Date()
            );
            console.log("[ DATA ] -", data);
            setOutput(data.output);
          });
        } else {
          response.json().then((error) => {
            console.log("[ STATUS ] POST request to /sim-v1 failed -", Date());
            console.log("[ ERROR ] -", error);
            setOutput(error.message);
          });
        }
      })
      .catch((error) => {
        console.log("[ STATUS ] POST request to /sim-v1 failed -", Date());
        console.log("[ ERROR ] -", error);
        setOutput(error.message);
      });

    // prevent default form submission
    event.preventDefault();
  }

  // update states with form field values
  function handleInputChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case "symbol":
        setSymbol(value);
        break;
      case "start":
        setStartDate(value);
        break;
      case "end":
        setEndDate(value);
        break;
      case "language":
        setLanguage(value);
        break;
      default:
        console.log("[ ERROR ] -", `Unknown input name: ${name}`);
        break;
    }
  }

  return (
    <div className="flex h-screen w-full flex-col items-center overflow-y-scroll bg-gray-200 pb-8">
      {/* back button */}
      <Link to="/" className="absolute top-6 left-6">
        <button className="rounded-full bg-gray-700 py-2 px-2 font-bold text-white shadow-lg hover:bg-gray-900">
          <ArrowSmLeftIcon className="h-8 w-8" />
        </button>
      </Link>

      {/* header */}
      <h1 className="m-8 text-4xl font-bold">
        Hope you know what you're doing... 😬
      </h1>

      {/* content */}
      <div className="flex h-full w-full max-w-screen-xl space-x-5">
        {/* column 1: symbol/date + graph */}
        <div className="flex w-2/5 flex-col items-center">
          {/* form */}
          <form
            onSubmit={handleGraphSubmit}
            className="flex w-full flex-col rounded-2xl bg-gray-700 font-mono text-white"
          >
            {/* symbol input */}
            <div className="m-4 flex justify-center space-x-8 ">
              <label className="text-xl font-extrabold">
                Symbol
                <input
                  name="symbol"
                  type="text"
                  defaultValue={symbol}
                  onChange={handleInputChange}
                  className="ml-2 w-20 bg-gray-900 text-center"
                />
              </label>
            </div>

            {/* date inputs */}
            <div className="m-4 flex justify-center space-x-8 ">
              <label className="text-xl font-extrabold">
                Start
                <input
                  name="start"
                  type="date"
                  defaultValue={startDate}
                  onChange={handleInputChange}
                  className="ml-2 w-20 bg-gray-900 text-center"
                />
              </label>
              <label className="text-xl font-extrabold">
                End
                <input
                  name="end"
                  type="date"
                  defaultValue={endDate}
                  onChange={handleInputChange}
                  className="ml-2 w-20 bg-gray-900 text-center"
                />
              </label>
            </div>

            {/* form submission */}
            <div className="mb-4 flex justify-center">
              <button
                type="submit"
                className="w-72 rounded-md bg-teal-300 font-mono text-black shadow-xl duration-300 hover:bg-teal-700 hover:text-teal-100"
              >
                re-render graph
              </button>
            </div>
          </form>

          {/* graph output */}
          {bars && (
            <div className="h-96 w-full">
              <Line
                data={{
                  labels: bars.map((bar) => ""), //bar.t),
                  datasets: [
                    {
                      label: `${labelSymbol} Price`,
                      data: bars.map((bar) => bar.c),
                      backgroundColor: "rgba(20, 184, 166, 0.2)",
                      borderColor: "rgba(20, 184, 166, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </div>
          )}

          {/* simulation output */}
          <div className="mb-2 max-h-64 rounded-full bg-gray-400 px-4">
            <pre>{output && output}</pre>
          </div>
        </div>

        {/* column 2: code editor + output */}
        <div className="flex max-h-screen grow flex-col space-y-3">
          <form
            onSubmit={handleCodeSubmit}
            className="flex h-full w-full flex-col rounded-2xl bg-gray-700 font-mono"
          >
            {/* language selctor */}
            <div className="flex w-full justify-end space-x-2 rounded-t-2xl bg-black px-3 pt-2 pr-6 font-mono text-gray-300">
              <label>select language</label>
              <select
                name="language"
                onChange={handleInputChange}
                className="bg-gray-700"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            {/* code editor */}
            <div className=" h-full w-full rounded-b-2xl bg-black p-3">
              <Editor
                theme="vs-dark"
                language={language}
                value={editorValue}
                options={{
                  wordWrap: "on",
                }}
                onMount={(editor, _) => {
                  setEditor(editor);
                }}
              />
            </div>

            {/* form submission */}
            <div className="my-4 flex justify-center">
              <button
                type="submit"
                onClick={() => {
                  if (editor) setCode(editor.getValue());
                }}
                className="w-72 rounded-md bg-teal-300 font-mono shadow-xl duration-300 hover:bg-teal-900 hover:text-teal-200"
              >
                simulate algorithm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
