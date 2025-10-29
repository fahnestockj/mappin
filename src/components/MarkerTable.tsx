import classNames from "classnames";
import { IMarker, ISetSearchParams, ITimeseries } from "../types";
import { useEffect, useRef, useState } from "react";
import { clearMarkersFromUrlParams } from "../utils/searchParamUtilities";
import { EditMarkerModal } from "./EditMarkerModal";
import { MarkerList } from "./MarkerList";

type IProps = {
  markers: Array<IMarker>;
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  setSearchParams: ISetSearchParams;
  setTimeseriesArr: React.Dispatch<React.SetStateAction<ITimeseries[]>>;
  onMarkerHover?: (markerId: string | null) => void;
};

export function MarkerTable(props: IProps) {
  const { markers, setMarkers, setSearchParams, setTimeseriesArr, onMarkerHover } = props;
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
        <div className="bg-sky-100 border-b-2 border-gray-300 font-semibold text-sm flex-shrink-0 px-3 py-2">
          Markers ({markers.length})
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {markers.length === 0 ? (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              No markers added yet. Click on the map to add markers.
            </div>
          ) : (
            <>
              <MarkerList
                markers={markers}
                onEdit={setMarkerToEditInModal}
                onDelete={handleDeleteMarker}
                onHover={onMarkerHover}
              />
              <div ref={bottomRowRef} />
            </>
          )}
        </div>

        {/* Footer */}
        {markers.length > 0 && (
          <div className="border-t border-gray-300 px-2 py-1 flex justify-center bg-gray-50 flex-shrink-0">
            <button
              onClick={handleClearAllMarkers}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs hover:bg-red-50 hover:text-red-700 transition-colors text-gray-600"
              title="Clear all markers"
            >
              <svg
                className="stroke-current"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
