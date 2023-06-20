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
    velocityArray: number[]
    // satelliteArray: ISatellite[]
    // deltaTimeArray: number[]
  }
}

export type ISatellite  = 'Sentinel 1' | 'Sentinel 2' | 'Landsat 4' | 'Landsat 5' | 'Landsat 7' | 'Landsat 8' | 'Landsat 9'

// sat_label_dict = {
// 	"1": "Sentinel 1",
// 	"2": "Sentinel 2",
// 	"4": "Landsat 4",
// 	"5": "Landsat 5",
// 	"7": "Landsat 7",
// 	"8": "Landsat 8",
// 	"9": "Landsat 9",
// }
