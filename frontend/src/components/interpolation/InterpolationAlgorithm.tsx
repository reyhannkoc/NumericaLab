import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import {
  type InterpMethod,
  LAGRANGE_XS, LAGRANGE_YS, LAGRANGE_QUERY,
  SPLINE_XS, SPLINE_YS, SPLINE_QUERY,
  lagrangeEval, naturalSplineSecondDerivs, buildSplineSegments,
} from './interpolationDemoData'

const fmt = (x: unknown) => {
  if (x === undefined || x === null) return '—'
  const n = Number(x)
  if (!isFinite(n)) return String(n)
  if (Number.isInteger(n)) return String(n)
  if (Math.abs(n) > 0.001 && Math.abs(n) < 1e5) return n.toFixed(6)
  return n.toExponential(4)
}

interface Props {
  method: InterpMethod
}

export default function InterpolationAlgorithm({ method }: Props) {
  if (method === 'lagrange') {
    const rows = LAGRANGE_QUERY.map((x, i) => ({
      idx: i + 1,
      x,
      y: lagrangeEval(LAGRANGE_XS, LAGRANGE_YS, x),
    }))

    return (
      <AlgorithmExecution<Record<string, unknown>>
        iterations={rows as unknown as Record<string, unknown>[]}
        columns={[
          { key: 'idx' as never, header: '#',    tooltip: 'Query index' },
          { key: 'x'   as never, header: 'x',    tooltip: 'Query x',    highlight: true, format: (v) => fmt(v) },
          { key: 'y'   as never, header: 'P(x)', tooltip: 'Lagrange polynomial value at x', highlight: true, format: (v) => fmt(v) },
        ]}
        status="converged"
        description="Lagrange polynomial P(x) evaluated at each query point for the demonstration dataset y = x²."
        executionLog={[
          'Method: Lagrange polynomial',
          `Data points: ${LAGRANGE_XS.length}`,
          `Query points: ${LAGRANGE_QUERY.length}`,
        ]}
      />
    )
  }

  const y2 = naturalSplineSecondDerivs(SPLINE_XS, SPLINE_YS)
  const segments = buildSplineSegments(SPLINE_XS, SPLINE_YS, y2).map((seg, i) => ({ ...seg, idx: i }))

  return (
    <AlgorithmExecution<Record<string, unknown>>
      iterations={segments as unknown as Record<string, unknown>[]}
      columns={[
        { key: 'idx'     as never, header: 'Seg',   tooltip: 'Segment index' },
        { key: 'x_start' as never, header: 'x_i',   tooltip: 'Segment start', format: (v) => fmt(v) },
        { key: 'x_end'   as never, header: 'x_i+1', tooltip: 'Segment end',   format: (v) => fmt(v) },
        { key: 'a'       as never, header: 'a',      tooltip: 'Constant term a = y_i',               highlight: true, format: (v) => fmt(v) },
        { key: 'b'       as never, header: 'b',      tooltip: 'Linear coefficient',                  format: (v) => fmt(v) },
        { key: 'c'       as never, header: 'c',      tooltip: 'Quadratic coefficient',               format: (v) => fmt(v) },
        { key: 'd'       as never, header: 'd',      tooltip: 'Cubic coefficient',                   highlight: true, format: (v) => fmt(v) },
      ]}
      status="converged"
      description="Spline coefficients: S_i(x) = a + b(x−x_i) + c(x−x_i)² + d(x−x_i)³ for each segment of the demonstration dataset."
      executionLog={[
        'Method: Natural Cubic Spline',
        `Segments: ${segments.length}`,
        `Query points: ${SPLINE_QUERY.length}`,
        'Boundary conditions: natural (S\'\'=0 at endpoints)',
      ]}
    />
  )
}
