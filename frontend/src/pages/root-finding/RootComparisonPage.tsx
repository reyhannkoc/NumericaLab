import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import Plot from 'react-plotly.js'
import { clsx } from 'clsx'
import { rootFindingService } from '@/services/rootFindingService'
import type { RootFindingResult } from '@/types/api.types'

// ─── Engineering case study presets ──────────────────────────────────────────

interface CaseStudy {
  id: string
  label: string
  icon: string
  field: string
  description: string
  expression: string
  a: number; b: number
  x0: number; x1: number
  root: string
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'irr',
    label: 'IRR — 3 Year Project',
    icon: '💹',
    field: 'Finance',
    description: 'Find the IRR of: invest $10k today, receive $3k, $5k, $4k over 3 years.',
    expression: '-10000 + 3000/(1+x) + 5000/(1+x)**2 + 4000/(1+x)**3',
    a: 0.001, b: 0.5, x0: 0.15, x1: 0.3,
    root: '≈ 18.5%',
  },
  {
    id: 'diode',
    label: 'Diode Circuit',
    icon: '⚡',
    field: 'Electrical Engineering',
    description: 'Find voltage V across diode: V_s=5V, R=1kΩ, I_s=10⁻¹⁴A, V_T=0.026V.',
    expression: 'x - 5 + 1000*1e-14*(exp(x/0.026)-1)',
    a: 0.0, b: 1.0, x0: 0.5, x1: 0.7,
    root: '≈ 0.693 V',
  },
  {
    id: 'projectile',
    label: 'Projectile (Dottie)',
    icon: '🚀',
    field: 'Aerospace',
    description: 'Find fixed point of cos(x): launch angle satisfying cos(θ) = θ radians.',
    expression: 'cos(x) - x',
    a: 0.0, b: 1.5, x0: 0.5, x1: 1.0,
    root: '≈ 0.7391',
  },
  {
    id: 'beam',
    label: 'Beam Deflection Zero',
    icon: '🏗',
    field: 'Structural Engineering',
    description: 'Find position of zero lateral deflection: f(x) = x³ − 5x + 3.',
    expression: 'x**3 - 5*x + 3',
    a: 1.0, b: 2.0, x0: 1.5, x1: 2.0,
    root: '≈ 1.834',
  },
  {
    id: 'chem',
    label: 'Chemical Equilibrium',
    icon: '⚗',
    field: 'Chemical Engineering',
    description: 'Solve extent of reaction x for equilibrium: K=0.25, f(x) = 4x²+x−0.25.',
    expression: '4*x**2 + x - 0.25',
    a: 0.0, b: 0.5, x0: 0.15, x1: 0.3,
    root: '≈ 0.140',
  },
]

// ─── Tolerance options ────────────────────────────────────────────────────────

const TOL_OPTIONS = [
  { label: '10⁻⁴',  value: 1e-4  },
  { label: '10⁻⁶',  value: 1e-6  },
  { label: '10⁻⁸',  value: 1e-8  },
  { label: '10⁻¹⁰', value: 1e-10 },
  { label: '10⁻¹²', value: 1e-12 },
]

// ─── Dark Plotly layout ───────────────────────────────────────────────────────

const DARK = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 60, r: 20, t: 40, b: 50 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.65, y: 0.98 },
}

const PLOTLY_CONFIG = { displayModeBar: false, responsive: true }

const METHOD_COLORS = {
  bisection:      '#10b981',
  newton_raphson: '#6366f1',
  secant:         '#c084fc',
}

const METHOD_LABELS = {
  bisection:      'Bisection',
  newton_raphson: 'Newton–Raphson',
  secant:         'Secant',
}

// ─── Result card ──────────────────────────────────────────────────────────────

interface ResultSlot {
  result: RootFindingResult | null
  err: string | null
}

function badge(text: string, color: string) {
  return (
    <span className={clsx('text-xs px-2 py-0.5 rounded-full font-semibold border', color)}>
      {text}
    </span>
  )
}

