import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import type { PlaygroundPreset } from '@/types/lesson.types'
import type { RootFindingResult, RootFindingMethod, RootFindingIteration } from '@/types/api.types'

type RFMethod = Extract<RootFindingMethod, 'bisection' | 'newton_raphson' | 'secant'>

// ─── Props ────────────────────────────────────────────────────────────────────

export interface RootFindingPlaygroundProps {
  method: RFMethod
  expression: string
  onExpressionChange: (v: string) => void
  // Bisection
  a?: number
  onAChange?: (v: number) => void
  b?: number
  onBChange?: (v: number) => void
  // Newton + Secant initial guesses
  x0?: number
  onX0Change?: (v: number) => void
  x1?: number
  onX1Change?: (v: number) => void
  // Common
  tolerance: number
  onToleranceChange: (v: number) => void
  maxIterations: number
  onMaxIterationsChange: (v: number) => void
  result: RootFindingResult | null
  isLoading: boolean
  onSolve: () => void
  onReset: () => void
}

// ─── Presets per method ───────────────────────────────────────────────────────

const BISECTION_PRESETS: PlaygroundPreset[] = [
  { id: 'b1', label: 'x³−x−2',   description: 'Classic cubic, root ≈ 1.521',       params: { expression: 'x**3 - x - 2',      a: 1,   b: 2,   tol: 1e-8 } },
  { id: 'b2', label: 'cos x − x', description: 'Dottie number, root ≈ 0.739',      params: { expression: 'cos(x) - x',        a: 0,   b: 1.5, tol: 1e-8 } },
  { id: 'b3', label: 'eˣ − 3x',  description: 'Root near x = 0.619',               params: { expression: 'exp(x) - 3*x',      a: 0,   b: 1,   tol: 1e-8 } },
  { id: 'b4', label: 'IRR 3yr',   description: 'Find IRR of 3-year cash flow project', params: { expression: '-10000 + 3000/(1+x) + 5000/(1+x)**2 + 4000/(1+x)**3', a: 0.001, b: 0.5, tol: 1e-8 } },
  { id: 'b5', label: 'Diode',     description: 'Diode circuit: V − 5 + 1000*1e-14*(exp(V/0.026)-1) = 0', params: { expression: 'x - 5 + 1000*1e-14*(exp(x/0.026)-1)', a: 0, b: 1, tol: 1e-10 } },
]

const NEWTON_PRESETS: PlaygroundPreset[] = [
  { id: 'n1', label: 'x³−x−2',   description: 'Classic cubic, start x₀ = 1.5',       params: { expression: 'x**3 - x - 2',  x0: 1.5,  tol: 1e-12 } },
  { id: 'n2', label: 'cos x − x', description: 'Dottie number, start x₀ = 0.5',      params: { expression: 'cos(x) - x',    x0: 0.5,  tol: 1e-12 } },
  { id: 'n3', label: 'Kepler',    description: "Kepler's equation, e=0.5, M=π/3",     params: { expression: 'x - 0.5*sin(x) - 1.0472', x0: 1.047, tol: 1e-12 } },
  { id: 'n4', label: 'eˣ − 3x',  description: 'Root near x = 1.51, start x₀ = 1.2', params: { expression: 'exp(x) - 3*x',  x0: 1.2,  tol: 1e-12 } },
  { id: 'n5', label: '√2',        description: 'x² − 2 = 0, classical √2 example',    params: { expression: 'x**2 - 2',      x0: 2.0,  tol: 1e-12 } },
]

