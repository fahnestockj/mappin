import { createId } from "@paralleldrive/cuid2"
import produce from "immer"
import { addMarkerToUrlParams } from "./searchParamUtilities"
import { IMarker, ISetSearchParams, colorHexArr } from "../types"

type IProps = {
  latitude: number
  longitude: number
  markers: IMarker[]
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>
  setSearchParams: ISetSearchParams

}
/**
 * Reponsible for creating a marker and updating the url params
 */
export function createMarker(props: IProps) {
  const { latitude, longitude, markers, setSearchParams, setMarkers } = props

  if (markers.length <= 10) {
    const newMarker: IMarker = {
      id: createId(),
      color: colorHexArr[markers.length],
      latLon: {
        lat: parseFloat(latitude.toFixed(4)),
        lon: parseFloat(longitude.toFixed(4))
      }
    }
    //Immer produce for immutability
    const updatedMarkers = produce(markers, draft => {
      draft.push(newMarker)
    })

    setSearchParams((prevUrlParams => addMarkerToUrlParams(prevUrlParams, newMarker)), { replace: true })
    setMarkers(updatedMarkers)
  }
}