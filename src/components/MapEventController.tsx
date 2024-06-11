import { useMapEvents } from "react-leaflet";
import { createMarker } from "../utils/createMarker";
import { IMarker, ISetSearchParams } from "../types";

type IProps = {
  markers: Array<IMarker>;
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  setSearchParams: ISetSearchParams;
};
const MapEventController = (props: IProps) => {
  const { markers, setMarkers, setSearchParams } = props;
  useMapEvents({
    click(e) {
      createMarker({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        markers,
        setMarkers,
        setSearchParams,
      });
    },
    zoomend(e) {
      setSearchParams((oldParams) => {
        const newParams = new URLSearchParams(oldParams);
        newParams.set("z", e.target.getZoom().toString());
        return newParams;
      }, { replace: true });
    },
  });

  return null;
};

export default MapEventController;
