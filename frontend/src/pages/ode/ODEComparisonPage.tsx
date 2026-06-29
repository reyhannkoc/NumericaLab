import { useState, useCallback } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import { odeService } from '@/services/odeService'
import type { ODEResult } from '@/types/api.types'

const CASE_STUDIES = [
  { label: 'dy/dx = y',         expr: 'y',            x0: 0, y0: 1, xEnd: 3, description: 'Exponential growth' },
  { label: 'dy/dx = −y',        expr: '-y',           x0: 0, y0: 1, xEnd: 3, description: 'Exponential decay' },
  { label: 'dy/dx = x + y',     expr: 'x + y',        x0: 0, y0: 1, xEnd: 2, description: 'Non-autonomous' },
  { label: 'dy/dx = sin(x)−y',  expr: 'sin(x) - y',  x0: 0, y0: 0, xEnd: 4, description: 'Steady-state oscillation' },
]

const METHODS: { key: 'euler' | 'runge_kutta_4'; label: string; color: string }[] = [
  { key: 'euler',          label: "Euler's Method", color: '#84cc16' },
  { key: 'runge_kutta_4',  label: 'Runge-Kutta 4',  color: '#f97316' },
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

type ResultMap = { euler: ODEResult | null; runge_kutta_4: ODEResult | null }

const H_VALUES = [0.5, 0.25, 0.1]

export default function ODEComparisonPage() {
  const [caseIdx, setCaseIdx] = useState(0)
  const [hIdx, setHIdx]       = useState(1)   // default h=0.25
  const [results, setResults] = useState<ResultMap>({ euler: null, runge_kutta_4: null })
  const [loading, setLoading] = useState(false)
  const cs = CASE_STUDIES[caseIdx]
  const h  = H_VALUES[hIdx]

  const runComparison = useCallback(async () => {
    setLoading(true)
    try {
      const base = { expression: cs.expr, x0: cs.x0, y0: cs.y0, x_end: cs.xEnd, h }
      const [euler, rk4] = await Promise.all([
        odeService.solve({ ...base, method: 'euler' }),
        odeService.solve({ ...base, method: 'runge_kutta_4' }),
      ])
      setResults({ euler, runge_kutta_4: rk4 })
    } catch (err) {
      console.error('[ODEComparison] error:', err)
    } finally {
      setLoading(false)
    }
  }, [caseIdx, hIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // Solution traces
  const solutionTraces: Plotly.Data[] = METHODS.flatMap(m => {
    const r = results[m.key]
    if (!r) return []
    return [{
      x: r.x_values, y: r.y_values,
      type: 'scatter', mode: 'lines+markers',
      name: m.label,
      line: { color: m.color, width: 2 },
      marker: { color: m.color, size: 4 },
    } as Plotly.Data]
  })

  // Error traces (global error vs step index)
  const errorTraces: Plotly.Data[] = METHODS.flatMap(m => {
    const r = results[m.key]
    if (!r || !r.global_error || r.global_error.length === 0) return []
    return [{
      x: r.x_values,
      y: r.global_error.map(e => Math.max(e, 1e-16)),
      type: 'scatter', mode: 'lines',
      name: m.label,
      line: { color: m.color, width: 2 },
    } as Plotly.Data]
  })

  const allDone = results.euler !== null && results.runge_kutta_4 !== null

  const maxErrors = METHODS.map(m => {
    const r = results[m.key]
    if (!r || !r.global_error || r.global_error.length === 0) return null
    return Math.max(...r.global_error)
  })

  const DECISION = [
    {
      method: "Euler's Method",
      color: '#84cc16',
      order: 'O(h)',
      evals: 1,
      use: ['Learning / prototyping', 'Non-stiff problems with small h', 'Real-time semi-implicit variant'],
      avoid: ['High accuracy requirements', 'Stiff ODEs', 'Long-time integration'],
    },
    {
      method: 'Runge-Kutta 4',
      color: '#f97316',
      order: 'O(h⁴)',
      evals: 4,
      use: ['Non-stiff smooth ODEs', 'Engineering simulations', 'Fixed step-size requirement'],
      avoid: ['Very stiff ODEs (use BDF)', 'Need adaptive step control (use RK45)', 'Extremely expensive f(x,y)'],
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">ODE: Method Comparison</h1>
        <p className="text-slate-400 text-sm">Euler (1st order) vs Runge-Kutta 4 (4th order) — accuracy and error analysis</p>
      </div>

      <div className="glass-card p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Test Function &amp; Parameters</h2>
        <div className="flex flex-wrap gap-3">
          {CASE_STUDIES.map((cs, i) => (
            <button key={i}
              onClick={() => { setCaseIdx(i); setResults({ euler: null, runge_kutta_4: null }) }}
              className={i === caseIdx
                ? 'px-4 py-2 rounded-lg text-sm font-medium bg-lime-700 text-white border border-lime-400'
                : 'px-4 py-2 rounded-lg text-sm font-medium bg-surface-card border border-surface-border text-slate-400 hover:text-white'}>
              {cs.label} — {cs.description}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm text-slate-400">Step size h:</span>
          {H_VALUES.map((hv, i) => (
            <button key={i}
              onClick={() => { setHIdx(i); setResults({ euler: null, runge_kutta_4: null }) }}
              className={i === hIdx
                ? 'px-3 py-1 rounded-lg text-sm font-mono font-bold bg-lime-700 text-white border border-lime-400'
                : 'px-3 py-1 rounded-lg text-sm font-mono bg-surface-card border border-surface-border text-slate-400 hover:text-white'}>
              {hv}
            </button>
          ))}
        </div>
        <button onClick={runComparison} disabled={loading}
          className="btn-primary px-6 bg-lime-700 hover:bg-lime-600 border-lime-500">
          {loading ? 'Running...' : 'Run Comparison'}
        </button>
      </div>

      {allDone && (
        <>
          <div className="glass-card p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Results Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    {['Method', 'Order', 'Steps', `y(${cs.xEnd})`, 'Max |Error|', 'Error Ratio'].map(hd => (
                      <th key={hd} className="text-left py-2 px-3 text-slate-400">{hd}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {METHODS.map((m, mi) => {
                    const r = results[m.key]
                    if (!r) return null
                    const yFinal = r.y_values[r.y_values.length - 1]
                    const me = maxErrors[mi]
                    const ratio = mi === 1 && maxErrors[0] !== null && me !== null && me > 0
                      ? (maxErrors[0]! / me).toFixed(1)
                      : '—'
                    return (
                      <tr key={m.key} className="border-b border-surface-border/50">
                        <td className="py-2 px-3 font-medium" style={{ color: m.color }}>{m.label}</td>
                        <td className="py-2 px-3 font-mono text-xs text-slate-300">{mi === 0 ? 'O(h)' : 'O(h⁴)'}</td>
                        <td className="py-2 px-3 font-mono text-xs text-emerald-400">{r.steps}</td>
                        <td className="py-2 px-3 font-mono text-xs text-white">{yFinal.toFixed(8)}</td>
                        <td className="py-2 px-3 font-mono text-xs" style={{ color: me !== null && me < 1e-4 ? '#4ade80' : '#f87171' }}>
                          {me !== null ? me.toExponential(3) : 'N/A'}
                        </td>
                        <td className="py-2 px-3 font-mono text-xs text-cyan-400">{ratio}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="glass-card p-5">
              <h2 className="text-lg font-semibold text-white mb-3">Solution: y(x)</h2>
              <div className="h-56">
                <Plot
                  data={solutionTraces}
                  layout={{
                    ...DARK_LAYOUT,
                    xaxis: { ...DARK_LAYOUT.xaxis, title: { text: 'x', font: { color: '#94a3b8' } } },
                    yaxis: { ...DARK_LAYOUT.yaxis, title: { text: 'y(x)', font: { color: '#94a3b8' } } },
                  } as Partial<Plotly.Layout>}
                  config={{ displayModeBar: false, responsive: true }}
                  style={{ width: '100%', height: '224px' }}
                />
              </div>
            </div>

            {errorTraces.length > 0 && (
              <div className="glass-card p-5">
                <h2 className="text-lg font-semibold text-white mb-3">Error: |y_exact − y_approx|</h2>
                <div className="h-56">
                  <Plot
                    data={errorTraces}
                    layout={{
                      ...DARK_LAYOUT,
                      yaxis: { ...DARK_LAYOUT.yaxis, type: 'log', title: { text: '|error|', font: { color: '#94a3b8' } } },
                      xaxis: { ...DARK_LAYOUT.xaxis, title: { text: 'x', font: { color: '#94a3b8' } } },
                    } as Partial<Plotly.Layout>}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: '100%', height: '224px' }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Decision Guide</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {DECISION.map(d => (
            <div key={d.method} className="rounded-lg p-4 bg-surface-card border border-surface-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold" style={{ color: d.color }}>{d.method}</h3>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded font-mono bg-surface border border-surface-border text-slate-300">{d.order}</span>
                  <span className="px-2 py-0.5 rounded font-mono bg-surface border border-surface-border text-slate-300">{d.evals} eval/step</span>
                </div>
              </div>
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

      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold text-white mb-3">Convergence Orders: What to Expect</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {['Method', 'Global Order', 'Evals/step', 'Halve h → error', 'Stability (|hλ| <)'].map(hd => (
                  <th key={hd} className="text-left py-2 px-3 text-slate-400">{hd}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { method: "Euler", color: '#84cc16', order: '1st', evals: '1', ratio: '÷2', stab: '2' },
                { method: 'RK4',   color: '#f97316', order: '4th', evals: '4', ratio: '÷16', stab: '2.8' },
              ].map(row => (
                <tr key={row.method} className="border-b border-surface-border/50">
                  <td className="py-2 px-3 font-medium" style={{ color: row.color }}>{row.method}</td>
                  <td className="py-2 px-3 font-mono text-xs text-slate-300">{row.order}</td>
                  <td className="py-2 px-3 font-mono text-xs text-slate-300">{row.evals}</td>
                  <td className="py-2 px-3 font-mono text-xs text-cyan-400">{row.ratio}</td>
                  <td className="py-2 px-3 font-mono text-xs text-amber-400">{row.stab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
