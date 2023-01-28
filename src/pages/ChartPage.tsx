import axios from "axios";
import React, { useEffect } from "react"
import { z } from "zod";
import { IMarker } from "../components/leafletMap/Velmap";
import ZoomingChart from "../components/ZoomingChart";

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

// type IResponse = {
//   [key: string]: Record<string, string>
// }

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
    <ZoomingChart timeseriesArr={timeseriesArr} />
  )
};

export default ChartPage;