function MethodCard({
  method, slot, isFastest, isMostAccurate, isFewestIter,
}: {
  method: keyof typeof METHOD_COLORS
  slot: ResultSlot
  isFastest: boolean
  isMostAccurate: boolean
  isFewestIter: boolean
}) {
  const color = METHOD_COLORS[method]
  const label = METHOD_LABELS[method]
  const { result, err } = slot

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-semibold text-white text-sm">{label}</span>
        </div>
        {result && (
          <span className={clsx(
            'text-xs px-2 py-0.5 rounded-full border font-medium',
            result.converged
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400',
          )}>
            {result.converged ? '✓' : '✗'}
          </span>
        )}
        {err && <span className="text-xs text-red-400">Error</span>}
      </div>

      {result ? (
        <>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-surface-card rounded-lg p-2">
              <div className="font-mono text-white font-semibold truncate">{result.root.toPrecision(8)}</div>
              <div className="text-slate-500">Root x*</div>
            </div>
            <div className="bg-surface-card rounded-lg p-2">
              <div className="font-mono text-rose-400 font-semibold">{result.final_error.toExponential(2)}</div>
              <div className="text-slate-500">Final error</div>
            </div>
            <div className="bg-surface-card rounded-lg p-2">
              <div className="font-mono text-amber-400 font-semibold">{result.total_iterations}</div>
              <div className="text-slate-500">Iterations</div>
            </div>
            <div className="bg-surface-card rounded-lg p-2">
              <div className="font-mono text-slate-300 font-semibold">{result.execution_time_ms.toFixed(2)} ms</div>
              <div className="text-slate-500">Time</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {isFastest     && badge('⚡ Fastest',        'bg-amber-500/10 border-amber-500/30 text-amber-400')}
            {isMostAccurate && badge('🎯 Most accurate', 'bg-blue-500/10 border-blue-500/30 text-blue-400')}
            {isFewestIter  && badge('🔁 Fewest iters',  'bg-purple-500/10 border-purple-500/30 text-purple-400')}
          </div>
        </>
      ) : err ? (
        <p className="text-xs text-red-400/80">{err}</p>
      ) : (
        <p className="text-xs text-slate-600 italic">Not yet computed</p>
      )}
    </motion.div>
  )
}

// ─── Decision guide ───────────────────────────────────────────────────────────

function DecisionGuide() {
  return (
    <section className="glass-card p-6 space-y-4">
      <h2 className="text-lg font-bold text-white">When should I use each method?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            method: 'Bisection',
            color: '#10b981',
            when: [
              'You need a guaranteed result',
              'The function may not be smooth',
              'You already have a bracket [a, b]',
              'Speed is not critical (30 iterations is fine)',
              "Fallback when Newton or Secant diverge",
            ],
            avoid: "When f is expensive to evaluate (takes 30 evaluations for 10⁻⁸ accuracy)",
          },
          {
            method: 'Newton–Raphson',
            color: '#6366f1',
            when: [
              'f′(x) is analytically available',
              'You have a good initial guess near root',
              'Maximum speed is required (~5–8 iterations)',
              "Root is simple: f'(x*) ≠ 0",
              "f is smooth (twice differentiable)",
            ],
            avoid: "When derivative computation is expensive, or f has near-zero slopes",
          },
          {
            method: 'Secant',
            color: '#c084fc',
            when: [
              "f is a black-box (no f′ available)",
              "f is expensive to evaluate per call",
              "You want near-Newton speed with 1 eval/iter",
              "Simulation-based functions (CFD, FEM)",
              "After a few bisection steps to get close",
            ],
            avoid: "When f(xₙ) ≈ f(xₙ₋₁) for your starting pair (use bisection to get started)",
          },
        ].map(({ method, color, when, avoid }) => (
          <div key={method} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-semibold text-white">{method}</span>
            </div>
            <ul className="space-y-1">
              {when.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {w}
                </li>
              ))}
            </ul>
            <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-2">
              <p className="text-xs text-red-400/80">
                <strong className="text-red-400">Avoid when: </strong>{avoid}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Interactive challenges ───────────────────────────────────────────────────

