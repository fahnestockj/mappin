export type IColor = 'green' | 'blue' | 'red' | 'yellow'

export type ICoordinate = {
  lat: number
  lng: number
}
export type IMarker = {
  id: string
  color: IColor
  latLng: ICoordinate
}

export type ITimeseries = {
  marker: IMarker
  data: {
    midDateArray: Date[]
    velocityArray: number[]
  }
}