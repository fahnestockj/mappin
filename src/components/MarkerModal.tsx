import { useState } from "react";
import { IMarker, ISetSearchParams } from "../types";
import { z } from "zod";
import classNames from "classnames";

interface IProps {
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
  markers: IMarker[];
  marker: IMarker;
  setSearchParams: ISetSearchParams;
  onClose: () => void;
}

export function MarkerModal(props: IProps) {
  const { markers, marker, setMarkers, setSearchParams, onClose } = props;

  const [latitude, setLatitude] = useState(String(marker.latLon.lat));
  const [longitude, setLongitude] = useState(String(marker.latLon.lon));

  const latitudeValid = z.number().min(-90).max(90).safeParse(Number(latitude));
  console.log(latitudeValid.success);
  
  const longitudeInvalid = z.number().min(-180).max(180).safeParse(longitude);

  return (
    <div className="shadow-2xl bg-[white] absolute w-[400px] h-[200px] left-[calc(50%-125px)] top-[calc(50%-125px)] rounded-xl border-2 border-solid z-[99999] p-2">
      <div className="h-[20%]">
        <h1 className="font-bold text-lg p-2">Edit a Marker</h1>
      </div>
      <div className="w-full h-[80%] flex">
        <form className="w-full h-full">
          <div className="w-full h-2/3 flex justify-evenly items-center">
            <label className="block">
              <span className="text-slate-700 text-sm font-medium">
                Latitude
              </span>
              <input
                type="text"
                className={classNames(
                  "mt-1 block w-[90%] px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
                  !latitudeValid.success &&
                    "border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500"
                )}
                defaultValue={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-slate-700 text-sm font-medium">
                Longitude
              </span>
              <input
                type="text"
                className="mt-1 block w-[90%] px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
              invalid:border-pink-500 invalid:text-pink-600
              focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                defaultValue={longitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </label>
          </div>
          <div className="w-full h-1/3 flex justify-end px-4">
            <button
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
              onSubmit={(e) => {
                e.preventDefault(); // TODO are we?
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
