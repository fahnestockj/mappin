// @ts-nocheck
import catalog_json from '../src/geoJson/catalog_v2.json'
import fs from 'node:fs'
function main() {

  const catalogJson = catalog_json
  const newFeatures = catalogJson.features.map((feature) => {
    const httpUrl = feature.properties.zarr_url as string
    const httpsUrl = httpUrl.replace('http://', 'https://')
    return {
      type: feature.type,
      properties: {
        "geometry_epsg": feature.properties.geometry_epsg,
        zarr_url: httpsUrl,
        epsg: feature.properties.epsg,
      },
      geometry: feature.geometry,
    }
  })
  const newCatalogJson = {
    type: catalogJson.type,
    features: newFeatures,
  }
  fs.writeFileSync('../src/geoJson/stripped_catalog.json', JSON.stringify(newCatalogJson, null, 0))
}

main()