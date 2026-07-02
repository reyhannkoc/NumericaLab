import { useState, useCallback } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import { linearSystemsService } from '@/services/linearSystemsService'
import type { LinearSystemResult, LinearSolverMethod } from '@/types/api.types'

const SYSTEMS = [
  {
    label: '3×3 SDD',
    description: 'Strictly diagonally dominant',
    a: [[5,-1,0],[-1,5,-1],[0,-1,5]],
    b: [4,3,4],
    exact: [1, 1, 1],
  },
  {
    label: '4×4 SDD',
    description: 'Larger tridiagonal system',
    a: [[6,-1,0,0],[-1,6,-1,0],[0,-1,6,-1],[0,0,-1,6]],
    b: [5,4,4,5],
    exact: null,
  },
  {
    label: '3×3 Truss',
    description: 'Structural engineering',
    a: [[10,2,1],[2,8,1],[1,1,5]],
    b: [12,11,7],
    exact: null,
  },
]

type SolverKey = Extract<LinearSolverMethod, 'gaussian_elimination' | 'gauss_seidel' | 'jacobi'>

const METHODS: { key: SolverKey; label: string; color: string }[] = [
  { key: 'gaussian_elimination', label: 'Gauss. Elim.', color: '#14b8a6' },
  { key: 'gauss_seidel',         label: 'Gauss–Seidel', color: '#22d3ee' },
  { key: 'jacobi',               label: 'Jacobi',       color: '#a78bfa' },
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

export default function LinearComparisonPage() {
  const [sysIdx, setSysIdx] = useState(0)
  const [results, setResults] = useState<Record<SolverKey, LinearSystemResult | null>>({
    gaussian_elimination: null,
    gauss_seidel: null,
    jacobi: null,
  })
  const [loading, setLoading] = useState(false)
  const [compError, setCompError] = useState<string | null>(null)

  const sys = SYSTEMS[sysIdx]

  const runComparison = useCallback(async () => {
    setLoading(true)
    setCompError(null)
    try {
      const [ge, gs, j] = await Promise.all([
        linearSystemsService.solve({ matrix_a: sys.a, vector_b: sys.b, method: 'gaussian_elimination' }),
        linearSystemsService.solve({ matrix_a: sys.a, vector_b: sys.b, method: 'gauss_seidel', tolerance: 1e-10, max_iterations: 200 }),
        linearSystemsService.solve({ matrix_a: sys.a, vector_b: sys.b, method: 'jacobi', tolerance: 1e-10, max_iterations: 400 }),
      ])
      setResults({ gaussian_elimination: ge, gauss_seidel: gs, jacobi: j })
    } catch (err) {
      setCompError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [sysIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // Convergence chart (iterative methods)
  const convergenceTraces: Plotly.Data[] = METHODS.filter(m => m.key !== 'gaussian_elimination').map(m => {
    const iters = results[m.key]?.iterations
    if (!iters || iters.length === 0) return null
    return {
      x: iters.map(it => it.iteration),
      y: iters.map(it => Math.max(it.error, 1e-15)),
      type: 'scatter', mode: 'lines+markers',
      name: m.label,
      line: { color: m.color, width: 2 },
      marker: { color: m.color, size: 5 },
    } as Plotly.Data
  }).filter(Boolean) as Plotly.Data[]

  const DECISION = [
    {
      method: 'Gaussian Elimination',
      color: '#14b8a6',
      use: ['Small–medium dense systems (n < 500)', 'Need exact solution', 'One-off solve'],
      avoid: ['Large sparse systems (n > 10⁴)', 'Massively parallel hardware'],
    },
    {
      method: 'Gauss–Seidel',
      color: '#22d3ee',
      use: ['Large sparse SDD or SPD systems', 'CPU serial code', 'When fast convergence needed'],
      avoid: ['GPU / massively parallel', 'Non-SDD with unknown spectral radius'],
    },
    {
      method: 'Jacobi',
      color: '#a78bfa',
      use: ['GPU / distributed HPC', 'Embarrassingly parallel architecture', 'Large SDD systems'],
      avoid: ['Single-core serial code (GS faster)', 'Non-SDD systems'],
    },
  ]

  const allDone = METHODS.every(m => results[m.key] !== null)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">Linear Systems: Method Comparison</h1>
        <p className="text-slate-400 text-sm">Direct (Gaussian elimination) vs iterative (Gauss-Seidel, Jacobi) solvers</p>
      </div>

      {compError && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {compError}
        </div>
      )}

      {/* System selector */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Select Test System</h2>
        <div className="flex flex-wrap gap-3">
          {SYSTEMS.map((s, i) => (
            <button
              type="button"
              key={i}
              onClick={() => { setSysIdx(i); setResults({ gaussian_elimination: null, gauss_seidel: null, jacobi: null }) }}
              className={i === sysIdx
                ? 'px-4 py-2 rounded-lg text-sm font-medium bg-teal-500 text-white border border-teal-400'
                : 'px-4 py-2 rounded-lg text-sm font-medium bg-surface-card border border-surface-border text-slate-400 hover:text-white'}
            >
              {s.label} — {s.description}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={runComparison}
          disabled={loading}
          className="btn-primary px-6 bg-teal-600 hover:bg-teal-500 border-teal-500"
        >
          {loading ? 'Running all methods...' : 'Run Comparison'}
        </button>
      </div>

      {/* Results table */}
      {allDone && (
        <div className="glass-card p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-2 px-3 text-slate-400">Method</th>
                  {results.gaussian_elimination?.solution.map((_, i) => (
                    <th key={i} className="text-center py-2 px-3 text-slate-400">x{i+1}</th>
                  ))}
                  <th className="text-center py-2 px-3 text-slate-400">‖Ax−b‖</th>
                  <th className="text-center py-2 px-3 text-slate-400">Iters</th>
                  <th className="text-center py-2 px-3 text-slate-400">Time (ms)</th>
                </tr>
              </thead>
              <tbody>
                {METHODS.map(m => {
                  const r = results[m.key]
                  if (!r) return null
                  return (
                    <tr key={m.key} className="border-b border-surface-border/50 hover:bg-surface-card/50 transition-colors">
                      <td className="py-2 px-3 font-medium" style={{ color: m.color }}>{m.label}</td>
                      {r.solution.map((xi, i) => (
                        <td key={i} className="text-center py-2 px-3 font-mono text-xs text-white">{xi.toFixed(8)}</td>
                      ))}
                      <td className="text-center py-2 px-3 font-mono text-xs text-amber-400">{r.residual.toExponential(3)}</td>
                      <td className="text-center py-2 px-3 font-mono text-xs text-emerald-400">{r.iterations?.length ?? '—'}</td>
                      <td className="text-center py-2 px-3 font-mono text-xs text-slate-400">{r.execution_time_ms.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Convergence chart */}
      {convergenceTraces.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Convergence: ‖error‖ vs Iteration</h2>
          <div className="h-64">
            <Plot
              data={convergenceTraces}
              layout={{
                ...DARK_LAYOUT,
                yaxis: { ...DARK_LAYOUT.yaxis, type: 'log', title: { text: '‖x⁽ᵏ⁾ − x*‖', font: { color: '#94a3b8' } } },
                xaxis: { ...DARK_LAYOUT.xaxis, title: { text: 'Iteration k', font: { color: '#94a3b8' } } },
              } as Partial<Plotly.Layout>}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '256px' }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Gauss-Seidel typically converges in ~half the iterations of Jacobi (ρ_GS = ρ_J²)
          </p>
        </div>
      )}

      {/* Decision guide */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Decision Guide</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {DECISION.map(d => (
            <div key={d.method} className="rounded-lg p-4 bg-surface-card border border-surface-border">
              <h3 className="font-semibold mb-3" style={{ color: d.color }}>{d.method}</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-emerald-400 mb-1">✓ Use when</p>
                  {d.use.map((u, i) => <p key={i} className="text-xs text-slate-300">• {u}</p>)}
                </div>
                <div>
                  <p className="text-xs font-medium text-red-400 mb-1 mt-2">✗ Avoid when</p>
                  {d.avoid.map((a, i) => <p key={i} className="text-xs text-slate-400">• {a}</p>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity summary */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Complexity Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {['Method', 'Time', 'Space', 'Convergence', 'Parallel', 'Requires'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { method: 'Gauss. Elim.', color: '#14b8a6', time: 'O(n³/3)', space: 'O(n²)', conv: 'Exact', par: 'Partial', req: 'a_ii ≠ 0' },
                { method: 'Gauss–Seidel', color: '#22d3ee', time: 'O(k·nnz)', space: 'O(n)', conv: 'Linear ρ_GS', par: '❌', req: 'SDD or SPD' },
                { method: 'Jacobi', color: '#a78bfa', time: 'O(k·nnz/p)', space: 'O(2n)', conv: 'Linear ρ_J', par: '✓ Full', req: 'Strict SDD' },
              ].map(r => (
                <tr key={r.method} className="border-b border-surface-border/50">
                  <td className="py-2 px-3 font-medium" style={{ color: r.color }}>{r.method}</td>
                  <td className="py-2 px-3 font-mono text-xs text-white">{r.time}</td>
                  <td className="py-2 px-3 font-mono text-xs text-white">{r.space}</td>
                  <td className="py-2 px-3 text-xs text-slate-300">{r.conv}</td>
                  <td className="py-2 px-3 text-xs text-slate-300">{r.par}</td>
                  <td className="py-2 px-3 text-xs text-slate-400">{r.req}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
