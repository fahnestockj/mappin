import React from "react"
import { IMarker } from "../components/leafletMap/Velmap";

type IProps = {
  markers: Array<IMarker>
}
const ChartPage = (props: IProps) => {
  const { markers } = props
  return (
    <div>
      
    </div>
  )
};

export default ChartPage;
