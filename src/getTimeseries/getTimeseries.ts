import { HTTPStore, openArray } from "@fahnestockj/zarr-fork";
import { findClosestIndex } from "./findClosestIndex";
import { geoJsonLookup } from "./geoJsonLookup";
import { IMarker, ITimeseries } from "../types";

declare enum HTTPMethod {
  GET = "GET",
}

export async function getTimeseries(marker: IMarker): Promise<ITimeseries> {

  const datacubeUrls = geoJsonLookup(marker)

  const timeseriesForMarker: Array<ITimeseries> = await Promise.all(datacubeUrls.map(async (dc) => {
    const { zarrUrl, cartesianCoordinate } = dc
    const cachedMidDateArrJson = window.sessionStorage.getItem(`midDateArr:${zarrUrl}`)


    const store = new HTTPStore(zarrUrl, { fetchOptions: {}, supportedMethods: ["GET" as HTTPMethod] });

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
      path: "/date_center",
      mode: "r"
    })

    const timeseriesArrZarr = await openArray({
      store,
      path: "/v",
      mode: "r"
    })

    const dateDeltaZarr = await openArray({
      store,
      path: "/date_dt",
      mode: "r"
    })

    const satellteZarr = await openArray({
      store,
      path: "satellite_img1",
      mode: "r",
    });

    const timeseriesArr = await timeseriesArrZarr.get([null, yIndex, xIndex]).then(res => {
      if (typeof res === 'number') {
        throw new Error('data is a number')
      }
      return res.data as Int16Array
    })

    let midDateArr: Float64Array

    if (cachedMidDateArrJson) {
      midDateArr = JSON.parse(cachedMidDateArrJson)
    }
    else {
      midDateArr = await midDateZarr.get(null).then(res => {
        if (typeof res === 'number') {
          throw new Error('data is a number')
        }
        return res.data as Float64Array
      })
      try {
        window.sessionStorage.setItem(`midDateArr:${zarrUrl}`, JSON.stringify(midDateArr, null, 0))
      }
      catch (e) {
        console.error(e)
        window.sessionStorage.clear()
      }
    }

    const dateDeltaArr = await dateDeltaZarr.get(null).then(res => {
      if (typeof res === 'number') {
        throw new Error('data is a number')
      }
      return res.data as Float64Array
    })

    const satelliteArr = await satellteZarr.get(null).then((res) => {
      if (typeof res === "number") {
        throw new Error("data is a number");
      }
      return res.data as Float64Array;
    });

    const velocityArray: Array<number> = []
    const midDateArray: Array<Date> = []
    const daysDeltaArray: Array<number> = []
    const satelliteArray: Array<string> = []
    // console.log(timeseriesArr.length);
    // console.log('bytelength ', timeseriesArr.byteLength);
    
    for (let i = 0; i < timeseriesArr.length; i++) {
      if (timeseriesArr[i] === -32767) {
        // console.log("SKIPPING");
        
        continue
      }
      velocityArray.push(timeseriesArr[i])
      /** 
       * NOTE: Mid date array is in days since 1970-01-01 (EPOCH) which the Date constructor cannot handle
       * new Date(daysSinceEpochFloat * 86400000) -> converts to milliseconds since EPOCH which the Date constructor can handle
       **/
      midDateArray.push(new Date(midDateArr[i] * 86400000))
      daysDeltaArray.push(Math.round(dateDeltaArr[i]))

      const offset = i * 8
      const eightBytes = satelliteArr.buffer.slice(offset, offset + 8);
      const uintArray = new Uint8Array(eightBytes);
      let satelliteShorthand = "";
      for (const byte of uintArray) {
        const char = String.fromCharCode(byte);
        if (char !== "\u0000") {
          satelliteShorthand = satelliteShorthand.concat(String.fromCharCode(byte));
        }
      }

      const satelliteString = satelliteStrDict[satelliteShorthand as keyof typeof satelliteStrDict];
      satelliteArray.push(satelliteString);
    }

    return {
      marker,
      zarrUrl,
      data: {
        midDateArray,
        velocityArray,
        daysDeltaArray,
        satelliteArray,
      }
    }
  }))

  if (timeseriesForMarker.length > 1) {
    // find timeseries with most pts
    return timeseriesForMarker.reduce((cur, acc) => cur.data.midDateArray.length > acc.data.midDateArray.length ? cur : acc, timeseriesForMarker[0])
  }
  return timeseriesForMarker[0]
}

const satelliteStrDict = {
  "1A": "Sentinel 1",
  "1B": "Sentinel 1",
  "2A": "Sentinel 2",
  "2B": "Sentinel 2",
  "4": "Landsat 4",
  "5": "Landsat 5",
  "7": "Landsat 7",
  "8": "Landsat 8",
  "9": "Landsat 9",
}