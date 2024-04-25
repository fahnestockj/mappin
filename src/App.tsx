import { useEffect, useState } from "react";
import { CSVDownloadButton } from "./components/CSVDownloadButton";
import { MarkerTable } from "./components/MarkerTable";
import { PlotlyChart } from "./components/PlotlyChart/PlotlyChart";
import ProgressBar from "./components/ProgressBar";
import RangeSlider from "./components/RangeSlider";
import { ShareButton } from "./components/ShareButton";
import LeafletMap from "./components/LeafletMap";
import { findManyTimeseries } from "./findManyTimeseries/findManyTimeseries";
import { ITimeseries, IMarker } from "./types";
import { urlParamsToMarkers } from "./utils/markerParamUtilities";
import { useSearchParams } from "react-router-dom";

function App() {
  const [timeseriesArr, setTimeseriesArr] = useState<Array<ITimeseries>>([]);
  const [params, setSearchParams] = useSearchParams();
  const initialMarkers = urlParamsToMarkers(params);
  const [markers, setMarkers] = useState<Array<IMarker>>(initialMarkers);
  const [intervalDays, setIntervalDays] = useState<Array<number>>([1, 120]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.log("markers", markers);

  useEffect(() => {
    setIsLoading(true);
    //NOTE: useEffect will run twice in development because of React.StrictMode this won't happen in production
    findManyTimeseries(markers)
      .then((timeseriesArr) => {
        setTimeseriesArr(timeseriesArr);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [markers]);

  return (
    <div className="h-full w-full">
      <div className="w-full md:h-[400px] h-[300px] ">
        <LeafletMap
          markers={markers}
          setMarkers={setMarkers}
          setSearchParams={setSearchParams}
          zoom={5}
        />
      </div>
      <div className="flex my-4">
        <div className="w-full md:h-[400px] h-[300px] max-w-[70%] border-2 overflow-hidden rounded-lg mx-4">
          <PlotlyChart
            loading={isLoading}
            timeseriesArr={timeseriesArr}
            intervalDays={intervalDays}
          />
        </div>
        <div className="max-w-[30%] w-full h-fit mx-4 ">
          <MarkerTable markers={markers} />
        </div>
      </div>

      <div className="h-[10%] flex items-center mx-4">
        <div className="mx-4">
          <CSVDownloadButton data={timeseriesArr} />
        </div>
        <div className="mx-4">
          <ShareButton />
        </div>
        <div className="align-end my-5 flex items-center mx-4">
          <div className="text-md mr-2 font-semibold">Interval (days)</div>
          <RangeSlider
            className="w-[19rem] h-10"
            defaultValue={[1, 120]}
            min={1}
            max={565}
            onAfterChange={(value) => setIntervalDays(value)}
          />
        </div>
      </div>
      <div className="w-full h-[10%] flex flex-row justify-center items-center m-4">
        <div>
          Velocity data generated using auto-RIFT (Gardner et al., 2018) and
          provided by the NASA MEaSUREs ITS_LIVE project (Gardner et al., 20XX).
        </div>
      </div>
    </div>
  );
}
export default App;
