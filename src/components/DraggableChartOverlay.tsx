import { useState, useRef, useEffect, useMemo } from "react";
import { IMarker, ITimeseries } from "../types";
import { getTimeseries } from "../getTimeseries/getTimeseries";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-gl2d-dist-min";
import { MdClose, MdDragIndicator } from "react-icons/md";

const Plot = createPlotlyComponent(Plotly);

interface IProps {
  marker: IMarker;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
}

export function DraggableChartOverlay(props: IProps) {
  const { marker, onClose, initialPosition = { x: 50, y: 50 } } = props;
  const [timeseries, setTimeseries] = useState<ITimeseries | null>(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: 500, height: 400 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getTimeseries(marker)
      .then((data) => {
        setTimeseries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load timeseries:", err);
        setLoading(false);
      });
  }, [marker.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setDragging(true);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
    setResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      } else if (resizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        setSize({
          width: Math.max(300, resizeStart.width + deltaX),
          height: Math.max(250, resizeStart.height + deltaY),
        });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };

    if (dragging || resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, dragOffset, resizeStart]);

  const chartData = useMemo(() => {
    if (!timeseries) return [];
    return [
      {
        x: timeseries.data.midDateArray,
        y: timeseries.data.velocityArray,
        type: "scattergl" as const,
        mode: "markers" as const,
        marker: {
          color: timeseries.marker.color,
          size: 6,
          opacity: 1,
        },
        hovertemplate: '<b>Date:</b> %{x}<br><b>Speed:</b> %{y:.2f} m/yr<extra></extra>',
      },
    ];
  }, [timeseries]);

  const chartLayout = useMemo<Partial<Plotly.Layout>>(() => {
    return {
      margin: { t: 10, b: 40, l: 60, r: 20 },
      autosize: true,
      showlegend: false,
      xaxis: { type: "date" },
      yaxis: { title: "Speed (m/yr)" },
      height: size.height - 100,
      width: size.width - 40,
      hovermode: "closest",
    };
  }, [size]);

  const chartConfig: Partial<Plotly.Config> = {
    displayModeBar: false,
    responsive: true,
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: dragging ? "grabbing" : resizing ? "nwse-resize" : "default",
      }}
      className="bg-white rounded-lg shadow-2xl border-2 border-gray-300"
    >
      {/* Header - Draggable */}
      <div
        className="bg-sky-100 border-b-2 border-gray-300 px-3 py-2 rounded-t-lg flex items-center justify-between cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <MdDragIndicator className="text-gray-500" />
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: marker.color }}
            />
            <span className="font-mono text-sm font-semibold">
              {marker.latLon.lat.toFixed(4)}, {marker.latLon.lon.toFixed(4)}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
          title="Close"
        >
          <MdClose className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Chart Content */}
      <div className="p-4">
        {loading && (
          <div className="text-sm text-gray-500 text-center py-8">
            Loading timeseries data...
          </div>
        )}

        {!loading && timeseries && (
          <div style={{ width: "100%", height: size.height - 100 }}>
            <Plot
              data={chartData}
              layout={chartLayout}
              config={chartConfig}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler={true}
            />
          </div>
        )}

        {!loading && !timeseries && (
          <div className="text-sm text-red-500 text-center py-8">
            Failed to load timeseries data
          </div>
        )}

        {/* Stats */}
        {timeseries && (
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600">Total Points</div>
              <div className="font-semibold">
                {timeseries.data.velocityArray.length}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600">Date Range</div>
              <div className="font-semibold text-xs">
                {timeseries.data.midDateArray[0]?.getFullYear()} -{" "}
                {timeseries.data.midDateArray[
                  timeseries.data.midDateArray.length - 1
                ]?.getFullYear()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize group"
        style={{ touchAction: "none" }}
      >
        <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-gray-400 group-hover:border-gray-600 transition-colors"></div>
      </div>
    </div>
  );
}
