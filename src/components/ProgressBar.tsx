import { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { LoadingBarRef } from "react-top-loading-bar";

type IProps = {
  numOfMarkers: number;
  isLoading: boolean;
};
const ProgressBar = (props: IProps) => {
  const [progress, setProgress] = useState<number>(0);
  const { numOfMarkers, isLoading } = props;


  return (
    <LoadingBar
      progress={progress}
      // TODO: Swap back
      // color="rgb(79 70 229)"
      color="rgb(255, 0, 0)"
    />
  );
};

export default ProgressBar;
