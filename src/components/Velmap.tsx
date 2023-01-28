import React from 'react'
import { MapContainer, TileLayer, LayersControl, GeoJSON } from 'react-leaflet'
import LocationMarker from './LocationMarker/LocationMarker'
import "proj4leaflet"
import { CRS } from 'leaflet'
import catalogJson from '../geoJson/catalog_v02.json'
import { GeoJsonObject } from 'geojson'

export type IColor = 'green' | 'blue' | 'red' | 'yellow'

export type IMarker = {
  color: IColor
  latLng: {
    lat: number
    lng: number
  }
}

type IProps = {
  markers: Array<IMarker>
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>
  children?: React.ReactNode
}

const Velmap = (props: IProps) => {
  const { markers, setMarkers } = props
  const { Overlay } = LayersControl

  return (
      <div className="w-full h-full">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin="" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
          integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
          crossOrigin="" />

        <div className="w-full h-full m-auto" >
          <MapContainer crs={CRS.EPSG3857} style={{ height: "100%" }} center={[70.3, -49.5]} zoom={6} maxZoom={10} minZoom={2} scrollWheelZoom={true}  >
            <LayersControl >
              <Overlay name='GeoJSON'>
                {/* @ts-ignore */}
                <GeoJSON data={catalogJson as GeoJsonObject} />
              </Overlay>
              <TileLayer
                attribution='Imagery provided by ESRI'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg"
                maxNativeZoom={7}
                tileSize={256}
              />
              <Overlay checked name='Velocity Map'>
                <TileLayer
                  url="https://glacierflow.nyc3.digitaloceanspaces.com/webmaps/vel_map/{z}/{x}/{y}.png"
                  maxNativeZoom={7}
                  tileSize={256}
                />
              </Overlay>
            </LayersControl>
            {props.children}
            {markers.map(marker => (
              <LocationMarker key={`${marker.latLng.lat}${marker.latLng.lng}`} markerProp={marker} markers={markers} setMarkers={setMarkers} />
            ))}
          </MapContainer>
        </div>
      </div>
  )
}

export default Velmap
