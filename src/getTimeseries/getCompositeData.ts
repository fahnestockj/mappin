import { HTTPStore, openArray } from "@fahnestockj/zarr-fork";
import { ICompositeData } from "../types";
import { getCompositeUrl } from "./getCompositeUrl";
import { findClosestIndex } from "./findClosestIndex";

declare enum HTTPMethod {
  GET = "GET",
}

const V_FILL_VALUE = -32767
const V_AMP_PHASE_FILL_VALUE = 32767

/**
 * Fetches composite data (v, v_amp, v_phase) from the annual composite zarr store.
 * Uses the same x/y indexing structure as the regular datacubes.
 */
export async function getCompositeData(
  zarrUrl: string,
  cartesianCoordinate: [number, number]
): Promise<ICompositeData | null> {
  const compositeUrl = getCompositeUrl(zarrUrl)

  try {
    const store = new HTTPStore(compositeUrl, {
      fetchOptions: {},
      supportedMethods: ["GET" as HTTPMethod],
    });

    // Open coordinate arrays
    const xArrayZarr = await openArray({ store, path: "/x", mode: "r" })
    const yArrayZarr = await openArray({ store, path: "/y", mode: "r" })

    const xArray = await xArrayZarr.get(null).then((res) => {
      if (typeof res === "number") throw new Error("x data is a number")
      return res.data as Float64Array
    })

    const yArray = await yArrayZarr.get(null).then((res) => {
      if (typeof res === "number") throw new Error("y data is a number")
      return res.data as Float64Array
    })

    const [xIndex, yIndex] = findClosestIndex(xArray, yArray, cartesianCoordinate)

    // Open data arrays
    const vZarr = await openArray({ store, path: "/v", mode: "r" })
    const vAmpZarr = await openArray({ store, path: "/v_amp", mode: "r" })
    const vPhaseZarr = await openArray({ store, path: "/v_phase", mode: "r" })
    const timeZarr = await openArray({ store, path: "/time", mode: "r" })

    // Fetch data at the grid point
    // v is [time, y, x], so we get all time values at this point
    const vRaw = await vZarr.get([null, yIndex, xIndex]).then((res) => {
      if (typeof res === "number") throw new Error("v data is a number")
      return res.data as Float32Array
    })

    // v_amp and v_phase are [y, x]
    const vAmpRaw = await vAmpZarr.get([yIndex, xIndex]).then((res) => {
      if (typeof res === "number") return res as number
      throw new Error("v_amp should be a single number")
    })

    const vPhaseRaw = await vPhaseZarr.get([yIndex, xIndex]).then((res) => {
      if (typeof res === "number") return res as number
      throw new Error("v_phase should be a single number")
    })

    // Fetch time array - zarr.js returns Float64Array but we need to decode int64 from raw buffer
    const timeFloat64 = await timeZarr.get(null).then((res) => {
      if (typeof res === "number") throw new Error("time data is a number")
      return res.data as Float64Array
    })

    // Decode int64 values from the raw buffer (same approach as satellite string decoding)
    const timeRaw: number[] = []
    const timeDataView = new DataView(timeFloat64.buffer)
    for (let i = 0; i < timeFloat64.length; i++) {
      const low = timeDataView.getUint32(i * 8, true)
      const high = timeDataView.getInt32(i * 8 + 4, true)
      timeRaw.push(high * 0x100000000 + low)
    }

    // Filter out no-data values and convert to arrays
    const v: number[] = []
    const time: Date[] = []

    for (let i = 0; i < vRaw.length; i++) {
      if (vRaw[i] !== V_FILL_VALUE) {
        v.push(vRaw[i])
        // Convert days since epoch to Date
        time.push(new Date(timeRaw[i] * 86400000))
      }
    }

    // Check if v_amp and v_phase are valid
    const vAmp = vAmpRaw === V_AMP_PHASE_FILL_VALUE ? NaN : vAmpRaw
    const vPhase = vPhaseRaw === V_AMP_PHASE_FILL_VALUE ? NaN : vPhaseRaw

    return { v, vAmp, vPhase, time }
  } catch (error) {
    console.error("Failed to fetch composite data:", error)
    return null
  }
}
