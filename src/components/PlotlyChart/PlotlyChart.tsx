import createPlotlyComponent from 'react-plotly.js/factory'
import Plotly from 'plotly.js-basic-dist-min'
import { ITimeseries } from '../../types';

const Plot = createPlotlyComponent(Plotly)

type IProps = {
  timeseriesArr: Array<ITimeseries>
}
export const PlotlyChart = (props: IProps) => {
  const { timeseriesArr } = props
  if (timeseriesArr.length === 0) {
    return (
      <div className='w-full h-full animate-pulse'>
        <Plot
          data={
            timeseriesArr.map(timeseries => {
              return {
                x: timeseries.data.midDateArray,
                y: timeseries.data.velocityArray,
                type: 'scatter',
                mode: 'markers',
                marker: { color: timeseries.marker.color },
                name: `Lat: ${timeseries.marker.latLon.lat.toFixed(2)}, Lon: ${timeseries.marker.latLon.lon.toFixed(2)}`
              }
            })
          }
          layout={{ autosize: true, title: 'ITS_LIVE Ice Flow Speed m/yr', xaxis: { title: 'date', type: 'date' }, yaxis: { type: '-', title: 'speed (m/yr)' } }}
          config={{ doubleClick: 'reset+autosize', displaylogo: false, showTips: false, responsive: true }}
          className='w-full h-full min-h-[400px]'
        />
      </div>
    )
  }

  return (
    <div className='w-full h-full'>
      <Plot
        data={
          timeseriesArr.map(timeseries => {
            return {
              x: timeseries.data.midDateArray,
              y: timeseries.data.velocityArray,
              type: 'scatter',
              mode: 'markers',
              marker: { color: timeseries.marker.color },
              name: `Lat: ${timeseries.marker.latLon.lat.toFixed(2)}, Lon: ${timeseries.marker.latLon.lon.toFixed(2)}`
            }
          })
        }
        layout={{ autosize: true, title: 'ITS_LIVE Ice Flow Speed m/yr', xaxis: { title: 'date', type: 'date' }, yaxis: { type: '-', title: 'speed (m/yr)' } }}
        config={{ doubleClick: 'reset+autosize', displaylogo: false, showTips: false, responsive: true }}
        className='w-full h-full min-h-[400px]'
      />
    </div>
  )
};

