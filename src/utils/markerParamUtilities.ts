import { createId } from "@paralleldrive/cuid2";
import { IColor, IMarker, ZColor } from "../types";

type IDeprecatedColor = 'r' | 'g' | 'b' | 'y'

const deprecatedColorsDict: Record<IDeprecatedColor, IColor> = {
  b: 'll',
  g: 'cpg',
  r: 'reb',
  y: 'c'
}


export function markersToUrlParams(markers: Array<IMarker>): URLSearchParams {
  const params = new URLSearchParams();
  markers.forEach((marker) => {
    params.append('lat', marker.latLon.lat.toString());
    params.append('lon', marker.latLon.lon.toString());
    params.append('c', marker.color)
  });
  return params;
}

export function urlParamsToMarkers(params: URLSearchParams): Array<IMarker> {
    const markers: Array<IMarker> = [];
    //NOTE: we need this to support the old coordinate param setup
    let lonArr = params.getAll('lon');
    if(lonArr.length === 0) {
      lonArr = params.getAll('lng');
    }
    //NOTE: and this to support the old colors...
    const colorArr = params.getAll('c').map((color) => {
      if(color in deprecatedColorsDict) {
        return deprecatedColorsDict[color as IDeprecatedColor]
      }
      return ZColor.parse(color)
    })

    for (let i = 0; i < params.getAll('lat').length; i++) {
      markers.push({
        id: createId(),
        color: colorArr[i],
        latLon: {
          lat: parseFloat(params.getAll('lat')[i]),
          lon: parseFloat(lonArr[i])
        }
      })
    }
    return markers;
  }
