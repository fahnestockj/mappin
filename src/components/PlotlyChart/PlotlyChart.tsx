import createPlotlyComponent from "react-plotly.js/factory";
import { Figure } from "react-plotly.js/index";
import Plotly from "plotly.js-gl2d-dist-min";
import { ISetSearchParams, ITimeseries } from "../../types";
import { useMemo, useState } from "react";
import classNames from "classnames";
import { ITS_LIVE_LOGO_SVG } from "../../utils/ITS_LIVE_LOGO_SVG";
import {
  IPlotBounds,
  setPlotBoundsInUrlParams,
} from "../../utils/searchParamUtilities";
import { satelliteSvgString } from "../../utils/SatelliteSvg";
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
  const [dragmode, setDragmode] = useState<"pan" | "zoom">("zoom");
  const [satelliteView, setSatelliteView] = useState<boolean>(false);
  const chartConfig: Partial<Plotly.Config> = useMemo(() => {
    return {
      modeBarButtons: [
        [
          {
            name: "satelliteView",
            title: "Satellite View",
            icon: {
              svg: satelliteSvgString,
              name: "satellite",
            },
            click: function () {
              setSatelliteView((prev) => !prev);
            },
          },

          {
            name: "downloadImage",
            title: "Download Plot PNG",
            icon: Plotly.Icons.camera,
            click: function (gd) {
              Plotly.relayout(gd, {
                title: {
                  text: "Source: NASA MEaSUREs ITS_LIVE",
                  xref: "container",
                  yref: "container",
                  x: 0.02,
                  y: 0.03,
                  font: {
                    color: "#808080",
                    size: 13,
                  },
                },
              });
              Plotly.downloadImage(gd, {
                format: "png",
                filename: "plot",
                height: 600,
                width: 1500,
              });
              Plotly.relayout(gd, {
                title: "",
              });
            },
          },
          {
            name: "zoom2d",
            title: "Zoom",
            icon: Plotly.Icons.zoombox,
            click: function (gd) {
              setDragmode("zoom");
              Plotly.relayout(gd, { dragmode: "zoom" });
            },
          },
          {
            name: "pan2d",
            title: "Pan",
            icon: Plotly.Icons.pan,
            click: function (gd) {
              setDragmode("pan");
              Plotly.relayout(gd, { dragmode: "pan" });
            },
          },
          {
            name: "autoscale2d",
            title: "Reset Axes",
            icon: Plotly.Icons.autoscale,
            click: function (gd) {
              Plotly.relayout(gd, {
                "xaxis.autorange": true,
                "yaxis.autorange": true,
              });
            },
          },
        ],
      ],
      doubleClick: "autosize",
      doubleClickDelay: 600,
      displaylogo: false,
      showTips: false,
      responsive: true,
      displayModeBar: true,
    };
  }, [satelliteView, setSatelliteView]);

  const chartLayout = useMemo(() => {
    const xBounds = plotBounds.x.slice(); // Needed to ensure immutability (the props don't get mutated)
    const yBounds = plotBounds.y.slice();

    const chartLayout: Pick<
      Plotly.Layout,
      | "margin"
      | "autosize"
      | "showlegend"
      | "xaxis"
      | "yaxis"
      | "dragmode"
      | "legend"
      | "modebar"
    > = {
      margin: { t: 20, b: 60, l: 80, r: satelliteView ? 150 : 80 },
      autosize: true,
      showlegend: satelliteView,
      xaxis: { type: "date", range: xBounds, autorange: false },
      yaxis: {
        range: yBounds,
        type: "-",
        title: "Ice Flow Speed (m/yr)",
        autorange: false,
      },
      dragmode,
      legend: {
        title: { text: "  Satellites", font: { size: 15 } },
        x: 1,
      },
      modebar: {
        orientation: "v",
        color: "rgb(71 85 105)",
      },
    };
    return chartLayout;
  }, [plotBounds, satelliteView]);

  const data = useMemo<Figure["data"]>(() => {
    let filteredTimeseries = timeseriesArr.map((timeseries) => {
      const filteredMidDateArray: Date[] = [];
      const filteredVelocityArray: number[] = [];
      const filteredDateDtArray: number[] = [];
      const filtertedSatelliteArray: string[] = [];

      for (let i = 0; i < timeseries.data.velocityArray.length; i++) {
        const dt = timeseries.data.daysDeltaArray[i];
        if (dt >= intervalDays[0] && dt <= intervalDays[1]) {
          filteredMidDateArray.push(timeseries.data.midDateArray[i]);
          filteredVelocityArray.push(timeseries.data.velocityArray[i]);
          filteredDateDtArray.push(timeseries.data.daysDeltaArray[i]);
          filtertedSatelliteArray.push(timeseries.data.satelliteArray[i]);
        }
      }
      return {
        marker: timeseries.marker,
        data: {
          midDateArray: filteredMidDateArray,
          velocityArray: filteredVelocityArray,
          dateDeltaArray: filteredDateDtArray,
          satelliteArray: filtertedSatelliteArray,
        },
      };
    });

    if (satelliteView) {
      // we need to regroup our timeseries by satellite
      // get all unique satellites - make a dict
      const satelliteDict: Record<string, Partial<Plotly.PlotData>> = {};

      for (const timeseries of filteredTimeseries) {
        for (let i = 0; i < timeseries.data.velocityArray.length; i++) {
          const satellite = timeseries.data.satelliteArray[i];
          if (!satelliteDict[satellite]) {
            satelliteDict[satellite] = {
              x: [],
              y: [],
              type: "scattergl",
              mode: "markers",
              name: satellite,
              marker: {
                color:
                  satelliteColorDict[
                    satellite as keyof typeof satelliteColorDict
                  ],
              },
            };
          }
          // @ts-ignore
          satelliteDict[satellite].x.push(timeseries.data.midDateArray[i]);
          // @ts-ignore
          satelliteDict[satellite].y.push(timeseries.data.velocityArray[i]);
        }
      }
      return Object.values(satelliteDict).sort(
        (a, b) =>
          (parseInt(a.name![a.name!.length - 1]) || 0) -
          (parseInt(b.name![b.name!.length - 1]) || 0)
      );
    }

    return filteredTimeseries.map((timeseries) => {
      return {
        x: timeseries.data.midDateArray,
        y: timeseries.data.velocityArray,
        type: "scattergl",
        mode: "markers",
        marker: { color: timeseries.marker.color },
      };
    });
  }, [timeseriesArr, intervalDays, satelliteView]);

  return (
    <div className={classNames("w-full h-[90%]", loading && "animate-pulse")}>
      <div className="w-full flex justify-center mt-4">
        <a href="https://its-live.jpl.nasa.gov/">
          <ITS_LIVE_LOGO_SVG />
        </a>
      </div>
      <Plot
        onUpdate={(figure) => {
          // this callback gets called a lot including when the user is dragging a zoom box
          // in that time we need to be careful to ignore all changes except for those that actually change the x and y axis range
          // heavily impacts chart performance

          const plotXBounds = figure.layout.xaxis!.range! as [string, string];
          const plotXBoundsDate = plotXBounds.map((date) => new Date(date)) as [
            Date,
            Date
          ];
          const plotYBounds = figure.layout.yaxis!.range! as [number, number];

          const currentPlotBounds: IPlotBounds = {
            x: plotXBoundsDate,
            y: plotYBounds,
          };
          // we need to see if our params don't match with
          if (!arePlotBoundsEqual(plotBounds, currentPlotBounds)) {
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
        data={data}
        layout={chartLayout}
        config={chartConfig}
        className="w-full h-full"
      />
    </div>
  );
};

const satelliteColorDict = {
  "Sentinel 1": "#FE4A49",
  "Sentinel 2": "#c47335ff",
  "Landsat 4": "#2660a4ff",
  "Landsat 5": "#A1C181",
  "Landsat 7": "#55dde0ff",
  "Landsat 8": "#2660a4ff",
  "Landsat 9": "#C60F7B",
};

function arePlotBoundsEqual(a: IPlotBounds, b: IPlotBounds): boolean {
  return (
    a.x[0].toISOString() === b.x[0].toISOString() &&
    a.x[1].toISOString() === b.x[1].toISOString() &&
    a.y[0] === b.y[0] &&
    a.y[1] === b.y[1]
  );
}
