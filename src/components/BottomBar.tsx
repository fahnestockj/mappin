import produce from "immer";
import { UseFormReturn } from "react-hook-form";
import { AiOutlineLineChart } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getColor } from "../utils/getColor";
import { LatLngForm } from "./LatLngForm";
import { IMarker } from "./Velmap";
import { createId } from '@paralleldrive/cuid2';
import { MarkerTable } from "./MarkerTable";
import { markersToUrlParams } from "../utils/markerParamUtilities";

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
  const [params, setParams] = useSearchParams();

  return (
    <>
      <div className='basis-2/3 inline-flex ml-5 h-14'>
        <LatLngForm form={form} onSubmit={({ latitude, longitude }) => {
          // console.log('lat', latitude, 'lng', longitude);

          if (markers.length < 4) {
            const color = getColor(markers.length)


            //Immer produce for immutability
            const updatedMarkers = produce(markers, draft => {
              draft.push({
                id: createId(),
                color,
                latLng: {
                  lat: parseFloat(latitude.toFixed(5)),
                  lng: parseFloat(longitude.toFixed(5))
                }
              })
            })

            const urlParams = markersToUrlParams(updatedMarkers)
            setParams(urlParams)
            setMarkers(updatedMarkers)
          }
        }} />

        <button
          type="button"
          className="mx-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            setMarkers([])
            setParams({})
          }}
        >
          <BiTrash className='scale-150 mr-2 mb-1' />
          Clear Points
        </button>

        <button
          type="button"
          className="mx-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            navigate({
              pathname: '/chart',
              search: params.toString()
            })
          }}
        >
          <AiOutlineLineChart className='scale-150 mr-2 mb-1' />
          Plot
        </button>


      </div>
      <div className='basis-1/3 flex flex-col items-center'>
        <MarkerTable markers={markers} />
      </div>
    </>
  )

}