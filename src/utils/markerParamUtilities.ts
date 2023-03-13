import { createId } from "@paralleldrive/cuid2";
import { IColor, IMarker } from "../components/Velmap";

export function markersToUrlParams(markers: Array<IMarker>): URLSearchParams {
  const params = new URLSearchParams();
  markers.forEach((marker) => {
    params.append('lat', marker.latLng.lat.toString());
    params.append('lng', marker.latLng.lng.toString());
    params.append('c', colorToC(marker.color));
  });
  return params;
}

export function urlParamsToMarkers(params: URLSearchParams): Array<IMarker> {
    const markers: Array<IMarker> = [];
    for (let i = 0; i < params.getAll('lat').length; i++) {
      markers.push({
        id: createId(),
        color: cToColor(params.getAll('c')[i]),
        latLng: {
          lat: parseFloat(params.getAll('lat')[i]),
          lng: parseFloat(params.getAll('lng')[i])
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