const SECANT_PRESETS: PlaygroundPreset[] = [
  { id: 's1', label: 'x³−x−2',   description: 'Classic cubic, x₀=1, x₁=2',          params: { expression: 'x**3 - x - 2', x0: 1.0,  x1: 2.0,  tol: 1e-12 } },
  { id: 's2', label: 'cos x − x', description: 'Dottie number, x₀=0, x₁=1',         params: { expression: 'cos(x) - x',   x0: 0.0,  x1: 1.0,  tol: 1e-12 } },
  { id: 's3', label: 'eˣ − 3x',  description: 'Root near 0.619, x₀=0.5, x₁=0.8',   params: { expression: 'exp(x) - 3*x', x0: 0.5,  x1: 0.8,  tol: 1e-12 } },
  { id: 's4', label: '√2',        description: 'x² − 2 = 0, x₀=1, x₁=3',            params: { expression: 'x**2 - 2',     x0: 1.0,  x1: 3.0,  tol: 1e-12 } },
  { id: 's5', label: 'x·eˣ − 1', description: 'x·eˣ − 1 = 0, Omega constant ≈ 0.567', params: { expression: 'x*exp(x) - 1', x0: 0.4, x1: 0.8, tol: 1e-12 } },
]

function getPresets(method: RFMethod): PlaygroundPreset[] {
  if (method === 'bisection')    return BISECTION_PRESETS
  if (method === 'newton_raphson') return NEWTON_PRESETS
  return SECANT_PRESETS
}

// ─── Table columns per method ─────────────────────────────────────────────────

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

// ─── Number formatting ────────────────────────────────────────────────────────

const fmtNum = (x: unknown) => {
  if (x === undefined || x === null) return '—'
  const n = Number(x)
  if (!isFinite(n)) return String(n)
  if (Number.isInteger(n)) return String(n)
  if (Math.abs(n) > 0.01 && Math.abs(n) < 1e5) return n.toFixed(8)
  return n.toExponential(4)
}

// ─── Tolerance options ────────────────────────────────────────────────────────

const TOL_OPTIONS = [
  { label: '10⁻⁴',  value: 1e-4  },
  { label: '10⁻⁶',  value: 1e-6  },
  { label: '10⁻⁸',  value: 1e-8  },
  { label: '10⁻¹⁰', value: 1e-10 },
  { label: '10⁻¹²', value: 1e-12 },
]

// ─── Result summary card ──────────────────────────────────────────────────────

