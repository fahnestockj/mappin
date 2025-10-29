import { useState, useRef, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { SvgCross } from "../SvgCross";
import "./LocationMarker.css";
import { ICoordinate, IMarker, ISetSearchParams } from "../../types";
import {
  addMarkerToUrlParams,
  clearMarkersFromUrlParams,
} from "../../utils/searchParamUtilities";
import { createId } from "@paralleldrive/cuid2";

type IProps = {
  markerProp: IMarker;
  markers: Array<IMarker>;
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  setSearchParams: ISetSearchParams;
  isHovered?: boolean;
  isDimmed?: boolean;
  onShowChart?: (marker: IMarker) => void;
};

const LocationMarker = (props: IProps) => {
  const { markerProp, markers, setMarkers, setSearchParams, isHovered, isDimmed, onShowChart } = props;
  const markerRef = useRef(null);
  const [position, setPosition] = useState<ICoordinate>(markerProp.latLon);

  // Adjust icon size based on hover state
  const iconSize: [number, number] = isHovered ? [36, 36] : [26, 26];
  const iconAnchor: [number, number] = isHovered ? [18, 18] : [13, 13];
  const opacity = isDimmed ? 0.3 : 1.0;

  const icon = L.divIcon({
    html: renderToStaticMarkup(SvgCross(markerProp.color)),
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [0, -18],
    shadowAnchor: [13, 28],
    className: "transparent",
  });

  const eventHandlers = useMemo(
    () => ({
      click() {
        onShowChart?.(markerProp);
      },
      dragend() {
        const oldMarkerIndex = markers.findIndex(
          (marker) => marker.id === markerProp.id
        );
        const marker = markerRef.current;
        if (marker != null) {
          const newMarkers = markers.slice()
          // @ts-ignore
          const { lat, lng: lon } = marker.getLatLng() as {
            lat: number;
            lng: number;
          };
          const updatedMarker = {
            id: createId(),
            color: markerProp.color,
            latLon: {
              lat: parseFloat(lat.toFixed(4)),
              lon: parseFloat(lon.toFixed(4)),
            },
          };
          newMarkers[oldMarkerIndex] = updatedMarker;
          setSearchParams(
            (prevParams) => {
              // remove all markers from the url
              let params = clearMarkersFromUrlParams(prevParams);
              // then add our newMarkers as params
              newMarkers.forEach((marker) => {
                params = addMarkerToUrlParams(params, marker);
              });
              return params;
            },
            { replace: true }
          );
          setPosition({ lat, lon });
          setMarkers(newMarkers);
          onShowChart?.(updatedMarker);
        }
      },
    }),
    [markerProp, markers, setMarkers, setSearchParams, onShowChart]
  );

  return (
    <Marker
      position={{ lat: position.lat, lng: position.lon }}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
      icon={icon}
      opacity={opacity}
    >
      <Popup>
        <div className="font-mono text-sm font-semibold">
          {position.lat.toFixed(4)}, {position.lon.toFixed(4)}
        </div>
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
