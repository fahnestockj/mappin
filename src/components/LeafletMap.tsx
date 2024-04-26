import React, { memo } from "react";
import { MapContainer, TileLayer, LayersControl, GeoJSON } from "react-leaflet";
import { CRS } from "leaflet";
import catalogJson from "../geoJson/catalog_v02.json";
import { GeoJsonObject } from "geojson";
import { IMarker, ISetSearchParams } from "../types";
import MapEventController from "./LatLonMapEventController";
import LocationMarker from "./LocationMarker/LocationMarker";

type IProps = {
  zoom: number;
  markers: IMarker[];
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  setSearchParams: ISetSearchParams;
};

const LeafletMap = memo(function Velmap(props: IProps) {
  console.log("rendering Velmap");

  const { zoom, markers, setMarkers, setSearchParams } = props;

  const center: [number, number] = markers[0]
    ? [markers[0].latLon.lat, markers[0].latLon.lon]
    : [69.198, -49.103];

  const { Overlay } = LayersControl;

  return (
    <div className="w-full h-full">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <div className="w-full h-full m-auto ">
        <MapContainer
          className="h-[100%] !cursor-crosshair"
          crs={CRS.EPSG3857}
          center={center}
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
              <TileLayer
                className="!cursor-crosshair !opacity-50"
                url="https://glacierflow.nyc3.digitaloceanspaces.com/webmaps/vel_map/{z}/{x}/{y}.png"
                maxNativeZoom={15}
                tileSize={256}
              />
            </Overlay>
          </LayersControl>
          <MapEventController
            markers={markers}
            setMarkers={setMarkers}
            setSearchParams={setSearchParams}
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
