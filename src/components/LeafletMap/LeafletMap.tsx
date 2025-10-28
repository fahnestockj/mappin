import React, { memo, useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, GeoJSON } from "react-leaflet";
import { CRS } from "leaflet";
import catalogJson from "../../geoJson/stripped_catalog.json";
import { GeoJsonObject } from "geojson";
import { IMarker, ISetSearchParams } from "../../types";
import MapEventController from "../MapEventController";
import LocationMarker from "../LocationMarker/LocationMarker";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;

    if (!isFullscreen) {
      // Enter fullscreen
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes (e.g., when user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="w-full h-full relative" ref={mapContainerRef}>
      <button
        onClick={toggleFullscreen}
        className="absolute top-[72px] right-[11px] z-[1000] bg-white hover:bg-[#f4f4f4] rounded-[5px] border-2 border-[rgba(0,0,0,0.2)] bg-clip-padding w-[48px] h-[48px] flex items-center justify-center text-black no-underline cursor-pointer transition-colors shadow-none"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <MdFullscreenExit className="w-7 h-7" />
        ) : (
          <MdFullscreen className="w-7 h-7" />
        )}
      </button>
      {isFullscreen && markers.length > 0 && (
        <div className="absolute top-20 left-2 z-[1000] bg-white/95 backdrop-blur-sm rounded shadow-lg p-3 max-h-[80vh] overflow-y-auto" style={{ boxShadow: "0 1px 5px rgba(0, 0, 0, 0.65)" }}>
          <h3 className="font-semibold text-sm mb-2 text-gray-700 border-b border-gray-300 pb-1">
            Markers ({markers.length})
          </h3>
          <div className="space-y-1">
            {markers.map((marker, idx) => (
              <div
                key={marker.id}
                className="flex items-center gap-2 text-xs py-1 px-2 hover:bg-gray-100 rounded transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: marker.color }}
                />
                <div className="flex-1 font-mono">
                  <div className="text-gray-600">
                    {marker.latLon.lat.toFixed(4)}, {marker.latLon.lon.toFixed(4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
