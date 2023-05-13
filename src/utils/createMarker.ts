import { createId } from "@paralleldrive/cuid2"
import produce from "immer"
import { getColor } from "./getColor"
import { markersToUrlParams } from "./markerParamUtilities"
import { IMarker } from "../types"

type IProps = {
  latitude: number
  longitude: number
  markers: IMarker[]
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>
  setSearchParams: (params: URLSearchParams) => void

}
export function createMarker(props: IProps) {
  const { latitude, longitude, markers, setSearchParams, setMarkers } = props
  // console.log('lat', latitude, 'lon', longitude);

  if (markers.length < 4) {
    const color = getColor(markers.length)


    //Immer produce for immutability
    const updatedMarkers = produce(markers, draft => {
      draft.push({
        id: createId(),
        color,
        latLon: {
          lat: parseFloat(latitude.toFixed(5)),
          lon: parseFloat(longitude.toFixed(5))
        }
      })
    })

    const urlParams = markersToUrlParams(updatedMarkers)
    setSearchParams(urlParams)
    setMarkers(updatedMarkers)
  }
}