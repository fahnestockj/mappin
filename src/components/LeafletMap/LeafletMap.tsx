import React, { memo, useState } from "react";
import { MapContainer, TileLayer, LayersControl, GeoJSON } from "react-leaflet";
import { CRS } from "leaflet";
import catalogJson from "../../geoJson/stripped_catalog.json";
import { GeoJsonObject } from "geojson";
import { IMarker, ISetSearchParams } from "../../types";
import MapEventController from "../MapEventController";
import LocationMarker from "../LocationMarker/LocationMarker";
import "./leaflet.css";

type IProps = {
  zoom: number;
  markers: IMarker[];
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  setSearchParams: ISetSearchParams;
};

const LeafletMap = memo(function Velmap(props: IProps) {
  const { zoom, markers, setMarkers, setSearchParams } = props;
  const [isVelMosaicChecked, setVelMosaicChecked] = useState(false);

  const middleMarkerIdx = Math.floor((markers.length - 1) / 2);
  const mapCenter: [number, number] =
    middleMarkerIdx >= 0
      ? [
          markers[middleMarkerIdx].latLon.lat,
          markers[middleMarkerIdx].latLon.lon,
        ]
      : // This is the default map location if no markers are found
        [69.198, -49.103];

  const { Overlay } = LayersControl;

  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <MapContainer
          className="h-[100%] !cursor-crosshair"
          attributionControl={true}
          crs={CRS.EPSG3857}
          center={mapCenter}
          zoom={zoom}
          maxZoom={15}
          minZoom={2}
          scrollWheelZoom={true}
          maxBounds={[
            [-90, -1440],
            [90, 1440],
          ]}
          worldCopyJump={true}
        >
          {isVelMosaicChecked && (
            <img
              src="/images/velocity_colorbar.png"
              alt="Vertical Velocity Colorbar"
              style={{ zIndex: 700 }}
              className="absolute right-2 bottom-8 w-[70px] rounded-md"
            />
          )}
          <LayersControl>
            <Overlay name="Datacube Boundaries">
              <GeoJSON data={catalogJson as GeoJsonObject} />
            </Overlay>
            <TileLayer
              className="!cursor-crosshair"
              attribution="Imagery provided by ESRI"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg"
              maxNativeZoom={15}
              tileSize={256}
            />
            <Overlay checked={false} name="Velocity Map">
              {/* <img src="/images/velocity_colorbar.png" alt="Vertical Velocity Colorbar" className="leaflet-bottom leaflet-right h-[40px] rounded-t-md"></img> */}
              <TileLayer
                className="!cursor-crosshair !opacity-50"
                url="https://its-live-data.s3.amazonaws.com/velocity_mosaic/v2/static/v_tiles_global/{z}/{x}/{y}.png"
                maxNativeZoom={15}
                tileSize={256}
              />
            </Overlay>
          </LayersControl>
          <MapEventController
            markers={markers}
            setMarkers={setMarkers}
            setSearchParams={setSearchParams}
            setVelMosaicChecked={setVelMosaicChecked}
          />
          {markers.map((marker) => (
            <LocationMarker
              key={`${marker.id}`}
              markerProp={marker}
              markers={markers}
              setMarkers={setMarkers}
              setSearchParams={setSearchParams}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
});

export default LeafletMap;
