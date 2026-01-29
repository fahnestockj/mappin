/**
 * Derives the composite zarr URL from a regular datacube zarr URL.
 *
 * Transformation:
 * - datacubes/ → composites/annual/
 * - v2-updated-october2024 → v2-updated-september2025
 * - ITS_LIVE_vel_ → ITS_LIVE_velocity_
 * - G0120 → 120m
 */
export function getCompositeUrl(zarrUrl: string): string {
  return zarrUrl
    .replace('datacubes/', 'composites/annual/')
    .replace('v2-updated-october2024', 'v2-updated-september2025')
    .replace('ITS_LIVE_vel_', 'ITS_LIVE_velocity_')
    .replace('G0120', '120m')
}
