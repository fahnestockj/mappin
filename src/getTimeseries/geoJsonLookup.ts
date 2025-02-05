//@ts-ignore
import GeoJsonGeometriesLookup from "geojson-geometries-lookup";
import { checkIfCoordinateIsWithinBounds } from "./checkIfCoordinateIsWithinBounds";
import { appProj4 } from "./proj4Projections";
import { IMarker } from "../types";
import geoJsonFile from "../geoJson/stripped_catalog.json";
type ICatalogGeoJson = {
  "features": Array<{
    properties: {
      zarr_url: string,
      epsg: string,
      geometry_epsg: {
        type: string,
        coordinates: Array<[[number, number], [number, number], [number, number], [number, number]]>
      }
    }
  }>
}
export interface IGeoJsonLookupResponse {
  cartesianCoordinate: [number, number],
  zarrUrl: string,
}
/**
 * Neighboring EPSGs can overlap at the edges - so potentially multiple zarrUrls for one marker
 */
export function geoJsonLookup(marker: IMarker): Array<IGeoJsonLookupResponse> {
  const glookup = new GeoJsonGeometriesLookup(geoJsonFile);
  /**
   * NOTE: the geoJson comes with a coordinates attribute that defines the bounds of the box in the cubes projection
   * You can check if you're in the wrong cube, and then index through the geoJson to find the right one
   */
  const coordinate = marker.latLon
  const point = { type: "Point", coordinates: [coordinate.lon, coordinate.lat] };
  const features: ICatalogGeoJson["features"] = glookup.getContainers(point).features;

  if (features.length === 0) {
    throw new Error("No features found")
  }
  const responses: Array<IGeoJsonLookupResponse> = features.map((feature) => {

    const zarrUrl = feature.properties.zarr_url
    const projection = `EPSG:${feature.properties.epsg}`

    //NOTE: EPSG:4326 is the projection of the lat lon coordinates
    // lat: 70, lon: -50 => [-200000, -2200000] in the locale projection EPSG:3413

    const cartesianCoordinate: [number, number] = appProj4("EPSG:4326", projection).forward([coordinate.lon, coordinate.lat])

    const inBounds = checkIfCoordinateIsWithinBounds(cartesianCoordinate, feature.properties.geometry_epsg.coordinates[0])

    if (!inBounds) {
      //We have to search through the features using the cartesianCoordinate to ensure we haven't crossed datacubes during the conversion
      // @ts-ignore
      for (const feature of geoJsonFile.features) {
        // @ts-ignore
        const inBounds = checkIfCoordinateIsWithinBounds(cartesianCoordinate, feature.properties.geometry_epsg.coordinates[0])
        if (inBounds) {
          return ({
            zarrUrl: feature.properties.zarr_url,
            cartesianCoordinate,
          })
        }
      }
    }

    return ({
      zarrUrl,
      cartesianCoordinate,
    })
  })
  return responses
}
