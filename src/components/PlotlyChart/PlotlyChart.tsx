import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-gl2d-dist-min";
import { ITimeseries, colorHexDict } from "../../types";
import { useMemo } from "react";
import classNames from "classnames";

const Plot = createPlotlyComponent(Plotly);

type IProps = {
  timeseriesArr: Array<ITimeseries>;
  intervalDays: Array<number>;
  loading: boolean;
};
export const PlotlyChart = (props: IProps) => {
  const { timeseriesArr, intervalDays, loading } = props;

  const filteredTimeseries = useMemo<ITimeseries[]>(() => {
    const epochTime = new Date(0).getTime();
    return timeseriesArr.map((timeseries) => {
      const filteredMidDateArray: Date[] = [];
      const filteredVelocityArray: number[] = [];
      const filteredDateDtArray: Date[] = [];

      for (let i = 0; i < timeseries.data.velocityArray.length; i++) {
        const dt = timeseries.data.dateDeltaArray[i].getTime() - epochTime;

        const days = dt / (1000 * 3600 * 24);
        if (days >= intervalDays[0] && days <= intervalDays[1]) {
          filteredMidDateArray.push(timeseries.data.midDateArray[i]);
          filteredVelocityArray.push(timeseries.data.velocityArray[i]);
          filteredDateDtArray.push(timeseries.data.dateDeltaArray[i]);
        }
      }
      return {
        marker: timeseries.marker,
        data: {
          midDateArray: filteredMidDateArray,
          velocityArray: filteredVelocityArray,
          dateDeltaArray: filteredDateDtArray,
        },
      };
    });
  }, [timeseriesArr, intervalDays]);

  if (filteredTimeseries.length === 0) {
    return EmptyChartLoadingSkeleton();
  }

  return (
    <div className={classNames("w-full h-full", loading && "animate-pulse")}>
      <Plot
        data={filteredTimeseries.map((timeseries) => {
          return {
            x: timeseries.data.midDateArray,
            y: timeseries.data.velocityArray,
            type: "scattergl",
            mode: "markers",
            marker: { color: colorHexDict[timeseries.marker.color] },
          };
        })}
        layout={{
          autosize: true,
          showlegend: false,
          title: "ITS_LIVE Ice Flow Speed m/yr",
          xaxis: { title: "date", type: "date" },
          yaxis: { type: "-", title: "speed (m/yr)" },
        }}
        config={{
          modeBarButtonsToRemove: [
            "select2d",
            "lasso2d",
            "resetScale2d",
            "pan2d",
            "toImage",
            "zoom2d",
            "zoomIn2d",
            "zoomOut2d",
          ],
          doubleClick: "reset+autosize",
          displaylogo: false,
          showTips: false,
          responsive: true,
        }}
        className="w-full h-full min-h-[400px]"
      />
    </div>
  );
};

function EmptyChartLoadingSkeleton() {
  return (
    <div className="w-full h-full animate-pulse">
      <Plot
        data={[]}
        layout={{
          autosize: true,
          title: "ITS_LIVE Ice Flow Speed m/yr",
          xaxis: {
            title: "date",
            type: "date",
            range: [new Date("1990-01-01"), new Date("2022-01-01")],
          },
          yaxis: { type: "-", title: "speed (m/yr)", range: [0, 1000] },
        }}
        config={{ displaylogo: false, showTips: false, responsive: true }}
        className="w-full h-full min-h-[400px]"
      />
    </div>
  );
}
