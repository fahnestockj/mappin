import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IMarker } from "./components/Velmap";
import ChartPage from "./pages/ChartPage";
import MapPage from "./pages/MapPage";
import { createId } from '@paralleldrive/cuid2'

const App = () => {

  const [markers, setMarkers] = useState<Array<IMarker>>([
    { 
      id: createId(),
      color: 'blue',
      latLng: {
        lat: 70,
        lng: -50
      },
    },
  ])

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