import { clsx } from 'clsx'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import type { PlaygroundPreset } from '@/types/lesson.types'
import type { IntegrationResult } from '@/types/api.types'

export type IntegMethodProp = 'trapezoidal' | 'simpsons' | 'gaussian_quadrature'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface IntegrationPlaygroundProps {
  method: IntegMethodProp
  expression: string
  a: number
  b: number
  n: number
  onExpressionChange: (v: string) => void
  onAChange: (v: number) => void
  onBChange: (v: number) => void
  onNChange: (v: number) => void
  result: IntegrationResult | null
  isLoading: boolean
  onCompute: () => void
  onReset: () => void
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const TRAP_PRESETS: PlaygroundPreset[] = [
  { id: 't1', label: 'sin(x)', description: '∫₀π sin(x) dx = 2', params: { expr: 'sin(x)', a: 0, b: 3.14159, n: 10 } },
  { id: 't2', label: 'eˣ', description: '∫₀¹ eˣ dx = e−1 ≈ 1.718', params: { expr: 'exp(x)', a: 0, b: 1, n: 20 } },
  { id: 't3', label: 'x²', description: '∫₀² x² dx = 8/3', params: { expr: 'x**2', a: 0, b: 2, n: 8 } },
  { id: 't4', label: '1/(1+x²)', description: '∫₀¹ 1/(1+x²) dx = π/4', params: { expr: '1/(1+x**2)', a: 0, b: 1, n: 10 } },
  { id: 't5', label: 'cos(x)', description: '∫₀π/₂ cos(x) dx = 1', params: { expr: 'cos(x)', a: 0, b: 1.5708, n: 8 } },
]

const SIMP_PRESETS: PlaygroundPreset[] = [
  { id: 's1', label: 'sin(x)', description: '∫₀π sin(x) dx = 2', params: { expr: 'sin(x)', a: 0, b: 3.14159, n: 10 } },
  { id: 's2', label: 'eˣ', description: '∫₀¹ eˣ dx = e−1 ≈ 1.718', params: { expr: 'exp(x)', a: 0, b: 1, n: 10 } },
  { id: 's3', label: 'x³', description: '∫₀¹ x³ dx = 1/4 (exact for any even n)', params: { expr: 'x**3', a: 0, b: 1, n: 4 } },
  { id: 's4', label: 'ln(x+1)', description: '∫₀¹ ln(x+1) dx = 2ln2−1', params: { expr: 'log(x+1)', a: 0, b: 1, n: 8 } },
  { id: 's5', label: 'x·eˣ', description: '∫₀² x·eˣ dx = e²+1', params: { expr: 'x*exp(x)', a: 0, b: 2, n: 10 } },
]

const GAUSS_PRESETS: PlaygroundPreset[] = [
  { id: 'g1', label: 'sin(x)', description: '∫₀π sin(x) dx = 2', params: { expr: 'sin(x)', a: 0, b: 3.14159, n: 5 } },
  { id: 'g2', label: 'eˣ', description: '∫₀¹ eˣ dx = e−1 ≈ 1.718', params: { expr: 'exp(x)', a: 0, b: 1, n: 5 } },
  { id: 'g3', label: 'x⁵', description: '∫₋₁¹ x⁵ dx = 0 (odd fn, exact)', params: { expr: 'x**5', a: -1, b: 1, n: 3 } },
  { id: 'g4', label: '1/(1+x²)', description: '∫₀¹ 1/(1+x²) dx = π/4', params: { expr: '1/(1+x**2)', a: 0, b: 1, n: 5 } },
  { id: 'g5', label: 'cos(πx)', description: '∫₀¹ cos(πx) dx = 0', params: { expr: 'cos(3.14159*x)', a: 0, b: 1, n: 5 } },
]

const PRESETS_BY_METHOD: Record<IntegMethodProp, PlaygroundPreset[]> = {
  trapezoidal:       TRAP_PRESETS,
  simpsons:          SIMP_PRESETS,
  gaussian_quadrature: GAUSS_PRESETS,
}

const N_OPTIONS_TRAP  = [4, 8, 10, 20, 50, 100, 200, 500, 1000]
const N_OPTIONS_SIMP  = [4, 8, 10, 20, 50, 100, 200]
const N_OPTIONS_GAUSS = [2, 3, 4, 5]

const METHOD_COLOR: Record<IntegMethodProp, string> = {
  trapezoidal:       '#60a5fa',
  simpsons:          '#34d399',
  gaussian_quadrature: '#f59e0b',
}

const METHOD_LABEL: Record<IntegMethodProp, string> = {
  trapezoidal:       'Trapezoidal',
  simpsons:          "Simpson's 1/3",
  gaussian_quadrature: 'Gaussian Quadrature',
}

// ─── Algorithm row types ──────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function IntegrationPlayground({
  method, expression, a, b, n,
  onExpressionChange, onAChange, onBChange, onNChange,
  result, isLoading, onCompute, onReset,
}: IntegrationPlaygroundProps) {
  const color = METHOD_COLOR[method]
  const label = METHOD_LABEL[method]
  const presets = PRESETS_BY_METHOD[method]
  const nOptions = method === 'gaussian_quadrature' ? N_OPTIONS_GAUSS
    : method === 'simpsons' ? N_OPTIONS_SIMP : N_OPTIONS_TRAP

  const applyPreset = (preset: PlaygroundPreset) => {
    const p = preset.params as { expr: string; a: number; b: number; n: number }
    onExpressionChange(p.expr)
    onAChange(p.a)
    onBChange(p.b)
    onNChange(p.n)
    onReset()
  }

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="section-label">Expression f(x)</label>
          <input
            type="text"
            value={expression}
            onChange={e => { onExpressionChange(e.target.value); onReset() }}
            className="input-field font-mono"
            placeholder="e.g. sin(x)"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">a (lower)</label>
          <input type="number" value={a} step={0.1}
            onChange={e => { onAChange(Number(e.target.value)); onReset() }}
            className="input-field" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">b (upper)</label>
          <input type="number" value={b} step={0.1}
            onChange={e => { onBChange(Number(e.target.value)); onReset() }}
            className="input-field" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="section-label">
          {method === 'gaussian_quadrature' ? 'Gauss Points n' : 'Subintervals n'}
        </label>
        <div className="flex flex-wrap gap-2">
          {nOptions.map(opt => (
            <button
              key={opt}
              onClick={() => { onNChange(opt); onReset() }}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm font-mono font-medium transition-colors',
                n === opt ? 'text-white' : 'bg-surface text-slate-400 hover:text-white hover:bg-surface-hover'
              )}
              style={n === opt ? { backgroundColor: color } : {}}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCompute}
          disabled={isLoading}
          className="btn-primary px-6"
          style={!isLoading ? { backgroundColor: color, borderColor: color } : {}}
        >
          {isLoading ? 'Computing...' : `Compute ∫ f(x) dx`}
        </button>
        {result && (
          <button onClick={onReset} className="btn-secondary px-4">Reset</button>
        )}
      </div>
    </div>
  )

  const resultsPanel = result ? (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: '∫ f(x) dx ≈', value: result.integral.toFixed(10), c: color },
        { label: 'Exact', value: result.exact_integral != null ? result.exact_integral.toFixed(10) : 'N/A', c: '#8b5cf6' },
        { label: 'Abs Error', value: result.absolute_error != null ? result.absolute_error.toExponential(4) : 'N/A', c: '#f87171' },
        { label: 'Rel Error', value: result.relative_error != null ? (result.relative_error * 100).toFixed(6) + '%' : 'N/A', c: '#f59e0b' },
      ].map(m => (
        <div key={m.label} className="glass-card p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">{m.label}</div>
          <div className="font-mono text-sm font-bold" style={{ color: m.c }}>{m.value}</div>
        </div>
      ))}
    </div>
  ) : undefined

  // Interval rows for Algorithm table
  const intervalRows: IntervalRow[] = []
  if (result?.intervals) {
    let cum = 0
    result.intervals.forEach((iv, i) => {
      cum += iv.area
      intervalRows.push({
        strip: i + 1,
        x_start: iv.x_start.toFixed(6),
        x_end: iv.x_end.toFixed(6),
        area: iv.area.toFixed(10),
        cumulative: cum.toFixed(10),
      })
    })
  }

  const intervalColumns = [
    { key: 'strip' as keyof IntervalRow, header: 'Strip', highlight: false },
    { key: 'x_start' as keyof IntervalRow, header: 'x_start' },
    { key: 'x_end' as keyof IntervalRow, header: 'x_end' },
    { key: 'area' as keyof IntervalRow, header: 'Area', highlight: true },
    { key: 'cumulative' as keyof IntervalRow, header: 'Cumulative' },
  ]

  // Gauss rows
  const gaussRows: GaussRow[] = []
  if (result?.nodes && result?.weights) {
    result.nodes.forEach((xi, i) => {
      gaussRows.push({ i: i + 1, node: xi.toFixed(10), weight: (result.weights![i]).toFixed(10) })
    })
  }

  const gaussColumns = [
    { key: 'i' as keyof GaussRow, header: '#' },
    { key: 'node' as keyof GaussRow, header: 'Node xᵢ' },
    { key: 'weight' as keyof GaussRow, header: 'Weight wᵢ', highlight: true },
  ]

  const executionLog = result ? [
    `Method: ${label}`,
    `∫ ${expression} dx from ${a} to ${b}`,
    `n = ${n}`,
    `Result: ${result.integral.toFixed(10)}`,
    result.absolute_error != null ? `|Error| = ${result.absolute_error.toExponential(4)}` : '',
  ].filter(Boolean) : undefined

  return (
    <>
      <InteractivePlayground
        controls={controls}
        results={resultsPanel}
        presets={presets}
        onPresetSelect={applyPreset}
        onRun={onCompute}
        onReset={onReset}
        isLoading={isLoading}
        description={`Compute ∫ f(x) dx from a to b using ${label}`}
      />

      {method === 'gaussian_quadrature' && gaussRows.length > 0 && (
        <AlgorithmExecution
          iterations={gaussRows}
          columns={gaussColumns}
          status={result?.absolute_error != null && result.absolute_error < 1e-6 ? 'converged' : 'idle'}
          executionLog={executionLog}
          description="Gauss nodes and weights"
        />
      )}
      {method !== 'gaussian_quadrature' && intervalRows.length > 0 && (
        <AlgorithmExecution
          iterations={intervalRows}
          columns={intervalColumns}
          status={result?.absolute_error != null && result.absolute_error < 1e-6 ? 'converged' : 'idle'}
          executionLog={executionLog}
          description="Integration strips"
        />
      )}
    </>
  )
}
