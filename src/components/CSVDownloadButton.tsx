import { useState } from "react";
import { MdDownload } from "react-icons/md";
import JSZip from "jszip";
import { ITimeseries } from "../types";
import { downloadBlob } from "../utils/downloadBlob";
import { getCompositeData } from "../getTimeseries/getCompositeData";
import { Button } from "./Button";

type IProps = {
  data: ITimeseries[];
};
export const CSVDownloadButton = (props: IProps) => {
  const { data } = props;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const zip = new JSZip();

      await Promise.all(
        data.map(async (timeseries) => {
          // Level 2 image-pair data
          let csvStr = "# Level 2 Image-Pair Data\n";
          csvStr += "mid_date, v [m/yr], satellite, dt (days)\n";
          timeseries.data.midDateArray.forEach(
            (midDate, index) =>
              (csvStr += `${midDate.toISOString()},${
                timeseries.data.velocityArray[index]
              }, ${timeseries.data.satelliteArray[index]}, ${
                timeseries.data.daysDeltaArray[index]
              } \n`)
          );

          // Fetch composite data on demand if not already present
          const compositeData =
            timeseries.compositeData ??
            (await getCompositeData(
              timeseries.zarrUrl,
              timeseries.xIndex,
              timeseries.yIndex
            ));

          if (compositeData) {
            const { v, vAmp, vPhase, time } = compositeData;
            csvStr += "\n# Annual Composite Data\n";
            csvStr += `# v_amp [m/yr], ${isNaN(vAmp) ? "NaN" : vAmp}\n`;
            csvStr += `# v_phase [day of year], ${
              isNaN(vPhase) ? "NaN" : vPhase
            }\n`;
            csvStr += "year, v_annual [m/yr]\n";
            time.forEach((date, index) => {
              csvStr += `${date.getUTCFullYear()}, ${v[index]}\n`;
            });
          }

          zip.file(
            `lat_${timeseries.marker.latLon.lat}_lon_${timeseries.marker.latLon.lon}.csv`,
            csvStr
          );
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      downloadBlob(content, "itslive-data.zip");
    } catch (err) {
      console.error("Failed to generate CSV:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={data.length === 0 || loading}
      variant="primary"
      onClick={handleClick}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Preparing...
        </>
      ) : (
        <>
          <MdDownload className="w-4 h-4" />
          Download CSV
        </>
      )}
    </Button>
  );
};
