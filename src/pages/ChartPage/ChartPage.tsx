import React, { useEffect, useState } from "react"
import BackButton from "../../components/BackButton";
import { CSVDownloadButton } from "../../components/CSVDownloadButton";
import LocationMarker from "../../components/LocationMarker/LocationMarker";
import Velmap  from "../../components/Velmap";
import { PlotlyChart } from "../../components/PlotlyChart/PlotlyChart";
import ProgressBarWithTimer from "../../components/ProgressBarWithTimer";
import { MarkerTable } from "../../components/MarkerTable";
import { useSearchParams } from "react-router-dom";
import { urlParamsToMarkers } from "../../utils/markerParamUtilities";
import { ShareButton } from "../../components/ShareButton";
//@ts-ignore
import { useBreakpoints } from 'react-breakpoints-hook'
import { IMarker, ITimeseries } from "../../types";
import { findManyTimeseries } from "../../findManyTimeseries/findManyTimeseries";


type IProps = {
}

const ChartPage = (props: IProps) => {
  let { sm, md, lg } = useBreakpoints({
    sm: { min: 0, max: 860 },
    md: { min: 861, max: 1400 },
    lg: { min: 1401, max: null },
  });
  

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
    <>
        <div className="w-full h-[89vh]">
          <ProgressBarWithTimer numOfMarkers={markers.length} disabled={!(timeseriesArr.length === 0)} setProgress={setProgress} progress={progress} />
          <BackButton params={params} />
          <div className="w-full h-full grid grid-cols-3 grid-rows-1 gap-4">

            <div className="col-span-2">
              <PlotlyChart timeseriesArr={timeseriesArr} />
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
                <ShareButton />
              </div>
            </div>

          </div>
          <div className="w-full h-[50px]  flex flex-row justify-center">
            <div className="flex flex-col justify-center">
              <div className="">Velocity data generated using auto-RIFT (Gardner et al., 2018) and provided by the NASA MEaSUREs ITS_LIVE project (Gardner et al., 20XX).</div>
            </div>
          </div>
        </div>
      {/* 
      TODO: md and sm views
      {(md || sm) &&
        <div className="w-full h-full">
        </div>
      } */}
    </>
  )
};

export default ChartPage;