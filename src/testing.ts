import { findManyTimeseries } from "./findManyTimeseries/findManyTimeseries";
import { IMarker } from "./types";

export async function testing() {
  console.log("Started testing ");
  
  const marker: IMarker = {
    latLon: {
      lat: 70,
      lon: -50,
    },
    id: 'test',
    color: '#2660a4ff',
  }

  const timeseries = await findManyTimeseries([marker])
  console.log(timeseries)
}