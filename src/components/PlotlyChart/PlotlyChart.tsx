import { ITimeseries } from "../../types";

type IProps = {
  timeseriesArr: ITimeseries[]
}

export const ZoomingChart = (props: IProps) => {


  const { timeseriesArr } = props

  if ((timeseriesArr.length === 0)) return <></>

  return (
    <div className="h-full w-full flex flex-col items-center">

    </div>
  );
}
