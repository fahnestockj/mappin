import { z } from "zod"

export type IColor = 'll' | 'reb' | 'cpg' | 'c' | 'dg'

export const colorHexDict: { [key in IColor]: string } = {
  ll: '#2660a4ff', // 'lapis-lazuli'
  reb: '#55dde0ff', // 'robin-egg-blue'
  cpg: '#28502eff', // 'cal-poly-green
  c: '#c47335ff', // 'copper'
  dg: '#7b7263ff', // 'dim-gray'
}

export const ZColor = z.enum(['ll', 'reb', 'cpg', 'c', 'dg'])

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
  marker: IMarker
  data: {
    midDateArray: Date[]
    dateDeltaArray: Date[]
    velocityArray: number[]
  }
}
