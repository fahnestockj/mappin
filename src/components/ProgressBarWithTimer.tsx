import React, { useEffect } from "react"
import LoadingBar from 'react-top-loading-bar'

type IProps = {
  disabled: boolean
  setProgress: React.Dispatch<React.SetStateAction<number>>
  progress: number
}

let progressInterval: any;

const ProgressBarWithTimer = (props: IProps) => {
  const { disabled, setProgress, progress } = props
  useEffect(() => {
    if (!disabled) {
      progressInterval = setInterval(() => {
        setProgress(prev => prev + 1);
      }, 20);

      console.log('progressInterval', progressInterval);
    }
  }, [disabled, setProgress]);

  useEffect(() => {
    if (progress >= 100) {
      console.log('clearing', progressInterval);
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
