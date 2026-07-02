import type { DifferentiationMethod } from '@/types/api.types'

export type DiffMethod = Extract<DifferentiationMethod, 'forward' | 'backward' | 'central'>

export const DEMO_FN  = Math.sin
export const DEMO_DFN = Math.cos
export const DEMO_X   = 1.0
export const DEMO_LABEL = 'sin(x), x = 1'
export const DEMO_H = 0.01

export const METHOD_COLOR: Record<DiffMethod, string> = {
  forward:  '#60a5fa',
  backward: '#f87171',
  central:  '#34d399',
}

const fmt = (v: unknown) => {
  if (v === undefined || v === null) return '—'
  const n = Number(v)
  if (!isFinite(n)) return String(n)
  if (Math.abs(n) > 1e-3 && Math.abs(n) < 1e5) return n.toPrecision(8)
  return n.toExponential(4)
}

export function computeDerivative(method: DiffMethod, h: number = DEMO_H) {
  let derivative: number
  if (method === 'forward') {
    derivative = (DEMO_FN(DEMO_X + h) - DEMO_FN(DEMO_X)) / h
  } else if (method === 'backward') {
    derivative = (DEMO_FN(DEMO_X) - DEMO_FN(DEMO_X - h)) / h
  } else {
    derivative = (DEMO_FN(DEMO_X + h) - DEMO_FN(DEMO_X - h)) / (2 * h)
  }
  const exact = DEMO_DFN(DEMO_X)
  const absoluteError = Math.abs(derivative - exact)
  const relativeError = exact !== 0 ? absoluteError / Math.abs(exact) : 0
  return { derivative, exact, absoluteError, relativeError, fmt }
}
