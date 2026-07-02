import type { InterpolationMethod } from '@/types/api.types'

export type InterpMethod = Extract<InterpolationMethod, 'lagrange' | 'cubic_spline'>

// ─── Fixed demo datasets ───────────────────────────────────────────────────────

export const LAGRANGE_XS: number[] = [0, 1, 2, 3, 4]
export const LAGRANGE_YS: number[] = [0, 1, 4, 9, 16]
export const LAGRANGE_QUERY: number[] = [0.5, 1.5, 2.5, 3.5]

export const SPLINE_XS: number[] = [0, 1, 2, 3, 4, 5]
export const SPLINE_YS: number[] = [0, 0.8415, 0.9093, 0.1411, -0.7568, -0.9589]
export const SPLINE_QUERY: number[] = [0.5, 1.5, 2.5, 3.5, 4.5]

// ─── Local math: Lagrange & natural cubic spline ───────────────────────────────

export function lagrangeEval(xs: number[], ys: number[], x: number): number {
  let total = 0
  for (let i = 0; i < xs.length; i++) {
    let term = ys[i]
    for (let j = 0; j < xs.length; j++) {
      if (j !== i) term *= (x - xs[j]) / (xs[i] - xs[j])
    }
    total += term
  }
  return total
}

export function naturalSplineSecondDerivs(xs: number[], ys: number[]): number[] {
  const n = xs.length
  const y2 = new Array(n).fill(0)
  const u = new Array(n).fill(0)
  for (let i = 1; i < n - 1; i++) {
    const sig = (xs[i] - xs[i - 1]) / (xs[i + 1] - xs[i - 1])
    const p = sig * y2[i - 1] + 2
    y2[i] = (sig - 1) / p
    u[i] = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]) - (ys[i] - ys[i - 1]) / (xs[i] - xs[i - 1])
    u[i] = (6 * u[i] / (xs[i + 1] - xs[i - 1]) - sig * u[i - 1]) / p
  }
  for (let k = n - 2; k >= 0; k--) {
    y2[k] = y2[k] * y2[k + 1] + u[k]
  }
  return y2
}

export function splineEval(xs: number[], ys: number[], y2: number[], x: number): number {
  const n = xs.length
  let klo = 0, khi = n - 1
  while (khi - klo > 1) {
    const k = (khi + klo) >> 1
    if (xs[k] > x) khi = k
    else klo = k
  }
  const h = xs[khi] - xs[klo]
  const a = (xs[khi] - x) / h
  const b = (x - xs[klo]) / h
  return a * ys[klo] + b * ys[khi] + ((a ** 3 - a) * y2[klo] + (b ** 3 - b) * y2[khi]) * (h * h) / 6
}

/** Natural cubic spline segment coefficients: S_i(x) = a + b(x-x_i) + c(x-x_i)² + d(x-x_i)³ */
export interface SplineSegmentRow {
  x_start: number
  x_end: number
  a: number
  b: number
  c: number
  d: number
}

export function buildSplineSegments(xs: number[], ys: number[], y2: number[]): SplineSegmentRow[] {
  const segments: SplineSegmentRow[] = []
  for (let i = 0; i < xs.length - 1; i++) {
    const h = xs[i + 1] - xs[i]
    segments.push({
      x_start: xs[i],
      x_end: xs[i + 1],
      a: ys[i],
      b: (ys[i + 1] - ys[i]) / h - (h * (2 * y2[i] + y2[i + 1])) / 6,
      c: y2[i] / 2,
      d: (y2[i + 1] - y2[i]) / (6 * h),
    })
  }
  return segments
}

export function buildDemoCurve(method: InterpMethod) {
  const xs = method === 'lagrange' ? LAGRANGE_XS : SPLINE_XS
  const ys = method === 'lagrange' ? LAGRANGE_YS : SPLINE_YS
  const queryPoints = method === 'lagrange' ? LAGRANGE_QUERY : SPLINE_QUERY
  const y2 = method === 'cubic_spline' ? naturalSplineSecondDerivs(xs, ys) : []

  const evalAt = (x: number) => method === 'lagrange'
    ? lagrangeEval(xs, ys, x)
    : splineEval(xs, ys, y2, x)

  const N = 150
  const xMin = xs[0], xMax = xs[xs.length - 1]
  const curveX = Array.from({ length: N }, (_, i) => xMin + (xMax - xMin) * i / (N - 1))
  const curveY = curveX.map(evalAt)
  const interpolatedValues = queryPoints.map(evalAt)

  return { curveX, curveY, queryPoints, interpolatedValues }
}
