// file: app/routes/add.jsx

import { useFetcher } from "remix";
import { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function Graph() {
  const fetcher = useFetcher();
  const svgRef = useRef(null);

  useEffect(() => {
    d3.select(this.myRef.current)
      .append('p')
      .text('Hello from D3');
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-500">
      <h1 className="mt-4 text-4xl font-bold">There'll be a graph one day.</h1>

      <fetcher.Form
        method="post"
        action="/api/bars"
        className="m-4 flex w-full max-w-xl flex-col rounded-2xl bg-gray-200 font-mono"
      >
        {/* symbol input */}
        <div className="m-4 flex justify-center space-x-8 ">
          <label className="text-xl font-extrabold">
            Symbol
            <input
              name="symbol"
              type="text"
              defaultValue="INTC"
              className="ml-2 w-20 text-center"
            />
          </label>
        </div>

        {/* date inputs */}
        <div className="m-4 flex justify-center space-x-8 ">
          <label className="text-xl font-extrabold">
            Start
            <input name="start" type="date" className="ml-2 w-20 text-center" />
          </label>
          <label className="text-xl font-extrabold">
            End
            <input name="end" type="date" className="ml-2 w-20 text-center" />
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
      </fetcher.Form>

      {/* output */}
      <div className="min-h-80 max-w-xl space-y-4">
        <p className="text-center font-bold">
          {fetcher.type === "done" &&
            `Result: ${JSON.stringify(fetcher.data.bars)}`}
          {fetcher.state === "submitting" && "submitting request..."}
        </p>
        <pre>{fetcher.type === "done" && fetcher.data.output}</pre>
        <div ref={svgRef} />
      </div>
    </div>
  );
}
