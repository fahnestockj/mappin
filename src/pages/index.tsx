import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BottomBar } from "../components/BottomBar";
import { ZFormSchema } from "../components/LatLngForm";
import Velmap, { IMarker } from "../components/leafletMap/Velmap";
function Page() {

  useEffect(() => {
    //NOTE: useEffect will run twice development because of React.StrictMode this won't happen in production
    axios.get('/timeseries', {
      params: {
        lat: 70,
        lng: -50
      },

    }).then(res => {
      console.log(res.data);
    })
  }, [])

  const form = useForm<z.infer<typeof ZFormSchema>>();

  const [markers, setMarkers] = useState<Array<IMarker>>([
    {
      color: 'blue',
      latLng: {
        lat: 70,
        lng: -50
      },
    }
  ])
  
  return (
    <div>

      <div className="h-[85vh] w-full" >
        <Velmap
          form={form}
          markers={markers}
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

export default Page;
