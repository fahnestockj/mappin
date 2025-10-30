import createPlotlyComponent from "react-plotly.js/factory";
import { Figure } from "react-plotly.js/index";
import Plotly from "plotly.js-gl2d-dist-min";
import { ISetSearchParams, ITimeseries } from "../../types";
import { useMemo, useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { ITS_LIVE_LOGO_SVG } from "../../utils/ITS_LIVE_LOGO_SVG";
import {
  IPlotBounds,
  setPlotBoundsInUrlParams,
} from "../../utils/searchParamUtilities";
import { satelliteSvgString } from "../../utils/SatelliteSvg";
import { ImageLinkModal } from "../ImageLinkModal";
import { getImageUrl } from "../../getImageUrl/getImageUrl";
const Plot = createPlotlyComponent(Plotly);

type IProps = {
  timeseriesArr: Array<ITimeseries>;
  intervalDays: Array<number>;
  loading: boolean;
  plotBounds: IPlotBounds;
  setSearchParams: ISetSearchParams;
  hoveredMarkerId?: string | null;
  onClearHover?: () => void;
};
export const PlotlyChart = (props: IProps) => {
  const {
    timeseriesArr,
    intervalDays,
    loading,
    setSearchParams,
    plotBounds,
    hoveredMarkerId,
    onClearHover,
  } = props;
  const [dragmode, setDragmode] = useState<"pan" | "zoom">("zoom");
  const [satelliteView, setSatelliteView] = useState<boolean>(false);
  const [clickedPoint, setClickedPoint] = useState<{
    imageUrl: string | null;
    date: string;
    satellite: string;
    speed: string;
    error?: string;
  } | null>(null);

  const isResettingAxesRef = useRef(false);

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
      | "hovermode"
      | "hoverdistance"
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
      hovermode: "closest",
      hoverdistance: 5, // Pixels - require cursor to be very close to point
    };
    return chartLayout;
  }, [plotBounds, satelliteView]);

  const data = useMemo<Figure["data"]>(() => {
    const filteredTimeseries = timeseriesArr.map((timeseries) => {
      const filteredMidDateArray: Date[] = [];
      const filteredVelocityArray: number[] = [];
      const filteredDateDtArray: number[] = [];
      const filtertedSatelliteArray: string[] = [];
      const filteredOriginalIndexArray: number[] = [];

      for (let i = 0; i < timeseries.data.velocityArray.length; i++) {
        const dt = timeseries.data.daysDeltaArray[i];
        if (dt >= intervalDays[0] && dt <= intervalDays[1]) {
          filteredMidDateArray.push(timeseries.data.midDateArray[i]);
          filteredVelocityArray.push(timeseries.data.velocityArray[i]);
          filteredDateDtArray.push(timeseries.data.daysDeltaArray[i]);
          filtertedSatelliteArray.push(timeseries.data.satelliteArray[i]);
          filteredOriginalIndexArray.push(
            timeseries.data.originalIndexArray[i]
          );
        }
      }
      return {
        marker: timeseries.marker,
        zarrUrl: timeseries.zarrUrl,
        data: {
          midDateArray: filteredMidDateArray,
          velocityArray: filteredVelocityArray,
          dateDeltaArray: filteredDateDtArray,
          satelliteArray: filtertedSatelliteArray,
          originalIndexArray: filteredOriginalIndexArray,
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
              hovertemplate:
                "<b>Date:</b> %{x}<br><b>Speed:</b> %{y:.2f} m/yr<extra></extra>",
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

    const traces = filteredTimeseries.map((timeseries) => {
      const isHovered = hoveredMarkerId === timeseries.marker.id;
      const shouldDim = hoveredMarkerId !== null && !isHovered;

      return {
        x: timeseries.data.midDateArray,
        y: timeseries.data.velocityArray,
        type: "scattergl" as const,
        mode: "markers" as const,
        marker: {
          color: timeseries.marker.color,
          opacity: shouldDim ? 0.1 : 1.0,
        },
        hovertemplate:
          "<b>Date:</b> %{x}<br><b>Speed:</b> %{y:.2f} m/yr<extra></extra>",
        isHovered,
      };
    });

    // Sort so hovered trace renders last (on top)
    return traces
      .sort((a, b) => {
        if (a.isHovered) return 1;
        if (b.isHovered) return -1;
        return 0;
      })
      .map(({ isHovered, ...trace }) => trace as Partial<Plotly.PlotData>);
  }, [timeseriesArr, intervalDays, satelliteView, hoveredMarkerId]);

  return (
    <div className={classNames("w-full h-[90%]", loading && "animate-pulse")}>
      {clickedPoint && (
        <ImageLinkModal
          imageUrl={clickedPoint.imageUrl}
          date={clickedPoint.date}
          satellite={clickedPoint.satellite}
          speed={clickedPoint.speed}
          error={clickedPoint.error}
          onClose={() => setClickedPoint(null)}
        />
      )}
      <div className="w-full flex justify-center mt-4">
        <a href="https://its-live.jpl.nasa.gov/">
          <ITS_LIVE_LOGO_SVG />
        </a>
      </div>
      {timeseriesArr.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-500 text-center">
            No markers added yet. Click on the map to add markers.
          </div>
        </div>
      ) : (
        <Plot
          onUpdate={(figure) => {
            // this callback gets called a lot including when the user is dragging a zoom box
            // in that time we need to be careful to ignore all changes except for those that actually change the x and y axis range
            // heavily impacts chart performance

            const plotXBounds = figure.layout.xaxis!.range! as [string, string];
            const plotXBoundsDate = plotXBounds.map(
              (date) => new Date(date)
            ) as [Date, Date];
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
          onRelayout={(event) => {
            // console.log("🔵 onRelayout fired", {
            //   timestamp: Date.now(),
            //   event,
            // });

            // Detect if axes are being auto-ranged (happens on double-click or reset button)
            if (
              event["xaxis.autorange"] === true ||
              event["yaxis.autorange"] === true
            ) {
              isResettingAxesRef.current = true;
              setTimeout(() => {
                isResettingAxesRef.current = false;
              }, 500);
            }
          }}
          onClick={async (event) => {
            // Now check the flag after giving onRelayout time to set it
            if (isResettingAxesRef.current) {
              return;
            }

            if (event.points && event.points.length > 0) {
              const point = event.points[0];

              // Get the clicked coordinates
              const clickedDate = point.x
                ? new Date(point.x as string | number)
                : null;
              const clickedSpeed = typeof point.y === "number" ? point.y : null;

              if (!clickedDate || clickedSpeed === null) {
                console.error("Invalid click data", { x: point.x, y: point.y });
                return;
              }

              // Only handle clicks in non-satellite view for now
              if (!satelliteView) {
                // Look up the point in the original timeseries data
                let foundTimeseries = null;
                let foundIndex = -1;

                for (const timeseries of timeseriesArr) {
                  for (
                    let i = 0;
                    i < timeseries.data.midDateArray.length;
                    i++
                  ) {
                    const midDate = timeseries.data.midDateArray[i];
                    const velocity = timeseries.data.velocityArray[i];

                    // Match by date and velocity
                    if (
                      midDate.getTime() === clickedDate.getTime() &&
                      Math.abs(velocity - clickedSpeed) < 0.01
                    ) {
                      foundTimeseries = timeseries;
                      foundIndex = i;
                      break;
                    }
                  }
                  if (foundTimeseries) break;
                }

                if (!foundTimeseries || foundIndex === -1) {
                  console.error("Could not find point in timeseries data");
                  return;
                }

                const midDate = foundTimeseries.data.midDateArray[foundIndex];
                const satellite =
                  foundTimeseries.data.satelliteArray[foundIndex];
                const speed =
                  foundTimeseries.data.velocityArray[foundIndex].toFixed(2);
                const originalIndex =
                  foundTimeseries.data.originalIndexArray[foundIndex];

                // Clear hover state
                onClearHover?.();

                // Show modal immediately with loading state
                setClickedPoint({
                  imageUrl: null, // Loading
                  date: midDate.toLocaleDateString(),
                  satellite,
                  speed,
                });

                // Fetch image URL on demand using original zarr index
                const imageUrl = await getImageUrl(
                  foundTimeseries.zarrUrl,
                  originalIndex
                );
                setClickedPoint({
                  imageUrl,
                  date: midDate.toLocaleDateString(),
                  satellite,
                  speed,
                });
              }
            }
          }}
          data={data}
          layout={chartLayout}
          config={chartConfig}
          className="w-full h-full"
        />
      )}
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
