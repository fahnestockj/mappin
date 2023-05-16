import { BiDownload } from 'react-icons/bi';
import { saveAs } from 'file-saver'
import JSZip from 'jszip';
import { unparse } from 'papaparse';
import { ITimeseries } from '../types';

type IProps = {
  data: ITimeseries[]
}
export const CSVDownloadButton = (props: IProps) => {
  const { data } = props
  const zip = new JSZip();

  return (
    <button
      disabled={data.length === 0}
      className="cursor-pointer inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={() => {
        data.forEach((timeseries) => {
          const csvStr = unparse([['mid_date', 'v [m/yr]'], [timeseries.data.midDateArray, timeseries.data.velocityArray]])
          zip.file(`lat_${timeseries.marker.latLon.lat}_lon_${timeseries.marker.latLon.lon}.csv`, csvStr)
        })

        zip.generateAsync({ type: "blob" })
          .then(function (content) {
            saveAs(content, 'itslive-data.zip');
          });
      }}
    >
      <BiDownload className='scale-150 mr-3 mb-1' />
      Download CSV
    </button>
  )
};
