import { useState, useCallback } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import { integrationService } from '@/services/integrationService'
import type { IntegrationResult, IntegrationMethod } from '@/types/api.types'

// ─── Case studies ─────────────────────────────────────────────────────────────

const CASE_STUDIES = [
  { label: 'sin(x)', expr: 'sin(x)', a: 0, b: Math.PI, exact: 2.0 },
  { label: 'eˣ', expr: 'exp(x)', a: 0, b: 1, exact: Math.E - 1 },
  { label: 'x³', expr: 'x**3', a: 0, b: 1, exact: 0.25 },
  { label: '1/(1+x²)', expr: '1/(1+x**2)', a: 0, b: 1, exact: Math.PI / 4 },
  { label: 'cos(x)', expr: 'cos(x)', a: 0, b: Math.PI / 2, exact: 1.0 },
]

const METHODS: { key: IntegrationMethod; label: string; color: string; n: number }[] = [
  { key: 'trapezoidal',        label: 'Trapezoidal',     color: '#60a5fa', n: 10 },
  { key: 'simpsons',           label: "Simpson's 1/3",  color: '#34d399', n: 10 },
  { key: 'gaussian_quadrature', label: 'Gauss (5-pt)',   color: '#f59e0b', n: 5 },
]

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 55, r: 20, t: 30, b: 50 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8', title: { text: 'n (subintervals / Gauss pts)' } },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8', title: { text: 'Absolute Error' }, type: 'log' },
  showlegend: true,
  legend: { bgcolor: 'rgba(15,23,42,0.8)', bordercolor: '#334155', borderwidth: 1 },
  autosize: true,
}

type MethodKey = IntegrationMethod

// ─── Component ────────────────────────────────────────────────────────────────

