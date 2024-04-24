import React, { useEffect } from "react";
import LoadingBar from "react-top-loading-bar";

type IProps = {
  setProgressBarPercentage: React.Dispatch<React.SetStateAction<number>>;
  progressBarPercentage: number;
  numOfMarkers: number;
};

let progressInterval: any;

const ProgressBar = (props: IProps) => {
  const { setProgressBarPercentage, progressBarPercentage, numOfMarkers } =
    props;

  const disabled = progressBarPercentage >= 100;

  const getIntervalFromNumOfMarkers = (numOfMarkers: number) => {
    switch (numOfMarkers) {
      case 1:
        return 50;
      case 2:
        return 100;
      case 3:
        return 150;
      case 4:
        return 200;
    }
  };

  useEffect(() => {
    if (!disabled) {
      progressInterval = setInterval(() => {
        setProgressBarPercentage((prev) => prev + 1);
      }, getIntervalFromNumOfMarkers(numOfMarkers));
    }
  }, [disabled, numOfMarkers, setProgressBarPercentage]);

  useEffect(() => {
    if (progressBarPercentage >= 100) {
      clearInterval(progressInterval);
      clearInterval(progressInterval - 1);
    }
  }, [progressBarPercentage]);

  return (
    <LoadingBar
      // TODO: Swap back
      // color="rgb(79 70 229)"
      color="rgb(255, 0, 0)"
      progress={progressBarPercentage}
    />
  );
};

export default ProgressBar;
