import { useState, useCallback } from 'react'
import Plot from 'react-plotly.js'
import { clsx } from 'clsx'
import { interpolationService } from '@/services/interpolationService'
import type { InterpolationResult } from '@/types/api.types'

// ─── Presets ──────────────────────────────────────────────────────────────────

interface CaseStudy {
  id: string
  label: string
  description: string
  icon: string
  xs: number[]
  ys: number[]
  qs: number[]
  known?: (x: number) => number
  knownLabel?: string
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'sin',
    label: 'sin(x)',
    description: 'Smooth function — both methods should perform well',
    icon: '〰',
    xs: [0, 1, 2, 3, 4, 5],
    ys: [0, 0.8415, 0.9093, 0.1411, -0.7568, -0.9589],
    qs: [0.5, 1.5, 2.5, 3.5, 4.5],
    known: (x) => Math.sin(x),
    knownLabel: 'sin(x)',
  },
  {
    id: 'runge',
    label: 'Runge function',
    description: '1/(1+x²) — Lagrange oscillates, spline stays smooth',
    icon: '🌊',
    xs: [-3, -2, -1, 0, 1, 2, 3],
    ys: [0.1, 0.2, 0.5, 1.0, 0.5, 0.2, 0.1],
    qs: [-2.5, -1.5, 0, 1.5, 2.5],
    known: (x) => 1 / (1 + x * x),
    knownLabel: '1/(1+x²)',
  },
  {
    id: 'exp',
    label: 'eˣ',
    description: 'Exponential growth — tests endpoint behavior',
    icon: '📈',
    xs: [0, 1, 2, 3, 4],
    ys: [1, 2.718, 7.389, 20.086, 54.598],
    qs: [0.5, 1.5, 2.5, 3.5],
    known: (x) => Math.exp(x),
    knownLabel: 'eˣ',
  },
  {
    id: 'noisy',
    label: 'Heart rate',
    description: 'Non-monotone medical signal — spline gives smooth result',
    icon: '🏥',
    xs: [0, 1, 2, 3, 4, 5, 6, 7],
    ys: [72, 75, 82, 90, 85, 78, 74, 72],
    qs: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5],
  },
  {
    id: 'yield',
    label: 'Yield curve',
    description: 'Bond yields — financial standard for smooth interpolation',
    icon: '💰',
    xs: [0.25, 0.5, 1, 2, 5, 10, 30],
    ys: [4.8, 4.9, 4.85, 4.7, 4.4, 4.3, 4.5],
    qs: [3, 7, 15, 20, 25],
  },
]

// ─── Plotly dark config ───────────────────────────────────────────────────────

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 55, r: 20, t: 35, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.01, y: 0.98 },
}
const PLOTLY_CONFIG = { displayModeBar: false, responsive: true }

// ─── Compare result type ──────────────────────────────────────────────────────

interface CompareState {
  lagrange: InterpolationResult | null
  spline: InterpolationResult | null
  lagrangeError: string | null
  splineError: string | null
  elapsedLagrange: number
  elapsedSpline: number
}

// ─── Max error calculation ────────────────────────────────────────────────────

