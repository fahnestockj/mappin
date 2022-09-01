import React from 'react'
import { useState } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import LocationMarker from './LocationMarker'
import "proj4leaflet"
import { CRS } from 'leaflet'
import { Scatter } from 'react-chartjs-2'
import axios from 'axios';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'
import MarkerController from './MarkerController'
export type IColor = 'green' | 'blue' | 'red' | 'orange'
export type IMarker = {
  color: IColor
  latLng: {
    lat: number
    lng: number

  }
}
type IProps = {
  latLong: Array<number>
  dataset: Array<number> | null
  setDataset: Function
  setLatLong: Function
  setfetchFlag: Function
  fetchFlag: boolean
}
const Velmap = (props: IProps) => {

  const { latLong, setDataset, dataset, setLatLong, setfetchFlag, fetchFlag } = props;
  const [renderFlag, setrenderFlag] = useState(!(latLong.length === 0))
  var lat = latLong[0]
  var long = latLong[1]
  const [searchParams, setSearchParams] = useSearchParams({
    'lat': '12345',
    'long': '12345'
  })

  const [markers, setMarkers] = useState<Array<IMarker>>([
    {
      color: 'blue',
      latLng: {
        lat: 70,
        lng: -50
      },
      
    }
  ])



  const EPSG3857 = CRS.EPSG3857


  var data = {
    datasets: [
      {
        label: `Velocity for Lat: ${lat} Long: ${long} `,
        data: dataset,
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };
  const options = {

    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Years",
          font: {
            size: 14
          }


        },
        ticks: {
          //@ts-ignore
          callback: function (value, index, values) {
            return (value)
          }
        }
      },
      y: {
        title: {
          display: true,
          text: "Velocity (meters/year)",
          font: {
            size: 14
          },
        }
      },


    },
  };



  return (
    <div className='body'>
      <div style={{ 'backgroundColor': '#192a43', height: '90vh', display: 'flex', flexDirection: 'column', width: '100vw', }}>
        <div className="rowleafletmap-container">

          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
            integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
            crossOrigin="" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
            integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
            crossOrigin=""></script>
          <div className="trashgarboleaflet" >
            <MapContainer crs={EPSG3857} style={{ height: "100%" }} center={[70.3, -49.5]} zoom={6} maxZoom={10} minZoom={2} scrollWheelZoom={true} >
              <TileLayer
                attribution='Imagery provided by ESRI'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg"
                maxNativeZoom={7}
                tileSize={256}
              />
              {<TileLayer
                url="https://glacierflow.nyc3.digitaloceanspaces.com/webmaps/vel_map/{z}/{x}/{y}.png"
                maxNativeZoom={7}
                tileSize={256}
              />}
              <MarkerController markers={markers} setMarkers={setMarkers} />
              {markers.map(marker => (
                <LocationMarker key={`${marker.latLng.lat}${marker.latLng.lng}`} markerProp={marker} />
              ))}
            </MapContainer>

          </div>

          <div className="graphclass">
            {(dataset && !fetchFlag && renderFlag) ? <div>
              <Scatter data={data} options={options} style={{ backgroundColor: "white" }} />
              {/* <CsvDownload data={dataset} style={{ "marginTop": "15px" }} filename={"Lat:" + lat + "Long:" + long + "Timeseries.csv"} /> */}
            </div>
              : <div />}
          </div>

        </div>

      </div>
      <button onClick={() => {
        setSearchParams(
          {

            'lat': '123'
          }
        )
        console.log(searchParams.get('lat'))
      }}>
        clickme
      </button>

    </div>
  )
}

export default Velmap
