import { useState } from "react";
import Velmap from "./Velmap";
import './App.css'
function App() {
  const [fetchFlag, setfetchFlag] = useState(false)
  const [dataset, setDataset] = useState(null)
  const [latLong, setLatLong] = useState([])

  // subtract 360 from long
  return (
    
    <Velmap latLong={latLong} fetchFlag={fetchFlag} setfetchFlag={setfetchFlag} dataset={dataset} setDataset={setDataset} setLatLong={setLatLong} />
  );
}

export default App;
