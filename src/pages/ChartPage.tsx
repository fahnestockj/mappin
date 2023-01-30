import axios from "axios";
import React, { useEffect } from "react"
import { z } from "zod";
import BackButton from "../components/BackButton";
import { CSVDownloadButton } from "../components/CSVDownloadButton";
import LocationMarker from "../components/LocationMarker/LocationMarker";
import Velmap, { IMarker } from "../components/Velmap";
import { ZoomingChart } from "../components/ZoomingChart";

export type ITimeseries = {
  coordinateStr: string
  coordinates: {
    lat: number
    lng: number
  }
  color?: string
  //[datetimeString, velocity]
  timeseries: Array<[Date, number]>
}

export type IArrayOfTimeseries = Array<ITimeseries>

const latLngRegex = new RegExp(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/)
const ZLatLngKey = z.string().trim().regex(latLngRegex)

const ZResponse = z.record(
  ZLatLngKey,
  z.array(z.tuple([z.coerce.date(), z.coerce.number()]))
)

type IProps = {
  markers: Array<IMarker>
}
const ChartPage = (props: IProps) => {
  const [timeseriesArr, setTimeseriesArr] = React.useState<IArrayOfTimeseries>([])

  const { markers } = props
  useEffect(() => {
    //NOTE: useEffect will run twice development because of React.StrictMode this won't happen in production

    const params = new URLSearchParams();
    markers.forEach(marker => {
      params.append('lat', marker.latLng.lat.toString());
      params.append('lng', marker.latLng.lng.toString());
    })

    axios.get('/timeseries', {
      params: params
    }).then(res => {

      //parse res with zod schema
      const parsedRes = ZResponse.parse(res.data)
      const data: IArrayOfTimeseries = Object.keys(parsedRes).map(latLngStr => {
        const lat = parseFloat(latLngStr.split(',')[0])
        const lng = parseFloat(latLngStr.split(',')[1])
        return {
          color: markers.find(marker => marker.latLng.lat === lat && marker.latLng.lng === lng)?.color,
          coordinateStr: latLngStr,
          coordinates: {
            lat,
            lng
          },
          timeseries: parsedRes[latLngStr]
        }
      })
      console.log(data);
      setTimeseriesArr(data)
    })
  }, [markers])

  return (
    <div className="w-full h-full">
      <BackButton />
      <div className="flex flex-row">
        <ZoomingChart timeseriesArr={timeseriesArr} />
        <div className="w-[40vh] h-[40vh]">
          <Velmap
            zoom={7}
            center={[markers[0].latLng.lat, markers[0].latLng.lng]}
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
      </div>

      <CSVDownloadButton data={timeseriesArr} />
    </div>
  )
};

export default ChartPage;