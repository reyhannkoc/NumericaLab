import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import { EXACT, buildEulerFrames, buildRK4Frames } from './odeDemoData'
import type { ODEMethodProp } from './ODEVisualization'

interface Props {
  method: ODEMethodProp
}

type IterRow = Record<string, unknown> & { k: number; x: string; y: string; err: string }

const METHOD_LABEL: Record<ODEMethodProp, string> = {
  euler:          "Euler's Method",
  runge_kutta_4:  'Runge-Kutta 4',
}

export default function ODEAlgorithm({ method }: Props) {
  const frames = method === 'euler' ? buildEulerFrames() : buildRK4Frames()
  const label = METHOD_LABEL[method]

  const rows: IterRow[] = frames.map((f) => ({
    k: f.stepIdx,
    x: f.x_cur.toFixed(6),
    y: f.y_cur.toFixed(8),
    err: Math.abs(f.y_cur - EXACT(f.x_cur)).toExponential(4),
  }))

  const columns = [
    { key: 'k'   as keyof IterRow, header: 'k' },
    { key: 'x'   as keyof IterRow, header: 'x' },
    { key: 'y'   as keyof IterRow, header: 'y(x)', highlight: true },
    { key: 'err' as keyof IterRow, header: '|error|' },
  ]

  return (
    <AlgorithmExecution
      iterations={rows}
      columns={columns}
      status="converged"
      description={`${label} step-by-step solution table for the demonstration IVP dy/dx = y, y(0) = 1.`}
    />
  )
}
