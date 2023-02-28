import { IMarker } from "../components/Velmap"
import { geoJsonLookup } from "./geoJsonLookup"

describe('geoJsonLookup', () => {

  it('finds the right datacube for a given latitude longitude', () => {
    const markers: IMarker = {
      latLng: {
        lat: 70,
        lng: -50,
      },
      id: 'test',
      color: 'red',
    }
    const res = geoJsonLookup([markers])
    expect(res[0].zarrUrl).toEqual('http://its-live-data.s3.amazonaws.com/datacubes/v02/N70W040/ITS_LIVE_vel_EPSG3413_G0120_X-150000_Y-2150000.zarr')

  })

  it('should fail if we input an incorrect latitude longitude', () => {
    const markers: IMarker = {
      latLng: {
        lat: 2000,
        lng: -2000,
      },
      id: 'test',
      color: 'red',
    }

    const err = new Error("No features found or more than one feature found")
    /**
     * expect().toThrow() is not working for some reason
     * What is it doing?
     * toThrow asks does the function passed to expect (as a callback) throw an error when it is called
     */

    const callbackFunction = () => {geoJsonLookup([markers])}
    expect(callbackFunction).toThrow(err)




  })


})
