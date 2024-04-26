import { createId } from "@paralleldrive/cuid2";
import { IColor, IMarker, colorHexArr } from "../types";


export function markersToUrlParams(markers: Array<IMarker>): URLSearchParams {
  const params = new URLSearchParams();
  markers.forEach((marker) => {
    params.append('lat', marker.latLon.lat.toString());
    params.append('lon', marker.latLon.lon.toString());
  });
  return params;
}

export function urlParamsToMarkers(params: URLSearchParams): Array<IMarker> {
  const markers: Array<IMarker> = [];
  //NOTE: we need this to support the old coordinate param setup
  let lonArr = params.getAll('lon');
  if (lonArr.length === 0) {
    lonArr = params.getAll('lng');
  }

  for (let i = 0; i < params.getAll('lat').length && markers.length < 11; i++) {
    markers.push({
      id: createId(),
      color: colorHexArr[i],
      latLon: {
        lat: parseFloat(params.getAll('lat')[i]),
        lon: parseFloat(lonArr[i])
      }
    })
  }
  return markers;
}