function maxError(result: InterpolationResult, known: (x: number) => number): number {
  return Math.max(...result.query_points.map((x, i) =>
    Math.abs(result.interpolated_values[i] - known(x))
  ))
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InterpolationComparisonPage() {
  const [caseIdx,  setCaseIdx]  = useState(0)
  const [compare,  setCompare]  = useState<CompareState | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const cs = CASE_STUDIES[caseIdx]

  const safeCall = async (fn: () => Promise<InterpolationResult>): Promise<[InterpolationResult | null, string | null, number]> => {
    const t0 = performance.now()
    try {
      const r = await fn()
      return [r, null, performance.now() - t0]
    } catch (e) {
      return [null, String(e), performance.now() - t0]
    }
  }

  const handleRun = useCallback(async () => {
    setLoading(true)
    setCompare(null)
    const [lagRes, lagErr, lagMs] = await safeCall(() =>
      interpolationService.interpolate({ x_points: cs.xs, y_points: cs.ys, query_points: cs.qs, method: 'lagrange' })
    )
    const [splRes, splErr, splMs] = await safeCall(() =>
      interpolationService.interpolate({ x_points: cs.xs, y_points: cs.ys, query_points: cs.qs, method: 'cubic_spline' })
    )
    setCompare({ lagrange: lagRes, spline: splRes, lagrangeError: lagErr, splineError: splErr, elapsedLagrange: lagMs, elapsedSpline: splMs })
    setLoading(false)
  }, [caseIdx, cs]) // eslint-disable-line react-hooks/exhaustive-deps

  // Determine winner badges
  const lagErr = compare?.lagrange && cs.known ? maxError(compare.lagrange, cs.known) : null
  const splErr = compare?.spline  && cs.known  ? maxError(compare.spline, cs.known)   : null
  const moreAccurate = lagErr !== null && splErr !== null
    ? (lagErr < splErr ? 'lagrange' : splErr < lagErr ? 'spline' : null)
    : null
  const faster = compare
    ? compare.elapsedLagrange < compare.elapsedSpline ? 'lagrange' : 'spline'
    : null

  // Build comparison curve plot
  const curvePlot: Plotly.Data[] = []
  if (compare?.lagrange) {
    curvePlot.push({ x: compare.lagrange.curve_x, y: compare.lagrange.curve_y, type: 'scatter', mode: 'lines', line: { color: '#60a5fa', width: 2 }, name: 'Lagrange' })
    curvePlot.push({ x: compare.lagrange.query_points, y: compare.lagrange.interpolated_values, type: 'scatter', mode: 'markers', marker: { color: '#60a5fa', size: 7, symbol: 'diamond' }, name: 'Lagrange queries', showlegend: false } as Plotly.Data)
  }
  if (compare?.spline) {
    curvePlot.push({ x: compare.spline.curve_x, y: compare.spline.curve_y, type: 'scatter', mode: 'lines', line: { color: '#34d399', width: 2, dash: 'dash' }, name: 'Cubic Spline' })
    curvePlot.push({ x: compare.spline.query_points, y: compare.spline.interpolated_values, type: 'scatter', mode: 'markers', marker: { color: '#34d399', size: 7, symbol: 'diamond' }, name: 'Spline queries', showlegend: false } as Plotly.Data)
  }
  if (cs.known) {
    const knownX = Array.from({ length: 200 }, (_, i) => cs.xs[0] + (cs.xs[cs.xs.length - 1] - cs.xs[0]) * i / 199)
    curvePlot.push({ x: knownX, y: knownX.map(cs.known), type: 'scatter', mode: 'lines', line: { color: 'rgba(255,255,255,0.3)', width: 1, dash: 'dot' }, name: cs.knownLabel ?? 'True f(x)' })
  }
  // Data points
  curvePlot.push({ x: cs.xs, y: cs.ys, type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 9, symbol: 'circle', line: { color: '#fff', width: 1 } }, name: 'Data nodes' } as Plotly.Data)

  // Challenge items
  const challenges = [
    {
      id: 'ch1', title: 'Why does Runge\'s function favor splines?',
      hint: 'Lagrange uses a single global polynomial of degree n. For 1/(1+x²) on [-3,3], the degree-6 polynomial overshoots between nodes.',
      body: 'The Runge preset demonstrates Lagrange\'s vulnerability to endpoint oscillations when the function has steep variations. Cubic spline stays local — its segments only interact through smoothness conditions — so it cannot oscillate globally.',
    },
    {
      id: 'ch2', title: 'When does Lagrange beat cubic spline?',
      hint: 'Try the x² preset. Lagrange with degree ≥ 2 reproduces any polynomial exactly.',
      body: 'If the underlying function IS a polynomial of degree ≤ n, Lagrange with n+1 nodes reproduces it exactly with zero error. Cubic spline (degree 3 per segment) still has error proportional to the 4th derivative — so for degree-3-or-less data, a 4-point Lagrange wins.',
    },
    {
      id: 'ch3', title: 'What happens at the endpoints?',
      hint: 'Natural spline has S\'\'=0 at endpoints, which may not match the true curvature.',
      body: 'Natural cubic spline imposes zero second derivative at both endpoints. This is "free end" boundary condition. If the true function has significant curvature at the endpoints (like eˣ), the spline endpoint segments are slightly less accurate than interior ones.',
    },
    {
      id: 'ch4', title: 'Performance: O(n) vs O(n²)',
      hint: 'Lagrange eval at one point costs O(n) — but precomputing barycentric weights is O(n²). Spline solve is O(n) (Thomas algorithm).',
      body: 'For n=100 data points: Lagrange evaluation at one point costs ~n multiplications. Cubic spline: solve O(n) tridiagonal system ONCE, then each evaluation is O(1) after a binary search. For repeated evaluations or large n, cubic splines dominate on performance.',
    },
  ]

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">Interpolation Comparison Center</h1>
        <p className="text-slate-400 text-sm">
          Run Lagrange and Cubic Spline side by side on the same dataset. Compare accuracy, smoothness, and speed.
        </p>
      </div>

      {/* Case study selector */}
      <div className="glass-card p-4 space-y-4">
        <p className="section-label">Dataset</p>
        <div className="flex flex-wrap gap-2">
          {CASE_STUDIES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => { setCaseIdx(i); setCompare(null) }}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                i === caseIdx
                  ? 'bg-brand-600 text-white border border-brand-500'
                  : 'bg-surface-card border border-surface-border text-slate-300 hover:border-brand-500/50 hover:text-white',
              )}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-400">{cs.description}</p>
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span>Nodes: [{cs.xs.join(', ')}]</span>
          <span>Query: [{cs.qs.join(', ')}]</span>
        </div>
        <button
          onClick={handleRun}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Computing…' : 'Run Both Methods'}
        </button>
      </div>

      {/* Results */}
      {compare && (
        <>
          {/* Method cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'lagrange', label: 'Lagrange Polynomial', color: '#60a5fa', result: compare.lagrange, err: compare.lagrangeError, ms: compare.elapsedLagrange, maxErr: lagErr },
              { key: 'spline',   label: 'Cubic Spline',        color: '#34d399', result: compare.spline,   err: compare.splineError,   ms: compare.elapsedSpline,   maxErr: splErr },
            ].map(({ key, label, color, result: r, err, ms, maxErr: me }) => (
              <div key={key} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                    <span className="font-semibold text-white text-sm">{label}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {faster === key && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400">⚡ Faster</span>
                    )}
                    {moreAccurate === key && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400">✓ More Accurate</span>
                    )}
                  </div>
                </div>

                {err ? (
                  <p className="text-xs text-red-400">{err}</p>
                ) : r ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded bg-surface-card p-2 text-center">
                      <div className="font-mono text-slate-200">{ms.toFixed(1)} ms</div>
                      <div className="text-slate-500 mt-0.5">Time</div>
                    </div>
                    <div className="rounded bg-surface-card p-2 text-center">
                      <div className="font-mono text-slate-200">{r.query_points.length}</div>
                      <div className="text-slate-500 mt-0.5">Query pts</div>
                    </div>
                    {me !== null && (
                      <div className="rounded bg-surface-card p-2 text-center col-span-2">
                        <div className="font-mono text-rose-400">{me.toExponential(3)}</div>
                        <div className="text-slate-500 mt-0.5">Max error vs {cs.knownLabel}</div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Curve comparison plot */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-surface-border">
              <h3 className="text-sm font-semibold text-white">Curve Comparison</h3>
              <p className="text-xs text-slate-400 mt-0.5">Both interpolants plotted on the same axes. Dashed = spline, solid = Lagrange. {cs.knownLabel && `Dotted = true ${cs.knownLabel}.`}</p>
            </div>
            <Plot
              data={curvePlot}
              layout={{ ...DARK_LAYOUT } as Partial<Plotly.Layout>}
              config={PLOTLY_CONFIG}
              style={{ width: '100%', height: '320px' }}
            />
          </div>

          {/* Query value table */}
          {compare.lagrange && compare.spline && (
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-surface-border">
                <h3 className="text-sm font-semibold text-white">Interpolated Values at Query Points</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="px-4 py-2.5 text-left text-slate-400 uppercase tracking-wider">#</th>
                      <th className="px-4 py-2.5 text-left text-slate-400 uppercase tracking-wider">x</th>
                      <th className="px-4 py-2.5 text-left text-blue-400 uppercase tracking-wider">Lagrange</th>
                      <th className="px-4 py-2.5 text-left text-green-400 uppercase tracking-wider">Cubic Spline</th>
                      {cs.known && <th className="px-4 py-2.5 text-left text-slate-400 uppercase tracking-wider">True f(x)</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {compare.lagrange.query_points.map((x, i) => {
                      const lag = compare.lagrange!.interpolated_values[i]
                      const spl = compare.spline!.interpolated_values[i]
                      const truth = cs.known?.(x)
                      return (
                        <tr key={i} className="border-b border-surface-border/50 last:border-0 hover:bg-surface-hover/20">
                          <td className="px-4 py-2 text-slate-500">{i + 1}</td>
                          <td className="px-4 py-2 text-slate-300 font-mono">{x.toFixed(4)}</td>
                          <td className="px-4 py-2 text-blue-300 font-mono">{lag.toFixed(6)}</td>
                          <td className="px-4 py-2 text-green-300 font-mono">{spl.toFixed(6)}</td>
                          {truth !== undefined && <td className="px-4 py-2 text-slate-400 font-mono">{truth.toFixed(6)}</td>}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Decision Guide */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Decision Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              color: 'blue',
              border: 'border-blue-500/30',
              bg: 'bg-blue-500/5',
              title: 'Use Lagrange when…',
              items: [
                'You have ≤ 6 data points and the function is polynomial-like',
                'You need an exact polynomial for symbolic computation',
                'Working on a small problem where simplicity beats efficiency',
                'The data came from a polynomial (Lagrange reproduces it exactly)',
              ],
            },
            {
              color: 'green',
              border: 'border-green-500/30',
              bg: 'bg-green-500/5',
              title: 'Use Cubic Spline when…',
              items: [
                'You have ≥ 6 data points or the interval is large',
                'Smoothness and no kinks are required (graphics, CAD, signals)',
                'Equally-spaced nodes and you fear Runge\'s phenomenon',
                'Updating the interpolant as new data arrives (efficient re-solve)',
              ],
            },
          ].map(({ border, bg, title, items }) => (
            <div key={title} className={clsx('rounded-xl border p-4 space-y-2', border, bg)}>
              <p className="font-semibold text-white text-sm">{title}</p>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="text-xs text-slate-300 flex gap-2">
                    <span className="text-slate-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive challenges */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Challenges</h3>
        {challenges.map((ch) => (
          <div key={ch.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === ch.id ? null : ch.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-hover/20 transition-colors"
            >
              <span className="font-medium text-white text-sm">{ch.title}</span>
              <span className="text-slate-500">{expanded === ch.id ? '▲' : '▼'}</span>
            </button>
            {expanded === ch.id && (
              <div className="px-5 pb-4 border-t border-surface-border space-y-3 pt-3">
                <p className="text-xs text-slate-400 leading-relaxed">{ch.body}</p>
                <div className="rounded-lg bg-surface-card p-3 border border-surface-border">
                  <p className="text-xs text-brand-300 font-medium mb-1">Hint</p>
                  <p className="text-xs text-slate-400">{ch.hint}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
