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
import { generateFittedTimeseries, generateDenseDates } from "../../utils/sineval";
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
  const [viewMode, setViewMode] = useState<"default" | "satellite" | "annual">("default");
  const [clickedPoint, setClickedPoint] = useState<{
    imageUrl: string | null;
    date: string;
    satellite: string;
    speed: string;
    dt: number;
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
              setViewMode((prev) => prev === "satellite" ? "default" : "satellite");
            },
          },
          {
            name: "annualView",
            title: "Annual Composite View",
            icon: Plotly.Icons.drawline,
            click: function () {
              setViewMode((prev) => prev === "annual" ? "default" : "annual");
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
                // @ts-ignore
                scale: 2,
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
  }, [setViewMode]);

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
      margin: { t: 20, b: 60, l: 80, r: viewMode !== "default" ? 150 : 80 },
      autosize: true,
      showlegend: viewMode !== "default",
      xaxis: { type: "date", range: xBounds, autorange: false },
      yaxis: {
        range: yBounds,
        type: "-",
        title: "Ice Flow Speed (m/yr)",
        autorange: false,
      },
      dragmode,
      legend: {
        title: { text: viewMode === "satellite" ? "  Satellites" : viewMode === "annual" ? "  Annual" : "", font: { size: 15 } },
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
  }, [plotBounds, viewMode]);

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

    if (viewMode === "satellite") {
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

    if (viewMode === "annual") {
      const traces: Partial<Plotly.PlotData>[] = [];

      console.log('Annual view - timeseriesArr:', timeseriesArr.map(t => ({ hasComposite: !!t.compositeData, compositeData: t.compositeData })));

      for (const timeseries of timeseriesArr) {
        const compositeData = timeseries.compositeData;
        if (!compositeData || compositeData.v.length === 0) continue;

        const markerColor = timeseries.marker.color;

        // Add annual velocity points as markers
        traces.push({
          x: compositeData.time,
          y: compositeData.v,
          type: "scattergl",
          mode: "markers",
          name: "Annual Velocity",
          marker: {
            color: markerColor,
            size: 10,
          },
          hovertemplate:
            "<b>Year:</b> %{x|%Y}<br><b>Speed:</b> %{y:.2f} m/yr<extra></extra>",
        });

        // Generate fitted sine wave curve
        if (!isNaN(compositeData.vAmp) && !isNaN(compositeData.vPhase) && compositeData.time.length >= 2) {
          const startDate = new Date(Math.min(...compositeData.time.map(d => d.getTime())));
          const endDate = new Date(Math.max(...compositeData.time.map(d => d.getTime())));
          // Extend range by 6 months on each side for visualization
          startDate.setMonth(startDate.getMonth() - 6);
          endDate.setMonth(endDate.getMonth() + 6);

          const denseDates = generateDenseDates(startDate, endDate, 500);
          const fittedVelocities = generateFittedTimeseries(
            compositeData.v,
            compositeData.time,
            compositeData.vAmp,
            compositeData.vPhase,
            denseDates
          );

          traces.push({
            x: denseDates,
            y: fittedVelocities,
            type: "scattergl",
            mode: "lines",
            name: "Fitted Curve",
            line: {
              color: markerColor,
              width: 2,
            },
            hovertemplate:
              "<b>Date:</b> %{x}<br><b>Fitted Speed:</b> %{y:.2f} m/yr<extra></extra>",
          });
        }
      }

      return traces;
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
  }, [timeseriesArr, intervalDays, viewMode, hoveredMarkerId]);

  return (
    <div className={classNames("w-full h-[90%]", loading && "animate-pulse")}>
      {clickedPoint && (
        <ImageLinkModal
          imageUrl={clickedPoint.imageUrl}
          date={clickedPoint.date}
          satellite={clickedPoint.satellite}
          speed={clickedPoint.speed}
          dt={clickedPoint.dt}
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

              // Only handle clicks in default view for now
              if (viewMode === "default") {
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
                const dt = foundTimeseries.data.daysDeltaArray[foundIndex];
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
                  dt,
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
                  dt,
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
