import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BottomBar } from "../components/BottomBar";
import { ZFormSchema } from "../components/LatLngForm";
import LatLngMapEventController from "../components/LatLngMapEventController";
import LocationMarker from "../components/LocationMarker/LocationMarker";
import Velmap, { IMarker } from "../components/Velmap";
type IProps = {
  markers: Array<IMarker>
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>
}
function MapPage(props: IProps) {
  const { markers, setMarkers } = props

  useEffect(() => {
    //NOTE: useEffect will run twice development because of React.StrictMode this won't happen in production
    axios.get('/timeseries', {
      params: {
        lat: 70,
        lng: -50
      },

    }).then(res => {
      // console.log(res.data);
    })
  }, [])

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
                <LocationMarker key={`${marker.latLng.lat}${marker.latLng.lng}`} markerProp={marker} markers={markers} setMarkers={setMarkers} draggable={true} />
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
