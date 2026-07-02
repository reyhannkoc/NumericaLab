import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import { buildGSFrames, buildGDFrames } from './optimizationDemoData'
import type { OptMethodProp } from './OptimizationVisualization'

interface Props {
  method: OptMethodProp
}

type Row = Record<string, unknown> & { k: number; x: string; fx: string; extra: string }

const METHOD_LABEL: Record<OptMethodProp, string> = {
  golden_section:   'Golden Section Search',
  gradient_descent: 'Gradient Descent',
}

export default function OptimizationAlgorithm({ method }: Props) {
  const label = METHOD_LABEL[method]

  const rows: Row[] = method === 'golden_section'
    ? buildGSFrames().map((f) => ({
        k: f.step,
        x: `[${f.a.toFixed(5)}, ${f.b.toFixed(5)}]`,
        fx: (f.b - f.a).toExponential(3),
        extra: f.desc,
      }))
    : buildGDFrames().map((f) => ({
        k: f.step,
        x: f.x.toFixed(6),
        fx: f.fx.toFixed(8),
        extra: Math.abs(f.grad).toExponential(3),
      }))

  const columns = method === 'golden_section'
    ? [
        { key: 'k'     as keyof Row, header: 'Step' },
        { key: 'x'     as keyof Row, header: 'Bracket [a, b]', highlight: true },
        { key: 'fx'    as keyof Row, header: 'Width' },
        { key: 'extra' as keyof Row, header: 'Description' },
      ]
    : [
        { key: 'k'     as keyof Row, header: 'k' },
        { key: 'x'     as keyof Row, header: 'xₖ', highlight: true },
        { key: 'fx'    as keyof Row, header: 'f(xₖ)', highlight: true },
        { key: 'extra' as keyof Row, header: '‖grad‖' },
      ]

  return (
    <AlgorithmExecution
      iterations={rows}
      columns={columns}
      status="converged"
      description={`${label} iteration history for the demonstration function f(x) = (x−2)² on [0, 4].`}
    />
  )
}
