import React, { useEffect, useState } from "react"
import BackButton from "../components/BackButton";
import { CSVDownloadButton } from "../components/CSVDownloadButton";
import LocationMarker from "../components/LocationMarker/LocationMarker";
import Velmap, { IMarker } from "../components/Velmap";
import { ZoomingChart } from "../components/ZoomingChart";
import ProgressBarWithTimer from "../components/ProgressBarWithTimer";
import { MarkerTable } from "../components/MarkerTable";
import { findManyTimeseries } from "../utils/findManyTimeseries";
import { useSearchParams } from "react-router-dom";
import { urlParamsToMarkers } from "../utils/markerParamUtilities";
import { BiShare } from "react-icons/bi";
import { CopyButton } from "../components/CopyButton";

export type ITimeseries = {
  marker: IMarker
  //[datetimeString, velocity]
  data: Array<[Date, number]>
}

type IProps = {
}

const ChartPage = (props: IProps) => {
  const [timeseriesArr, setTimeseriesArr] = React.useState<Array<ITimeseries>>([])
  const [progress, setProgress] = React.useState<number>(0)

  const [params] = useSearchParams();
  const initialMarkers = urlParamsToMarkers(params)
  const [markers] = useState<Array<IMarker>>(initialMarkers)

  useEffect(() => {
    //NOTE: useEffect will run twice in development because of React.StrictMode this won't happen in production
    findManyTimeseries(markers).then((timeseriesArr) => {
      setTimeseriesArr(timeseriesArr)
      setProgress(100)
    }).catch((err) => {
      console.error(err)
    })
  }, [markers])

  return (
    <div className="w-full h-[89vh]">
      <ProgressBarWithTimer numOfMarkers={markers.length} disabled={!(timeseriesArr.length === 0)} setProgress={setProgress} progress={progress} />
      <BackButton />
      <div className="w-full h-full grid grid-cols-3 grid-rows-1 gap-4">

        <div className="col-span-2">
          <ZoomingChart timeseriesArr={timeseriesArr} />
        </div>

        <div className="mr-5">
          <div className="w-[100%] h-[40%] ">
            <Velmap
              zoom={7}
              center={markers[0] ? [markers[0].latLng.lat, markers[0].latLng.lng] : [70, -50]}
              mapChildren={
                <>
                  {
                    markers.map(marker => (
                      <LocationMarker key={`${marker.id}`} markerProp={marker} markers={markers} draggable={false} />
                    ))
                  }
                </>
              }
            />
          </div>
          <div className="mt-4">
            <MarkerTable markers={markers} />
          </div>
          <div className="mt-4">
            <CSVDownloadButton data={timeseriesArr} />

          </div>
          <div className="mt-4">
            <CopyButton />
          </div>
        </div>

      </div>
      <div className="w-full h-[50px]  flex flex-row justify-center">
        <div className="flex flex-col justify-center">
          <div className="">Velocity data generated using auto-RIFT (Gardner et al., 2018) and provided by the NASA MEaSUREs ITS_LIVE project (Gardner et al., 20XX).</div>
        </div>
      </div>
    </div>
  )
};

export default ChartPage;