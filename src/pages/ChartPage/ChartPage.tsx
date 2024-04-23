import { useEffect, useMemo, useState } from "react";
import BackButton from "../../components/BackButton";
import { CSVDownloadButton } from "../../components/CSVDownloadButton";
import LocationMarker from "../../components/LocationMarker/LocationMarker";
import Velmap from "../../components/Velmap";
import { PlotlyChart } from "../../components/PlotlyChart/PlotlyChart";
import ProgressBar from "../../components/ProgressBar";
import { MarkerTable } from "../../components/MarkerTable";
import { useSearchParams } from "react-router-dom";
import { urlParamsToMarkers } from "../../utils/markerParamUtilities";
import { ShareButton } from "../../components/ShareButton";
//@ts-ignore
import { useBreakpoints } from "react-breakpoints-hook";
import { IMarker, ITimeseries } from "../../types";
import { findManyTimeseries } from "../../findManyTimeseries/findManyTimeseries";
import RangeSlider from "../../components/RangeSlider";

type IProps = {};

const ChartPage = (props: IProps) => {
  let { lg } = useBreakpoints({
    lg: { min: 1384, max: null },
  });

  const [timeseriesArr, setTimeseriesArr] = useState<Array<ITimeseries>>([]);
  const [progressBarPercentage, setProgressBarPercentage] = useState<number>(0);

  const [params] = useSearchParams();
  const [markers] = useState<IMarker[]>(urlParamsToMarkers(params));

  const [intervalDays, setIntervalDays] = useState<Array<number>>([1, 120]);


  useEffect(() => {
    //NOTE: useEffect will run twice in development because of React.StrictMode this won't happen in production
    findManyTimeseries(markers)
      .then((timeseriesArr) => {
        setTimeseriesArr(timeseriesArr);
        setProgressBarPercentage(100);
      })
      .catch((err) => {
        console.error(err);
        setProgressBarPercentage(100);
      });
  }, [markers]);

  return (
    <div className={`${lg ? "h-[100vh]" : "h-full"} w-full overflow-hidden`}>
      <div className="w-full h-[90%]">
        <ProgressBar
          numOfMarkers={markers.length}
          disabled={timeseriesArr.length > 0}
          setProgressBarPercentage={setProgressBarPercentage}
          progressBarPercentage={progressBarPercentage}
        />
        <BackButton params={params} />

        {lg && (
          <div className="w-full h-full grid grid-cols-3 grid-rows-1 gap-4">
            <div className="col-span-2 w-full h-[90%] flex flex-col items-center">
              <PlotlyChart timeseriesArr={timeseriesArr} intervalDays={intervalDays} />
            </div>

            <div className="mr-5">
              <div className="w-[100%] h-[40%] ">
                <Velmap
                  zoom={5}
                  center={
                    markers[0]
                      ? [markers[0].latLon.lat, markers[0].latLon.lon]
                      : [69.198, -49.103]
                  }
                  mapChildren={
                    <>
                      {markers.map((marker) => (
                        <LocationMarker
                          key={`${marker.id}`}
                          markerProp={marker}
                          markers={markers}
                          draggable={false}
                        />
                      ))}
                    </>
                  }
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
        )}
        {!lg && (
          <div className="w-full h-full flex flex-col items-center ">
            <PlotlyChart timeseriesArr={timeseriesArr} intervalDays={intervalDays} />
            <div className="my-2">
              <MarkerTable markers={markers} className="m-auto" />
            </div>
            <div className="my-2">
              <CSVDownloadButton data={timeseriesArr} />
            </div>
            <div className="my-2">
              <ShareButton />
            </div>
          </div>
        )}
      </div>
      <div className="w-full h-[10%] flex flex-row justify-center items-center m-4">
        <div className="">
          Velocity data generated using auto-RIFT (Gardner et al., 2018) and
          provided by the NASA MEaSUREs ITS_LIVE project (Gardner et al., 20XX).
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
