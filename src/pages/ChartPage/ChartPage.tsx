import React, { useEffect, useMemo, useState } from "react"
import BackButton from "../../components/BackButton";
import { CSVDownloadButton } from "../../components/CSVDownloadButton";
import LocationMarker from "../../components/LocationMarker/LocationMarker";
import Velmap from "../../components/Velmap";
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
import RangeSlider from "../../components/RangeSlider";


type IProps = {
}

const ChartPage = (props: IProps) => {
  let { sm, md, lg } = useBreakpoints({
    sm: { min: 0, max: 860 },
    md: { min: 861, max: 1383 },
    lg: { min: 1384, max: null },
  });


  const [timeseriesArr, setTimeseriesArr] = React.useState<Array<ITimeseries>>([])
  const [progress, setProgress] = React.useState<number>(0)

  const [params] = useSearchParams();
  const initialMarkers = urlParamsToMarkers(params)
  const [markers] = useState<Array<IMarker>>(initialMarkers)
  const [intervalDays, setIntervalDays] = useState<Array<number>>([1, 120])

  const filteredTimeseries = useMemo<ITimeseries[]>(() => {
    if(timeseriesArr.length === 0) return ([])
    const epochTime = new Date(0).getTime()
    return timeseriesArr.map((timeseries) => {
      
      const filteredMidDateArray = []
      const filteredVelocityArray = []
      const filteredDateDtArray = []

      for(let i = 0; i < timeseries.data.midDateArray.length; i++) {
        const dt = timeseries.data.dateDeltaArray[i].getTime() - epochTime
        
        const days = dt / (1000 * 3600 * 24)
        if(days >= intervalDays[0] && days <= intervalDays[1]){
          filteredMidDateArray.push(timeseries.data.midDateArray[i])
          filteredVelocityArray.push(timeseries.data.velocityArray[i])
          filteredDateDtArray.push(timeseries.data.dateDeltaArray[i])
        }
      }
      return {
        marker: timeseries.marker,
        data: {
          midDateArray: filteredMidDateArray,
          velocityArray: filteredVelocityArray,
          dateDeltaArray: filteredDateDtArray
        }
      }
    })
  },[timeseriesArr, intervalDays])

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
    <div className={`${lg ? 'h-[100vh]' : 'h-full'} w-full`}>
      <div className="w-full h-[90%]">
        <ProgressBarWithTimer numOfMarkers={markers.length} disabled={!(timeseriesArr.length === 0)} setProgress={setProgress} progress={progress} />
        <BackButton params={params} />

        {lg && (
          <div className="w-full h-full grid grid-cols-3 grid-rows-1 gap-4">
            <div className="col-span-2 w-full h-[90%] flex flex-col items-center">
              <PlotlyChart timeseriesArr={filteredTimeseries} />
            </div>

            <div className="mr-5">
              <div className="w-[100%] h-[40%] ">
                <Velmap
                  zoom={7}
                  center={markers[0] ? [markers[0].latLon.lat, markers[0].latLon.lon] : [70, -50]}
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
              <div className="mt-4 ">
                <MarkerTable markers={markers} />
              </div>
              <div className="mt-4 flex ">
                <CSVDownloadButton data={timeseriesArr} />
                <ShareButton />
              </div>
              <div className="mt-4 flex items-center  ">
                <div className="text-md mr-2 font-bold">Interval (days)</div>
                <RangeSlider
                  className="w-[19rem] h-10 "
                  defaultValue={[1, 120]}
                  min={0}
                  max={565}
                  step={1}
                  onAfterChange={(value) => setIntervalDays(value)}
                />
              </div>


            </div>

          </div>
        )}
        {(md || sm) && (

          <div className="w-full h-full flex flex-col items-center ">
            <PlotlyChart timeseriesArr={timeseriesArr} />
            <div className="mt-4">
              <CSVDownloadButton data={timeseriesArr} />
            </div>
            <div className="mt-4">
              <ShareButton />
            </div>
          </div>
        )}


      </div>
      <div className="w-full h-[10%] flex flex-row justify-center m-4">
        <div className="flex flex-col justify-center">
          <div className="">Velocity data generated using auto-RIFT (Gardner et al., 2018) and provided by the NASA MEaSUREs ITS_LIVE project (Gardner et al., 20XX).</div>
        </div>
      </div>
    </div >
  )
};

export default ChartPage;