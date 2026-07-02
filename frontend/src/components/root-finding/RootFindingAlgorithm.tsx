import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import { DEMO_ITERATIONS } from './RootFindingStepAnimation'
import type { RootFindingIteration, RootFindingMethod } from '@/types/api.types'

type RFMethod = Extract<RootFindingMethod, 'bisection' | 'newton_raphson' | 'secant'>

type IterRow = RootFindingIteration & Record<string, unknown>

const BISECTION_COLS = [
  { key: 'iteration' as const, header: '#',       tooltip: 'Iteration number'        },
  { key: 'a'         as const, header: 'a',       tooltip: 'Lower bracket bound'     },
  { key: 'b'         as const, header: 'b',       tooltip: 'Upper bracket bound'     },
  { key: 'x'         as const, header: 'mid c',   tooltip: 'Midpoint c = (a+b)/2', highlight: true },
  { key: 'fx'        as const, header: 'f(c)',     tooltip: 'Function value at midpoint' },
  { key: 'error'     as const, header: 'error',   tooltip: 'Error bound (b−a)/2'    },
]

const NEWTON_COLS = [
  { key: 'iteration' as const, header: '#',        tooltip: 'Iteration number'       },
  { key: 'x'         as const, header: 'xₙ',       tooltip: 'Current iterate', highlight: true },
  { key: 'fx'        as const, header: 'f(xₙ)',    tooltip: 'Function value at xₙ'  },
  { key: 'x_new'     as const, header: 'xₙ₊₁',    tooltip: 'Next iterate', highlight: true },
  { key: 'error'     as const, header: '|Δx|',     tooltip: 'Step size |xₙ₊₁ − xₙ|' },
]

const SECANT_COLS = [
  { key: 'iteration' as const, header: '#',        tooltip: 'Iteration number'        },
  { key: 'x'         as const, header: 'xₙ',       tooltip: 'Current point', highlight: true },
  { key: 'fx'        as const, header: 'f(xₙ)',    tooltip: 'Function value at xₙ'   },
  { key: 'fx_new'    as const, header: 'f(xₙ₊₁)', tooltip: 'Function value at next iterate' },
  { key: 'x_new'     as const, header: 'xₙ₊₁',    tooltip: 'Next iterate', highlight: true },
  { key: 'error'     as const, header: '|Δx|',     tooltip: 'Step size |xₙ₊₁ − xₙ|' },
]

function getCols(method: RFMethod) {
  if (method === 'bisection')    return BISECTION_COLS
  if (method === 'newton_raphson') return NEWTON_COLS
  return SECANT_COLS
}

const fmtNum = (x: unknown) => {
  if (x === undefined || x === null) return '—'
  const n = Number(x)
  if (!isFinite(n)) return String(n)
  if (Number.isInteger(n)) return String(n)
  if (Math.abs(n) > 0.01 && Math.abs(n) < 1e5) return n.toFixed(8)
  return n.toExponential(4)
}

interface Props {
  method: RFMethod
}

export default function RootFindingAlgorithm({ method }: Props) {
  const iterations = DEMO_ITERATIONS[method] as IterRow[]
  const cols = getCols(method)
  const methodLabel = method === 'bisection' ? 'Bisection' : method === 'newton_raphson' ? 'Newton–Raphson' : 'Secant'

  return (
    <AlgorithmExecution<IterRow>
      iterations={iterations}
      columns={cols.map((c) => ({ ...c, format: (v) => fmtNum(v) }))}
      status="converged"
      convergedAt={iterations.length - 1}
      description={`Step-by-step ${methodLabel} iteration table for the demonstration problem f(x) = x³ − x − 2.`}
      executionLog={[
        `Method: ${methodLabel}`,
        `Demonstration function: f(x) = x³ − x − 2`,
        `Iterations: ${iterations.length}`,
      ]}
    />
  )
}
