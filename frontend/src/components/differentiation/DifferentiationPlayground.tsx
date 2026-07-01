import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import { clsx } from 'clsx'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import { differentiationService } from '@/services/differentiationService'
import type { PlaygroundPreset } from '@/types/lesson.types'
import type { DifferentiationResult, DifferentiationMethod } from '@/types/api.types'

export type DiffMethod = Extract<DifferentiationMethod, 'forward' | 'backward' | 'central'>

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DifferentiationPlaygroundProps {
  method: DiffMethod
  expression: string
  xPoint: number
  h: number
  onExpressionChange: (v: string) => void
  onXPointChange: (v: number) => void
  onHChange: (v: number) => void
  result: DifferentiationResult | null
  isLoading: boolean
  onCompute: () => void
  onReset: () => void
  error?: string | null
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const FORWARD_PRESETS: PlaygroundPreset[] = [
  { id: 'fp1', label: 'sin(x)',    description: "f'(π/4) = cos(π/4) ≈ 0.7071",   params: { expr: 'sin(x)', x: 0.7854, h: 1e-5 } },
  { id: 'fp2', label: 'eˣ',       description: "f'(1) = e ≈ 2.718",               params: { expr: 'exp(x)', x: 1, h: 1e-5 } },
  { id: 'fp3', label: 'x³',       description: "f'(2) = 3×4 = 12",                params: { expr: 'x**3', x: 2, h: 1e-5 } },
  { id: 'fp4', label: 'ln(x)',    description: "f'(1) = 1",                        params: { expr: 'log(x)', x: 1, h: 1e-7 } },
  { id: 'fp5', label: 'cos(x)',   description: "f'(0) = -sin(0) = 0",              params: { expr: 'cos(x)', x: 0, h: 1e-5 } },
]

const BACKWARD_PRESETS: PlaygroundPreset[] = [
  { id: 'bp1', label: 'sin(x)',   description: "Backward f'(1) vs exact cos(1)",  params: { expr: 'sin(x)', x: 1, h: 1e-5 } },
  { id: 'bp2', label: 'eˣ',      description: "Backward f'(2), exact e² ≈ 7.389", params: { expr: 'exp(x)', x: 2, h: 1e-5 } },
  { id: 'bp3', label: 'x⁴',      description: "f'(1) = 4",                        params: { expr: 'x**4', x: 1, h: 1e-5 } },
  { id: 'bp4', label: 'x²',      description: "f'(3) = 6",                        params: { expr: 'x**2', x: 3, h: 1e-6 } },
  { id: 'bp5', label: 'cos(x)',  description: "f'(π/2) ≈ −1",                     params: { expr: 'cos(x)', x: 1.5708, h: 1e-5 } },
]

const CENTRAL_PRESETS: PlaygroundPreset[] = [
  { id: 'cp1', label: 'sin(x)',  description: "Central f'(1), error O(h²)",        params: { expr: 'sin(x)', x: 1, h: 1e-5 } },
  { id: 'cp2', label: 'eˣ',     description: "Central f'(1), optimal h≈1e-5",      params: { expr: 'exp(x)', x: 1, h: 1e-5 } },
  { id: 'cp3', label: 'x³',     description: "f'(2)=12 — compare with forward",    params: { expr: 'x**3', x: 2, h: 1e-5 } },
  { id: 'cp4', label: 'ln(x)',  description: "f'(2) = 0.5",                        params: { expr: 'log(x)', x: 2, h: 1e-4 } },
  { id: 'cp5', label: 'x²+sin', description: "f'(1) = 2 + cos(1)",                params: { expr: 'x**2 + sin(x)', x: 1, h: 1e-5 } },
]

const H_OPTIONS = [1.0, 0.1, 0.01, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8]

// ─── Plotly config ────────────────────────────────────────────────────────────

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 60, r: 15, t: 20, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.01, y: 0.98 },
}
const PLOTLY_CFG = { displayModeBar: false, responsive: true }

