import { z } from "zod";
import { createTsForm, useTsController } from '@ts-react/form';
import { FaMapMarkerAlt } from 'react-icons/fa'
import { UseFormReturn } from 'react-hook-form'

type IInputProps = {
  message: string;
  placeholder: string;
}
const NumInput = (props: IInputProps) => {
  const { field, error } = useTsController<number>();
  return (
    <div className={`px-3 mb-6  md:mb-0 flex flex-row items-center ${props.message === 'Lat: ' ? 'w-[230px]' : 'w-[250px]'} `}>
      <label className="tracking-wide text-gray-700 text-2xl mr-2">
        {props.message}
      </label>
      <input className=" appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        value={field.value ? field.value.toFixed(5) : ""} // conditional to prevent "uncontrolled to controlled" react warning
        type="number"
        placeholder={props.placeholder}
        onChange={(e) => {
          field.onChange(e.target.valueAsNumber);
        }}
      />
      {error?.errorMessage && <span>{error?.errorMessage}</span>}
    </div>
  )
}

// create the mapping
const mapping = [
  [z.number(), NumInput] as const,
  [z.number(), NumInput] as const,
] as const; // 👈 `as const` is necessary



const MyForm = createTsForm(mapping);
//@ts-ignore
export const ZFormSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});


type IProps = {
  onSubmit: (data: z.infer<typeof ZFormSchema>) => void;
  form: UseFormReturn<{
    latitude: number;
    longitude: number;
  }, any>
}
export const LatLngForm = (props: IProps) => {

  const { onSubmit, form } = props;
  return (
    <MyForm
      form={form}
      formProps={{
        className: 'inline-flex justify-center w-[55%]',
      }}
      schema={ZFormSchema}
      onSubmit={onSubmit}
      renderAfter={() =>
        <button
          type="submit"
          className="mx-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <FaMapMarkerAlt className='scale-150 mr-2 mb-1' />
          Add Point
        </button>
      }
      props={{
        latitude: {
          placeholder: '70.00',
          message: 'Lat: '
        },
        longitude: {
          placeholder: '-50.00',
          message: 'Long: '
        }
      }}
    />

  )
}