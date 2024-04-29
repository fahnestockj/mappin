import { createId } from "@paralleldrive/cuid2"
import produce from "immer"
import { markersToUrlParams } from "./paramUtilities"
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

  if (markers.length < 11) {
    //Immer produce for immutability
    const updatedMarkers = produce(markers, draft => {
      draft.push({
        id: createId(),
        color: colorHexArr[markers.length], //TODO: ?? is this right
        latLon: {
          lat: parseFloat(latitude.toFixed(4)),
          lon: parseFloat(longitude.toFixed(4))
        }
      })
    })

    const urlParams = markersToUrlParams(updatedMarkers)
    setSearchParams(urlParams, { replace: true })
    setMarkers(updatedMarkers)
  }
}