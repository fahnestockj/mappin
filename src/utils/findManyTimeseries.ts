import { HTTPStore, openArray } from "zarr";
import { IMarker } from "../components/Velmap";
import { ITimeseries } from "../pages/ChartPage";
import { findClosestIndex } from "./findClosestIndex";
import { geoJsonLookup } from "./geoJsonLookup";

declare enum HTTPMethod {
  GET = "GET",
}

export async function findManyTimeseries(markerArr: Array<IMarker>): Promise<Array<ITimeseries>> {
  const results: Array<ITimeseries> = []

  const geoJsonLookupRes = geoJsonLookup(markerArr)

  for (const { marker, zarrUrl, cartesianCoordinate } of geoJsonLookupRes) {
    
    
    const url = 'http://localhost:5000/' + zarrUrl
    const store = new HTTPStore(url, { fetchOptions: {}, supportedMethods: ["GET" as HTTPMethod] });

    const xArrayZarr = await openArray({
      store,
      path: "/x",
      mode: "r"
    })

    const yArrayZarr = await openArray({
      store,
      path: "/y",
      mode: "r"
    })

    const xArray = await xArrayZarr.get(null).then(res => {
      if (typeof res === 'number') {
        throw new Error('data is a number')
      }
      return res.data as Float64Array
    })

    const yArray = await yArrayZarr.get(null).then(res => {
      if (typeof res === 'number') {
        throw new Error('data is a number')
      }
      return res.data as Float64Array
    })

    const [xIndex, yIndex] = findClosestIndex(xArray, yArray, cartesianCoordinate)

    const midDateZarr = await openArray({
      store,
      path: "/mid_date",
      mode: "r"
    })

    const timeseriesArrZarr = await openArray({
      store,
      path: "/v",
      mode: "r"
    })
    
    const timeseriesArr = await timeseriesArrZarr.get([null, yIndex, xIndex]).then(res => {
      if (typeof res === 'number') {
        throw new Error('data is a number')
      }
      return res.data as Int16Array
    })
    // console.log(timeseriesArr);

    /** 
     * NOTE: Mid date array is in days since 1970-01-01 (EPOCH) which the Date constructor cannot handle
     * new Date(daysSinceEpochFloat * 86400000) -> converts to milliseconds since EPOCH which the Date constructor can handle
     **/
    const midDateArr = await midDateZarr.get(null).then(res => {
      if (typeof res === 'number') {
        throw new Error('data is a number')
      }
      return res.data as Float64Array
    })

    const timeseriesData: Array<[Date, number]> = []
    for (let i = 0; i < timeseriesArr.length; i++) {
      if (timeseriesArr[i] === -32767) continue
      timeseriesData.push([new Date(midDateArr[i] * 86400000), timeseriesArr[i]])
    }
    

    results.push({
      marker,
      data: timeseriesData,
    })
  }
  return results

}