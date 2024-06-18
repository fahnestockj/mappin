import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* NOTE: supporting old routing and different basenames */}
        <Route path="/" element={<App />} />
        <Route path="/app" element={<App />} />
        <Route path="/itslive-web/app" element={<App />} />
        <Route path="/chart" element={<App />} />{" "}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
