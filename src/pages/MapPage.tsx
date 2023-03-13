import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { BottomBar } from "../components/BottomBar";
import { ZFormSchema } from "../components/LatLngForm";
import LatLngMapEventController from "../components/LatLngMapEventController";
import LocationMarker from "../components/LocationMarker/LocationMarker";
import Velmap, { IMarker } from "../components/Velmap";
import { urlParamsToMarkers } from "../utils/markerParamUtilities";

type IProps = {
}

function MapPage(props: IProps) {

  const [params, setSearchParams] = useSearchParams();
  const initialMarkers = urlParamsToMarkers(params)
  const [markers, setMarkers] = useState<Array<IMarker>>(initialMarkers)

  const form = useForm<z.infer<typeof ZFormSchema>>();

  return (
    <div>
      <div className="h-[85vh] w-full" >
        <Velmap
          center={markers.length ? [markers[0].latLng.lat, markers[0].latLng.lng] : undefined}
          mapChildren={
            <>
              <LatLngMapEventController form={form} />
              {markers.map(marker => (
                <LocationMarker key={`${marker.latLng.lat}${marker.latLng.lng}`} markerProp={marker} markers={markers} setMarkers={setMarkers} setSearchParams={setSearchParams} draggable={true} />
              ))}
            </>
          }
        />
      </div>

      <div className='h-[15vh] w-full flex items-center'>
        <BottomBar
          form={form}
          setMarkers={setMarkers}
          markers={markers}
        />
      </div>
    </div>
  );
}

export default MapPage;
