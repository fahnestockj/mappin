import { ITimeseries } from "../../types";

export const malaspinaTimeseries: ITimeseries = {
  marker: {
    id: "blueMalaspinaTimeseries",
    color: "blue",
    latLng: {
      lat: 60.11,
      lng: -140.45
    }
  },
  data: []
}

const fixtureChartlyPlots = [
  {
    x: blueX,
    y: blueY,
    type: 'scatter',
    mode: 'markers',
    marker: { color: 'blue' },
    name: 'Lat: 60.11, Lon: -140.45'
  },
  {
    x: greenX,
    y: greenY,
    type: 'scatter',
    mode: 'markers',
    marker: { color: 'green' },
    name: 'Lat: 60.02, Lon: -140.54'
  },
  {
    x: redX,
    y: redY,
    type: 'scatter',
    mode: 'markers',
    marker: { color: 'red' },
    name: 'Lat: 59.92, Lon: -140.65',
  },
  {
    x: yellowX,
    y: yellowY,
    type: 'scatter',
    mode: 'markers',
    marker: { color: 'yellow' },
    name: 'Lat: 59.83, Lon: -140.78'
  },
]