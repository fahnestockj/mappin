import React, { useEffect } from "react"
import LoadingBar from 'react-top-loading-bar'

type IProps = {
  disabled: boolean
  setProgress: React.Dispatch<React.SetStateAction<number>>
  progress: number
  numOfMarkers: number
}

let progressInterval: any;

const ProgressBarWithTimer = (props: IProps) => {
  const { disabled, setProgress, progress, numOfMarkers } = props

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
        setProgress(prev => prev + 1);
      }, getIntervalFromNumOfMarkers(numOfMarkers));
    }
  }, [disabled, numOfMarkers, setProgress]);

  useEffect(() => {
    if (progress >= 100) {
      clearInterval(progressInterval);
      //@ts-ignore
      clearInterval(progressInterval - 1);
    }
  }, [progress]);

  return (
    <LoadingBar color='rgb(79 70 229)' progress={progress} onLoaderFinished={() => setProgress(0)} />
  )
};

export default ProgressBarWithTimer;
