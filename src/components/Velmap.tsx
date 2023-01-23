import React, { useEffect } from 'react'
import { useState } from 'react'
import { MapContainer, TileLayer, LayersControl, GeoJSON } from 'react-leaflet'
import LocationMarker from './LocationMarker/LocationMarker'
import "proj4leaflet"
import { CRS } from 'leaflet'
import MarkerController from './MarkerController'
import catalogJson from '../geoJson/catalog_v02.json'
import axios from 'axios'
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
}



const Velmap = (props: IProps) => {

  const [res, setRes] = useState<string>('')

  useEffect(() => {
    //NOTE: useEffect will run twice development because of React.StrictMode this won't happen in production
    axios.get('/timeseries', {
      params: {
        lat: 70,
        lng: -50
      },

    }).then(res => {
      console.log(res.data);
    })
  }, [])


  const [markers, setMarkers] = useState<Array<IMarker>>([
    {
      color: 'blue',
      latLng: {
        lat: 70,
        lng: -50
      },

    }
  ])



  const { Overlay } = LayersControl



  return (
    <div className='body'>
      <div style={{ 'backgroundColor': '#192a43', height: '90vh', display: 'flex', flexDirection: 'column', width: '100vw', }}>
        <div className="flex flex-row w-full h-full">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
            integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
            crossOrigin="" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
            integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
            crossOrigin=""></script>

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
              <MarkerController markers={markers} setMarkers={setMarkers} />
              {markers.map(marker => (
                <LocationMarker key={`${marker.latLng.lat}${marker.latLng.lng}`} markerProp={marker} />
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Velmap
