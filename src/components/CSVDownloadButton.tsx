import { BiDownload } from 'react-icons/bi';
import { saveAs } from 'file-saver'
import JSZip from 'jszip';
import { ITimeseries } from '../pages/ChartPage';
import { unparse } from 'papaparse';

type IProps = {
  data: ITimeseries[]
}
export const CSVDownloadButton = (props: IProps) => {
  const { data } = props
  const zip = new JSZip();

  return (
    <button
      type="button"
      className={`inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      onClick={() => {
        data.forEach((timeseries) => {
          const csvStr = unparse([['mid_date', 'v [m/yr]'], ...timeseries.timeseries])
          zip.file(`${timeseries.coordinateStr}.csv`, csvStr)
        })

        zip.generateAsync({ type: "blob" })
          .then(function (content) {
            saveAs(content, 'itslive-date.zip');
          });
      }}
    >
      <BiDownload className='scale-150 mr-3 mb-1' />
      Download CSV
    </button>
  )
};