import React from 'react'
import { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import LocationMarker from './LocationMarker'
import "proj4leaflet"
import { CRS } from 'leaflet'
import { Scatter } from 'react-chartjs-2'
import axios from 'axios';
import { useEffect } from 'react';
import {  Loader, Panel, PanelGroup } from 'rsuite';


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

  const EPSG3857 = CRS.EPSG3857

  useEffect(() => {
    setrenderFlag(!(latLong.length === 0))
    if (!(latLong.length === 0)) {
      setfetchFlag(true);
      axios.get(`/fetchTimeSeries/${lat}/${long}`, {
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.data === "<h1>Bad Request</h1>") {
          console.log("ERROR bad request")
          console.log("Why")
          return null
        }
        //var result = JSON.parse(response.data.replace(/\bNaN\b/g, "null"))

        // console.log(typeof(result))
        setDataset(response.data.jsondata)
        setfetchFlag(false)
      }).catch(function (error) {
        setfetchFlag(false)
        setrenderFlag(false)
      });


    }
  }, [latLong])



  // useEffect(() => {
  //     // fetch(`/fetchTimeSeries/${lat}/${long}`,{
  //     //   method: 'GET',
  //     //   headers: {
  //     //     'Accept': 'application/json'
  //     //   }
  //     // }).then(function(response){
  //     //   console.log(response)
  //     //   console.log(response.json)


  //     // })
  //       axios.get(`/fetchTimeSeries/${lat}/${long}`,{
  //         headers:{
  //           'Accept': 'application/json'
  //         }
  //       }).then(response =>{
  //           if(response.data ==="<h1>Bad Request</h1>"){
  //               console.log("ERROR bad request")
  //               console.log("Why")
  //               return null
  //           }
  //           //var result = JSON.parse(response.data.replace(/\bNaN\b/g, "null"))

  //           // console.log(typeof(result))
  //           setDataset(response.data.jsondata)
  //           console.log(response.data.jsondata)
  //       });


  //   }, []);


  //    const [position, setPosition] = useState(null)
  //const map = useMapEvents({
  //click(e){
  //setPosition(e.latlng)
  //console.log(e.latlng)
  //},
  //})



  //    return (
  //<div>
  //{position === null ? null : }
  //</div>
  //)
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
    <div className="body">
      <div className="rowleafletmap-container">

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin="" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
          integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
          crossOrigin=""></script>

        <div className="trashgarboleaflet" >
          <MapContainer crs={EPSG3857} style={{ height: "100%" }} center={[70.3, -49.5]} zoom={6} maxZoom={8} minZoom={2} scrollWheelZoom={true} >
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

            <LocationMarker setLatLong={setLatLong} latLong={latLong} fetchFlag={fetchFlag} setDataset={setDataset} />
          </MapContainer>

        </div>

        <div className="graphclass">
          {fetchFlag ? <Loader size="md" style={{ color: "white" }} content={<h3 style={{ color: "white" }}>Loading time series...</h3>} /> : <div />}
          {renderFlag ? <div /> :
            <PanelGroup accordion defaultActiveKey={1} bordered>
              <Panel eventKey={1} id={1} header={<h3 style={{ color: "white" }}>Quickstart</h3>}>
                <p style={{ color: "white", fontSize: "18px" }}>Welcome to mappin!

                  <br />To fetch the time series of one point click anywhere on the velocity mosaic
                  <br />Data takes anywhere from 15-80 seconds to retrieve
                  <br />To change the time series simply click another point on the map
                </p>
                <h6 style={{ color: "white" }}></h6>
              </Panel>
              <Panel eventKey={2} id={2} header={<h3 style={{ color: "white" }}>Where does the data come from?</h3>}>

                <p style={{ color: "white", fontSize: "18px" }}>
                  Both the time series and velocity mosaic come from the <a target="_blank" rel="noreferrer" href="https://its-live.jpl.nasa.gov/">ITS_LIVE Project.</a>
                </p>

              </Panel>
            </PanelGroup>}

          {(dataset && !fetchFlag && renderFlag) ? <div>
            <Scatter data={data} options={options} style={{ backgroundColor: "white" }} />
            {/* <CsvDownload data={dataset} style={{ "marginTop": "15px" }} filename={"Lat:" + lat + "Long:" + long + "Timeseries.csv"} /> */}
          </div>
            : <div />}
        </div>

      </div>

    </div>

  )
}

export default Velmap
