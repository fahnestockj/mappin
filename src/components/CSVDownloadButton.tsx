import { CSVLink } from 'react-csv';
import { BiDownload } from 'react-icons/bi';

type IProps = {
  data: Object[]
  filename: string
  anchorText: string
  className?: string
}
export const StyledCSVDownloadLink = (props: IProps) => {
  const {
    data, filename, anchorText, className
  } = props
  return (
    <CSVLink className={`flex flex-row align-self-end ${className}`} data={data} filename={filename}>
      <BiDownload color='#0d6efd' />
      <h6>
        <div className='mt-1 ms-2'>
          {anchorText}
        </div>
      </h6>
    </CSVLink>
  )
};
