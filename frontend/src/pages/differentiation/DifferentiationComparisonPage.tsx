import { useState, useCallback } from 'react'
import Plot from 'react-plotly.js'
import { clsx } from 'clsx'
import { differentiationService } from '@/services/differentiationService'
import type { DifferentiationResult } from '@/types/api.types'

// ─── Case studies ─────────────────────────────────────────────────────────────

interface CaseStudy {
  id: string
  label: string
  icon: string
  description: string
  expression: string
  xPoint: number
  exact: number
  exactLabel: string
}

const CASE_STUDIES: CaseStudy[] = [
  { id: 'sin',  label: 'sin(x)',  icon: '〰',  description: "f'(1) = cos(1) ≈ 0.5403",       expression: 'sin(x)',   xPoint: 1,      exact: Math.cos(1),    exactLabel: 'cos(1)' },
  { id: 'exp',  label: 'eˣ',     icon: '📈', description: "f'(1) = e ≈ 2.7183",             expression: 'exp(x)',   xPoint: 1,      exact: Math.exp(1),    exactLabel: 'e' },
  { id: 'cube', label: 'x³',     icon: '3️⃣', description: "f'(2) = 3×4 = 12",              expression: 'x**3',     xPoint: 2,      exact: 12,             exactLabel: '12' },
  { id: 'log',  label: 'ln(x)',  icon: '📉', description: "f'(2) = 1/2 = 0.5",              expression: 'log(x)',   xPoint: 2,      exact: 0.5,            exactLabel: '0.5' },
  { id: 'cos',  label: 'cos(x)', icon: '🌀', description: "f'(π/4) = −sin(π/4) ≈ −0.7071", expression: 'cos(x)',   xPoint: Math.PI/4, exact: -Math.sin(Math.PI/4), exactLabel: '−sin(π/4)' },
]

const H_SWEEP = [1.0, 0.5, 0.2, 0.1, 0.05, 0.01, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8]

// ─── Plotly config ────────────────────────────────────────────────────────────

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 60, r: 20, t: 35, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.01, y: 0.98 },
}
const PLOTLY_CFG = { displayModeBar: false, responsive: true }

type MethodKey = 'forward' | 'backward' | 'central'

const METHOD_COLOR: Record<MethodKey, string> = {
  forward:  '#60a5fa',
  backward: '#f87171',
  central:  '#34d399',
}

