//@ts-ignore
import GeoJsonGeometriesLookup from "geojson-geometries-lookup";
import { checkIfCoordinateIsWithinBounds } from "./checkIfCoordinateIsWithinBounds";
import { appProj4 } from "./proj4Projections";
import { IMarker } from "../types";
import geoJsonFile from "../geoJson/catalog_v02.json";
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

export function geoJsonLookup(markers: Array<IMarker>): Array<{
  marker: IMarker,
  cartesianCoordinate: [number, number],
  zarrUrl: string,
}> {
  const results = []
  const glookup = new GeoJsonGeometriesLookup(geoJsonFile);
  /**
   * NOTE: the geoJson comes with a coordinates attribute that defines the bounds of the box IN THE CUBES PROJECTION
   * You can check if you're in the wrong cube, and then index through the geoJson to find the right one
   */
  for (const marker of markers) {
    const coordinate = marker.latLon
    const point = { type: "Point", coordinates: [coordinate.lon, coordinate.lat] };
    const features: ICatalogGeoJson["features"] = glookup.getContainers(point).features;

    if (features.length === 0 || features.length > 1) {
      throw new Error("No features found or more than one feature found")
    }
    const zarrUrl = features[0].properties.zarr_url
    const projection = `EPSG:${features[0].properties.epsg}`

    //NOTE: EPSG:4326 is the projection of the lat lon coordinates
    // lat: 70, lon: -50 => [-200000, -2200000] in the locale projection EPSG:3413

    const cartesianCoordinate: [number, number] = appProj4("EPSG:4326", projection).forward([coordinate.lon, coordinate.lat])

    const inBounds = checkIfCoordinateIsWithinBounds(cartesianCoordinate, features[0].properties.geometry_epsg.coordinates[0])

    if (!inBounds) {
      //We have to search through the features using the cartesianCoordinate
      // @ts-ignore
      for (const feature of geoJsonFile.features) {
        // @ts-ignore
        const inBounds = checkIfCoordinateIsWithinBounds(cartesianCoordinate, feature.properties.geometry_epsg.coordinates[0])
        if (inBounds) {
          results.push({
            marker,
            zarrUrl: feature.properties.zarr_url,
            cartesianCoordinate,
          })
          break
        }
      }
      continue
    }


    results.push({
      marker,
      zarrUrl,
      cartesianCoordinate,
    })
  }
  return results
}
