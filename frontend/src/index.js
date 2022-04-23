import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Helmet, HelmetProvider } from "react-helmet-async";
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

//-----------------------------------------------------------------------------
// initialize chart.js
//-----------------------------------------------------------------------------

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

//-----------------------------------------------------------------------------
// render app
//-----------------------------------------------------------------------------

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>AlgoSim</title>
        <meta
          name="description"
          content="Algorithmic stock trading simulation."
        />
        <meta
          name="keywords"
          content="Stock Market, Algorithm, Algo Trading, Stocks, Algo"
        />
        <meta name="author" content="Leo Battalora" />
      </Helmet>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
