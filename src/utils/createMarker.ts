import { createId } from "@paralleldrive/cuid2"
import produce from "immer"
import { markersToUrlParams } from "./markerParamUtilities"
import { IColor, IMarker, ISetSearchParams } from "../types"

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

  if (markers.length < 4) {
    //Immer produce for immutability
    const updatedMarkers = produce(markers, draft => {
      draft.push({
        id: createId(),
        color: getColor(markers.length),
        latLon: {
          lat: parseFloat(latitude.toFixed(5)),
          lon: parseFloat(longitude.toFixed(5))
        }
      })
    })

    const urlParams = markersToUrlParams(updatedMarkers)
    setSearchParams(urlParams, { replace: true })
    setMarkers(updatedMarkers)
  }
}
const getColor = (num: number): IColor => {
  switch (num) {
    case 0:
      return 'll'
    case 1:
      return 'cpg'
    case 2:
      return 'reb'
    case 3:
      return 'c'
    default:
      return 'dg'
  }
}