export default function IntegrationComparisonPage() {
  const [caseIdx,   setCaseIdx]   = useState(0)
  const [results,   setResults]   = useState<Record<MethodKey, IntegrationResult | null>>({
    trapezoidal: null, simpsons: null, gaussian_quadrature: null,
    simpsons_3_8: null, romberg: null,
  })
  const [loading, setLoading] = useState(false)
  const [compError, setCompError] = useState<string | null>(null)

  const cs = CASE_STUDIES[caseIdx]

  const runComparison = useCallback(async () => {
    setLoading(true)
    setCompError(null)
    try {
      const [trap, simp, gauss] = await Promise.all([
        integrationService.integrate({ expression: cs.expr, a: cs.a, b: cs.b, n: 10, method: 'trapezoidal' }),
        integrationService.integrate({ expression: cs.expr, a: cs.a, b: cs.b, n: 10, method: 'simpsons' }),
        integrationService.integrate({ expression: cs.expr, a: cs.a, b: cs.b, n: 5, method: 'gaussian_quadrature' }),
      ])
      setResults(prev => ({ ...prev, trapezoidal: trap, simpsons: simp, gaussian_quadrature: gauss }))
    } catch (err) {
      setCompError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [cs])

  // Convergence chart — estimated errors vs n
  const nRange = {
    trapezoidal: [4, 8, 16, 32, 64, 128, 256],
    simpsons:    [4, 8, 16, 32, 64, 128, 256],
    gaussian_quadrature: [2, 3, 4, 5],
  }

  const convergenceTraces: Plotly.Data[] = METHODS.map(m => {
    const ns = nRange[m.key as keyof typeof nRange]
    const baseErr = results[m.key]?.absolute_error ?? 1e-3
    const baseN = m.key === 'gaussian_quadrature' ? 5 : 10
    const order = m.key === 'gaussian_quadrature' ? 8 : m.key === 'simpsons' ? 4 : 2
    const ys = ns.map(n => baseErr * Math.pow(baseN / n, order))
    return {
      x: ns, y: ys,
      type: 'scatter', mode: 'lines+markers',
      name: m.label,
      line: { color: m.color, width: 2 },
      marker: { color: m.color, size: 6 },
    }
  })

  const insights = [
    {
      title: "Simpson's vs Trapezoidal at n=10",
      body: "Simpson's rule is ~1000× more accurate than trapezoidal at the same n for smooth functions, " +
            "because O(h⁴) vs O(h²) means 10⁴ vs 10² accuracy at h=0.1.",
    },
    {
      title: 'Gauss 5-point vs Simpson n=100',
      body: '5-point Gauss achieves ~12-digit accuracy on smooth integrands, ' +
            "while Simpson's with 100 points gives only ~8 digits. Exponential vs polynomial convergence.",
    },
    {
      title: 'When trapezoidal wins',
      body: 'For periodic functions on full periods, the trapezoidal rule achieves spectral (exponential) ' +
            "convergence — outperforming even Gaussian quadrature for certain integrands.",
    },
    {
      title: 'Practical choice guide',
      body: 'Tabulated/non-smooth data: Trapezoidal. General smooth integrals: Simpson\'s. ' +
            'Maximum accuracy per evaluation (FEA, smooth analytic): Gaussian quadrature.',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20">
            Integration
          </span>
          <span className="text-slate-500 text-sm">Comparison Center</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Integration Methods Comparison</h1>
        <p className="text-slate-400">
          Compare trapezoidal, Simpson's, and Gaussian quadrature on the same problems.
          Understand when each method shines and when it fails.
        </p>
      </div>

      {compError && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {compError}
        </div>
      )}

      {/* Case study selector */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Select Test Integral</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {CASE_STUDIES.map((cs, i) => (
            <button
              key={cs.label}
              onClick={() => { setCaseIdx(i); setResults(prev => ({ ...prev, trapezoidal: null, simpsons: null, gaussian_quadrature: null })) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                caseIdx === i ? 'bg-pink-500 text-white' : 'bg-surface text-slate-400 hover:text-white'
              }`}
            >
              {cs.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            <span className="text-white font-mono">∫{cs.label} dx</span>
            <span className="ml-2">on [{cs.a.toFixed(4)}, {cs.b.toFixed(4)}]</span>
            <span className="ml-2 text-pink-400">Exact = {cs.exact.toFixed(8)}</span>
          </div>
          <button
            onClick={runComparison}
            disabled={loading}
            className="btn-primary px-4"
          >
            {loading ? 'Running...' : 'Run Comparison'}
          </button>
        </div>
      </div>

      {/* Results table */}
      {(results.trapezoidal || results.simpsons || results.gaussian_quadrature) && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Side-by-Side Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left text-slate-400 pb-2 pr-4">Method</th>
                  <th className="text-right text-slate-400 pb-2 pr-4">∫ f dx</th>
                  <th className="text-right text-slate-400 pb-2 pr-4">Abs Error</th>
                  <th className="text-right text-slate-400 pb-2 pr-4">Rel Error</th>
                  <th className="text-right text-slate-400 pb-2">n</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {METHODS.map(m => {
                  const r = results[m.key]
                  return (
                    <tr key={m.key}>
                      <td className="py-2 pr-4">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                          <span className="font-medium text-white">{m.label}</span>
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right font-mono text-slate-300">
                        {r ? r.integral.toFixed(10) : '—'}
                      </td>
                      <td className="py-2 pr-4 text-right font-mono" style={{ color: m.color }}>
                        {r?.absolute_error != null ? r.absolute_error.toExponential(4) : '—'}
                      </td>
                      <td className="py-2 pr-4 text-right font-mono text-slate-400">
                        {r?.relative_error != null ? (r.relative_error * 100).toFixed(6) + '%' : '—'}
                      </td>
                      <td className="py-2 text-right text-slate-400">{m.n}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Convergence chart */}
      {results.trapezoidal && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Convergence Comparison</h2>
          <p className="text-sm text-slate-400 mb-4">
            Log-log plot of absolute error vs n. Slope = convergence order.
          </p>
          <div className="h-64 rounded-lg overflow-hidden bg-surface">
            <Plot
              data={convergenceTraces}
              layout={DARK_LAYOUT as Partial<Plotly.Layout>}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )}

      {/* Decision guide */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Decision Guide</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              method: 'Trapezoidal',
              color: '#60a5fa',
              use: ['Tabulated / non-smooth data', 'Periodic functions on full periods', 'Simple prototyping', 'Sensor data integration'],
              avoid: ['High-precision smooth integrals', 'Limited function evaluations'],
              order: 'O(h²)',
            },
            {
              method: "Simpson's 1/3",
              color: '#34d399',
              use: ['General-purpose smooth integrals', 'Engineering default', 'Medium precision (6–8 digits)', 'Adaptive quadrature base'],
              avoid: ['Non-smooth or tabulated data', 'Very high precision needs'],
              order: 'O(h⁴)',
            },
            {
              method: 'Gaussian Quadrature',
              color: '#f59e0b',
              use: ['FEA element integrals', 'Maximum precision per evaluation', 'Smooth analytic functions', 'High-performance computing'],
              avoid: ['Tabulated data', 'Non-smooth / singular integrands', 'When equal-spacing is required'],
              order: 'Exponential',
            },
          ].map(m => (
            <div key={m.method} className="bg-surface rounded-lg p-4 border" style={{ borderColor: m.color + '40' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">{m.method}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: m.color + '20', color: m.color }}>
                  {m.order}
                </span>
              </div>
              <div className="mb-3">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Use when</div>
                <ul className="space-y-1">
                  {m.use.map(u => (
                    <li key={u} className="text-xs text-slate-300 flex gap-1.5">
                      <span style={{ color: m.color }}>✓</span> {u}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Avoid when</div>
                <ul className="space-y-1">
                  {m.avoid.map(a => (
                    <li key={a} className="text-xs text-slate-400 flex gap-1.5">
                      <span className="text-red-400">✗</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick formula reference */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Formula Reference</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              method: 'Trapezoidal',
              color: '#60a5fa',
              formula: 'h/2 [f₀ + 2f₁ + 2f₂ + ... + 2fₙ₋₁ + fₙ]',
              error: '−(b−a)h²f′′(ξ)/12',
              constraint: 'Any n ≥ 1',
            },
            {
              method: "Simpson's 1/3",
              color: '#34d399',
              formula: 'h/3 [f₀ + 4f₁ + 2f₂ + 4f₃ + ... + 4fₙ₋₁ + fₙ]',
              error: '−(b−a)h⁴f⁽⁴⁾(ξ)/180',
              constraint: 'n must be even',
            },
            {
              method: 'Gauss–Legendre',
              color: '#f59e0b',
              formula: '(b−a)/2 · Σ wᵢ f(transformed xᵢ)',
              error: 'Exponential in n',
              constraint: 'n = Gauss points (table)',
            },
          ].map(m => (
            <div key={m.method} className="bg-surface rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="font-medium text-white text-sm">{m.method}</span>
              </div>
              <div className="text-xs font-mono text-slate-300 bg-surface-card rounded p-2 mb-2">{m.formula}</div>
              <div className="text-xs text-slate-400"><span className="text-red-400">Error:</span> {m.error}</div>
              <div className="text-xs text-slate-400 mt-1"><span className="text-yellow-400">Note:</span> {m.constraint}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight challenges */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Insight Challenges</h2>
        <div className="space-y-3">
          {insights.map((ins, i) => (
            <details key={i} className="group bg-surface rounded-lg overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer select-none">
                <span className="text-white font-medium text-sm">{ins.title}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-300">{ins.body}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
