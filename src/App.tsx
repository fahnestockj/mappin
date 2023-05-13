import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChartPage from "./pages/ChartPage/ChartPage";
import MapPage from "./pages/MapPage/MapPage";


const App = () => {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
    </BrowserRouter>
  )
};
export default App