const CHALLENGES = [
  {
    id: 'c1',
    title: 'Make Newton Fail',
    description: 'Find a function and initial guess where Newton-Raphson diverges but Bisection converges.',
    hint: 'Try f(x) = x^(1/3), x₀=1. Compare with bisection on [-1, 0.5].',
    difficulty: 'medium',
  },
  {
    id: 'c2',
    title: 'Find the Fastest Method',
    description: 'Try f(x) = cos(x)−x on [0, π/2], x₀=0.5, x₁=1. Which method converges in fewest iterations? In least time?',
    hint: 'Newton should win on iterations. Secant may win on total function evaluations.',
    difficulty: 'easy',
  },
  {
    id: 'c3',
    title: 'IRR Race',
    description: "Try the IRR preset. Newton needs the derivative of the NPV function (complex chain rule). Compare all three.",
    hint: 'The backend computes derivatives symbolically via SymPy, so Newton still works here.',
    difficulty: 'hard',
  },
  {
    id: 'c4',
    title: 'Tight Tolerance Test',
    description: 'Set tolerance to 10⁻¹². How many extra iterations does Bisection need vs Newton? Observe how the gap grows at tighter tolerances.',
    hint: 'Bisection adds ~13 iterations for 10⁻⁴ → 10⁻¹². Newton adds 1–2.',
    difficulty: 'medium',
  },
]

