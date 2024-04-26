import createPlotlyComponent from "react-plotly.js/factory";
import { Figure } from "react-plotly.js/index";
import Plotly from "plotly.js-gl2d-dist-min";
import { ITimeseries } from "../../types";
import { useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { ITS_LIVE_LOGO_SVG } from "../../utils/ITS_LIVE_LOGO_SVG";
const Plot = createPlotlyComponent(Plotly);

type IProps = {
  timeseriesArr: Array<ITimeseries>;
  intervalDays: Array<number>;
  loading: boolean;
};
export const PlotlyChart = (props: IProps) => {
  const { timeseriesArr, intervalDays, loading } = props;
  const layoutRef = useRef<Figure["layout"]>();

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

  return (
    <div className={classNames("w-full h-[325px]", loading && "animate-pulse")}>
      <div className="w-full flex justify-center my-4">
        <a href="https://its-live.jpl.nasa.gov/">
          <ITS_LIVE_LOGO_SVG />
        </a>
      </div>
      <Plot
        onUpdate={(figure) => {
          layoutRef.current = figure.layout;
        }}
        data={filteredTimeseries.map((timeseries) => {
          return {
            x: timeseries.data.midDateArray,
            y: timeseries.data.velocityArray,
            type: "scattergl",
            mode: "markers",
            marker: { color: timeseries.marker.color },
          };
        })}
        layout={
          layoutRef.current || {
            margin: { t: 0, b: 40, l: 80, r: 80 },
            autosize: true,
            showlegend: false,
            // title: "ITS_LIVE Ice Flow Speed m/yr",
            xaxis: { type: "date" },
            yaxis: {
              type: "-",
              title: "Ice Flow Speed (m/yr)",
            },
          }
        }
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
        className="w-full h-full"
      />
    </div>
  );
};
