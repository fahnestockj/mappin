import React, { memo, useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, GeoJSON } from "react-leaflet";
import { CRS } from "leaflet";
import catalogJson from "../../geoJson/stripped_catalog.json";
import { GeoJsonObject } from "geojson";
import { IMarker, ISetSearchParams, ITimeseries } from "../../types";
import MapEventController from "../MapEventController";
import LocationMarker from "../LocationMarker/LocationMarker";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { MarkerList } from "../MarkerList";
import { EditMarkerModal } from "../EditMarkerModal";
import { DraggableChartOverlay } from "../DraggableChartOverlay";
import { clearMarkersFromUrlParams } from "../../utils/searchParamUtilities";
import "./leaflet.css";

type IProps = {
  zoom: number;
  markers: IMarker[];
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  setSearchParams: ISetSearchParams;
  hoveredMarkerId?: string | null;
  onMarkerHover?: (markerId: string | null) => void;
  timeseriesArr: ITimeseries[];
};

const LeafletMap = memo(function Velmap(props: IProps) {
  const { zoom, markers, setMarkers, setSearchParams, hoveredMarkerId, onMarkerHover, timeseriesArr } = props;
  const [isVelMosaicChecked, setVelMosaicChecked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [markerToEditInModal, setMarkerToEditInModal] =
    useState<IMarker | null>(null);
  const [markerWithChart, setMarkerWithChart] = useState<IMarker | null>(null);
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

  const handleDeleteMarker = (markerId: string) => {
    const newMarkers = markers.filter((m) => m.id !== markerId);
    setMarkers(newMarkers);
    onMarkerHover?.(null);
    // Close overlay if the deleted marker was being displayed
    if (markerWithChart?.id === markerId) {
      setMarkerWithChart(null);
    }
    setSearchParams((prevParams) => {
      const newParams = clearMarkersFromUrlParams(prevParams);
      newMarkers.forEach((marker) => {
        newParams.append("lat", marker.latLon.lat.toString());
        newParams.append("lon", marker.latLon.lon.toString());
      });
      return newParams;
    });
  };

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

  // Close overlay if the marker no longer exists
  useEffect(() => {
    if (markerWithChart && !markers.some(m => m.id === markerWithChart.id)) {
      setMarkerWithChart(null);
    }
  }, [markers, markerWithChart]);

  return (
    <div className="w-full h-full relative" ref={mapContainerRef}>
      {markerToEditInModal && (
        <EditMarkerModal
          markers={markers}
          marker={markerToEditInModal}
          setMarkers={setMarkers}
          setSearchParams={setSearchParams}
          onClose={() => setMarkerToEditInModal(null)}
          container={mapContainerRef.current}
        />
      )}
      {markerWithChart && (
        <DraggableChartOverlay
          marker={markerWithChart}
          onClose={() => setMarkerWithChart(null)}
          timeseriesArr={timeseriesArr}
        />
      )}
      <button
        onClick={toggleFullscreen}
        className="absolute top-[86px] left-[8px] z-[1000] bg-white hover:bg-[#f4f4f4] rounded-[5px] border-2 border-[rgba(0,0,0,0.2)] bg-clip-padding w-[48px] h-[48px] flex items-center justify-center text-black no-underline cursor-pointer transition-colors shadow-none"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <MdFullscreenExit className="w-7 h-7" />
        ) : (
          <MdFullscreen className="w-7 h-7" />
        )}
      </button>
      {isFullscreen && markers.length > 0 && (
        <div className="absolute top-[76px] right-2 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg border-2 border-gray-300 shadow-md max-h-[calc(100vh-20px)] flex flex-col max-w-xs">
          <div className="bg-sky-100 border-b-2 border-gray-300 font-semibold text-sm px-3 py-2 rounded-t-lg">
            Markers ({markers.length})
          </div>
          <div className="overflow-y-auto">
            <MarkerList
              markers={markers}
              onEdit={setMarkerToEditInModal}
              onDelete={handleDeleteMarker}
              compact
            />
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
            onMarkerCreated={isFullscreen ? setMarkerWithChart : undefined}
          />
          {markers.map((marker) => (
            <LocationMarker
              key={`${marker.id}`}
              markerProp={marker}
              markers={markers}
              setMarkers={setMarkers}
              setSearchParams={setSearchParams}
              isHovered={hoveredMarkerId === marker.id}
              isDimmed={
                hoveredMarkerId !== null && hoveredMarkerId !== marker.id
              }
              onShowChart={isFullscreen ? setMarkerWithChart : undefined}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
});

export default LeafletMap;