function ChallengeCard({ ch }: { ch: typeof CHALLENGES[0] }) {
  const [open, setOpen] = useState(false)
  const colors = { easy: 'text-green-400 border-green-500/30 bg-green-500/5', medium: 'text-amber-400 border-amber-500/30 bg-amber-500/5', hard: 'text-red-400 border-red-500/30 bg-red-500/5' }
  return (
    <div className="glass-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-hover/30 transition-colors text-left"
      >
        <div className="space-y-0.5">
          <div className="font-semibold text-white text-sm">{ch.title}</div>
          <div className="text-xs text-slate-400">{ch.description}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className={clsx('text-xs px-2 py-0.5 rounded-full border font-medium', colors[ch.difficulty as keyof typeof colors])}>{ch.difficulty}</span>
          <span className="text-slate-500 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-surface-border">
          <div className="mt-3 p-3 rounded-lg bg-brand-500/5 border border-brand-500/20">
            <p className="text-xs text-brand-300"><strong className="text-brand-200">Hint: </strong>{ch.hint}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type MethodKey = 'bisection' | 'newton_raphson' | 'secant'

interface Slots { bisection: ResultSlot; newton_raphson: ResultSlot; secant: ResultSlot }

const EMPTY_SLOT: ResultSlot = { result: null, err: null }

export default function RootComparisonPage() {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [expression, setExpression] = useState('x**3 - x - 2')
  const [a,           setA]          = useState(1)
  const [b,           setB]          = useState(2)
  const [x0,          setX0]         = useState(1.5)
  const [x1,          setX1]         = useState(2.0)
  const [tolerance,   setTolerance]  = useState(1e-8)
  const [maxIter,     setMaxIter]    = useState(100)

  // ── Result state ────────────────────────────────────────────────────────────
  const [slots,     setSlots]     = useState<Slots>({ bisection: EMPTY_SLOT, newton_raphson: EMPTY_SLOT, secant: EMPTY_SLOT })
  const [curveX,    setCurveX]    = useState<number[]>([])
  const [curveY,    setCurveY]    = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeCase, setActiveCase] = useState<string | null>(null)

  const loadPreset = useCallback((cs: CaseStudy) => {
    setExpression(cs.expression)
    setA(cs.a); setB(cs.b); setX0(cs.x0); setX1(cs.x1)
    setActiveCase(cs.id)
    setSlots({ bisection: EMPTY_SLOT, newton_raphson: EMPTY_SLOT, secant: EMPTY_SLOT })
    setCurveX([]); setCurveY([])
  }, [])

  const handleCompare = useCallback(async () => {
    setIsLoading(true)
    setSlots({ bisection: EMPTY_SLOT, newton_raphson: EMPTY_SLOT, secant: EMPTY_SLOT })

    const lo = Math.min(a, b), hi = Math.max(a, b)
    const spread = Math.max(hi - lo, 1.0)
    const pMin = lo - spread * 0.3, pMax = hi + spread * 0.3

    const safeCall = async (method: MethodKey, params: object): Promise<ResultSlot> => {
      try {
        const result = await rootFindingService.solve({
          expression,
          method,
          tolerance,
          max_iterations: maxIter,
          ...params,
        })
        return { result, err: null }
      } catch (e: unknown) {
        return { result: null, err: (e instanceof Error ? e.message : 'Solve failed') }
      }
    }

    try {
      const [bisSlot, nrSlot, secSlot, curve] = await Promise.all([
        safeCall('bisection',    { a, b }),
        safeCall('newton_raphson', { x0 }),
        safeCall('secant',       { x0, x1 }),
        rootFindingService.getFunctionPlot(expression, pMin, pMax, 300).catch(() => ({ x: [], y: [] })),
      ])
      setSlots({ bisection: bisSlot, newton_raphson: nrSlot, secant: secSlot })
      setCurveX(curve.x)
      setCurveY(curve.y)
    } finally {
      setIsLoading(false)
    }
  }, [expression, a, b, x0, x1, tolerance, maxIter])

  const hasResults = Object.values(slots).some((s) => s.result !== null)

  // ── Winner badges ───────────────────────────────────────────────────────────
  const winners = useMemo(() => {
    const entries = (Object.entries(slots) as [MethodKey, ResultSlot][])
      .filter(([, s]) => s.result?.converged)
      .map(([m, s]) => ({ method: m, result: s.result! }))

    if (entries.length === 0) return { fastest: null, mostAccurate: null, fewestIter: null }

    const fastest      = entries.reduce((a, b) => a.result.execution_time_ms < b.result.execution_time_ms ? a : b).method
    const mostAccurate = entries.reduce((a, b) => a.result.final_error < b.result.final_error ? a : b).method
    const fewestIter   = entries.reduce((a, b) => a.result.total_iterations < b.result.total_iterations ? a : b).method

    return { fastest, mostAccurate, fewestIter }
  }, [slots])

  // ── Charts ──────────────────────────────────────────────────────────────────
  const convergenceTraces = useMemo(() => {
    return (Object.entries(slots) as [MethodKey, ResultSlot][])
      .filter(([, s]) => s.result && s.result.iterations.length > 0)
      .map(([m, s]) => ({
        x: s.result!.iterations.map((it) => it.iteration),
        y: s.result!.iterations.map((it) => Math.max(it.error, 1e-16)),
        type: 'scatter' as const, mode: 'lines+markers' as const,
        name: METHOD_LABELS[m],
        line: { color: METHOD_COLORS[m], width: 2 },
        marker: { color: METHOD_COLORS[m], size: 5 },
      }))
  }, [slots])

  const perfTrace = useMemo(() => {
    const labels: string[] = []
    const values: number[] = []
    const colors: string[] = []
    ;(Object.entries(slots) as [MethodKey, ResultSlot][]).forEach(([m, s]) => {
      if (s.result) {
        labels.push(METHOD_LABELS[m])
        values.push(s.result.execution_time_ms)
        colors.push(METHOD_COLORS[m])
      }
    })
    return { labels, values, colors }
  }, [slots])

  return (
    <div className="min-h-screen bg-surface-bg py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs text-brand-400 uppercase tracking-widest font-semibold mb-2">
            <span className="w-8 h-px bg-brand-500/40" />
            Root Finding
            <span className="w-8 h-px bg-brand-500/40" />
          </div>
          <h1 className="text-3xl font-bold text-white">Root Finding Comparison Center</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Race Bisection, Newton–Raphson, and Secant on the same equation.
            Compare convergence speed, accuracy, iterations, and execution time side by side.
          </p>
        </div>

        {/* ── Engineering presets ─────────────────────────────────────── */}
        <section className="glass-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Engineering Case Studies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CASE_STUDIES.map((cs) => (
              <button
                type="button"
                key={cs.id}
                onClick={() => loadPreset(cs)}
                className={clsx(
                  'text-left p-3 rounded-xl border transition-all',
                  activeCase === cs.id
                    ? 'border-brand-500/60 bg-brand-600/10'
                    : 'border-surface-border bg-surface-card hover:border-brand-500/30 hover:bg-surface-hover/20',
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{cs.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-white">{cs.label}</div>
                    <div className="text-xs text-brand-400">{cs.field}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{cs.description}</p>
                <div className="mt-1.5 text-xs text-slate-500">Expected root: <span className="text-slate-300 font-mono">{cs.root}</span></div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Input form ──────────────────────────────────────────────── */}
        <section className="glass-card p-5 space-y-5">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Configure Comparison</h2>

          <div>
            <label className="section-label mb-1.5 block">Function f(x) =</label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="input-field w-full font-mono"
              placeholder="e.g. x**3 - x - 2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bisection params */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Bisection</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="section-label mb-1 block">a (lower)</label>
                  <input type="number" step="any" value={a} onChange={(e) => { const n = parseFloat(e.target.value); if (isFinite(n)) setA(n) }} className="input-field w-full font-mono" />
                </div>
                <div>
                  <label className="section-label mb-1 block">b (upper)</label>
                  <input type="number" step="any" value={b} onChange={(e) => { const n = parseFloat(e.target.value); if (isFinite(n)) setB(n) }} className="input-field w-full font-mono" />
                </div>
              </div>
            </div>

            {/* Newton + Secant params */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap gap-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Newton–Raphson</span>
                <span className="text-slate-600 text-xs mx-1">/</span>
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Secant</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="section-label mb-1 block">x₀ (both)</label>
                  <input type="number" step="any" value={x0} onChange={(e) => { const n = parseFloat(e.target.value); if (isFinite(n)) setX0(n) }} className="input-field w-full font-mono" />
                </div>
                <div>
                  <label className="section-label mb-1 block">x₁ (Secant)</label>
                  <input type="number" step="any" value={x1} onChange={(e) => { const n = parseFloat(e.target.value); if (isFinite(n)) setX1(n) }} className="input-field w-full font-mono" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div>
              <label className="section-label mb-1.5 block">Tolerance</label>
              <div className="flex flex-wrap gap-1.5">
                {TOL_OPTIONS.map(({ label, value }) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => setTolerance(value)}
                    className={clsx(
                      'px-2.5 py-1 rounded text-xs font-mono transition-colors',
                      tolerance === value
                        ? 'bg-brand-600 text-white'
                        : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
                    )}
                  >{label}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="section-label mb-1.5 block">Max iterations</label>
              <input type="number" min="10" max="500" step="10" value={maxIter} onChange={(e) => { const n = parseInt(e.target.value); if (n > 0) setMaxIter(n) }} className="input-field w-28 font-mono" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompare}
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-base py-3"
          >
            {isLoading ? 'Computing all three methods…' : '⚡ Compare All Methods'}
          </button>
        </section>

        {/* ── Results ─────────────────────────────────────────────────── */}
        {hasResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Method cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['bisection', 'newton_raphson', 'secant'] as MethodKey[]).map((m) => (
                <MethodCard
                  key={m}
                  method={m}
                  slot={slots[m]}
                  isFastest={winners.fastest === m}
                  isMostAccurate={winners.mostAccurate === m}
                  isFewestIter={winners.fewestIter === m}
                />
              ))}
            </div>

            {/* Comparison table */}
            <section className="glass-card overflow-hidden">
              <div className="px-5 py-3 border-b border-surface-border">
                <h2 className="font-semibold text-white">Detailed Comparison</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-border text-xs text-slate-400 uppercase tracking-wider">
                      <th className="px-5 py-3 text-left">Metric</th>
                      <th className="px-4 py-3 text-center">Bisection</th>
                      <th className="px-4 py-3 text-center">Newton–Raphson</th>
                      <th className="px-4 py-3 text-center">Secant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Root x*',       fmt: (r: RootFindingResult) => r.root.toPrecision(10) },
                      { label: 'Converged?',     fmt: (r: RootFindingResult) => r.converged ? '✓ Yes' : '✗ No' },
                      { label: 'Iterations',     fmt: (r: RootFindingResult) => String(r.total_iterations) },
                      { label: 'Final error',    fmt: (r: RootFindingResult) => r.final_error.toExponential(3) },
                      { label: 'Time (ms)',       fmt: (r: RootFindingResult) => r.execution_time_ms.toFixed(3) },
                    ].map(({ label, fmt }) => (
                      <tr key={label} className="border-b border-surface-border/50 last:border-0 hover:bg-surface-hover/20">
                        <td className="px-5 py-3 text-slate-400 font-medium text-xs">{label}</td>
                        {(['bisection', 'newton_raphson', 'secant'] as MethodKey[]).map((m) => {
                          const r = slots[m].result
                          const e = slots[m].err
                          return (
                            <td key={m} className="px-4 py-3 text-center font-mono text-xs text-slate-200">
                              {r ? fmt(r) : e ? <span className="text-red-400/70">—</span> : '—'}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Convergence chart */}
            {convergenceTraces.length > 0 && (
              <section className="glass-card overflow-hidden">
                <div className="px-5 py-3 border-b border-surface-border">
                  <h2 className="font-semibold text-white">Convergence Graph — Error vs Iteration</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Log scale — steeper drop = faster convergence. Quadratic (Newton) shows a characteristic "elbow" where errors begin squaring.</p>
                </div>
                <Plot
                  data={convergenceTraces as Plotly.Data[]}
                  layout={{
                    ...DARK,
                    xaxis: { ...DARK.xaxis, title: { text: 'Iteration', font: { color: '#94a3b8' } } },
                    yaxis: { ...DARK.yaxis, type: 'log' as const, title: { text: 'Error (log scale)', font: { color: '#94a3b8' } } },
                  } as Partial<Plotly.Layout>}
                  config={PLOTLY_CONFIG}
                  style={{ width: '100%', height: '300px' }}
                />
              </section>
            )}

            {/* Function curve + performance bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Function curve */}
              {curveX.length > 0 && (
                <section className="glass-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-surface-border">
                    <h2 className="font-semibold text-white text-sm">Function f(x)</h2>
                  </div>
                  <Plot
                    data={[
                      {
                        x: curveX, y: curveY,
                        type: 'scatter', mode: 'lines',
                        line: { color: '#60a5fa', width: 2 },
                        name: 'f(x)',
                      },
                      // Root markers
                      ...(['bisection', 'newton_raphson', 'secant'] as MethodKey[])
                        .filter((m) => slots[m].result?.converged)
                        .map((m) => ({
                          x: [slots[m].result!.root],
                          y: [0],
                          type: 'scatter' as const,
                          mode: 'markers' as const,
                          marker: { color: METHOD_COLORS[m], size: 10, symbol: 'diamond' },
                          name: `${METHOD_LABELS[m]} root`,
                        })),
                    ] as Plotly.Data[]}
                    layout={{
                      ...DARK,
                      xaxis: { ...DARK.xaxis, title: { text: 'x', font: { color: '#94a3b8' } } },
                      yaxis: { ...DARK.yaxis, title: { text: 'f(x)', font: { color: '#94a3b8' } } },
                      shapes: [{
                        type: 'line' as const,
                        x0: Math.min(...curveX), x1: Math.max(...curveX), y0: 0, y1: 0,
                        line: { color: 'rgba(255,255,255,0.2)', width: 1 },
                      }],
                    } as Partial<Plotly.Layout>}
                    config={PLOTLY_CONFIG}
                    style={{ width: '100%', height: '260px' }}
                  />
                </section>
              )}

              {/* Performance bar chart */}
              {perfTrace.labels.length > 0 && (
                <section className="glass-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-surface-border">
                    <h2 className="font-semibold text-white text-sm">Execution Time (ms)</h2>
                  </div>
                  <Plot
                    data={[{
                      x: perfTrace.labels,
                      y: perfTrace.values,
                      type: 'bar' as const,
                      marker: { color: perfTrace.colors },
                      text: perfTrace.values.map((v) => `${v.toFixed(2)} ms`),
                      textposition: 'auto' as const,
                    }] as Plotly.Data[]}
                    layout={{
                      ...DARK,
                      yaxis: { ...DARK.yaxis, title: { text: 'ms', font: { color: '#94a3b8' } } },
                      bargap: 0.4,
                    } as Partial<Plotly.Layout>}
                    config={PLOTLY_CONFIG}
                    style={{ width: '100%', height: '260px' }}
                  />
                </section>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Decision guide ───────────────────────────────────────────── */}
        <DecisionGuide />

        {/* ── Interactive challenges ───────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Interactive Challenges</h2>
          <p className="text-sm text-slate-400">Use the comparison tool above to complete each challenge.</p>
          <div className="space-y-2">
            {CHALLENGES.map((ch) => <ChallengeCard key={ch.id} ch={ch} />)}
          </div>
        </section>

        {/* ── Navigation ──────────────────────────────────────────────── */}
        <nav className="flex flex-wrap justify-between gap-3 pt-4 border-t border-surface-border">
          {[
            { label: '← Bisection',      path: '/root-finding/bisection'       },
            { label: 'Newton–Raphson →',  path: '/root-finding/newton-raphson'  },
            { label: 'Secant →',          path: '/root-finding/secant'          },
          ].map(({ label, path }) => (
            <a
              key={path}
              href={path}
              className="px-4 py-2 rounded-lg text-sm font-medium
                         bg-surface-card border border-surface-border
                         text-slate-300 hover:border-brand-500/60 hover:text-white
                         transition-all"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
