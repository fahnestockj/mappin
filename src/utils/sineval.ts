/**
 * Evaluates a sinusoid of specified amplitude and phase with a frequency of 1/yr.
 * This is a TypeScript port of the MATLAB sineval function from ITS_LIVE.
 *
 * @param vAmp - Amplitude of the sinusoid (v_amp from composite data)
 * @param vPhase - Day of year corresponding to the maximum value (v_phase from composite data)
 * @param date - Date to evaluate the sinusoid at
 * @returns The sinusoidal component of velocity at the given date
 */
export function sineval(vAmp: number, vPhase: number, date: Date): number {
  // Normalize phase: ph = 0.25 - vPhase/365.25
  const ph = 0.25 - vPhase / 365.25

  // Convert date to decimal year
  const decimalYear = dateToDecimalYear(date)

  // Evaluate sinusoid: y = A * sin((yr + ph) * 2 * pi)
  return vAmp * Math.sin((decimalYear + ph) * 2 * Math.PI)
}

/**
 * Converts a Date to a decimal year (e.g., 2020.5 for mid-2020)
 */
export function dateToDecimalYear(date: Date): number {
  const year = date.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const endOfYear = new Date(year + 1, 0, 1)
  const yearLength = endOfYear.getTime() - startOfYear.getTime()
  const elapsed = date.getTime() - startOfYear.getTime()
  return year + elapsed / yearLength
}

/**
 * Generates fitted velocity timeseries by interpolating annual velocities
 * and adding the seasonal sine wave component.
 *
 * @param annualV - Array of annual velocity values
 * @param annualTime - Array of dates for annual velocities (typically mid-year)
 * @param vAmp - Amplitude of seasonal variation
 * @param vPhase - Phase (day of year of maximum)
 * @param outputDates - Array of dates to generate fitted values for
 * @returns Array of fitted velocity values
 */
export function generateFittedTimeseries(
  annualV: number[],
  annualTime: Date[],
  vAmp: number,
  vPhase: number,
  outputDates: Date[]
): number[] {
  if (annualV.length === 0 || annualTime.length === 0) {
    return []
  }

  // Convert annual times to decimal years for interpolation
  const annualDecimalYears = annualTime.map(dateToDecimalYear)

  return outputDates.map((date) => {
    const decimalYear = dateToDecimalYear(date)

    // Linear interpolation of annual velocities
    const interpV = linearInterp(annualDecimalYears, annualV, decimalYear)

    // Add seasonal component (only if vAmp is valid)
    const seasonal = !isNaN(vAmp) && !isNaN(vPhase) ? sineval(vAmp, vPhase, date) : 0

    return interpV + seasonal
  })
}

/**
 * Simple linear interpolation with extrapolation for out-of-bounds values
 */
function linearInterp(xs: number[], ys: number[], x: number): number {
  if (xs.length === 0 || ys.length === 0) return NaN
  if (xs.length === 1) return ys[0]

  // Find the two points to interpolate between
  let i = 0
  while (i < xs.length - 1 && xs[i + 1] < x) {
    i++
  }

  // Clamp to valid range for extrapolation
  if (i >= xs.length - 1) i = xs.length - 2
  if (i < 0) i = 0

  const x0 = xs[i]
  const x1 = xs[i + 1]
  const y0 = ys[i]
  const y1 = ys[i + 1]

  // Linear interpolation formula
  const t = (x - x0) / (x1 - x0)
  return y0 + t * (y1 - y0)
}

/**
 * Generates a dense array of dates for plotting the fitted curve
 */
export function generateDenseDates(startDate: Date, endDate: Date, numPoints: number = 365): Date[] {
  const dates: Date[] = []
  const startTime = startDate.getTime()
  const endTime = endDate.getTime()
  const step = (endTime - startTime) / (numPoints - 1)

  for (let i = 0; i < numPoints; i++) {
    dates.push(new Date(startTime + i * step))
  }

  return dates
}
