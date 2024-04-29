import createPlotlyComponent from "react-plotly.js/factory";
import { Figure } from "react-plotly.js/index";
import Plotly from "plotly.js-gl2d-dist-min";
import { ISetSearchParams, ITimeseries } from "../../types";
import { useMemo, useRef } from "react";
import classNames from "classnames";
import { ITS_LIVE_LOGO_SVG } from "../../utils/ITS_LIVE_LOGO_SVG";
import {
  IPlotBounds,
  setPlotBoundsInUrlParams,
} from "../../utils/paramUtilities";
import { useTraceUpdate } from "../../utils/debugProps";
import { randomBytes } from "crypto";
const Plot = createPlotlyComponent(Plotly);

type IProps = {
  timeseriesArr: Array<ITimeseries>;
  intervalDays: Array<number>;
  loading: boolean;
  plotBounds: IPlotBounds;
  setSearchParams: ISetSearchParams;
};
export const PlotlyChart = (props: IProps) => {
  const { timeseriesArr, intervalDays, loading, setSearchParams, plotBounds } =
    props;

  const chartLayout = useMemo(() => {
    console.log("recomputing layout");

    const xBounds = plotBounds.x.slice(); // Needed to ensure the props don't get mutated
    const yBounds = plotBounds.y.slice();

    const chartLayout: Pick<
      Plotly.Layout,
      "margin" | "autosize" | "showlegend" | "xaxis" | "yaxis"
    > = {
      margin: { t: 0, b: 40, l: 80, r: 80 },
      autosize: true,
      showlegend: false,
      // "xaxis.autorange": false,
      // "yaxis.autorange": false,

      // title: "ITS_LIVE Ice Flow Speed m/yr",
      xaxis: { type: "date", range: xBounds, autorange: false },
      yaxis: {
        range: yBounds,
        type: "-",
        title: "Ice Flow Speed (m/yr)",
        autorange: false,
      },
    };
    return chartLayout;
  }, [plotBounds]);

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
          // this callback gets called a lot including when the user is dragging a zoom box
          // in that time we need to be careful to ignore all changes except for those that actually change the x and y axis range
          // console.log("Updating the layout");
          const plotXBounds = figure.layout.xaxis!.range! as [string, string];
          const plotXBoundsDate = plotXBounds.map((date) => new Date(date)) as [
            Date,
            Date
          ];
          const plotYBounds = figure.layout.yaxis!.range! as [number, number];
          if (
            !(
              plotXBoundsDate[0].toISOString() === plotBounds.x[0].toISOString()
            )
          ) {
            console.log("xaxis range are not the same");
            const currentPlotBounds: IPlotBounds = {
              x: plotXBoundsDate,
              y: plotYBounds,
            };
            setSearchParams(
              (prevParams) =>
                setPlotBoundsInUrlParams(prevParams, currentPlotBounds),
              { replace: true }
            );
          }
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
          chartLayout
          // layoutRef.current || {
          //   margin: { t: 0, b: 40, l: 80, r: 80 },
          //   autosize: true,
          //   showlegend: false,
          //   // title: "ITS_LIVE Ice Flow Speed m/yr",
          //   xaxis: { type: "date" },
          //   yaxis: {
          //     type: "-",
          //     title: "Ice Flow Speed (m/yr)",
          //   },
          // }
        }
        config={{
          modeBarButtonsToAdd: [
            {
              // we remove then re-add this button purely for styling
              // - for some reason this stops the modebar from wrapping vertically
              name: "pan2d",
              title: "Pan",
              icon: Plotly.Icons.pan,
              click: function (gd) {
                Plotly.relayout(gd, { dragmode: "pan" });
              },
            },
          ],
          modeBarButtonsToRemove: [
            "select2d",
            "lasso2d",
            "resetScale2d",
            "pan2d",
            "toImage",
            "zoomIn2d",
            "zoomOut2d",
          ],
          doubleClick: "autosize",
          displaylogo: false,
          showTips: false,
          responsive: true,
        }}
        className="w-full h-full"
      />
    </div>
  );
};
