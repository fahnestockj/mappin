import { useMapEvents } from "react-leaflet"
import { createMarker } from "../utils/createMarker";
import { IMarker } from "../types";

type IProps = {
  markers: Array<IMarker>
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>
  setSearchParams: (params: URLSearchParams) => void
}
const MapEventController = (props: IProps) => {
  const { markers, setMarkers, setSearchParams } = props
  useMapEvents({
    click(e) {
      createMarker({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        markers,
        setMarkers,
        setSearchParams,
      })

    }
  })

  return null
}

export default MapEventController