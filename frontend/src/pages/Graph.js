import { useState } from "react";
import { Link } from "react-router-dom";
import * as constants from "../constants";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph() {
  // form fields
  const [symbol, setSymbol] = useState("INTC");
  const [startDate, setStartDate] = useState(
    new Date(2022, 3 - 1, 28).toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date(2022, 4 - 1, 8).toISOString().substring(0, 10)
  );

  // results
  const [bars, setBars] = useState(null);

  // call backend to query stock bars on form submission
  function handleSubmit(event) {
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
      default:
        console.log("[ ERROR ] -", `Unknown input name: ${name}`);
        break;
    }
  }

  return (
    <div className="flex h-screen w-full flex-col items-center bg-gray-200">
      {/* back button */}
      <Link to="/" className="absolute top-10 left-10">
        <button className="rounded-xl bg-gray-700 py-2 px-4 font-bold text-white hover:bg-gray-900">
          Back
        </button>
      </Link>

      {/* header */}
      <h1 className="mt-4 text-4xl font-bold">Hope there's a graph... 😬</h1>

      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="m-4 flex w-full max-w-xl flex-col rounded-2xl bg-gray-700 font-mono text-white"
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
            className="w-72 rounded-md bg-teal-500 font-mono text-black shadow-xl duration-300 hover:bg-teal-700 hover:text-teal-100"
          >
            get bars
          </button>
        </div>
      </form>

      {/* graph output */}
      {bars && (
        <div className="h-96 w-5/6">
          <Line
            data={{
              labels: bars.map((bar) => bar.t),
              datasets: [
                {
                  label: symbol,
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
    </div>
  );
}
