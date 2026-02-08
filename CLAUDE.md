# CLAUDE.md

## Overview

Interactive web app for exploring glacier ice velocity data from NASA's ITS_LIVE project. Users click on a Leaflet map to place markers, which triggers fetching time-series velocity data from remote Zarr datacubes. The data is displayed as Plotly scatter plots showing ice flow speed over time (satellite observations from 1985-present). Supports up to 11 simultaneous markers with color-coded traces.

Key data flow: map click -> GeoJSON spatial lookup to find the right Zarr datacube -> Proj4 coordinate transformation (WGS84 to datacube's local EPSG projection) -> fetch velocity/date arrays from Zarr -> render in Plotly chart.

App state (marker coordinates, chart bounds, filters) is encoded in URL search params so links are shareable.

## Tech Stack

React 18 + TypeScript, Vite, Tailwind CSS, Leaflet/React-Leaflet (map), Plotly.js GL2D (charts), Zarr (scientific data), Formik (forms), Zod (validation), Immer (immutable updates).

## Commands

- **Typecheck**: `npm run typecheck`
- **Dev server**: `npm run dev`
- **Build**: `npm run build`

## Code Layout

- `src/components/` - React UI components (map, chart, modals, marker table)
- `src/getTimeseries/` - Data fetching (Zarr reads, spatial lookup, projection transforms)
- `src/utils/` - Helpers (URL param parsing, SVG assets, sine-wave fitting)
- `src/geoJson/` - GeoJSON boundaries defining datacube coverage areas
- `src/getImageUrl/` - Satellite image URL resolution
