import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { ZFormSchema } from "../../components/BottomBar/LatLonForm";
import LocationMarker from "../../components/LocationMarker/LocationMarker";
import Velmap from "../../components/Velmap";
import { urlParamsToMarkers } from "../../utils/markerParamUtilities";
//@ts-ignore
import { useBreakpoints } from "react-breakpoints-hook";
import { IMarker } from "../../types";
import { BottomBar } from "../../components/BottomBar/BottomBar";
import LatLonMapEventController from "../../components/LatLonMapEventController";
import { marker } from "leaflet";

type IProps = {};

function MapPage(props: IProps) {
  let { sm, md, lg } = useBreakpoints({
    sm: { min: 0, max: 860 },
    md: { min: 861, max: 1383 },
    lg: { min: 1384, max: null },
  });

  const [params, setSearchParams] = useSearchParams();
  const initialMarkers = urlParamsToMarkers(params);
  const [markers, setMarkers] = useState<Array<IMarker>>(initialMarkers);
  const form = useForm<z.infer<typeof ZFormSchema>>();

  return (
    <div className="overflow-hidden">
      <div className={`${sm ? "h-[75vh]" : "h-[85vh]"} w-full`}>
        <Velmap
          center={
            markers.length
              ? [markers[0].latLon.lat, markers[0].latLon.lon]
              : undefined
          }
          mapChildren={
            <>
              <LatLonMapEventController
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
                  draggable={true}
                />
              ))}
            </>
          }
        />
      </div>

      <div className="h-[15vh] w-full flex items-center justify-center">
        <BottomBar
          form={form}
          setMarkers={setMarkers}
          markers={markers}
          breakpoints={{ sm, md, lg }}
        />
      </div>
    </div>
  );
}

export default MapPage;
