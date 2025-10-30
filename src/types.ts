import { NavigateOptions, URLSearchParamsInit } from 'react-router-dom'

enum ColorByHex {
  '#2660a4ff',// 'lapis-lazuli'
  '#61D1D4',// 'robin-egg-blue'
  '#28502eff',// 'cal-poly-green
  '#c47335ff',// 'copper'
  '#7b7263ff',// 'dim-gray'
  "#A1C181", // 'olivine'
  "#233D4D", // 'charcoal'
  "#391D0C", // 'dark brown'
  "#C60F7B", // 'magenta dye'
  "#FE4A49", // 'tomato'
  "#F17300", // 'safety-orange'
}
export type IColor = keyof typeof ColorByHex
export const colorHexArr = Object.values(ColorByHex) as Array<IColor> // ew TS enums


export type ICoordinate = {
  lat: number
  lon: number
}
export type IMarker = {
  id: string
  color: IColor
  latLon: ICoordinate
}

export type ITimeseries = {
  zarrUrl: string
  marker: IMarker
  data: {
    midDateArray: Date[]
    daysDeltaArray: number[]
    velocityArray: number[]
    satelliteArray: string[]
    originalIndexArray: number[] // Preserves original zarr index before filtering
  }
}

export type ISetSearchParams = (nextInit?: URLSearchParamsInit | ((prev: URLSearchParams) => URLSearchParamsInit), navigateOpts?: NavigateOptions) => void;