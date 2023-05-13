import { useState, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import { SvgCross } from '../SvgCross'
import './LocationMarker.css'
import { markersToUrlParams } from '../../utils/markerParamUtilities'
import { IMarker } from '../../types'

type IProps = {
  markerProp: IMarker
  draggable: boolean
  markers?: Array<IMarker>
  setMarkers?: React.Dispatch<React.SetStateAction<IMarker[]>>
  setSearchParams?: React.Dispatch<React.SetStateAction<any>>
}
const LocationMarker = (props: IProps) => {
  const { draggable, markerProp, markers, setMarkers, setSearchParams } = props
  const markerRef = useRef(null)
  const [position, setPosition] = useState(markerProp.latLon)

  const icon = L.divIcon({
    html: renderToStaticMarkup(SvgCross(markerProp.color)),
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, 0],
    shadowAnchor: [13, 28],
    className: 'transparent'
  })
  if (!draggable || !markers || !setMarkers || !setSearchParams) return (

    <Marker position={{ lat: position.lat, lng: position.lon }}
      draggable={draggable}
      ref={markerRef}
      icon={icon}
    >
      <Popup>Lat: {position.lat.toFixed(5)} Long: {position.lon.toFixed(5)}</Popup>
    </Marker>
  )

  const eventHandlers = {
    dragend() {
      const oldMarkerIndex = markers.findIndex(marker => marker.id === markerProp.id)
      const marker = markerRef.current
      if (marker != null) {
        const newMarkers = [...markers]
        // @ts-ignore
        const { lat, lon } = marker.getLatLon() as { lat: number, lon: number } //a leaflet function for fetching latLon
        newMarkers[oldMarkerIndex] = {
          ...markerProp,
          latLon: {
            lat: parseFloat(lat.toFixed(5)),
            lon: parseFloat(lon.toFixed(5))
          }
        }
        setMarkers(newMarkers)
        setSearchParams(markersToUrlParams(newMarkers))
        //@ts-ignore
        setPosition(marker.getLatLon())
      }
    }
  }
  return (
    <Marker position={{ lat: position.lat, lng: position.lon }}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
      icon={icon}
    >
      <Popup>Lat: {position.lat.toFixed(5)} Long: {position.lon.toFixed(5)}</Popup>
    </Marker>
  )
}



export default LocationMarker
