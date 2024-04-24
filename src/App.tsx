import { SetStateAction, useEffect, useState } from "react";
import { CSVDownloadButton } from "./components/CSVDownloadButton";
import LocationMarker from "./components/LocationMarker/LocationMarker";
import { MarkerTable } from "./components/MarkerTable";
import { PlotlyChart } from "./components/PlotlyChart/PlotlyChart";
import ProgressBar from "./components/ProgressBar";
import RangeSlider from "./components/RangeSlider";
import { ShareButton } from "./components/ShareButton";
import Velmap from "./components/Velmap";
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
    <div className="h-[100vh] w-full overflow-hidden">
      <div className="w-full h-[90%]">
        <ProgressBar numOfMarkers={markers.length} isLoading={isLoading} />
        <div className="w-full h-full grid grid-cols-3 grid-rows-1 gap-4">
          <div className="col-span-2 w-full h-[90%] flex flex-col items-center">
            <PlotlyChart
              loading={isLoading}
              timeseriesArr={timeseriesArr}
              intervalDays={intervalDays}
            />
          </div>

          <div className="mr-5">
            <div className="w-[100%] h-[40%] ">
              <Velmap
                markers={markers}
                setMarkers={setMarkers}
                setSearchParams={setSearchParams}
                zoom={5}
              />
            </div>
            <div className="my-5 ">
              <MarkerTable markers={markers} />
            </div>
            <div className="my-5 flex ">
              <CSVDownloadButton data={timeseriesArr} />
              <ShareButton />
            </div>
            <div className="my-5 flex items-center  ">
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
        </div>
      </div>
      <div className="w-full h-[10%] flex flex-row justify-center items-center m-4">
        <div className="">
          Velocity data generated using auto-RIFT (Gardner et al., 2018) and
          provided by the NASA MEaSUREs ITS_LIVE project (Gardner et al., 20XX).
        </div>
      </div>
    </div>
  );
}
export default App;
