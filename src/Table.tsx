import { IMarker } from "./components/Velmap"

type IProps = {
    markers: Array<IMarker>
}

export function Table(props: IProps) {

    return (
        <div id="dvContents"
        // style={{ "border": "1px dotted black", "padding": "5px", "width":"305px" }}
        //className="bg-green-700"
        >
            <table className="border-spacing-2 border border-slate-500"
            //  border="1
            >
                <tbody>

                    <tr>
                        <th className="border border-slate-600">Longitude</th>
                        <th className="border border-slate-600">Latitude</th>
                        <th className="border border-slate-600">Symbol</th>
                    </tr>
                    {
                        props.markers.map(marker => {
                            return (
                                <tr key={`${marker.color}`}>
                                    <td className="border border-slate-600">{marker.latLng.lng}</td>
                                    <td className="border border-slate-600">{marker.latLng.lat}</td>
                                    <td className="border border-slate-600">{marker.color}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>
        </div>
        /*<br />*/
        /*<input type="button" onclick="PrintTable();" value="Print" />   */
    )
}





























/*
<thead>
    <tr>
        <th class="border border-slate-300...">Longitude</th>
        <th class="border border-slate-300...">Latitude</th>
        <th class="border border-slate-300...">Symbol</th>
    </tr>
</thead>
   <tbody>
    <tr>
        <td class="border border-slate-300...">           </td>
        <td class="border border-slate-300...">           </td>
        <td class="border border-slate-300...">           </td>
    </tr>
    <tr>
        <td class="border border-slate-300...">           </td>
        <td class="border border-slate-300...">           </td>
        <td class="border border-slate-300...">           </td>
        </tr>
        <tr>
            <td class="border border-slate-300...">           </td>
            <td class="border border-slate-300...">           </td>
            <td class="border border-slate-300...">           </td>
        </tr>
        <tr>
            <td class="border border-slate-300...">           </td>
            <td class="border border-slate-300...">           </td>
            <td class="border border-slate-300...">           </td>
        </tr>
        <tr>
            <td class="border border-slate-300...">           </td>
            <td class="border border-slate-300...">           </td>
            <td class="border border-slate-300...">           </td>
        </tr>

    </tbody>*/













/*<table class="table-fixed">
    <body>
        <style>
        </style>
        <table style="width:100%">
            <tr>
                <td>Latitude</td>
                <td>Longitude</td>
                <td>Symbol</td>
            </tr>
        </table>
    </body>
</table>*/


