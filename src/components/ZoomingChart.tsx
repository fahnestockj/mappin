import { useState } from "react";
import { VictoryChart, VictoryZoomContainer, VictoryScatter } from "victory";
import { round, minBy, maxBy, last } from 'lodash'
import { ITimeseries } from "../pages/ChartPage";


type IProps = {
  timeseries: ITimeseries
}
const ZoomingChart = (props: IProps) => {

  const [zoomedXDomain, setZoomedXDomain] = useState<[Date, Date]>([new Date('2010-01-01'), new Date('2023-01-01')]);

  const { timeseries } = props
  if (!timeseries) return (<div>loading...</div>)
  const data = timeseries.timeseries
  const maxPoints = 100

  function getData() {

    const filtered = data.filter(
      (d) => (d[0] >= zoomedXDomain[0] && d[0] <= zoomedXDomain[1]));

    if (filtered.length > maxPoints) {
      const k = Math.ceil(filtered.length / maxPoints);
      return filtered.filter(
        (d, i) => ((i % k) === 0)
      );
    }
    return filtered;
  }
  function getEntireDomain(data: [Date, number][]): { x: [Date, Date], y: [number, number] } {

    return {
      y: [minBy(data, d => d[1])![1], maxBy(data, d => d[1])![1]],
      x: [minBy(data, d => d[0])![0], maxBy(data, d => d[0])![0]],
    };
  }

  function getZoomFactor() {
    const factor = 10 / (zoomedXDomain[1].getTime() - zoomedXDomain[0].getTime());
    return round(factor, factor < 3 ? 1 : 0);
  }
  const entireDomain = getEntireDomain(data);
  const renderedData = getData();

  return (
    <div className="h-[50vh] ">
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
        <VictoryScatter
        x={0}
        y={1}
        data={renderedData} />
      </VictoryChart>
      <div>
        {getZoomFactor()}x zoom;
        rendering {renderedData.length} of {data.length}
      </div>
    </div>
  );
}

export default ZoomingChart;