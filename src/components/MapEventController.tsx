import { useMapEvents } from "react-leaflet";
import { createMarker } from "../utils/createMarker";
import { IMarker, ISetSearchParams } from "../types";

type IProps = {
  markers: Array<IMarker>;
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  setSearchParams: ISetSearchParams;
  setVelMosaicChecked: React.Dispatch<React.SetStateAction<boolean>>;
};
const MapEventController = (props: IProps) => {
  const { markers, setMarkers, setSearchParams, setVelMosaicChecked } = props;
  useMapEvents({
    // Show velocity colorbar for reference
    layeradd(e) {
      if (
        //@ts-ignore
        e.layer._url ===
        "https://its-live-data.s3.amazonaws.com/velocity_mosaic/v2/static/v_tiles_global/{z}/{x}/{y}.png"
      ) {
        setVelMosaicChecked(true);
      }
    },
    layerremove(e) {
      if (
        //@ts-ignore
        e.layer._url ===
        "https://its-live-data.s3.amazonaws.com/velocity_mosaic/v2/static/v_tiles_global/{z}/{x}/{y}.png"
      ) {
        setVelMosaicChecked(false);
      }
    },

    click(e) {
      if (markers.length <= 10) {
        createMarker({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          markers,
          setMarkers,
          setSearchParams,
        });
      }
    },
    zoomend(e) {
      setSearchParams(
        (oldParams) => {
          const newParams = new URLSearchParams(oldParams);
          newParams.set("z", e.target.getZoom().toString());
          return newParams;
        },
        { replace: true }
      );
    },
  });

  return null;
};

export default MapEventController;