const METHOD_LABEL: Record<MethodKey, string> = {
  forward:  'Forward',
  backward: 'Backward',
  central:  'Central',
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface MethodResult {
  result: DifferentiationResult | null
  error: string | null
  elapsed: number
}

interface CompareState {
  forward:  MethodResult
  backward: MethodResult
  central:  MethodResult
  errorData: { h_values: number[]; errors: Record<string, number[]> } | null
}

// ─── Component ────────────────────────────────────────────────────────────────

const fmt = (v: number | undefined | null) =>
  v == null ? '—' : Math.abs(v) > 1e-3 && Math.abs(v) < 1e5 ? v.toPrecision(8) : v.toExponential(4)

export default function DifferentiationComparisonPage() {
  const [caseIdx,  setCaseIdx]  = useState(0)
  const [h,        setH]        = useState(1e-5)
  const [compare,  setCompare]  = useState<CompareState | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const cs = CASE_STUDIES[caseIdx]

  const safeCall = async (fn: () => Promise<DifferentiationResult>): Promise<MethodResult> => {
    const t0 = performance.now()
    try {
      const r = await fn()
      return { result: r, error: null, elapsed: performance.now() - t0 }
    } catch (e) {
      return { result: null, error: String(e), elapsed: performance.now() - t0 }
    }
  }

  const handleRun = useCallback(async () => {
    setLoading(true)
    setCompare(null)

    const [fwd, bwd, cen, errData] = await Promise.all([
      safeCall(() => differentiationService.differentiate({ expression: cs.expression, x_point: cs.xPoint, h, method: 'forward' })),
      safeCall(() => differentiationService.differentiate({ expression: cs.expression, x_point: cs.xPoint, h, method: 'backward' })),
      safeCall(() => differentiationService.differentiate({ expression: cs.expression, x_point: cs.xPoint, h, method: 'central' })),
      differentiationService.errorVsH(cs.expression, cs.xPoint).catch(() => null),
    ])

    setCompare({ forward: fwd, backward: bwd, central: cen, errorData: errData })
    setLoading(false)
  }, [caseIdx, h]) // eslint-disable-line react-hooks/exhaustive-deps

  // Winner badges
  const absErrors = compare
    ? (['forward', 'backward', 'central'] as MethodKey[]).map((m) => ({
        method: m,
        err: compare[m].result?.absolute_error ?? Infinity,
        ms: compare[m].elapsed,
      }))
    : []
  const mostAccurate = absErrors.length ? absErrors.reduce((b, c) => c.err < b.err ? c : b).method : null
  const fastest = absErrors.length ? absErrors.reduce((b, c) => c.ms < b.ms ? c : b).method : null

  // Error-vs-h plot
  const errorTraces: Plotly.Data[] = compare?.errorData
    ? (['forward', 'backward', 'central'] as MethodKey[]).filter((m) => compare.errorData!.errors[m]).map((m) => ({
        x: compare.errorData!.h_values,
        y: compare.errorData!.errors[m],
        type: 'scatter' as const,
        mode: 'lines' as const,
        line: { color: METHOD_COLOR[m], width: 2 },
        name: METHOD_LABEL[m],
      }))
    : []

  const challenges = [
    {
      id: 'c1',
      title: 'Why does central difference outperform forward/backward at the same h?',
      body: 'Central difference is (forward + backward)/2. The O(h) bias terms have opposite signs and cancel exactly, leaving only O(h²) error. At h=0.1, central error is ~0.001 while forward/backward error is ~0.05 — 50× better at no extra cost.',
      hint: 'Run the comparison at h=0.1 and observe the absolute error column.',
    },
    {
      id: 'c2',
      title: 'Why do forward and backward errors have opposite signs?',
      body: 'Forward error ≈ +h f\'\'(x)/2 (positive for increasing f\'\'). Backward error ≈ −h f\'\'(x)/2 (negative). The sign of h f\'\'(x)/2 at your x determines which direction each method is biased. Try sin(x) at x=0 vs x=π.',
      hint: 'The error formula differs by sign: forward adds h f\'\'(x)/2, backward subtracts it.',
    },
    {
      id: 'c3',
      title: 'What is the optimal h for each method?',
      body: 'Forward/backward: h* ≈ √(ε) ≈ 10⁻⁸. Central: h* ≈ ∛(3ε) ≈ 10⁻⁵. Central\'s larger optimal h means it\'s more numerically stable — less sensitive to floating-point round-off. The error-vs-h chart (log-log) shows a V shape with each method\'s minimum at a different h.',
      hint: 'Check the error-vs-h chart after running. The minimum of each curve is h*.',
    },
    {
      id: 'c4',
      title: 'When should you NOT use central difference?',
      body: 'Central difference requires f(x+h) — a future value. In causal real-time systems (PID controllers, real-time filters), future samples are unavailable. Use backward difference, which only needs f(x) and f(x−h). Also at boundary x=a: f(a−h) may be outside the domain.',
      hint: 'Think about when f(x+h) might not be available in your application.',
    },
  ]

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">Numerical Differentiation Comparison Center</h1>
        <p className="text-slate-400 text-sm">
          Run Forward, Backward, and Central difference on the same function. Compare accuracy, bias, and optimal h.
        </p>
      </div>

      {/* Function selector */}
      <div className="glass-card p-5 space-y-4">
        <p className="section-label">Function and Point</p>
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
        <p className="text-sm text-slate-400">{cs.description} &nbsp;·&nbsp; exact = {cs.exactLabel}</p>

        {/* h selector */}
        <div>
          <p className="section-label mb-2">Step size h</p>
          <div className="flex flex-wrap gap-1.5">
            {H_SWEEP.map((hv) => (
              <button
                key={hv}
                onClick={() => { setH(hv); setCompare(null) }}
                className={clsx(
                  'px-2.5 py-1 rounded text-xs font-mono transition-colors',
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

        <button
          onClick={handleRun}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Computing…' : 'Run All Three Methods'}
        </button>
      </div>

      {/* Results */}
      {compare && (
        <>
          {/* Method cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['forward', 'backward', 'central'] as MethodKey[]).map((m) => {
              const mr = compare[m]
              const r  = mr.result
              return (
                <div key={m} className="glass-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: METHOD_COLOR[m] }} />
                      <span className="font-semibold text-white text-sm">{METHOD_LABEL[m]}</span>
                    </div>
                    <div className="flex gap-1">
                      {mostAccurate === m && <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400">✓ Accurate</span>}
                      {fastest      === m && <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400">⚡ Fast</span>}
                    </div>
                  </div>

                  {mr.error ? (
                    <p className="text-xs text-red-400">{mr.error}</p>
                  ) : r ? (
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: "f'(x)",       value: fmt(r.derivative) },
                          { label: 'Exact',        value: fmt(r.exact_derivative) },
                          { label: '|error|',      value: r.absolute_error != null ? r.absolute_error.toExponential(3) : '—' },
                          { label: 'Time',         value: `${mr.elapsed.toFixed(1)} ms` },
                        ].map(({ label, value }) => (
                          <div key={label} className="rounded bg-surface-card p-1.5 text-center">
                            <div className="font-mono text-slate-200">{value}</div>
                            <div className="text-slate-500 mt-0.5 text-[10px]">{label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-slate-500 font-mono text-center">
                        {m === 'forward' ? '[f(x+h)−f(x)] / h' : m === 'backward' ? '[f(x)−f(x−h)] / h' : '[f(x+h)−f(x−h)] / (2h)'}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          {/* Accuracy comparison table */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-surface-border">
              <h3 className="text-sm font-semibold text-white">Side-by-side Accuracy at h = {h.toExponential(0)}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Exact = {cs.exactLabel} = {cs.exact.toPrecision(8)}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-surface-border">
                    <th className="px-4 py-2.5 text-left text-slate-400 uppercase tracking-wider">Metric</th>
                    <th className="px-4 py-2.5 text-left uppercase tracking-wider" style={{ color: METHOD_COLOR.forward  }}>Forward</th>
                    <th className="px-4 py-2.5 text-left uppercase tracking-wider" style={{ color: METHOD_COLOR.backward }}>Backward</th>
                    <th className="px-4 py-2.5 text-left uppercase tracking-wider" style={{ color: METHOD_COLOR.central  }}>Central</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "f'(x) approx", key: (r: DifferentiationResult) => fmt(r.derivative) },
                    { label: '|abs error|',  key: (r: DifferentiationResult) => r.absolute_error != null ? r.absolute_error.toExponential(3) : '—' },
                    { label: '% rel error',  key: (r: DifferentiationResult) => r.relative_error != null ? (r.relative_error * 100).toFixed(6) + '%' : '—' },
                    { label: 'Time (ms)',    key: (_r: DifferentiationResult, m: MethodKey) => compare[m].elapsed.toFixed(2) },
                  ].map(({ label, key }) => (
                    <tr key={label} className="border-b border-surface-border/50 last:border-0 hover:bg-surface-hover/20">
                      <td className="px-4 py-2 text-slate-400 font-medium">{label}</td>
                      {(['forward', 'backward', 'central'] as MethodKey[]).map((m) => (
                        <td key={m} className="px-4 py-2 font-mono" style={{ color: METHOD_COLOR[m] }}>
                          {compare[m].result ? key(compare[m].result!, m) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Error vs h chart */}
          {errorTraces.length > 0 && (
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-surface-border">
                <h3 className="text-sm font-semibold text-white">Error vs h (log-log)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Forward/Backward: slope ≈ 1 (O(h)). Central: slope ≈ 2 (O(h²)). Optimal h* at curve minimum.
                </p>
              </div>
              <Plot
                data={errorTraces}
                layout={{
                  ...DARK_LAYOUT,
                  xaxis: { ...DARK_LAYOUT.xaxis, type: 'log', title: { text: 'h', font: { color: '#94a3b8' } } },
                  yaxis: { ...DARK_LAYOUT.yaxis, type: 'log', title: { text: '|error|', font: { color: '#94a3b8' } } },
                } as Partial<Plotly.Layout>}
                config={PLOTLY_CFG}
                style={{ width: '100%', height: '300px' }}
              />
            </div>
          )}
        </>
      )}

      {/* Method guide */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Decision Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            {
              method: 'forward' as MethodKey,
              title: 'Use Forward when…',
              items: ['At left boundary (only f(x), f(x+h) needed)', 'Real-time: future samples already buffered', 'Explicit ODE integration (Euler method)'],
            },
            {
              method: 'backward' as MethodKey,
              title: 'Use Backward when…',
              items: ['Strictly causal real-time system (no future values)', 'Implicit ODE methods (Adams-Moulton)', 'Signal processing with causal filter requirement'],
            },
            {
              method: 'central' as MethodKey,
              title: 'Use Central when…',
              items: ['Interior grid points (default choice)', 'CFD, FEA, gradient checking in ML', 'Maximum accuracy needed at same cost'],
            },
          ]).map(({ method, title, items }) => (
            <div
              key={method}
              className="rounded-xl border p-4 space-y-2"
              style={{ borderColor: METHOD_COLOR[method] + '40', background: METHOD_COLOR[method] + '08' }}
            >
              <p className="font-semibold text-sm" style={{ color: METHOD_COLOR[method] }}>{title}</p>
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

        {/* Quick formula reference */}
        <div className="mt-4 p-4 rounded-xl bg-surface-card border border-surface-border">
          <p className="section-label mb-3">Quick Formula Reference</p>
          <div className="space-y-2 font-mono text-xs">
            {[
              { label: 'Forward',  formula: "[f(x+h) − f(x)] / h",          order: 'O(h)',  color: METHOD_COLOR.forward  },
              { label: 'Backward', formula: "[f(x) − f(x−h)] / h",          order: 'O(h)',  color: METHOD_COLOR.backward },
              { label: 'Central',  formula: "[f(x+h) − f(x−h)] / (2h)",     order: 'O(h²)', color: METHOD_COLOR.central  },
            ].map(({ label, formula, order, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-20 text-slate-500">{label}</span>
                <span className="flex-1 text-slate-300">{formula}</span>
                <span className="px-2 py-0.5 rounded text-[10px]" style={{ color, background: color + '20', border: `1px solid ${color}40` }}>{order}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Insight Challenges</h3>
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
