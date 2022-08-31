import { useState } from "react";
import Velmap from "./Velmap";
import './App.css'
// import 'rsuite/dist/styles/rsuite-default.min.css'
import 'rsuite/dist/rsuite.min.css'
function App() {
  const [fetchFlag, setfetchFlag] = useState(false)
  const [dataset, setDataset] = useState(null)
  const [latLong, setLatLong] = useState([])

// subtract 360 from long
  return (
    <div className="App">
      <Velmap latLong={latLong} fetchFlag={fetchFlag} setfetchFlag={setfetchFlag}  dataset={dataset} setDataset={setDataset} setLatLong={setLatLong}/>

    </div>
  );
}

export default App;
