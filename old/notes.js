//NOTE: This is a debug for the standard leaflet marker we don't use bc we have custom ones now
//Still worth keeping around

//@ts-ignore
// delete L.Icon.Default.prototype._getIconUrl

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// })
  
  
  // NOTE: subtract 360 from long 

          // <div className="graphclass">
          //   {(dataset && !fetchFlag && renderFlag) ? <div>
          //     {/* <Scatter data={data} options={options} style={{ backgroundColor: "white" }} /> */}
          //     {/* <CsvDownload data={dataset} style={{ "marginTop": "15px" }} filename={"Lat:" + lat + "Long:" + long + "Timeseries.csv"} /> */}
          //   </div>
          //     : <div />}
          // </div>
  
  
  // var data = {
  //   datasets: [
  //     {
  //       label: `Velocity for Lat: ${lat} Long: ${long} `,
  //       data: dataset,
  //       backgroundColor: 'rgba(255, 99, 132, 1)',
  //     },
  //   ],
  // };
  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: true,
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: "Years",
  //         font: {
  //           size: 14
  //         }
  //       },
  //       ticks: {
  //         //@ts-ignore
  //         callback: function (value, index, values) {
  //           return (value)
  //         }
  //       }
  //     },
  //     y: {
  //       title: {
  //         display: true,
  //         text: "Velocity (meters/year)",
  //         font: {
  //           size: 14
  //         },
  //       }
  //     },
  //   },
  // };