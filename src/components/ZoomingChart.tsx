import { useState } from "react";
import { VictoryChart, VictoryZoomContainer, VictoryScatter } from "victory";
import { minBy, maxBy, flatten } from 'lodash'
import { ITimeseries } from "../pages/ChartPage";

type IProps = {
  timeseriesArr: ITimeseries[]
}

const ZoomingChart = (props: IProps) => {

  const maxPoints = 1000
  const [zoomedXDomain, setZoomedXDomain] = useState<[Date, Date]>([new Date('2010-01-01'), new Date('2023-01-01')]);

  const { timeseriesArr } = props

  if ((timeseriesArr.length === 0)) return (<div>loading...</div>)

  function getData(): Array<ITimeseries & {
    filteredTimeseries: [Date, number][]
  }> {

    const filteredTimeseries = timeseriesArr.map((timeseries: ITimeseries) => {
      const filteredTimeseries = timeseries.timeseries.filter((d) => (d[0] >= zoomedXDomain[0] && d[0] <= zoomedXDomain[1]));
      if (filteredTimeseries.length > maxPoints) {
        const k = Math.ceil(filteredTimeseries.length / maxPoints);
        return filteredTimeseries.filter(
          (d, i) => ((i % k) === 0)
        );
      }
      return filteredTimeseries;
    })

    return timeseriesArr.map((timeseries, i) => {
      return {
        ...timeseries,
        filteredTimeseries: filteredTimeseries[i]
      }
    })
  }
  function getEntireDomain(data: [Date, number][][]): { x: [Date, Date], y: [number, number] } {
    if (data.length === 0) return ({ x: [new Date('2010-01-01'), new Date('2023-01-01')], y: [0, 3000] })

    const flattenedData = flatten(data);
    return {
      y: [minBy(flattenedData, d => d[1])![1], maxBy(flattenedData, d => d[1])![1]],
      x: [minBy(flattenedData, d => d[0])![0], maxBy(flattenedData, d => d[0])![0]],
    };
  }

  const entireDomain = getEntireDomain(timeseriesArr.map(timeseries => timeseries.timeseries));
  const filteredTimeseriesArr = getData();

  return (
    <div className="h-full w-1/2 flex flex-col items-center">
      <div className=" py-3 px-5 font-bold">ITS_LIVE Ice Flow Speed m/yr</div>
      <div className="flex flex-row items-center">
        <div className="-rotate-90 whitespace-nowrap">speed (m/y)</div>
        <VictoryChart
          domain={entireDomain}
          containerComponent={<VictoryZoomContainer
            zoomDimension="x"
            onZoomDomainChange={(domain) => {
              setZoomedXDomain(domain.x as [Date, Date])
            }}
            minimumZoom={{ x: 1 / 10000 }}
          />}
        >

          {
            filteredTimeseriesArr.map(timeseries =>
              <VictoryScatter
                key={`${timeseries.coordinateStr}`}
                style={{ data: { fill: `${timeseries.color}` } }}
                x={0}
                y={1}
                data={timeseries.filteredTimeseries}
              />
            )
          }
        </VictoryChart>
      </div>
      <div>date</div>
    </div>
  );
}

export default ZoomingChart;