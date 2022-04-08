import * as React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';

export default function App() {
  const location = useLocation();

  return (
    <div className="relative flex flex-col min-h-screen bg-prussian-blue text-white">
      <Routes location={location} key={location.pathname}>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
}