import classNames from "classnames";
import { TiPencil } from "react-icons/ti";
import { IMarker, ISetSearchParams, ITimeseries } from "../types";
import { SvgCross } from "./SvgCross";
import { useCallback, useEffect, useRef, useState } from "react";
import { clearMarkersFromUrlParams } from "../utils/searchParamUtilities";
import { createPortal } from "react-dom";
import { EditMarkerModal } from "./EditMarkerModal";

type IProps = {
  markers: Array<IMarker>;
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  setSearchParams: ISetSearchParams;
  setTimeseriesArr: React.Dispatch<React.SetStateAction<ITimeseries[]>>;
};
// TODO: clean up these classnames
const cellClassName = "border-r-2 border-b-2 border-slate-600";
export function MarkerTable(props: IProps) {
  const { markers, setMarkers, setSearchParams, setTimeseriesArr } = props;
  const [scrollBarGutterPresent, setScrollBarGutterPresent] = useState(false);

  const [markerToEditInModal, setMarkerToEditInModal] =
    useState<IMarker | null>(null);

  const bottomRowRef = useRef<HTMLTableRowElement>(null);
  const tableBodyRef = useCallback((node: HTMLTableSectionElement) => {
    if (node !== null) {
      setScrollBarGutterPresent(node.offsetWidth - node.clientWidth > 0);
    }
  }, []);

  useEffect(() => {
    if (bottomRowRef.current) {
      bottomRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [markers]);

  return (
    <>
      {markerToEditInModal &&
        createPortal(
          <EditMarkerModal
            markers={markers}
            marker={markerToEditInModal}
            setMarkers={setMarkers}
            setSearchParams={setSearchParams}
            onClose={() => setMarkerToEditInModal(null)}
          />,
          document.getElementById("modal-root") as HTMLElement
        )}
      <table
        className="table-fixed border-spacing-0 rounded-lg border-2 border-separate border-slate-600 shadow-md
      block min-w-[362px] overflow-hidden
    "
      >
        <thead className={classNames("bg-[#B4D2E7] block relative w-full")}>
          <tr className="w-full flex">
            <th
              className={classNames(
                cellClassName,
                "font-semibold overflow-hidden basis-full grow-[2] block p-1"
              )}
            >
              Latitude
            </th>
            <th
              className={classNames(
                cellClassName,
                "font-semibold overflow-hidden basis-full grow-[2] block p-1"
              )}
            >
              Longitude
            </th>
            <th
              className={classNames(
                "border-b-2 border-slate-600 basis-full grow-[2] block p-1",
                "font-semibold"
              )}
            >
              Symbol
            </th>
          </tr>
        </thead>
        <tbody
          id="table-body"
          ref={tableBodyRef}
          className={classNames(
            "block relative w-full max-h-[104px] border-b border-slate-600 overflow-y-scroll"
          )}
        >
          {markers.map((marker, i) => {
            return (
              <tr
                className="w-full flex hover:bg-slate-100 group"
                key={`${marker.id}`}
              >
                <td
                  className={classNames(
                    cellClassName,
                    "basis-full grow-[2] block p-1",
                    i === markers.length - 1 && "border-b-0"
                  )}
                >
                  <div className="ml-2 overflow-hidden">
                    {marker.latLon.lat}
                  </div>
                </td>

                <td
                  className={classNames(
                    cellClassName,
                    "basis-full grow-[2] block p-1",
                    i === markers.length - 1 && "border-b-0"
                  )}
                >
                  <div className="ml-2 overflow-hidden">
                    {marker.latLon.lon}
                  </div>
                </td>

                <td
                  className={classNames(
                    "border-b-2 border-slate-600 basis-full grow-[2] block p-1 ",
                    i === markers.length - 1 && "border-b-0",
                    scrollBarGutterPresent && "max-w-[calc(34.35%-15px)]"
                  )}
                >
                  <div className="h-6 w-full flex flex-row items-center justify-between overflow-hidden">
                    <div className="w-[40px]"></div>
                    {SvgCross(marker.color, "h-[22px] w-[22px]")}
                    <div className="w-[40px] flex">
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setMarkerToEditInModal(marker);
                        }}
                      >
                        <TiPencil
                          title={"Edit this marker"}
                          className="fill-white group-hover:fill-gray-600 w-[16px] h-[16px]"
                        />
                      </div>
                      <div
                        className="cursor-pointer mx-1"
                        onClick={() => {
                          const newMarkers = markers
                            .filter((m) => m.id !== marker.id)
                            .slice();
                          setMarkers(newMarkers);
                          setSearchParams((prevParams) => {
                            const newParams =
                              clearMarkersFromUrlParams(prevParams);
                            newMarkers.forEach((marker) => {
                              newParams.append(
                                "lat",
                                marker.latLon.lat.toString()
                              );
                              newParams.append(
                                "lon",
                                marker.latLon.lon.toString()
                              );
                            });
                            return newParams;
                          });
                        }}
                      >
                        <TrashCanSvg title="Delete this marker" className="stroke-white group-hover:stroke-gray-600" />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
          <tr ref={bottomRowRef} />
        </tbody>
        <tfoot className="w-full block">
          <tr
            className="h-[24px] block w-full cursor-pointer hover:bg-slate-100"
            onClick={() => {
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
            }}
          >
            <td
              colSpan={3}
              className="w-full h-full text-gray-600 text-sm text-left"
            >
              <div className="ml-2 flex items-center text-gray-600">
                <TrashCanSvg className="stroke-gray-600 mr-1" />
                Clear Markers
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
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
