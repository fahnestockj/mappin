import { openArray, HTTPStore, slice, array } from "zarr";
import fetch, { Headers, Request, Response } from "node-fetch";
import { createId } from "@paralleldrive/cuid2";
import { findClosestIndex } from "../findManyTimeseries/findClosestIndex";
import { IMarker } from "../types";
import { geoJsonLookup } from "../findManyTimeseries/geoJsonLookup";

declare enum HTTPMethod {
  GET = "GET",
}

export async function main() {
  //TODO:
  /**
   * Blocked by zarr-js issue:
   * doesnt recognize '<U2' dtype
   * we need to add this dtype to the zarr-js library
   * currently trying in node_modules/zarr/lib/nestedArray/types.js
   * Looks like this one is the only one that impacts tsx scripts node_modules/zarr/core.mjs
   * using patch package
   * 
   * 
   * 
   * Looks like its a unicode string??
   * 
   * Its a fcing unicode string!!!
   * https://numpy.org/doc/stable/reference/arrays.scalars.html#numpy.str_
   * 
   * okay so how do we decode it?
   * 
   * 
   */


  console.log("start");
  if (!globalThis.fetch) {
    // @ts-ignore
    globalThis.fetch = fetch;
    // @ts-ignore
    globalThis.Headers = Headers;
    // @ts-ignore
    globalThis.Request = Request;
    // @ts-ignore
    globalThis.Response = Response;
  }

  const marker: IMarker = {
    id: createId(),
    color: "blue",
    latLon: {
      lat: 70,
      lon: -50,
    },
  };
  const markerArray = [marker];

  const geoJsonLookupRes = geoJsonLookup([marker]);
  // console.log(coordinateS3UrlTuples);

  // for (const { zarrUrl, cartesianCoordinate } of geoJsonLookupRes) {
  //   console.log(zarrUrl);
  const { zarrUrl, cartesianCoordinate } = geoJsonLookupRes[0];
  const url =
    "https://its-live-data.s3.amazonaws.com/datacubes/v02/N70W040/ITS_LIVE_vel_EPSG3413_G0120_X-150000_Y-2150000.zarr";

  const store = new HTTPStore(url, {
    fetchOptions: {},
    supportedMethods: ["GET" as HTTPMethod],
  });

  const xArrayZarr = await openArray({
    store,
    path: "/x",
    mode: "r",
  });

  const yArrayZarr = await openArray({
    store,
    path: "/y",
    mode: "r",
  });

  // const xArray = await xArrayZarr.get(null).then((res) => {
  //   if (typeof res === "number") {
  //     throw new Error("data is a number");
  //   }
  //   return res.data as Float64Array;
  // });

  // const yArray = await yArrayZarr.get(null).then((res) => {
  //   if (typeof res === "number") {
  //     throw new Error("data is a number");
  //   }
  //   return res.data as Float64Array;
  // });

  // const [xIndex, yIndex] = findClosestIndex(
  //   xArray,
  //   yArray,
  //   cartesianCoordinate
  // );

  // const midDateZarr = await openArray({
  //   store,
  //   path: "/mid_date",
  //   mode: "r",
  // });

  const timeseriesArrZarr = await openArray({
    store,
    path: "/v",
    mode: "r",
  });

  const satelliteArr = await openArray({
    store,
    path: "/satellite_img1",
    mode: "r",
  })
  const x = await satelliteArr.get(null).then(res => {
    console.log(res);
    if(typeof res === 'number') {
      throw new Error('data is a number')
    }

    return res.data as Uint8Array
  })
  console.log('res: ', x);
  
   
  //unicode decoder
  // const decoder = new TextDecoder()
  // const decoded = decoder.decode(x.buffer)
  // console.log(decoded);
  //@ts-ignore
  console.log(String.fromCharCode.apply(null, x));
  
  
  
  
    


  const deltaTimeArrZarr = await openArray({
    store,
    path: "/date_dt",
    mode: "r",
  });

  // const timeseriesArr = await timeseriesArrZarr
  //   .get([null, xIndex, yIndex])
  //   .then((res) => {
  //     if (typeof res === "number") {
  //       throw new Error("data is a number");
  //     }
  //     return res.data as Int16Array;
  //   });
  // console.log(timeseriesArr);

  /**
   * NOTE: Mid date array is in days since 1970-01-01 (EPOCH) which the Date constructor cannot handle
   * new Date(daysSinceEpochFloat * 86400000) -> converts to milliseconds since EPOCH which the Date constructor can handle
   **/
  // const midDateArr = await midDateZarr.get(null).then((res) => {
  //   if (typeof res === "number") {
  //     throw new Error("data is a number");
  //   }
  //   return res.data as Float64Array;
  // });



  // const velocityArray: Array<number> = []
  // const midDateArray: Array<Date> = []
  // const satelliteArray: Array<string> = []
  // const deltaTimeArray: Array<number> = []


  // for (let i = 0; i < timeseriesArr.length; i++) {
  //   if (timeseriesArr[i] === -32767) continue
  //   velocityArray.push(timeseriesArr[i])
  //   midDateArray.push(new Date(midDateArr[i] * 86400000))

  // }

}



main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });


