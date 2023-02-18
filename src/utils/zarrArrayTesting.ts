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
      lng: -50
    },
  }
  const markerArray = [marker]

  const coordinateS3UrlTuples: Array<{
    coordinate: ICoordinate,
    zarrUrl: string,
    projection: string,
  }> = geoJsonLookup([marker.latLng])
  // console.log(coordinateS3UrlTuples);


  for (const resObj of coordinateS3UrlTuples) {
    const { coordinate, zarrUrl, projection } = resObj
    // console.log(coordinate, zarrUrl, projection);

    //NOTE: EPSG:4326 is the projection of the lat lng coordinates
    // lat: 70, lng: -50 => [-200000, -2200000] in the locale projection EPSG:3413
    const indexCoordinate = appProj4("EPSG:4326", projection).forward([coordinate.lng, coordinate.lat])
    console.log(indexCoordinate);

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

    const midDateZarr = await openArray({
      store,
      path: "/mid_date",
      mode: "r"
    })

    const xArray = await xArrayZarr.get(null).then(res => {
      if(typeof res === 'number') {
        throw new Error('data is a number')
      }
      return res.data as Float64Array
    })
    
    const yArray = await yArrayZarr.get(null).then(res => {
      if(typeof res === 'number') {
        throw new Error('data is a number')
      }
      return res.data as Float64Array
    })
    
    
    // const midDateArr = await midDateZarr.get(null).then(res => {
    //   if(typeof res === 'number') {
    //     throw new Error('data is a number')
    //   }
    //   return res.data as Float64Array
    // })
    

    


    // const arr = await openArray({
    //   store,
    //   path: "/v",
    //   mode: "r"
    // })

    // const RData = await arr.get([0, 50, null])
    // if (typeof RData === 'number') {
    //   throw new Error('data is a number')
    // }
    // const dataArr = RData.data

    // const filteredArr: Array<number> = []

    // dataArr.forEach((element) => {
    //   if (element !== -32767) {
    //     //@ts-ignore
    //     filteredArr.push(element)
    //   }
    // })
    // console.log(filteredArr);






  }



  // }




  // const fetchOptions = {}
  // const supportedMethods = ["GET" as HTTPMethod]; // defaults
  // // const store = new HTTPStore('https://its-live-data.s3.amazonaws.com/datacubes/v02/N50W140/ITS_LIVE_vel_EPSG3413_G0120_X-3350000_Y350000.zarr', { fetchOptions, supportedMethods });
  // const store = new HTTPStore('http://its-live-data.s3.amazonaws.com/datacubes/v02/S30W070/ITS_LIVE_vel_EPSG32719_G0120_X250000_Y5750000.zarr', { fetchOptions, supportedMethods });

  // const z = await openArray({
  //   store,
  //   path: "/v",
  //   mode: "r"
  // });
  // console.log(await z.get([null, 50, 50]))
}


main()
  .catch((e) => {
    console.log(e);
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
