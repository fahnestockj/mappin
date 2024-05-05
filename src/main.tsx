import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { testing } from "./testing";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chart" element={<App />} /> {/* TODO: deprecate this */}
        <Route path="/testing" element={<Testing />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

function Testing() {
  useEffect(() => {
    testing();
  }, []);

  return <div>Testing</div>;
}
