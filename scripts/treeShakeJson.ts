import catalog_json from '../src/geoJson/catalog_v02.json'
import fs from 'node:fs'

function main() {

  const catalogJson = catalog_json
  const newFeatures = catalogJson.features.map((feature) => ({
    type: feature.type,
    properties: {
      "geometry_epsg": feature.properties.geometry_epsg,
      zarr_url: feature.properties.zarr_url,
      epsg: feature.properties.epsg,
    },
    geometry: feature.geometry,
  }))
  const newCatalogJson = {
    type: catalogJson.type,
    features: newFeatures,
  }
  fs.writeFileSync('../src/geoJson/stripped_catalog.json', JSON.stringify(newCatalogJson, null, 0))
}

main()