import { createId } from "@paralleldrive/cuid2";
import { IColor, IMarker, colorHexArr } from "../types";
import { z } from "zod";
import dayjs from "dayjs";



export function getStateFromUrlParams(params: URLSearchParams): { markers: Array<IMarker>, mapZoom: number, plotBounds: IPlotBounds } {
  return {
    markers: getMarkersFromParams(params),
    mapZoom: getMapZoomFromParams(params),
    plotBounds: getBoundsFromParams(params)
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

export interface IPlotBounds {
  x: [Date, Date]
  y: [number, number]
}
function getBoundsFromParams(params: URLSearchParams): IPlotBounds {
  const defaultPlotBounds: IPlotBounds = {
    x: [new Date("1985-01-01"), new Date("2024-01-01")],
    y: [-500, 10000]
  }
  const x = params.getAll('x')
  const y = params.getAll('y')
  // need a few guard clauses
  if (x.length != 2 || y.length != 2) {
    console.log("not enough params 2 or 2");

    return defaultPlotBounds;
  }

  const parsedDateBounds = x.map(xVal => z.coerce.date().safeParse(xVal))
  const parsedYBounds = y.map(yVal => z.coerce.number().safeParse(yVal))

  if (parsedDateBounds.some(result => result.success === false) || parsedYBounds.some(result => result.success === false)) {
    console.log("failed to parse bounds");

    return defaultPlotBounds;
  }

  return {
    x: parsedDateBounds.map(result => result!.data!) as [Date, Date],
    y: parsedYBounds.map(result => result!.data!) as [number, number],
  }
}

function getMapZoomFromParams(params: URLSearchParams): number {
  return parseFloat(params.get('z') || '7');
}




export function addMarkerToUrlParams(prevParams: URLSearchParams, marker: IMarker): URLSearchParams {
  const newParams = new URLSearchParams(prevParams);
  newParams.append('lat', marker.latLon.lat.toString());
  newParams.append('lon', marker.latLon.lon.toString());
  return newParams;
}

export function setPlotBoundsInUrlParams(prevParams: URLSearchParams, plotBounds: IPlotBounds): URLSearchParams {
  const newParams = new URLSearchParams(prevParams);
  newParams.delete('x');
  newParams.delete('y');
  newParams.append('x', dayjs(plotBounds.x[0]).format('YYYY-MM-DD'));
  newParams.append('x', dayjs(plotBounds.x[1]).format('YYYY-MM-DD'));
  newParams.append('y', plotBounds.y[0].toFixed(0));
  newParams.append('y', plotBounds.y[1].toFixed(0));
  return newParams;
}

export function clearMarkersFromUrlParams(prevParams: URLSearchParams): URLSearchParams {
  const newParams = new URLSearchParams(prevParams);
  newParams.delete('lat');
  newParams.delete('lon');
  return newParams;
}
