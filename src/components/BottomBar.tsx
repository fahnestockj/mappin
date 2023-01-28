import produce from "immer";
import { UseFormReturn } from "react-hook-form";
import { AiOutlineLineChart } from "react-icons/ai";
import { BiImport } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getColor } from "../utils/getColor";
import { LatLngForm } from "./LatLngForm";
import { IMarker } from "./Velmap";

type IProps = {
  form: UseFormReturn<{
    latitude: number;
    longitude: number;
  }, any>
  markers: Array<IMarker>
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>
}
export const BottomBar = (props: IProps) => {
  const { form, markers, setMarkers } = props
  const navigate = useNavigate()
  return (
    <>
      <div className='basis-2/3 inline-flex'>
        <LatLngForm form={form} onSubmit={({ latitude, longitude }) => {
          console.log('lat', latitude, 'lng', longitude);

          if (markers.length < 4) {
            const color = getColor(markers.length)
            setMarkers(
              //Immer produce for immutability
              produce(markers, draft => {
                draft.push({
                  color,
                  latLng: {
                    lat: latitude,
                    lng: longitude
                  }
                })
              })
            )
          }
        }} />

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <BiImport className='scale-150 mr-2 mb-1' />
          Import Coordinates
        </button>

        <button
          type="button"
          className="ml-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => { navigate('/chart') }}
        >
          <AiOutlineLineChart className='scale-150 mr-2 mb-1' />
          Plot
        </button>
      </div>

      <div className='basis-1/3'>
        {/** Table go here */}
      </div>
    </>
  )

}