function ResultSummary({ result }: { result: RootFindingResult }) {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Solve Result</span>
        <span className={clsx(
          'text-xs px-2.5 py-1 rounded-full border font-medium',
          result.converged
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400',
        )}>
          {result.converged ? '✓ Converged' : '✗ Did not converge'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Root x*',       value: result.root.toPrecision(10),          color: 'text-brand-300'  },
          { label: 'Final error',   value: result.final_error.toExponential(3),  color: 'text-rose-400'   },
          { label: 'Iterations',    value: String(result.total_iterations),      color: 'text-amber-400'  },
          { label: 'Time',          value: `${result.execution_time_ms.toFixed(2)} ms`, color: 'text-slate-300' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg bg-surface-card p-3 text-center">
            <div className={clsx('text-sm font-mono font-semibold', color)}>{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Controls per method ──────────────────────────────────────────────────────

function fieldRow(label: string, node: ReactNode) {
  return (
    <div>
      <label className="section-label mb-1.5 block">{label}</label>
      {node}
    </div>
  )
}

function numInput(value: number, onChange: (v: number) => void, props?: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number" step="any"
      value={value}
      onChange={(e) => { const n = parseFloat(e.target.value); if (isFinite(n)) onChange(n) }}
      className="input-field w-full font-mono"
      {...props}
    />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RootFindingPlayground(props: RootFindingPlaygroundProps) {
  const {
    method, expression, onExpressionChange,
    a, onAChange, b, onBChange,
    x0, onX0Change, x1, onX1Change,
    tolerance, onToleranceChange,
    maxIterations, onMaxIterationsChange,
    result, isLoading, onSolve, onReset,
  } = props

  const presets = getPresets(method)
  const cols    = getCols(method)

  const handlePreset = (preset: PlaygroundPreset) => {
    const p = preset.params
    if (typeof p['expression'] === 'string') onExpressionChange(p['expression'])
    if (typeof p['a'] === 'number' && onAChange) onAChange(p['a'])
    if (typeof p['b'] === 'number' && onBChange) onBChange(p['b'])
    if (typeof p['x0'] === 'number' && onX0Change) onX0Change(p['x0'])
    if (typeof p['x1'] === 'number' && onX1Change) onX1Change(p['x1'])
    if (typeof p['tol'] === 'number') onToleranceChange(p['tol'])
    onReset()
  }

  const methodLabel = method === 'bisection' ? 'Bisection' : method === 'newton_raphson' ? 'Newton–Raphson' : 'Secant'

  const controls = (
    <div className="space-y-4">
      {fieldRow('Function f(x) =', (
        <input
          type="text"
          value={expression}
          onChange={(e) => { onExpressionChange(e.target.value); onReset() }}
          className="input-field w-full font-mono"
          placeholder="e.g. x**3 - x - 2"
        />
      ))}

      {/* Method-specific params */}
      {method === 'bisection' && (
        <div className="grid grid-cols-2 gap-3">
          {fieldRow('a (lower bound)', numInput(a ?? 1, (v) => onAChange?.(v)))}
          {fieldRow('b (upper bound)', numInput(b ?? 2, (v) => onBChange?.(v)))}
        </div>
      )}

      {method === 'newton_raphson' && (
        fieldRow('x₀ (initial guess)', numInput(x0 ?? 1.5, (v) => onX0Change?.(v)))
      )}

      {method === 'secant' && (
        <div className="grid grid-cols-2 gap-3">
          {fieldRow('x₀ (first guess)', numInput(x0 ?? 1.0, (v) => onX0Change?.(v)))}
          {fieldRow('x₁ (second guess)', numInput(x1 ?? 2.0, (v) => onX1Change?.(v)))}
        </div>
      )}

      {/* Tolerance */}
      <div>
        <label className="section-label mb-1.5 block">Tolerance ε</label>
        <div className="flex flex-wrap gap-1.5">
          {TOL_OPTIONS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => onToleranceChange(value)}
              className={clsx(
                'px-2.5 py-1 rounded text-xs font-mono transition-colors',
                tolerance === value
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Max iterations */}
      {fieldRow('Max iterations', numInput(maxIterations, onMaxIterationsChange, { min: 5, max: 200, step: 5 }))}
    </div>
  )

  const iterRows = result?.iterations as IterRow[] ?? []

  const resultsPanel = result ? (
    <div className="space-y-4">
      <ResultSummary result={result} />
    </div>
  ) : undefined

  const algoStatus = result
    ? result.converged ? 'converged' as const : 'diverged' as const
    : 'idle' as const

  return (
    <>
      <InteractivePlayground
        description={`Enter a function and ${method === 'bisection' ? 'bracket [a, b]' : method === 'newton_raphson' ? 'initial guess x₀' : 'two initial guesses x₀, x₁'}. Click Run to solve and load iteration data into the animation above.`}
        controls={controls}
        results={resultsPanel}
        presets={presets}
        onPresetSelect={handlePreset}
        onRun={onSolve}
        onReset={onReset}
        isLoading={isLoading}
      />

      <AlgorithmExecution<IterRow>
        iterations={iterRows}
        columns={cols.map((c) => ({
          ...c,
          format: (v) => fmtNum(v),
        }))}
        status={algoStatus}
        convergedAt={result?.converged ? result.total_iterations - 1 : undefined}
        description={`Step-by-step ${methodLabel} iteration table. Each row shows the state after one iteration. The highlighted columns are the current root approximation(s).`}
        executionLog={result ? [
          `Method: ${methodLabel}`,
          `Expression: ${result.method}`,
          `Root: ${result.root}`,
          `Converged: ${result.converged}`,
          `Iterations: ${result.total_iterations}`,
          `Final error: ${result.final_error}`,
          `Time: ${result.execution_time_ms.toFixed(3)} ms`,
        ] : undefined}
      />
    </>
  )
}
