import classNames from "classnames";
import { IMarker } from "../types";
import { SvgCross } from "./SvgCross";

type IProps = {
  markers: Array<IMarker>;
};
const cellClassName = "border-r-2 border-b-2 border-slate-600";
export function MarkerTable(props: IProps) {
  return (
    <table className="table-fixed w-full overflow-hidden border-spacing-0 rounded-lg border-2 border-separate border-slate-600">
      <thead className="bg-[#B4D2E7]">
        <tr>
          <th className={classNames(cellClassName, "font-semibold")}>Latitude</th>
          <th className={classNames(cellClassName, "font-semibold")}>Longitude</th>
          <th className={classNames("border-b-2 border-slate-600", "font-semibold")}>Symbol</th>
        </tr>
      </thead>
      <tbody>
        {props.markers.length === 0 && (
          <tr className="h-[10px]">
            <td className="border border-slate-600" />
            <td className="border border-slate-600" />
            <td className="border border-slate-600 h-5" />
          </tr>
        )}
        {props.markers.map((marker, i) => {
          return (
            <tr className="h-[10px]" key={`${marker.id}`}>
              <td
                className={classNames(
                  cellClassName,
                  i + 1 === props.markers.length && "border-b-0"
                )}
              >
                <div className="ml-2">{marker.latLon.lat}</div>
              </td>

              <td
                className={classNames(
                  cellClassName,
                  i + 1 === props.markers.length && "border-b-0"
                )}
              >
                <div className="ml-2">{marker.latLon.lon}</div>
              </td>

              <td
                className={classNames(
                  "border-b-2 border-slate-600",
                  i + 1 === props.markers.length && "border-b-0 border-r-0"
                )}
              >
                <div className="h-5 flex flex-col justify-middle">
                  {SvgCross(marker.color)}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
