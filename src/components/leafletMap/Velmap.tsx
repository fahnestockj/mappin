import React, { useEffect } from 'react'
import { useState } from 'react'
import { MapContainer, TileLayer, LayersControl, GeoJSON } from 'react-leaflet'
import LocationMarker from '../LocationMarker/LocationMarker'
import "proj4leaflet"
import { CRS } from 'leaflet'
import LatLngMapEventController from '../LatLngMapEventController'
import catalogJson from '../../geoJson/catalog_v02.json'
import axios from 'axios'
import { GeoJsonObject } from 'geojson'
import { BiImport } from 'react-icons/bi'
import { AiOutlineLineChart } from 'react-icons/ai'
import { LatLngForm, ZFormSchema } from '../LatLngForm'
import { produce } from 'immer'
import { getColor } from '../../utils/getColor'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

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

  const form = useForm<z.infer<typeof ZFormSchema>>();

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


  const renderMap = () => (
    <div style={{ height: '85vh', display: 'flex', flexDirection: 'column', width: '100vw' }}>
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
            <LatLngMapEventController form={form}/>
            {markers.map(marker => (
              <LocationMarker key={`${marker.latLng.lat}${marker.latLng.lng}`} markerProp={marker} />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {renderMap()}

      <div className='h-[15vh] w-full flex items-center'>
        <div className='basis-2/3 inline-flex'>

          <LatLngForm form={form} onSubmit={({ latitude, longitude }) => {
            console.log('lat', latitude, 'lng', longitude);

            if (markers.length < 4) {
              const color = getColor(markers.length)
              setMarkers(
                //Immer produce for immutability
                produce(markers, draft => {
                  draft.push({
                    color,
                    latLng: {
                      lat: latitude,
                      lng: longitude
                    }
                  })
                })
              )
            }

          }} />

          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <BiImport className='scale-150 mr-2 mb-1' />
            Import Coordinates
          </button>

          <button
            type="button"
            className="ml-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <AiOutlineLineChart className='scale-150 mr-2 mb-1' />
            Plot
          </button>
        </div>

        <div className='basis-1/3'>
          {/** Table go here */}
        </div>
      </div>

    </div >
  )
}

export default Velmap
