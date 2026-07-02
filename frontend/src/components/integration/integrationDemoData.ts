import type { IntegMethod } from './IntegrationVisualization'

export const DEMO_FN    = Math.sin
export const DEMO_EXACT = 2.0
export const DEMO_A     = 0
export const DEMO_B     = Math.PI

export const METHOD_COLOR: Record<IntegMethod, string> = {
  trapezoidal:       '#60a5fa',
  simpsons:          '#34d399',
  gaussian_quadrature: '#f59e0b',
}

export const METHOD_LABEL: Record<IntegMethod, string> = {
  trapezoidal:       'Trapezoidal',
  simpsons:          "Simpson's",
  gaussian_quadrature: 'Gaussian Quadrature',
}

export const GAUSS: Record<number, { x: number[]; w: number[] }> = {
  1: { x: [0], w: [2] },
  2: { x: [-0.5773502692, 0.5773502692], w: [1, 1] },
  3: { x: [-0.7745966692, 0, 0.7745966692], w: [0.5555555556, 0.8888888889, 0.5555555556] },
  4: { x: [-0.8611363116, -0.3399810436, 0.3399810436, 0.8611363116], w: [0.3478548451, 0.6521451549, 0.6521451549, 0.3478548451] },
  5: { x: [-0.9061798459, -0.5384693101, 0, 0.5384693101, 0.9061798459], w: [0.2369268851, 0.4786286705, 0.5688888889, 0.4786286705, 0.2369268851] },
}
