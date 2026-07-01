import { useState, useCallback } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import { optimizationService } from '@/services/optimizationService'
import type { OptimizationResult } from '@/types/api.types'

const CASE_STUDIES = [
  { label: '(x−2)²', expr: '(x-2)**2', a: 0, b: 4, x0: 3.5, description: 'Convex quadratic — best case' },
  { label: 'x⁴−4x²', expr: 'x**4 - 4*x**2', a: 0.5, b: 3, x0: 2.5, description: 'Nonconvex on positive side' },
  { label: 'sin(x)+x/4', expr: 'sin(x)+x/4', a: 1, b: 6, x0: 4, description: 'Non-polynomial unimodal' },
]

const METHODS: { key: 'golden_section' | 'gradient_descent'; label: string; color: string }[] = [
  { key: 'golden_section',   label: 'Golden Section', color: '#06b6d4' },
  { key: 'gradient_descent', label: 'Gradient Descent', color: '#818cf8' },
]

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 60, r: 20, t: 30, b: 50 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  showlegend: true,
  legend: { bgcolor: 'rgba(15,23,42,0.8)', bordercolor: '#334155', borderwidth: 1 },
  autosize: true,
}

type ResultMap = { golden_section: OptimizationResult | null; gradient_descent: OptimizationResult | null }

export default function OptimizationComparisonPage() {
  const [caseIdx, setCaseIdx] = useState(0)
  const [results, setResults] = useState<ResultMap>({ golden_section: null, gradient_descent: null })
  const [loading, setLoading] = useState(false)
  const [compError, setCompError] = useState<string | null>(null)
  const cs = CASE_STUDIES[caseIdx]

  const runComparison = useCallback(async () => {
    setLoading(true)
    setCompError(null)
    try {
      const [gs, gd] = await Promise.all([
        optimizationService.optimize({ expression: cs.expr, method: 'golden_section', a: cs.a, b: cs.b, tolerance: 1e-10, max_iterations: 200 }),
        optimizationService.optimize({ expression: cs.expr, method: 'gradient_descent', x0: cs.x0, learning_rate: 0.1, tolerance: 1e-10, max_iterations: 500 }),
      ])
      setResults({ golden_section: gs, gradient_descent: gd })
    } catch (err) {
      setCompError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [caseIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // Convergence chart: f(x_k) vs iteration
  const convergenceTraces: Plotly.Data[] = METHODS.map(m => {
    const r = results[m.key]
    if (!r || r.iterations.length === 0) return null
    return {
      x: r.iterations.map(it => it.iteration),
      y: r.iterations.map(it => Math.abs(it.fx - r.optimum_value) + 1e-15),
      type: 'scatter', mode: 'lines+markers',
      name: m.label,
      line: { color: m.color, width: 2 },
      marker: { color: m.color, size: 4 },
    } as Plotly.Data
  }).filter(Boolean) as Plotly.Data[]

  const allDone = results.golden_section !== null && results.gradient_descent !== null

  const DECISION = [
    {
      method: 'Golden Section',
      color: '#06b6d4',
      use: ['Unimodal f on known [a,b]', 'Derivative-free (black-box)', '1D problems only', 'Guaranteed convergence'],
      avoid: ['Multimodal functions', 'High-dimensional (n > 1)'],
    },
    {
      method: 'Gradient Descent',
      color: '#818cf8',
      use: ['Differentiable f in any dimension', 'Machine learning / neural networks', 'Continuous optimization'],
      avoid: ['Non-differentiable f', 'Sensitive to learning rate α'],
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">Optimization: Method Comparison</h1>
        <p className="text-slate-400 text-sm">Golden Section (bracket, derivative-free) vs Gradient Descent (gradient-based)</p>
      </div>

      {compError && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {compError}
        </div>
      )}

      <div className="glass-card p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Select Test Function</h2>
        <div className="flex flex-wrap gap-3">
          {CASE_STUDIES.map((cs, i) => (
            <button key={i}
              onClick={() => { setCaseIdx(i); setResults({ golden_section: null, gradient_descent: null }) }}
              className={i === caseIdx
                ? 'px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white border border-cyan-400'
                : 'px-4 py-2 rounded-lg text-sm font-medium bg-surface-card border border-surface-border text-slate-400 hover:text-white'}
            >{cs.label} — {cs.description}</button>
          ))}
        </div>
        <button onClick={runComparison} disabled={loading}
          className="btn-primary px-6 bg-cyan-600 hover:bg-cyan-500 border-cyan-500">
          {loading ? 'Running...' : 'Run Comparison'}
        </button>
      </div>

      {allDone && (
        <div className="glass-card p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  {['Method', 'x*', 'f(x*)', 'Iterations', 'Converged', 'Time (ms)'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METHODS.map(m => {
                  const r = results[m.key]
                  if (!r) return null
                  return (
                    <tr key={m.key} className="border-b border-surface-border/50">
                      <td className="py-2 px-3 font-medium" style={{ color: m.color }}>{m.label}</td>
                      <td className="py-2 px-3 font-mono text-xs text-white">{r.optimum.toFixed(8)}</td>
                      <td className="py-2 px-3 font-mono text-xs text-white">{r.optimum_value.toExponential(4)}</td>
                      <td className="py-2 px-3 font-mono text-xs text-emerald-400">{r.iterations.length}</td>
                      <td className="py-2 px-3 text-xs" style={{ color: r.converged ? '#4ade80' : '#f87171' }}>{r.converged ? 'Yes ✓' : 'No ✗'}</td>
                      <td className="py-2 px-3 font-mono text-xs text-slate-400">{r.execution_time_ms.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {convergenceTraces.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Convergence: |f(xₖ) − f*| vs Iteration</h2>
          <div className="h-64">
            <Plot
              data={convergenceTraces}
              layout={{
                ...DARK_LAYOUT,
                yaxis: { ...DARK_LAYOUT.yaxis, type: 'log', title: { text: '|f(xₖ) − f*|', font: { color: '#94a3b8' } } },
                xaxis: { ...DARK_LAYOUT.xaxis, title: { text: 'Iteration k', font: { color: '#94a3b8' } } },
              } as Partial<Plotly.Layout>}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '256px' }}
            />
          </div>
        </div>
      )}

      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Decision Guide</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {DECISION.map(d => (
            <div key={d.method} className="rounded-lg p-4 bg-surface-card border border-surface-border">
              <h3 className="font-semibold mb-3" style={{ color: d.color }}>{d.method}</h3>
              <div>
                <p className="text-xs font-medium text-emerald-400 mb-1">✓ Use when</p>
                {d.use.map((u, i) => <p key={i} className="text-xs text-slate-300">• {u}</p>)}
              </div>
              <div className="mt-2">
                <p className="text-xs font-medium text-red-400 mb-1">✗ Avoid when</p>
                {d.avoid.map((a, i) => <p key={i} className="text-xs text-slate-400">• {a}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
