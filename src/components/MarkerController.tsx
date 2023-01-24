import { useMapEvents } from "react-leaflet"
import { IColor, IMarker } from "./leafletMap/Velmap"

type IProps = {
  markers: Array<IMarker>
  setMarkers: Function
}
const MarkerController = (props: IProps) => {
  const { markers, setMarkers } = props
  const getColor = (num: number): IColor => {
    switch (num) {
      case 0:
        return 'blue'
      case 1:
        return 'green'
      case 2:
        return 'red'
      case 3:
        return 'yellow'
      default:
        return 'blue'
    }
  }
  useMapEvents({
    click(e) {
      if (markers.length < 4) {
        setMarkers([
          ...markers,
          {
            latLng: e.latlng,
            color: getColor(markers.length)
          }
        ])
      }
    },
  })
  return null
}

export default MarkerController