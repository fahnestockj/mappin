import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename='/app'> {/* NOTE: basename in dev the basename is /itslive-wev/app */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chart" element={<App />} /> {/* NOTE: supporting old routing */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
