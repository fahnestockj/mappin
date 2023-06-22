export type IColor = 'green' | 'blue' | 'red' | 'yellow'

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
