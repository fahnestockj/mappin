import { createId } from "@paralleldrive/cuid2";
import { IColor, IMarker, colorHexArr } from "../types";
import { z } from "zod";


export function markersToUrlParams(markers: Array<IMarker>): URLSearchParams {
  const params = new URLSearchParams();
  markers.forEach((marker) => {
    params.append('lat', marker.latLon.lat.toString());
    params.append('lon', marker.latLon.lon.toString());
  });
  return params;
}

export function getStateFromUrlParams(params: URLSearchParams): Partial<{ markers: Array<IMarker>, mapZoom: number, layout: IPlotLayout }> {
  return {
    markers: getMarkersFromParams(params),
    mapZoom: getMapZoomFromParams(params),
    layout: getLayoutFromParams(params)
  }
}

function getMarkersFromParams(params: URLSearchParams): Array<IMarker> {
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
// const intialPlotLayout = urlParamsToLayout(params);
// const initialZoom = urlParamsToZoom(params);

export interface IPlotLayout {
  x: [Date, Date]
  y: [number, number]
}
function getLayoutFromParams(params: URLSearchParams): IPlotLayout | undefined {
  const x = params.getAll('x')
  const y = params.getAll('y')
  // need a few guard clauses
  if (x.length != 2 || y.length != 2) {
    return undefined;
  }

  const parsedDateBounds = x.map(xVal => z.coerce.date().safeParse(xVal))
  const parsedYBounds = y.map(yVal => z.number().safeParse(yVal))

  if (parsedDateBounds.some(result => result.success === false) || parsedYBounds.some(result => result.success === false)) {
    return undefined;
  }

  return {
    x: parsedDateBounds.map(result => result.data) as [Date, Date],
    y: parsedYBounds.map(result => result.data) as [number, number],
  }

}

function getMapZoomFromParams(params: URLSearchParams): number {
  return parseFloat(params.get('z') || '1');
}
