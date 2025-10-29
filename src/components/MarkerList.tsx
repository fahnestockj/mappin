import classNames from "classnames";
import { TiPencil } from "react-icons/ti";
import { IMarker } from "../types";

type IProps = {
  markers: Array<IMarker>;
  onEdit: (marker: IMarker) => void;
  onDelete: (markerId: string) => void;
  compact?: boolean;
  onHover?: (markerId: string | null) => void;
};

export function MarkerList(props: IProps) {
  const { markers, onEdit, onDelete, compact = false, onHover } = props;

  return (
    <div className={classNames("space-y-1", compact ? "p-2" : "p-2")}>
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded transition-colors group"
          onMouseEnter={() => onHover?.(marker.id)}
          onMouseLeave={() => onHover?.(null)}
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: marker.color }}
          />
          <div className="flex-1 font-mono text-sm text-gray-600">
            {marker.latLon.lat.toFixed(4)}, {marker.latLon.lon.toFixed(4)}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onEdit(marker)}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              title="Edit marker"
            >
              <TiPencil className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
            <button
              onClick={() => onDelete(marker.id)}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              title="Delete marker"
            >
              <TrashCanSvg className="stroke-gray-400 group-hover:stroke-gray-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
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
