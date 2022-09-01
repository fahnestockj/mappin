import { useState, useRef, useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { IMarker } from './Velmap'
import L from 'leaflet'
//@ts-ignore
import greenMarker from './images/greenMarker.svg'
type IProps = {
  markerProp: IMarker
}
const LocationMarker = (props: IProps) => {
  const { markerProp } = props
  const markerRef = useRef(null)
  const [position, setPosition] = useState(markerProp.latLng)

  //NOTE: This is a debug for the standard leaflet marker we don't use bc we have custom ones now
  //Still worth keeping around

  //@ts-ignore
  // delete L.Icon.Default.prototype._getIconUrl

  // L.Icon.Default.mergeOptions({
  //   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  //   iconUrl: require('leaflet/dist/images/marker-icon.png'),
  //   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  // })


  const redIcon = L.icon({
    iconUrl: greenMarker,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, 0],
    shadowAnchor: [13,28]
  })

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          //@ts-ignore
          setPosition(marker.getLatLng())
        }
      },
    }),
    [],
  )
  return (
    <Marker position={position}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
      icon={redIcon}

    >
      <Popup>Lat: {position.lat} Long: {position.lng}</Popup>
    </Marker>
  )
}



export default LocationMarker