const METHOD_COLOR: Record<DiffMethod, string> = {
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

// ─── Error-vs-h mini chart ────────────────────────────────────────────────────

function ErrorVsHChart({ expression, xPoint, method }: { expression: string; xPoint: number; method: DiffMethod }) {
  const [data, setData] = useState<{ h_values: number[]; errors: Record<string, number[]> } | null>(null)

  useEffect(() => {
    let cancelled = false
    differentiationService.errorVsH(expression, xPoint).then((d) => {
      if (!cancelled) setData(d)
    }).catch(() => {/* ignore */})
    return () => { cancelled = true }
  }, [expression, xPoint])

  if (!data) return <div className="text-xs text-slate-500 text-center py-4">Loading error curve…</div>

  const methodKey = method === 'central' ? 'central' : method === 'backward' ? 'backward' : 'forward'
  const traces: Plotly.Data[] = []

  if (data.errors[methodKey]) {
    traces.push({
      x: data.h_values,
      y: data.errors[methodKey],
      type: 'scatter', mode: 'lines+markers',
      line: { color: METHOD_COLOR[method], width: 2 },
      marker: { color: METHOD_COLOR[method], size: 4 },
      name: methodKey,
    })
  }

  return (
    <Plot
      data={traces}
      layout={{
        ...DARK_LAYOUT,
        xaxis: { ...DARK_LAYOUT.xaxis, type: 'log', title: { text: 'h', font: { color: '#94a3b8' } } },
        yaxis: { ...DARK_LAYOUT.yaxis, type: 'log', title: { text: '|error|', font: { color: '#94a3b8' } } },
      } as Partial<Plotly.Layout>}
      config={PLOTLY_CFG}
      style={{ width: '100%', height: '200px' }}
    />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DifferentiationPlayground(props: DifferentiationPlaygroundProps) {
  const { method, expression, xPoint, h, onExpressionChange, onXPointChange, onHChange, result, isLoading, onCompute, onReset, error } = props

  const presets = method === 'forward' ? FORWARD_PRESETS : method === 'backward' ? BACKWARD_PRESETS : CENTRAL_PRESETS
  const color = METHOD_COLOR[method]

  const handlePreset = (preset: PlaygroundPreset) => {
    const p = preset.params
    if (typeof p['expr'] === 'string') onExpressionChange(p['expr'])
    if (typeof p['x'] === 'number') onXPointChange(p['x'])
    if (typeof p['h'] === 'number') onHChange(p['h'])
    onReset()
  }

  const controls = (
    <div className="space-y-4">
      <div>
        <label className="section-label mb-1.5 block">f(x) expression</label>
        <input
          type="text"
          value={expression}
          onChange={(e) => { onExpressionChange(e.target.value); onReset() }}
          className="input-field w-full font-mono text-sm"
          placeholder="sin(x)"
        />
        <p className="text-[11px] text-slate-500 mt-1">Use: sin, cos, exp, log, x**n, sqrt</p>
      </div>

      <div>
        <label className="section-label mb-1.5 block">
          Evaluation point x = {xPoint}
        </label>
        <input
          type="number"
          value={xPoint}
          step={0.1}
          onChange={(e) => { onXPointChange(parseFloat(e.target.value) || 0); onReset() }}
          className="input-field w-full font-mono text-sm"
        />
      </div>

      <div>
        <label className="section-label mb-1.5 block">Step size h</label>
        <div className="flex flex-wrap gap-1.5">
          {H_OPTIONS.map((hv) => (
            <button
              key={hv}
              onClick={() => { onHChange(hv); onReset() }}
              className={clsx(
                'px-2 py-1 rounded text-xs font-mono transition-colors',
                h === hv
                  ? 'bg-brand-600 text-white border border-brand-500'
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
              )}
            >
              {hv >= 0.001 ? hv : hv.toExponential(0)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const resultsPanel = result ? (
    <div className="space-y-3 h-full">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "f'(x) approx", value: fmt(result.derivative),      accent: color },
          { label: "f'(x) exact",  value: fmt(result.exact_derivative), accent: '#f59e0b' },
          { label: 'Abs error',    value: result.absolute_error != null ? result.absolute_error.toExponential(3) : '—', accent: '#f87171' },
          { label: 'Rel error',    value: result.relative_error != null ? (result.relative_error * 100).toFixed(4) + '%' : '—', accent: '#f87171' },
        ].map(({ label, value, accent }) => (
          <div key={label} className="glass-card p-3 text-center">
            <div className="font-mono text-sm font-semibold" style={{ color: accent }}>{value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Error vs h chart */}
      <div className="glass-card overflow-hidden">
        <div className="px-3 pt-2 pb-0 border-b border-surface-border">
          <p className="text-xs text-slate-400 font-medium">Error vs h (log-log)</p>
        </div>
        <ErrorVsHChart expression={expression} xPoint={xPoint} method={method} />
      </div>
    </div>
  ) : undefined

  // Build AlgorithmExecution table rows
  type Row = Record<string, unknown>
  const tableRows: Row[] = result
    ? [{
        step: 'Evaluate',
        description: method === 'forward' ? `f(x+h) = f(${(xPoint + h).toPrecision(4)})` : method === 'backward' ? `f(x−h) = f(${(xPoint - h).toPrecision(4)})` : `f(x+h) = f(${(xPoint + h).toPrecision(4)})`,
        value: method === 'forward' ? fmt(result.derivative * h + (result.exact_derivative ?? 0)) : fmt(result.derivative),
      },
      { step: 'Divide', description: `Divide by ${method === 'central' ? '2h = ' + (2 * h).toExponential(2) : 'h = ' + h.toExponential(2)}`, value: fmt(result.derivative) },
      { step: 'Result', description: `f'(x) ≈ ${fmt(result.derivative)}`, value: fmt(result.derivative) },
    ]
    : []

  const log = result ? [
    `Method: ${method}`,
    `x = ${xPoint}, h = ${h}`,
    `f'(x) ≈ ${result.derivative}`,
    result.exact_derivative != null ? `Exact: ${result.exact_derivative}` : '',
    result.absolute_error != null ? `|error| = ${result.absolute_error.toExponential(3)}` : '',
  ].filter(Boolean) : undefined

  return (
    <>
      <InteractivePlayground
        description={`Compute the ${method} difference derivative of any expression. The error-vs-h chart shows the optimal step size.`}
        controls={controls}
        results={resultsPanel}
        presets={presets}
        onPresetSelect={handlePreset}
        onRun={onCompute}
        onReset={onReset}
        isLoading={isLoading}
        error={error}
      />

      <AlgorithmExecution<Row>
        iterations={tableRows}
        columns={[
          { key: 'step'        as never, header: 'Step',        tooltip: 'Computation step' },
          { key: 'description' as never, header: 'Description', tooltip: 'What is being computed', highlight: true },
          { key: 'value'       as never, header: 'Value',       tooltip: 'Numeric result', highlight: true },
        ]}
        status={result ? 'converged' : 'idle'}
        description={`${method.charAt(0).toUpperCase() + method.slice(1)} difference formula steps.`}
        executionLog={log}
      />
    </>
  )
}
