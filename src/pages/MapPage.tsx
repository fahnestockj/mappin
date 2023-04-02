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
//@ts-ignore
import { useBreakpoints } from 'react-breakpoints-hook'

type IProps = {
}

function MapPage(props: IProps) {

  let { sm, md, lg } = useBreakpoints({
    sm: {min: 0, max: 860},
    md: {min: 861, max: 1400},
    lg: {min: 1401, max: null},
  });

  const [params, setSearchParams] = useSearchParams();
  const initialMarkers = urlParamsToMarkers(params)
  const [markers, setMarkers] = useState<Array<IMarker>>(initialMarkers)

  const form = useForm<z.infer<typeof ZFormSchema>>();

  return (
    <div>
      <div className={`${sm ? "h-[65vh]": "h-[85vh]"} w-full`} >
        <Velmap
          center={markers.length ? [markers[0].latLng.lat, markers[0].latLng.lng] : undefined}
          mapChildren={
            <>
              <LatLngMapEventController markers={markers} setMarkers={setMarkers} setSearchParams={setSearchParams} />
              {markers.map(marker => (
                <LocationMarker key={`${marker.id}`} markerProp={marker} markers={markers} setMarkers={setMarkers} setSearchParams={setSearchParams} draggable={true} />
              ))}
            </>
          }
        />
      </div>

      <div className='h-[15vh] w-full flex items-center justify-center'>
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
