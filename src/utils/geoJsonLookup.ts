//@ts-ignore
import GeoJsonGeometriesLookup from "geojson-geometries-lookup";
import { ICoordinate } from "../components/Velmap";
import geoJsonFile from "../geoJson/catalog_v02.json";

export function geoJsonLookup(coordinates: Array<ICoordinate>) {
  const results = []
  const glookup = new GeoJsonGeometriesLookup(geoJsonFile);
  /**
   * NOTE: the geoJson comes with a coordiantes attribute that defines the bounds of the box IN THE CUBES PROJECTION
   * You can check if you're in the wrong cube, and then index through the geoJson to find the right one
   */
  for (const coordinate of coordinates) {
    const point = { type: "Point", coordinates: [coordinate.lng, coordinate.lat] };
    const features = glookup.getContainers(point).features;
    // console.log(features);
    if (features.length === 0 || features.length > 1) {
      throw new Error("No features found or more than one feature found")
    }
    const zarrUrl = features[0].properties.zarr_url
    const projection = features[0].properties.data_epsg
    results.push({
      coordinate,
      zarrUrl,
      projection,
    })
  }
  return results
}
