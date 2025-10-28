import { IMarker, ISetSearchParams } from "../types";
import { z } from "zod";
import classNames from "classnames";
import { ErrorMessage, Field, Form, Formik, FormikErrors } from "formik";
import { createId } from "@paralleldrive/cuid2";
import {
  addMarkerToUrlParams,
  clearMarkersFromUrlParams,
} from "../utils/searchParamUtilities";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface IProps {
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  markers: IMarker[];
  marker: IMarker;
  setSearchParams: ISetSearchParams;
  onClose: () => void;
  container?: HTMLElement | null;
}

interface FormValues {
  latitude: string;
  longitude: string;
}

export function EditMarkerModal(props: IProps) {
  const { markers, marker, setMarkers, setSearchParams, onClose, container } = props;

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Marker" size="md" container={container}>
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
        onSubmit={(values) => {
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
          <Form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-slate-700 text-sm font-medium">
                  Latitude
                </span>
                <Field
                  name="latitude"
                  className={classNames(
                    "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 font-mono",
                    "focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                    "disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
                    "invalid:border-pink-500 invalid:text-pink-600 invalid:focus:border-pink-500 invalid:focus:ring-pink-500"
                  )}
                />
                <ErrorMessage
                  name="latitude"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </label>

              <label className="block">
                <span className="text-slate-700 text-sm font-medium">
                  Longitude
                </span>
                <Field
                  name="longitude"
                  type="text"
                  className={classNames(
                    "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 font-mono",
                    "focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
                    "disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
                    "invalid:border-pink-500 invalid:text-pink-600 invalid:focus:border-pink-500 invalid:focus:ring-pink-500"
                  )}
                />
                <ErrorMessage
                  name="longitude"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
