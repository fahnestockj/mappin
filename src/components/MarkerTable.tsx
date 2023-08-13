import { IMarker } from "../types"
import { SvgCross } from "./SvgCross"

type IProps = {
  markers: Array<IMarker>
}

export function MarkerTable(props: IProps) {

  return (
    <div className="w-full flex flex-row justify-left">
      <table className="border-spacing-2 border border-slate-500 w-4/5 table-fixed">
        <tbody>
          <tr className="bg-slate-500">
            <th className="border border-slate-600 text-white">Latitude</th>
            <th className="border border-slate-600 text-white">Longitude</th>
            <th className="border border-slate-600 text-white">Symbol</th>
          </tr>
          {props.markers.length === 0 &&
            <tr className="h-[10px]">
              <td className="border border-slate-600"/>
              <td className="border border-slate-600"/>
              <td className="border border-slate-600 h-5"/>
            </tr>
          }
          {
            props.markers.map(marker => {
              return (
                <tr className="h-[10px]" key={`${marker.id}`}>
                  <td className="border border-slate-600">
                    <div className="ml-2">{marker.latLon.lat}</div>
                    </td>

                  <td className="border border-slate-600">
                    <div className="ml-2">{marker.latLon.lon}</div>
                    </td>

                  <td className="border border-slate-600">
                    <div className="h-5 flex flex-col justify-middle">
                      {SvgCross(marker.color)}
                    </div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>

      </table>
    </div>
  )
}
