import { useState } from "react";
import { Link } from "react-router-dom";
import * as constants from "../constants";

export default function RawBars() {
  // form fields
  const [symbol, setSymbol] = useState('INTC');
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().substring(0, 10));

  // results
  const [bars, setBars] = useState(null);

  // call backend to query stock bars on form submission
  function handleSubmit(event) {
    console.log('[ STATUS ] making POST request to /bars -', Date());

    const start = new Date(Date.parse(startDate));
    start.setUTCHours(13, 30) // start of normal trading hours
    const end = new Date(Date.parse(endDate));
    end.setUTCHours(19, 59) // end of normal trading hours

    fetch(`${constants.BACKEND_URI}/bars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: symbol, // string
        start: start.toISOString(), // string
        end: end.toISOString(), // string
      }),
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log('[ STATUS ] POST request to /bars succeeded -', Date());
          console.log('[ DATA ] -', data);
          setBars(data.bars);
        });
      } else {
        response.json().then(error => {
          console.log('[ STATUS ] POST request to /bars failed -', Date());
          console.log('[ ERROR ] -', error);
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
    }
  }

  return (
    <div className="flex h-screen w-full flex-col items-center bg-gray-500">
      {/* back button */}
      <Link to="/" className="absolute top-10 left-10">
        <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-xl">Back</button>
      </Link>

      {/* header */}
      <h1 className="mt-4 text-4xl font-bold">Just raw data.</h1>

      {/* form */}
      <form onSubmit={handleSubmit} className="m-4 flex w-full max-w-xl flex-col rounded-2xl bg-gray-200 font-mono">
        {/* symbol input */}
        <div className="m-4 flex justify-center space-x-8 ">
          <label className="text-xl font-extrabold">
            Symbol
            <input
              name="symbol"
              type="text"
              defaultValue={symbol}
              onChange={handleInputChange}
              className="ml-2 w-20 text-center"
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
              className="ml-2 w-20 text-center" />
          </label>
          <label className="text-xl font-extrabold">
            End
            <input
              name="end"
              type="date"
              defaultValue={endDate}
              onChange={handleInputChange}
              className="ml-2 w-20 text-center" />
          </label>
        </div>

        {/* form submission */}
        <div className="mb-4 flex justify-center">
          <button
            type="submit"
            className="w-72 rounded-md bg-teal-500 font-mono shadow-xl"
          >
            get bars
          </button>
        </div>
      </form>

      {/* output */}
      <div className="max-w-xl mb-5 px-10 overflow-y-scroll">
        <pre>{bars && JSON.stringify(bars, null, 2)}</pre>
      </div>
    </div>
  );
}