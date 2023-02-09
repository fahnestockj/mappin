import { useMapEvents } from "react-leaflet"
import { UseFormReturn } from "react-hook-form"

type IProps = {
  form: UseFormReturn<{
    latitude: number;
    longitude: number;
  }, any>
}
const LatLngMapEventController = (props: IProps) => {

  useMapEvents({
    click(e) {
      // console.log(e.latlng);
      props.form.setValue('latitude', e.latlng.lat)
      props.form.setValue('longitude', e.latlng.lng)
    }
  })

  return null
}

export default LatLngMapEventController