import classNames from "classnames";
import { TiPencil } from "react-icons/ti";
import { IMarker, ISetSearchParams, ITimeseries } from "../types";
import { SvgCross } from "./SvgCross";
import { useEffect, useRef, useState } from "react";
import { clearMarkersFromUrlParams } from "../utils/searchParamUtilities";
import { EditMarkerModal } from "./EditMarkerModal";

type IProps = {
  markers: Array<IMarker>;
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  setSearchParams: ISetSearchParams;
  setTimeseriesArr: React.Dispatch<React.SetStateAction<ITimeseries[]>>;
};

export function MarkerTable(props: IProps) {
  const { markers, setMarkers, setSearchParams, setTimeseriesArr } = props;
  const [markerToEditInModal, setMarkerToEditInModal] =
    useState<IMarker | null>(null);

  const bottomRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (bottomRowRef.current) {
      bottomRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [markers]);

  const handleDeleteMarker = (markerId: string) => {
    const newMarkers = markers.filter((m) => m.id !== markerId);
    setMarkers(newMarkers);
    setSearchParams((prevParams) => {
      const newParams = clearMarkersFromUrlParams(prevParams);
      newMarkers.forEach((marker) => {
        newParams.append("lat", marker.latLon.lat.toString());
        newParams.append("lon", marker.latLon.lon.toString());
      });
      return newParams;
    });
  };

  const handleClearAllMarkers = () => {
    setMarkers([]);
    setTimeseriesArr([]);
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.delete("lat");
        newParams.delete("lon");
        return newParams;
      },
      { replace: true }
    );
  };

  return (
    <>
      {markerToEditInModal && (
        <EditMarkerModal
          markers={markers}
          marker={markerToEditInModal}
          setMarkers={setMarkers}
          setSearchParams={setSearchParams}
          onClose={() => setMarkerToEditInModal(null)}
        />
      )}
      <div className="w-full h-full border-2 border-gray-300 rounded-lg shadow-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-3 bg-sky-100 border-b-2 border-gray-300 font-semibold text-sm flex-shrink-0">
          <div className="px-3 py-2 border-r border-gray-300">Latitude</div>
          <div className="px-3 py-2 border-r border-gray-300">Longitude</div>
          <div className="px-3 py-2">Symbol</div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto border-b border-gray-300 min-h-0">
          {markers.length === 0 ? (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              No markers added yet. Click on the map to add markers.
            </div>
          ) : (
            markers.map((marker) => (
              <div
                key={marker.id}
                className="grid grid-cols-3 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 group"
              >
                <div className="px-3 py-2 border-r border-gray-200 text-sm truncate">
                  {marker.latLon.lat.toFixed(4)}
                </div>
                <div className="px-3 py-2 border-r border-gray-200 text-sm truncate">
                  {marker.latLon.lon.toFixed(4)}
                </div>
                <div className="px-3 py-2 flex items-center justify-center gap-2">
                  {SvgCross(marker.color, "h-5 w-5")}
                  <button
                    onClick={() => setMarkerToEditInModal(marker)}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                    title="Edit marker"
                  >
                    <TiPencil className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteMarker(marker.id)}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                    title="Delete marker"
                  >
                    <TrashCanSvg className="stroke-gray-400 group-hover:stroke-gray-600" />
                  </button>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRowRef} />
        </div>

        {/* Footer */}
        <button
          onClick={handleClearAllMarkers}
          className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center flex-shrink-0"
          disabled={markers.length === 0}
        >
          <TrashCanSvg className="stroke-gray-600 mr-2" />
          Clear All Markers
        </button>
      </div>
    </>
  );
}

function TrashCanSvg(props: { className?: string; title?: string }) {
  return (
    <svg
      className={classNames(props.className)}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.title && <title>{props.title}</title>}
      <path
        d="M3 6H5H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11V17"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11V17"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
