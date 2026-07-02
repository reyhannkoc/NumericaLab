import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import type { IntegMethod } from './IntegrationVisualization'
import { DEMO_FN, DEMO_A, DEMO_B, METHOD_LABEL, GAUSS } from './integrationDemoData'

const DEMO_N = 8

interface Props {
  method: IntegMethod
}

type IntervalRow = Record<string, unknown> & {
  strip: number
  x_start: string
  x_end: string
  area: string
  cumulative: string
}

type GaussRow = Record<string, unknown> & {
  i: number
  node: string
  weight: string
}

function buildIntervalRows(method: 'trapezoidal' | 'simpsons'): { rows: IntervalRow[]; value: number } {
  const a = DEMO_A, b = DEMO_B
  const rows: IntervalRow[] = []
  let cum = 0

  if (method === 'trapezoidal') {
    const n = DEMO_N
    const h = (b - a) / n
    for (let i = 0; i < n; i++) {
      const x0 = a + i * h, x1 = a + (i + 1) * h
      const area = (DEMO_FN(x0) + DEMO_FN(x1)) * h / 2
      cum += area
      rows.push({ strip: i + 1, x_start: x0.toFixed(6), x_end: x1.toFixed(6), area: area.toFixed(10), cumulative: cum.toFixed(10) })
    }
    return { rows, value: cum }
  }

  // Simpson's — pairs of subintervals
  const n = DEMO_N % 2 === 0 ? DEMO_N : DEMO_N + 1
  const h = (b - a) / n
  let value = 0
  for (let i = 0, strip = 1; i < n; i += 2, strip++) {
    const x0 = a + i * h, x1 = a + (i + 1) * h, x2 = a + (i + 2) * h
    const area = (h / 3) * (DEMO_FN(x0) + 4 * DEMO_FN(x1) + DEMO_FN(x2))
    cum += area
    value += area
    rows.push({ strip, x_start: x0.toFixed(6), x_end: x2.toFixed(6), area: area.toFixed(10), cumulative: cum.toFixed(10) })
  }
  return { rows, value }
}

function buildGaussRows(): { rows: GaussRow[]; value: number } {
  const g = GAUSS[5]
  const scale = (DEMO_B - DEMO_A) / 2, shift = (DEMO_A + DEMO_B) / 2
  let value = 0
  const rows: GaussRow[] = g.x.map((xi, i) => {
    const x = scale * xi + shift
    value += g.w[i] * DEMO_FN(x) * scale
    return { i: i + 1, node: x.toFixed(10), weight: (g.w[i] * scale).toFixed(10) }
  })
  return { rows, value }
}

export default function IntegrationAlgorithm({ method }: Props) {
  const label = METHOD_LABEL[method]

  if (method === 'gaussian_quadrature') {
    const { rows, value } = buildGaussRows()
    return (
      <AlgorithmExecution
        iterations={rows}
        columns={[
          { key: 'i' as keyof GaussRow, header: '#' },
          { key: 'node' as keyof GaussRow, header: 'Node xᵢ' },
          { key: 'weight' as keyof GaussRow, header: 'Weight wᵢ', highlight: true },
        ]}
        status="converged"
        executionLog={[
          `Method: ${label}`,
          `∫ sin(x) dx from ${DEMO_A} to ${DEMO_B.toFixed(5)}`,
          `Result: ${value.toFixed(10)}`,
        ]}
        description="Gauss nodes and weights for the demonstration integral."
      />
    )
  }

  const { rows, value } = buildIntervalRows(method)
  return (
    <AlgorithmExecution
      iterations={rows}
      columns={[
        { key: 'strip' as keyof IntervalRow, header: 'Strip' },
        { key: 'x_start' as keyof IntervalRow, header: 'x_start' },
        { key: 'x_end' as keyof IntervalRow, header: 'x_end' },
        { key: 'area' as keyof IntervalRow, header: 'Area', highlight: true },
        { key: 'cumulative' as keyof IntervalRow, header: 'Cumulative' },
      ]}
      status="converged"
      executionLog={[
        `Method: ${label}`,
        `∫ sin(x) dx from ${DEMO_A} to ${DEMO_B.toFixed(5)}`,
        `n = ${DEMO_N}`,
        `Result: ${value.toFixed(10)}`,
      ]}
      description="Integration strips for the demonstration integral ∫₀π sin(x) dx = 2."
    />
  )
}
