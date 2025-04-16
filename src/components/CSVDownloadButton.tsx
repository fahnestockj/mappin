import { BiDownload } from "react-icons/bi";
import JSZip from "jszip";
import { ITimeseries } from "../types";
import { downloadBlob } from "../utils/downloadBlob";

type IProps = {
  data: ITimeseries[];
};
export const CSVDownloadButton = (props: IProps) => {
  const { data } = props;
  const zip = new JSZip();

  return (
    <button
      disabled={data.length === 0}
      className="
      h-[40px]
      cursor-pointer inline-flex 
      items-center rounded-md border border-transparent bg-sky-700 
      px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-sky-800
       focus:ring-[3px] focus:ring-sky-500"
      onClick={() => {
        data.forEach((timeseries) => {
          let csvStr = "mid_date, v [m/yr], satellite, dt (days)\n";
          timeseries.data.midDateArray.forEach(
            (midDate, index) =>
              (csvStr += `${midDate.toISOString()},${
                timeseries.data.velocityArray[index]
              }, ${timeseries.data.satelliteArray[index]}, ${
                timeseries.data.daysDeltaArray[index]
              } \n`)
          );

          zip.file(
            `lat_${timeseries.marker.latLon.lat}_lon_${timeseries.marker.latLon.lon}.csv`,
            csvStr
          );
        });

        zip.generateAsync({ type: "blob" }).then(function (content) {
          downloadBlob(content, "itslive-data.zip");
        });
      }}
    >
      Download CSV
      <BiDownload className="scale-150 ml-3 mb-1" />
    </button>
  );
};
