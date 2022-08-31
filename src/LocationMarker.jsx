import React from 'react'
import { useState } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'

const LocationMarker = (props) => {
  const { setLatLong, latLong, fetchFlag, setDataset } = props;

  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click(e) {
      if (!fetchFlag) {
        setPosition(e.latlng)
        console.log(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
        setLatLong([e.latlng.lat, e.latlng.lng])
        setDataset(null)

      }
      else {
      }
    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Lat: {latLong[0]} Long: {latLong[1]}</Popup>
    </Marker>
  )
}



export default LocationMarker
