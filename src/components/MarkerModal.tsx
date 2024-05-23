import { useState } from "react";
import { IMarker, ISetSearchParams } from "../types";
import { z } from "zod";
import classNames from "classnames";
import { ErrorMessage, Field, Form, Formik, FormikErrors } from "formik";
import { createId } from "@paralleldrive/cuid2";
import {
  addMarkerToUrlParams,
  clearMarkersFromUrlParams,
} from "../utils/searchParamUtilities";

interface IProps {
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  markers: IMarker[];
  marker: IMarker;
  setSearchParams: ISetSearchParams;
  onClose: () => void;
}

interface FormValues {
  latitude: string;
  longitude: string;
}

export function MarkerModal(props: IProps) {
  const { markers, marker, setMarkers, setSearchParams, onClose } = props;

  // const [latitude, setLatitude] = useState(String(marker.latLon.lat));
  // const [longitude, setLongitude] = useState(String(marker.latLon.lon));

  // const latitudeValid = z.number().min(-90).max(90).safeParse(Number(latitude));
  // const longitudeInvalid = z.number().min(-180).max(180).safeParse(longitude);

  return (
    <div className="shadow-2xl bg-[white] absolute w-[400px] h-[200px] left-[calc(50%-125px)] top-[calc(50%-125px)] rounded-xl border-2 border-solid z-[99999] p-2">
      <div className="h-[20%]">
        <h1 className="font-bold text-lg p-2">Edit a Marker</h1>
      </div>
      <div className="w-full h-[80%] flex">
        <Formik
          initialValues={{
            latitude: marker.latLon.lat.toString(),
            longitude: marker.latLon.lon.toString(),
          }}
          validate={(values: FormValues) => {
            const errors: FormikErrors<FormValues> = {};
            if (!values.longitude) {
              errors.longitude = "Required";
            } else {
              const longitudeValid = z
                .number()
                .min(-180)
                .max(180)
                .safeParse(Number(values.longitude)).success;
              if (!longitudeValid) {
                errors.longitude = "Invalid Longitude";
              }
            }

            if (!values.latitude) {
              errors.latitude = "Required";
            } else {
              const latitudeValid = z
                .number()
                .min(-90)
                .max(90)
                .safeParse(Number(values.latitude)).success;
              if (!latitudeValid) {
                errors.latitude = "Invalid Latitude";
              }
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            const newMarkers = markers.slice();
            const index = newMarkers.findIndex((m) => m.id === marker.id);
            newMarkers[index] = {
              ...newMarkers[index],
              id: createId(),
              latLon: {
                lat: Number(values.latitude),
                lon: Number(values.longitude),
              },
            };
            setMarkers(newMarkers);
            setSearchParams(
              (prevParams) => {
                // remove all markers from the url
                let params = clearMarkersFromUrlParams(prevParams);
                // then add our newMarkers as params
                newMarkers.forEach((marker) => {
                  params = addMarkerToUrlParams(params, marker);
                });
                return params;
              },
              { replace: true }
            );
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="w-full h-full">
              <div className="w-full h-2/3 flex justify-evenly items-center">
                <label className="block">
                  <span className="text-slate-700 text-sm font-medium">
                    Latitude
                  </span>
                  <Field
                    name="latitude"
                    type="text"
                    className={classNames(
                      "mt-1 block w-[90%] px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
                      "invalid:border-pink-500 invalid:text-pink-600 invalid:focus:border-pink-500 invalid:focus:ring-pink-500"
                    )}
                  />
                  <ErrorMessage
                    name="latitude"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </label>

                <label className="block">
                  <span className="text-slate-700 text-sm font-medium">
                    Longitude
                  </span>
                  <Field
                    name="longitude"
                    type="text"
                    className="mt-1 block w-[90%] px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
              invalid:border-pink-500 invalid:text-pink-600
              focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  />
                  <ErrorMessage
                    name="longitude"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </label>
              </div>
              <div className="w-full h-1/3 flex justify-end px-4">
                <button
                  type="button"
                  className="
            h-[40px] inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-3 
            text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 mx-2"
                  onClick={onClose}
                >
                  close
                </button>
                <button
                  className="h-[40px]
            cursor-pointer inline-flex 
            items-center rounded-md border border-transparent bg-sky-700 
            px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-sky-800 
            focus:ring-[3px] focus:ring-sky-500"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
