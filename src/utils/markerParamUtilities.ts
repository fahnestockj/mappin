import { createId } from "@paralleldrive/cuid2";
import { IColor, IMarker } from "../types";

export function markersToUrlParams(markers: Array<IMarker>): URLSearchParams {
  const params = new URLSearchParams();
  markers.forEach((marker) => {
    params.append('lat', marker.latLon.lat.toString());
    params.append('lon', marker.latLon.lon.toString());
    params.append('c', colorToC(marker.color));
  });
  return params;
}

export function urlParamsToMarkers(params: URLSearchParams): Array<IMarker> {
    const markers: Array<IMarker> = [];
    //NOTE: we need this to support the old url format
    let lonArr = params.getAll('lon');
    if(lonArr.length === 0) {
      lonArr = params.getAll('lng');
    }

    for (let i = 0; i < params.getAll('lat').length; i++) {
      markers.push({
        id: createId(),
        color: cToColor(params.getAll('c')[i]),
        latLon: {
          lat: parseFloat(params.getAll('lat')[i]),
          lon: parseFloat(lonArr[i])
        }
      })
    }
    return markers;
  }

function cToColor (c: string): IColor {
  switch(c) {
    case 'r':
      return 'red'
    case 'g':
      return 'green'
    case 'b':
      return 'blue'
    case 'y':
      return 'yellow'
    default:
      throw new Error('Invalid color')
  }
}

function colorToC (color: IColor): string {
  switch(color) {
    case 'red':
      return 'r'
    case 'green':
      return 'g'
    case 'blue':
      return 'b'
    case 'yellow':
      return 'y'
  }
}