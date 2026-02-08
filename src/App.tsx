import { useEffect, useState } from "react";
import { CSVDownloadButton } from "./components/CSVDownloadButton";
import { MarkerTable } from "./components/MarkerTable";
import { PlotlyChart } from "./components/PlotlyChart/PlotlyChart";
import DualRangeSlider from "./components/DualRangeSlider";
import { ShareButton } from "./components/ShareButton";
import LeafletMap from "./components/LeafletMap/LeafletMap";
import { ITimeseries, IMarker } from "./types";
import { useSearchParams } from "react-router-dom";
import {
  getStateFromUrlParams,
  setIntervalDaysInUrlParams,
} from "./utils/searchParamUtilities";
import { getTimeseries } from "./getTimeseries/getTimeseries";
import { NumberOfFilteredPts } from "./components/NumberOfFilteredPts";

function App() {
  const [timeseriesArr, setTimeseriesArr] = useState<Array<ITimeseries>>([]);
  const [params, setSearchParams] = useSearchParams();
  const initialState = getStateFromUrlParams(params);
  const [markers, setMarkers] = useState<Array<IMarker>>(initialState.markers);
  const [intervalDays, setIntervalDays] = useState<Array<number>>(
    initialState.intervalDays
  );
  const [isLoading, setIsLoading] = useState<boolean>(initialState.markers.length > 0);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Detect fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // cleanup for race conditions
    let ignore = false;

    // filter stale timeseries by markers
    const filteredTimeseries = timeseriesArr.filter(
      (timeseries) => !markers.every((m) => m.id !== timeseries.marker.id)
    );
    setTimeseriesArr(filteredTimeseries.slice());

    const newMarkers = markers.filter((marker) =>
      timeseriesArr.every((timeseries) => timeseries.marker.id !== marker.id)
    );

    if (newMarkers.length > 0) {
      setIsLoading(true);
      newMarkers.map(getTimeseries).map((promise) =>
        promise
          .then((timeseries) => {
            if (ignore) return;
            setTimeseriesArr((arr) => [...arr, timeseries]);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setIsLoading(false);
          })
      );
    }
    return () => {
      ignore = true;
    };
  }, [markers]);

  return (
    <div id="root" className="w-full h-screen flex flex-col">
      {/* Map Section */}
      <div className="w-full flex-[2] min-h-[300px] shadow-md">
        <LeafletMap
          markers={markers}
          setMarkers={setMarkers}
          setSearchParams={setSearchParams}
          zoom={initialState.mapZoom}
          hoveredMarkerId={hoveredMarkerId}
          onMarkerHover={setHoveredMarkerId}
          timeseriesArr={timeseriesArr}
        />
      </div>

      {/* Bottom Section - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="flex-[3] flex flex-col lg:flex-row p-4 gap-4 overflow-auto">
        {/* Chart Section */}
        <div className="flex-1 min-h-[300px] border-2 border-gray-200 overflow-hidden rounded-lg shadow-md">
          <PlotlyChart
            loading={isLoading}
            timeseriesArr={timeseriesArr}
            intervalDays={intervalDays}
            plotBounds={initialState.plotBounds}
            setSearchParams={setSearchParams}
            hoveredMarkerId={hoveredMarkerId}
            onClearHover={() => setHoveredMarkerId(null)}
          />
        </div>

        {/* Controls Section */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          {/* Marker Table */}
          <div className="h-[340px]">
            <MarkerTable
              markers={markers}
              setMarkers={setMarkers}
              setSearchParams={setSearchParams}
              setTimeseriesArr={setTimeseriesArr}
              onMarkerHover={setHoveredMarkerId}
            />
          </div>

          {/* Controls Panel */}
          <div className="flex-1 max-h-[200px] shadow-md border-2 border-gray-200 rounded-lg p-4 space-y-4">
            {/* Slider Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                  Measurement Interval (days)
                </h3>
                <NumberOfFilteredPts
                  timeseriesArr={timeseriesArr}
                  intervalDays={intervalDays}
                />
              </div>
              <DualRangeSlider
                className="w-full h-10"
                defaultValue={[intervalDays[0], intervalDays[1]]}
                min={1}
                max={500}
                onAfterChange={(value) => {
                  setIntervalDays(value);
                  setSearchParams(
                    (prevParams) =>
                      setIntervalDaysInUrlParams(prevParams, value),
                    { replace: true }
                  );
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <CSVDownloadButton data={timeseriesArr} />
              <ShareButton markers={markers} />
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
export default App;
