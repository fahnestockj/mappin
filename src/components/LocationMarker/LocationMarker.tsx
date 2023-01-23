import { useState, useRef, useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { IMarker } from '../Velmap'
import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import { SvgCross } from '../SvgCross'
import './LocationMarker.css'

type IProps = {
  markerProp: IMarker
}
const LocationMarker = (props: IProps) => {
  const { markerProp } = props
  const markerRef = useRef(null)
  const [position, setPosition] = useState(markerProp.latLng)





  const icon = L.divIcon({
    html:  renderToStaticMarkup(SvgCross(markerProp.color)),
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, 0],
    shadowAnchor: [13, 28],
    className: 'transparent'
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
      icon={icon}
    >
      <Popup>Lat: {position.lat} Long: {position.lng}</Popup>
    </Marker>
  )
}



export default LocationMarker
