import { openArray, HTTPStore, slice, array } from 'zarr';
import fetch, {
  Headers,
  Request,
  Response
} from 'node-fetch'
import { geoJsonLookup } from './geoJsonLookup';
import { ICoordinate, IMarker } from '../components/Velmap';
import { createId } from '@paralleldrive/cuid2';
import { appProj4 } from './proj4Projections';
import { findClosestIndex } from './findClosestIndex';



declare enum HTTPMethod {
  GET = "GET",
}

async function main() {
  console.log('start');
  if (!globalThis.fetch) {
    // @ts-ignore
    globalThis.fetch = fetch
    // @ts-ignore
    globalThis.Headers = Headers
    // @ts-ignore
    globalThis.Request = Request
    // @ts-ignore
    globalThis.Response = Response
  }

  const marker: IMarker = {
    id: createId(),
    color: 'blue',
    latLng: {
      lat: 70,
      lng: -50,
    },
  }
  const markerArray = [marker]

  const geoJsonLookupRes = geoJsonLookup([marker])
  // console.log(coordinateS3UrlTuples);


  for (const { zarrUrl, cartesianCoordinate } of geoJsonLookupRes) {

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
      path: "/mid_date",
      mode: "r"
    })



    const timeseriesArrZarr = await openArray({
      store,
      path: "/v",
      mode: "r"
    })

    const timeseriesArr = await timeseriesArrZarr.get([null, xIndex, yIndex]).then(res => {
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

    const timeseries: Array<[Date, number]> = []
    for (let i = 0; i < timeseriesArr.length; i++) {
      if(timeseriesArr[i] === -32767) continue
      timeseries.push([new Date(midDateArr[i] * 86400000), timeseriesArr[i]])
    }
    console.log(timeseries);

  }

}


main()
  .catch((e) => {
    console.log(e);
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })