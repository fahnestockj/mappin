import { useMemo } from "react";
import { ITimeseries } from "../types";

interface IProps {
  timeseriesArr: ITimeseries[];
  intervalDays: Array<number>;
}
export function NumberOfFilteredPts(props: IProps) {
  const { timeseriesArr, intervalDays } = props;
  const { filteredPts, totalPts } = useMemo(() => {
    const totalPts = [
      ...timeseriesArr.map(
        (timeseries) => timeseries.data.velocityArray.length
      ),
    ].reduce((a, b) => a + b, 0);

    let filteredPts = 0;
    for (const timeseries of timeseriesArr) {
      for (let i = 0; i < timeseries.data.velocityArray.length; i++) {
        const dt = timeseries.data.daysDeltaArray[i];
        if (dt >= intervalDays[0] && dt <= intervalDays[1]) {
          filteredPts++;
        }
      }
    }
    return { filteredPts, totalPts };
  }, [timeseriesArr, intervalDays]);

  return (
    <div className="text-sm text-gray-600">
      {filteredPts}/{totalPts}
    </div>
  );
}
