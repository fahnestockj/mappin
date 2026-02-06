# Mappin

A web-based tool for visualizing glacier ice flow velocity data from NASA's [ITS_LIVE](https://its-live.jpl.nasa.gov/) (Inter-mission Time Series of Land Ice Velocity and Elevation) project.

## Features

- **Interactive Map**: Place markers anywhere on the globe to query ice velocity data
- **Time Series Visualization**: View velocity measurements over time with multiple display modes (default, by satellite, annual composite)
- **Data Filtering**: Filter measurements by collection interval
- **Data Export**: Download time series data as CSV files
- **Satellite Imagery**: View corresponding satellite images for data points
- **URL Sharing**: Share analysis sessions via URL

## Tech Stack

- React + TypeScript + Vite
- Leaflet for mapping
- Plotly.js for charts
- Zarr.js for reading cloud-hosted scientific data


## How It Works

Mappin reads ice velocity datacubes stored in Zarr format on AWS S3. When you place a marker on the map, it queries the relevant datacube and displays velocity measurements from multiple satellite missions (Sentinel-1/2, Landsat 4-9) spanning several decades.

## Attributions

- **Data**: Velocity data generated using auto-RIFT (Gardner et al., 2018) and provided by the NASA MEaSUREs [ITS_LIVE](https://its-live.jpl.nasa.gov/) project (Gardner et al., 2019).
  > Gardner, A. S., M. A. Fahnestock, and T. A. Scambos, 2019: ITS_LIVE Regional Glacier and Ice Sheet Surface Velocities: Version 1. Data archived at National Snow and Ice Data Center. https://doi.org/10.5067/6II6VW8LLWJ7
- **Imagery**: Satellite imagery provided by [Esri](https://www.esri.com/)
- **Mapping**: Built with [Leaflet](https://leafletjs.com/)

## License

MIT
