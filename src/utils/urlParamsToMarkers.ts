import { createId } from "@paralleldrive/cuid2";
import { IColor, IMarker } from "../components/Velmap";

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