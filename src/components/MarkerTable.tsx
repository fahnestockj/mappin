import classNames from "classnames";
import { IMarker } from "../types";
import { SvgCross } from "./SvgCross";

type IProps = {
  markers: Array<IMarker>;
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
};
const cellClassName = "border-r-2 border-b-2 border-slate-600";
export function MarkerTable(props: IProps) {
  return (
    <table className="table-fixed w-full overflow-hidden border-spacing-0 rounded-lg border-2 border-separate border-slate-600 shadow-md">
      <thead className="bg-[#B4D2E7]">
        <tr>
          <th
            className={classNames(
              cellClassName,
              "font-semibold overflow-hidden"
            )}
          >
            Latitude
          </th>
          <th
            className={classNames(
              cellClassName,
              "font-semibold overflow-hidden"
            )}
          >
            Longitude
          </th>
          <th
            className={classNames(
              "border-b-2 border-slate-600",
              "font-semibold"
            )}
          >
            Symbol
          </th>
        </tr>
      </thead>
      <tbody>
        {props.markers.map((marker, i) => {
          return (
            <tr className="h-[10px]" key={`${marker.id}`}>
              <td className={cellClassName}>
                <div className="ml-2 overflow-hidden">{marker.latLon.lat}</div>
              </td>

              <td className={cellClassName}>
                <div className="ml-2 overflow-hidden">{marker.latLon.lon}</div>
              </td>

              <td className={"border-b-2 border-slate-600"}>
                <div className="h-5 flex flex-col justify-middle overflow-hidden">
                  {SvgCross(marker.color)}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr
          className="h-[24px] w-full cursor-pointer hover:bg-slate-100"
          onClick={() => props.setMarkers([])}
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
  );
}

function TrashCanSvg(props: { className?: string }) {
  return (
    <svg
      className={classNames(props.className)}
      width="16"
      height="16"
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
  );
}
