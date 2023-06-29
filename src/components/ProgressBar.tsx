import React, { useEffect } from "react"
import LoadingBar from 'react-top-loading-bar'

type IProps = {
  disabled: boolean
  setProgressBarPercentage: React.Dispatch<React.SetStateAction<number>>
  progressBarPercentage: number
  numOfMarkers: number
}

let progressInterval: any;

const ProgressBar = (props: IProps) => {
  const { disabled, setProgressBarPercentage, progressBarPercentage, numOfMarkers } = props

  const getIntervalFromNumOfMarkers = (numOfMarkers: number) => {
    switch (numOfMarkers) {
      case 1:
        return 50
      case 2:
        return 100
      case 3:
        return 150
      case 4:
        return 200
    }
  }

  useEffect(() => {
    if (!disabled) {
      progressInterval = setInterval(() => {
        setProgressBarPercentage(prev => prev + 1);
      }, getIntervalFromNumOfMarkers(numOfMarkers));
    }
  }, [disabled, numOfMarkers, setProgressBarPercentage]);

  useEffect(() => {
    if (progressBarPercentage >= 100) {
      clearInterval(progressInterval);
      //@ts-ignore
      clearInterval(progressInterval - 1);
    }
  }, [progressBarPercentage]);

  return (
    <LoadingBar color='rgb(79 70 229)' progress={progressBarPercentage} onLoaderFinished={() => setProgressBarPercentage(0)} />
  )
};

export default ProgressBar;
