import axios from "axios";
import React, { useEffect } from "react"
import { z } from "zod";
import { IMarker } from "../components/leafletMap/Velmap";
import ZoomingChart from "../components/ZoomingChart";

export type ITimeseries = {
  coordinates: {
    lat: number
    lng: number
  }
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
    axios.get('/timeseries', {
      params: {
        lat: 70,
        lng: -50
      },
    }).then(res => {

      //parse res with zod schema
      const parsedRes = ZResponse.parse(res.data)
      const data: IArrayOfTimeseries = Object.keys(parsedRes).map(latLngStr => {
        const lat = parseFloat(latLngStr.split(',')[0])
        const lng = parseFloat(latLngStr.split(',')[1])
        return {
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
  }, [])


  return (
    <ZoomingChart timeseries={timeseriesArr[0]} />
  )

  // return (
  //   <div className="h-[50vh]">
  //     <VictoryChart
  //       name="chart"
  //       theme={VictoryTheme.material}
  //       domain={{ x: [new Date('01-01-2010'), new Date('01-01-2022')], y: [0, 3000] }}
  //     >
  //       {data.map((timeseries: ITimeseries) => {
  //         return (
  //           <VictoryScatter
  //             key={`${timeseries.coordinates.lat},${timeseries.coordinates.lng}`}
  //             style={{ data: { fill: "#c43a31" } }}
  //             size={7}
  //             x={0}
  //             y={1}
  //             data={timeseries.timeseries}
  //           />
  //         )
  //       }
  //       )}

  //     </VictoryChart>
  //   </div>
  // )
};

export default ChartPage;