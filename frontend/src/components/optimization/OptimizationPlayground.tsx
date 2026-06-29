import { useState } from 'react'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import type { PlaygroundPreset } from '@/types/lesson.types'
import type { OptimizationResult } from '@/types/api.types'
import type { OptMethodProp } from './OptimizationVisualization'

export interface OptimizationPlaygroundProps {
  method: OptMethodProp
  expression: string
  a: number
  b: number
  x0: number
  alpha: number
  tolerance: number
  onExpressionChange: (v: string) => void
  onAChange: (v: number) => void
  onBChange: (v: number) => void
  onX0Change: (v: number) => void
  onAlphaChange: (v: number) => void
  result: OptimizationResult | null
  isLoading: boolean
  onCompute: () => void
  onReset: () => void
}

const METHOD_COLOR: Record<OptMethodProp, string> = {
  golden_section:   '#06b6d4',
  gradient_descent: '#818cf8',
}
const METHOD_LABEL: Record<OptMethodProp, string> = {
  golden_section:   'Golden Section',
  gradient_descent: 'Gradient Descent',
}

const GS_PRESETS: PlaygroundPreset[] = [
  { id: 'gs1', label: '(x−2)²', description: 'min at x=2', params: { expr: '(x-2)**2', a: 0, b: 4 } },
  { id: 'gs2', label: 'x²−4x', description: 'min at x=2', params: { expr: 'x**2 - 4*x', a: -1, b: 5 } },
  { id: 'gs3', label: 'sin(x)+x/4', description: 'min near x=3.7', params: { expr: 'sin(x)+x/4', a: 1, b: 6 } },
  { id: 'gs4', label: 'x⁴−4x²', description: 'right min near x=1.41', params: { expr: 'x**4 - 4*x**2', a: 0, b: 3 } },
]
const GD_PRESETS: PlaygroundPreset[] = [
  { id: 'gd1', label: '(x−2)²', description: 'quadratic, x*=2', params: { expr: '(x-2)**2', x0: 4, alpha: 0.3 } },
  { id: 'gd2', label: 'x⁴−4x²', description: 'nonconvex double-well', params: { expr: 'x**4 - 4*x**2', x0: 2, alpha: 0.05 } },
  { id: 'gd3', label: 'x+sin(x)', description: 'min near x=−π/2', params: { expr: 'x + sin(x)', x0: 0.5, alpha: 0.5 } },
  { id: 'gd4', label: '0.5x²', description: 'L=1, optimal α=1', params: { expr: '0.5*x**2', x0: 5, alpha: 0.5 } },
]

type IterRow = Record<string, unknown> & { k: number; x: string; fx: string; extra: string }

export default function OptimizationPlayground({
  method, expression, a, b, x0, alpha,
  onExpressionChange, onAChange, onBChange, onX0Change, onAlphaChange,
  result, isLoading, onCompute, onReset,
}: OptimizationPlaygroundProps) {
  const color = METHOD_COLOR[method]
  const label = METHOD_LABEL[method]
  const presets = method === 'golden_section' ? GS_PRESETS : GD_PRESETS
  const [showTable, setShowTable] = useState(false)

  const applyPreset = (p: PlaygroundPreset) => {
    const v = p.params as Record<string, number | string>
    onExpressionChange(String(v.expr))
    if (v.a !== undefined) onAChange(Number(v.a))
    if (v.b !== undefined) onBChange(Number(v.b))
    if (v.x0 !== undefined) onX0Change(Number(v.x0))
    if (v.alpha !== undefined) onAlphaChange(Number(v.alpha))
    onReset()
  }

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="section-label">Expression f(x)</label>
          <input type="text" value={expression}
            onChange={e => { onExpressionChange(e.target.value); onReset() }}
            className="input-field font-mono"
            placeholder="e.g. (x-2)**2"
          />
        </div>
        {method === 'golden_section' ? (
          <>
            <div className="flex flex-col gap-1">
              <label className="section-label">a (left bound)</label>
              <input type="number" value={a} step={0.5}
                onChange={e => { onAChange(Number(e.target.value)); onReset() }}
                className="input-field" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="section-label">b (right bound)</label>
              <input type="number" value={b} step={0.5}
                onChange={e => { onBChange(Number(e.target.value)); onReset() }}
                className="input-field" />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <label className="section-label">x₀ (start)</label>
              <input type="number" value={x0} step={0.5}
                onChange={e => { onX0Change(Number(e.target.value)); onReset() }}
                className="input-field" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="section-label">α (learning rate)</label>
              <input type="number" value={alpha} step={0.01} min={0.001} max={2}
                onChange={e => { onAlphaChange(Number(e.target.value)); onReset() }}
                className="input-field" />
            </div>
          </>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={onCompute} disabled={isLoading} className="btn-primary px-6"
          style={!isLoading ? { backgroundColor: color, borderColor: color } : {}}>
          {isLoading ? 'Optimizing...' : `Minimize with ${label}`}
        </button>
        {result && <button onClick={onReset} className="btn-secondary px-4">Reset</button>}
      </div>
    </div>
  )

  const resultsPanel = result ? (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'x*', value: result.optimum.toFixed(10), color },
          { label: 'f(x*)', value: result.optimum_value.toFixed(10), color: '#8b5cf6' },
          { label: 'Iterations', value: String(result.iterations.length), color: '#22d3ee' },
          { label: 'Converged', value: result.converged ? 'Yes ✓' : 'No ✗', color: result.converged ? '#4ade80' : '#f87171' },
        ].map(m => (
          <div key={m.label} className="glass-card p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">{m.label}</div>
            <div className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      {result.iterations.length > 0 && (
        <button onClick={() => setShowTable(t => !t)} className="text-xs transition-colors" style={{ color }}>
          {showTable ? 'Hide' : 'Show'} iteration table ({Math.min(result.iterations.length, 50)} rows)
        </button>
      )}
    </div>
  ) : undefined

  const iterRows: IterRow[] = result?.iterations.slice(0, 50).map(it => ({
    k: it.iteration,
    x: it.x.toFixed(10),
    fx: it.fx.toExponential(6),
    extra: it.interval ? `[${it.interval[0].toFixed(6)}, ${it.interval[1].toFixed(6)}]`
      : it.gradient !== undefined ? `∇=${it.gradient.toExponential(4)}`
      : '',
  })) ?? []

  const iterColumns = [
    { key: 'k' as keyof IterRow, header: 'k' },
    { key: 'x' as keyof IterRow, header: 'x', highlight: true },
    { key: 'fx' as keyof IterRow, header: 'f(x)' },
    { key: 'extra' as keyof IterRow, header: method === 'golden_section' ? 'Bracket' : 'Gradient' },
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
        description={method === 'golden_section'
          ? 'Minimize f(x) on [a, b] using golden section search. Requires a unimodal function.'
          : 'Minimize f(x) starting from x₀ using gradient descent. Choose α carefully.'}
      />
      {showTable && iterRows.length > 0 && (
        <AlgorithmExecution
          iterations={iterRows}
          columns={iterColumns}
          status={result?.converged ? 'converged' : 'idle'}
          description={`${label} iteration history`}
        />
      )}
    </>
  )
}
