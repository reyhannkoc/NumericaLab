import { useState } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import type { PlaygroundPreset } from '@/types/lesson.types'
import type { ODEResult } from '@/types/api.types'
import type { ODEMethodProp } from './ODEVisualization'

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 55, r: 15, t: 20, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.01, y: 0.98 },
}
const PLOTLY_CFG = { displayModeBar: false, responsive: true }

export interface ODEPlaygroundProps {
  method: ODEMethodProp
  expression: string
  x0: number
  y0: number
  xEnd: number
  h: number
  onExpressionChange: (v: string) => void
  onX0Change: (v: number) => void
  onY0Change: (v: number) => void
  onXEndChange: (v: number) => void
  onHChange: (v: number) => void
  result: ODEResult | null
  isLoading: boolean
  onCompute: () => void
  onReset: () => void
  error?: string | null
}

const METHOD_COLOR: Record<ODEMethodProp, string> = {
  euler:          '#84cc16',
  runge_kutta_4:  '#f97316',
}
const METHOD_LABEL: Record<ODEMethodProp, string> = {
  euler:          "Euler's Method",
  runge_kutta_4:  'Runge-Kutta 4',
}

const EULER_PRESETS: PlaygroundPreset[] = [
  { id: 'e1', label: 'dy/dx = y',         description: 'y(0)=1, x∈[0,2]',  params: { expr: 'y',             x0: 0, y0: 1, xEnd: 2, h: 0.2 } },
  { id: 'e2', label: 'dy/dx = −y',        description: 'y(0)=1, x∈[0,3]',  params: { expr: '-y',            x0: 0, y0: 1, xEnd: 3, h: 0.1 } },
  { id: 'e3', label: 'dy/dx = x + y',     description: 'y(0)=1, x∈[0,1]',  params: { expr: 'x + y',         x0: 0, y0: 1, xEnd: 1, h: 0.1 } },
  { id: 'e4', label: 'dy/dx = sin(x)−y',  description: 'y(0)=0, x∈[0,4]',  params: { expr: 'sin(x) - y',   x0: 0, y0: 0, xEnd: 4, h: 0.05 } },
]
const RK4_PRESETS: PlaygroundPreset[] = [
  { id: 'r1', label: 'dy/dx = y',         description: 'y(0)=1, x∈[0,3]',  params: { expr: 'y',             x0: 0, y0: 1, xEnd: 3, h: 0.5 } },
  { id: 'r2', label: 'dy/dx = −2y',       description: 'y(0)=1, x∈[0,2]',  params: { expr: '-2*y',          x0: 0, y0: 1, xEnd: 2, h: 0.5 } },
  { id: 'r3', label: 'dy/dx = x²−y',      description: 'y(0)=0, x∈[0,3]',  params: { expr: 'x**2 - y',      x0: 0, y0: 0, xEnd: 3, h: 0.25 } },
  { id: 'r4', label: 'Lotka-Volterra',     description: 'Requires 2D — demo only', params: { expr: 'y*(1-y)',  x0: 0, y0: 0.1, xEnd: 10, h: 0.1 } },
]

type IterRow = Record<string, unknown> & { k: number; x: string; y: string; err: string }