const datacubeAttributesEx = {
  GDAL_AREA_OR_POINT: "Area",
  author: "ITS_LIVE, a NASA MEaSUREs project (its-live.jpl.nasa.gov)",
  autoRIFT_parameter_file:
    "http://its-live-data.s3.amazonaws.com/autorift_parameters/v001/autorift_landice_0120m.shp",
  datacube_software_version: "1.0",
  date_created: "29-Mar-2022 18:26:48",
  date_updated: "06-Jun-2022 20:45:39",
  geo_polygon:
    "[[-140.0424510691709, 59.22378023379081], [-140.07960786001456, 59.43816214251048], [-140.11731484997264, 59.65274347822059], [-140.15558431740624, 59.86752276155854], [-140.19442890773482, 60.082498496408085], [-140.62462804144593, 60.06213986570746], [-141.0541918941148, 60.04017088028565], [-141.48307369289725, 60.0165957241404], [-141.91122711902466, 59.991418873895434], [-141.85976000552583, 59.77720805456233], [-141.8090501796134, 59.563182947949294], [-141.7590811269705, 59.34934528039464], [-141.70983680775691, 59.135696754888066], [-141.29394818895108, 59.16004700736533], [-140.87739260664313, 59.182847033625336], [-140.46021259214837, 59.20409272284828], [-140.0424510691709, 59.22378023379081]]",
  institution:
    "NASA Jet Propulsion Laboratory (JPL), California Institute of Technology",
  latitude: "59.61",
  longitude: "-140.96",
  proj_polygon:
    "[[-3400000, 300000], [-3375000.0, 300000.0], [-3350000.0, 300000.0], [-3325000.0, 300000.0], [-3300000, 300000], [-3300000.0, 325000.0], [-3300000.0, 350000.0], [-3300000.0, 375000.0], [-3300000, 400000], [-3325000.0, 400000.0], [-3350000.0, 400000.0], [-3375000.0, 400000.0], [-3400000, 400000], [-3400000.0, 375000.0], [-3400000.0, 350000.0], [-3400000.0, 325000.0], [-3400000, 300000]]",
  projection: "3413",
  s3: "s3://its-live-data/datacubes/v02/N50W140/ITS_LIVE_vel_EPSG3413_G0120_X-3350000_Y350000.zarr",
  skipped_granules:
    "s3://its-live-data/datacubes/v02/N50W140/ITS_LIVE_vel_EPSG3413_G0120_X-3350000_Y350000.json",
  time_standard_img1: "UTC",
  time_standard_img2: "UTC",
  title: "ITS_LIVE datacube of image_pair velocities",
  url: "https://its-live-data.s3.amazonaws.com/datacubes/v02/N50W140/ITS_LIVE_vel_EPSG3413_G0120_X-3350000_Y350000.zarr",
};
/**
 * zarr datacube tree
/
 ├── acquisition_date_img1 (17759,) float64
 ├── acquisition_date_img2 (17759,) float64
 ├── autoRIFT_software_version (17759,) <U5
 ├── chip_size_height (17759, 833, 833) uint16
 ├── chip_size_width (17759, 833, 833) uint16
 ├── date_center (17759,) float64
 ├── date_dt (17759,) float64
 ├── granule_url (17759,) <U235
 ├── interp_mask (17759, 833, 833) uint8
 ├── mapping () <U1
 ├── mid_date (17759,) float64
 ├── mission_img1 (17759,) <U1
 ├── mission_img2 (17759,) <U1
 ├── roi_valid_percentage (17759,) float64
 ├── satellite_img1 (17759,) <U2
 ├── satellite_img2 (17759,) <U2
 ├── sensor_img1 (17759,) <U3
 ├── sensor_img2 (17759,) <U3
 ├── stable_count_mask (17759,) int64
 ├── stable_count_slow (17759,) int64
 ├── stable_shift_flag (17759,) int64
 ├── v (17759, 833, 833) int16
 ├── v_error (17759, 833, 833) int16
 ├── va (17759, 833, 833) int16
 ├── va_error (17759,) float64
 ├── va_error_mask (17759,) float64
 ├── va_error_modeled (17759,) float64
 ├── va_error_slow (17759,) float64
 ├── va_stable_shift (17759,) float64
 ├── va_stable_shift_mask (17759,) float64
 ├── va_stable_shift_slow (17759,) float64
 ├── vr (17759, 833, 833) int16
 ├── vr_error (17759,) float64
 ├── vr_error_mask (17759,) float64
 ├── vr_error_modeled (17759,) float64
 ├── vr_error_slow (17759,) float64
 ├── vr_stable_shift (17759,) float64
 ├── vr_stable_shift_mask (17759,) float64
 ├── vr_stable_shift_slow (17759,) float64
 ├── vx (17759, 833, 833) int16
 ├── vx_error (17759,) float64
 ├── vx_error_mask (17759,) float64
 ├── vx_error_modeled (17759,) float64
 ├── vx_error_slow (17759,) float64
 ├── vx_stable_shift (17759,) float64
 ├── vx_stable_shift_mask (17759,) float64
 ├── vx_stable_shift_slow (17759,) float64
 ├── vy (17759, 833, 833) int16
 ├── vy_error (17759,) float64
 ├── vy_error_mask (17759,) float64
 ├── vy_error_modeled (17759,) float64
 ├── vy_error_slow (17759,) float64
 ├── vy_stable_shift (17759,) float64
 ├── vy_stable_shift_mask (17759,) float64
 ├── vy_stable_shift_slow (17759,) float64
 ├── x (833,) float64
 └── y (833,) float64

 */