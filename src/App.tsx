import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IMarker } from "./components/Velmap";
import ChartPage from "./pages/ChartPage";
import MapPage from "./pages/MapPage";
import { useSearchParams } from "react-router-dom";
import { urlParamsToMarkers } from "./utils/urlParamsToMarkers";


const App = () => {

  const [params] = useSearchParams();
  const initialMarkers = urlParamsToMarkers(params)
  
  const [markers, setMarkers] = useState<Array<IMarker>>(initialMarkers)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapPage setMarkers={setMarkers} markers={markers} />} />
        <Route path="/chart" element={<ChartPage markers={markers} />} />
      </Routes>
    </BrowserRouter>
  )
};
export default App