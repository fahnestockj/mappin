import { useEffect, useState } from "react";
import { CSVDownloadButton } from "./components/CSVDownloadButton";
import { MarkerTable } from "./components/MarkerTable";
import { PlotlyChart } from "./components/PlotlyChart/PlotlyChart";
import RangeSlider from "./components/RangeSlider";
import { ShareButton } from "./components/ShareButton";
import LeafletMap from "./components/LeafletMap";
import { findManyTimeseries } from "./findManyTimeseries/findManyTimeseries";
import { ITimeseries, IMarker } from "./types";
import { useSearchParams } from "react-router-dom";
import { getStateFromUrlParams } from "./utils/paramUtilities";
function App() {
  const [timeseriesArr, setTimeseriesArr] = useState<Array<ITimeseries>>([]);
  const [params, setSearchParams] = useSearchParams();
  const initialState = getStateFromUrlParams(params)
  const [markers, setMarkers] = useState<Array<IMarker>>(initialState.markers);
  const [intervalDays, setIntervalDays] = useState<Array<number>>([1, 120]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    <div className=" w-full h-screen">
      <div className="w-full md:h-[450px] h-[300px] shadow-md">
        <LeafletMap
          markers={markers}
          setMarkers={setMarkers}
          setSearchParams={setSearchParams}
          zoom={5}
        />
      </div>
      <div className="flex my-4">
        <div className="w-full md:h-[400px] h-[300px] max-w-[70%] border-[#e5e7eb] border-2 overflow-hidden rounded-lg mx-4 shadow-md">
          <PlotlyChart
            loading={isLoading}
            timeseriesArr={timeseriesArr}
            intervalDays={intervalDays}
            plotBounds={initialState.plotBounds}
            setSearchParams={setSearchParams}
          />
        </div>
        <div className="max-w-[30%] w-full  mx-4 flex flex-col items-center">
          <div className="h-[196px] w-full">
            <MarkerTable markers={markers} setMarkers={setMarkers} setSearchParams={setSearchParams} />
          </div>

          <div className="w-full my-4 shadow-md border-[#e5e7eb] border-2 overflow-hidden rounded-lg p-4">
            <div className="align-end my-5 flex items-center mx-4">
              <div className="text-md mr-4 font-semibold">
                Interval <br /> (days)
              </div>
              <RangeSlider
                className="w-[19rem] h-10"
                defaultValue={[1, 120]}
                min={1}
                max={565}
                onAfterChange={(value) => setIntervalDays(value)}
              />
            </div>

            <div className="flex justify-between">
              <div className="mr-4">
                <CSVDownloadButton data={timeseriesArr} />
              </div>
              <ShareButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
