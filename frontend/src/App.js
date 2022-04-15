import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import * as pages from "./pages";

export default function App() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Routes location={location} key={location.pathname}>
        <Route path="/">
          <Route index element={<pages.Home />} />
          <Route path="add" element={<pages.Add />} />
          <Route path="raw-bars" element={<pages.RawBars />} />
          <Route path="graph" element={<pages.Graph />} />
          <Route path="*" element={<pages.PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
}