export default function ODEPlayground({
  method, expression, x0, y0, xEnd, h,
  onExpressionChange, onX0Change, onY0Change, onXEndChange, onHChange,
  result, isLoading, onCompute, onReset, error,
}: ODEPlaygroundProps) {
  const color = METHOD_COLOR[method]
  const label = METHOD_LABEL[method]
  const presets = method === 'euler' ? EULER_PRESETS : RK4_PRESETS
  const [showTable, setShowTable] = useState(false)

  const applyPreset = (p: PlaygroundPreset) => {
    const v = p.params as Record<string, number | string>
    onExpressionChange(String(v.expr))
    onX0Change(Number(v.x0))
    onY0Change(Number(v.y0))
    onXEndChange(Number(v.xEnd))
    onHChange(Number(v.h))
    onReset()
  }

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="section-label">dy/dx = f(x, y)</label>
          <input type="text" value={expression}
            onChange={e => { onExpressionChange(e.target.value); onReset() }}
            className="input-field font-mono"
            placeholder="e.g. y  or  -2*y  or  x + y"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">x₀ (initial x)</label>
          <input type="number" value={x0} step={0.1}
            onChange={e => { onX0Change(Number(e.target.value)); onReset() }}
            className="input-field" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">y₀ (initial y)</label>
          <input type="number" value={y0} step={0.1}
            onChange={e => { onY0Change(Number(e.target.value)); onReset() }}
            className="input-field" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">x_end</label>
          <input type="number" value={xEnd} step={0.5}
            onChange={e => { onXEndChange(Number(e.target.value)); onReset() }}
            className="input-field" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">h (step size)</label>
          <input type="number" value={h} step={0.01} min={0.001} max={1}
            onChange={e => { onHChange(Number(e.target.value)); onReset() }}
            className="input-field" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onCompute} disabled={isLoading} className="btn-primary px-6"
          style={!isLoading ? { backgroundColor: color, borderColor: color } : {}}>
          {isLoading ? 'Solving...' : `Solve with ${label}`}
        </button>
        {result && <button onClick={onReset} className="btn-secondary px-4">Reset</button>}
      </div>
    </div>
  )

  const globalErr = result && result.global_error
    ? Math.max(...result.global_error)
    : null

  const solutionTraces: Plotly.Data[] = result ? [
    {
      x: result.x_values,
      y: result.y_values,
      type: 'scatter', mode: 'lines+markers',
      name: result.method === 'euler' ? "Euler's Method" : 'RK4',
      line: { color, width: 2.5 },
      marker: { color, size: result.x_values.length > 30 ? 3 : 6 },
    },
    ...(result.exact_values && result.exact_values.length > 0 ? [{
      x: result.x_values,
      y: result.exact_values,
      type: 'scatter' as const, mode: 'lines' as const,
      name: 'Exact',
      line: { color: '#94a3b8', width: 1.5, dash: 'dash' as const },
    }] : []),
  ] : []

  const resultsPanel = result ? (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Steps', value: String(result.steps), color },
          { label: `y(${result.x_values[result.x_values.length - 1].toFixed(3)})`, value: result.y_values[result.y_values.length - 1].toFixed(8), color: '#8b5cf6' },
          { label: 'Max Error', value: globalErr !== null ? globalErr.toExponential(3) : 'N/A (no exact)', color: globalErr !== null ? (globalErr < 1e-4 ? '#4ade80' : '#f87171') : '#64748b' },
          { label: 'Method', value: result.method === 'euler' ? 'Euler' : 'RK4', color },
        ].map(m => (
          <div key={m.label} className="glass-card p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">{m.label}</div>
            <div className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {solutionTraces.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="px-3 pt-2 pb-0 border-b border-surface-border">
            <p className="text-xs text-slate-400 font-medium">Solution: y(x)</p>
          </div>
          <Plot
            data={solutionTraces}
            layout={{
              ...DARK_LAYOUT,
              xaxis: { ...DARK_LAYOUT.xaxis, title: { text: 'x', font: { color: '#94a3b8' } } },
              yaxis: { ...DARK_LAYOUT.yaxis, title: { text: 'y(x)', font: { color: '#94a3b8' } } },
            }}
            config={PLOTLY_CFG}
            style={{ width: '100%', height: '220px' }}
          />
        </div>
      )}

      {result.x_values.length > 0 && (
        <button onClick={() => setShowTable(t => !t)} className="text-xs transition-colors" style={{ color }}>
          {showTable ? 'Hide' : 'Show'} step table ({Math.min(result.x_values.length, 50)} rows)
        </button>
      )}
    </div>
  ) : undefined

  const iterRows: IterRow[] = result
    ? result.x_values.slice(0, 50).map((x, i) => ({
        k: i,
        x: x.toFixed(6),
        y: result.y_values[i].toFixed(8),
        err: result.global_error && result.global_error[i] !== undefined
          ? result.global_error[i].toExponential(4)
          : '—',
      }))
    : []

  const iterColumns = [
    { key: 'k'   as keyof IterRow, header: 'k' },
    { key: 'x'   as keyof IterRow, header: 'x' },
    { key: 'y'   as keyof IterRow, header: 'y(x)', highlight: true },
    { key: 'err' as keyof IterRow, header: '|error|' },
  ]

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
        error={error}
        description={`Solve the IVP dy/dx = f(x,y), y(x₀) = y₀ using ${label}. Adjust step size h to observe accuracy changes.`}
      />
      {showTable && iterRows.length > 0 && (
        <AlgorithmExecution
          iterations={iterRows}
          columns={iterColumns}
          status="converged"
          description={`${label} step-by-step solution table`}
        />
      )}
    </>
  )
}
