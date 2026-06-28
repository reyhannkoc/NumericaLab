import { clsx } from 'clsx'
import { LAB_DEFINITIONS, COMPARISON_METHODS } from '@/config/laboratory'
import { useLabComparison } from '@/hooks/useLabComparison'
import { LabPageHeader, MetricCard, ComparisonResultTable, ConvergenceChart } from '@/components/laboratory'
import type { ComparisonCategory } from '@/types/laboratory.types'

const lab = LAB_DEFINITIONS.find((l) => l.id === 'comparison')!

const CATEGORIES: { id: ComparisonCategory; label: string }[] = [
  { id: 'root-finding',    label: 'Root Finding' },
  { id: 'integration',     label: 'Integration' },
  { id: 'differentiation', label: 'Differentiation' },
  { id: 'optimization',    label: 'Optimization' },
  { id: 'ode',             label: 'ODE Solvers' },
]

export default function ComparisonCenter() {
  const { params, updateParams, results, status, errorMessage, run, reset, winner } = useLabComparison()

  const categoryMethods = COMPARISON_METHODS.filter((m) => m.category === params.category)
  const isRootFinding = params.category === 'root-finding'

  const toggleMethod = (id: string) => {
    const selected = params.selectedMethodIds
    updateParams({
      selectedMethodIds: selected.includes(id)
        ? selected.filter((m) => m !== id)
        : [...selected, id],
    })
  }

  return (
    <div>
      <LabPageHeader
        icon={lab.icon}
        title={lab.title}
        subtitle={lab.subtitle}
        badge={lab.badge}
        badgeColor={lab.color}
        description="Select a problem category, configure the input, choose which methods to run, then click Compare. Results update live."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Controls ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category tabs */}
          <div className="glass-card p-4">
            <p className="section-label mb-3">Problem Category</p>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateParams({ category: c.id, selectedMethodIds: [] })}
                  className={clsx(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    params.category === c.id
                      ? 'bg-brand-600/15 border border-brand-500/30 text-brand-300 font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-surface-hover',
                  )}
                >
                  {c.label}
                  {c.id !== 'root-finding' && (
                    <span className="text-xs text-slate-600">Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs — root finding only for now */}
          {isRootFinding && (
            <div className="glass-card p-4 space-y-3">
              <p className="section-label">Problem Setup</p>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">f(x) =</label>
                <input
                  type="text"
                  value={params.expression}
                  onChange={(e) => updateParams({ expression: e.target.value })}
                  className="input-field w-full font-mono text-sm"
                  placeholder="x**3 - x - 2"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">f′(x) = (for Newton-Raphson)</label>
                <input
                  type="text"
                  value={params.derivativeExpression}
                  onChange={(e) => updateParams({ derivativeExpression: e.target.value })}
                  className="input-field w-full font-mono text-sm"
                  placeholder="3*x**2 - 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">a (interval left)</label>
                  <input type="number" value={params.a} onChange={(e) => updateParams({ a: +e.target.value })} className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">b (interval right)</label>
                  <input type="number" value={params.b} onChange={(e) => updateParams({ b: +e.target.value })} className="input-field w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">x₀ (initial guess)</label>
                  <input type="number" value={params.x0} onChange={(e) => updateParams({ x0: +e.target.value })} className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">x₁ (Secant 2nd pt)</label>
                  <input type="number" value={params.x1} onChange={(e) => updateParams({ x1: +e.target.value })} className="input-field w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tolerance</label>
                  <input type="number" step="1e-10" value={params.tolerance} onChange={(e) => updateParams({ tolerance: +e.target.value })} className="input-field w-full font-mono text-xs" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Max Iterations</label>
                  <input type="number" value={params.maxIterations} onChange={(e) => updateParams({ maxIterations: +e.target.value })} className="input-field w-full" />
                </div>
              </div>
            </div>
          )}

          {/* Method selection */}
          <div className="glass-card p-4">
            <p className="section-label mb-3">Methods to Compare</p>
            <div className="space-y-2">
              {categoryMethods.map((m) => (
                <label key={m.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={params.selectedMethodIds.includes(m.id)}
                    onChange={() => toggleMethod(m.id)}
                    className="w-4 h-4 rounded accent-brand-500"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {m.name}
                  </span>
                  {m.requiresDerivative && (
                    <span className="text-xs text-slate-600 ml-auto">needs f′</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Run / Reset */}
          <div className="flex gap-2">
            <button
              onClick={run}
              disabled={status === 'running' || params.selectedMethodIds.length === 0}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'running' ? 'Running…' : 'Compare All'}
            </button>
            {status !== 'idle' && (
              <button onClick={reset} className="px-4 py-2 rounded-lg text-sm glass-card text-slate-400 hover:text-white">
                Reset
              </button>
            )}
          </div>

          {errorMessage && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 px-3 py-2 rounded-md">
              {errorMessage}
            </p>
          )}
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-5">
          {status === 'idle' && (
            <div className="glass-card p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <p className="text-4xl mb-3">⚖</p>
              <p className="text-slate-400 text-sm">
                Configure the problem on the left and click <strong className="text-white">Compare All</strong>.
              </p>
              <p className="text-slate-600 text-xs mt-2">
                All selected methods run simultaneously. Results appear here instantly.
              </p>
            </div>
          )}

          {status === 'running' && (
            <div className="glass-card p-10 flex items-center justify-center min-h-[300px]">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                Running {params.selectedMethodIds.length} method(s)…
              </div>
            </div>
          )}

          {status === 'complete' && results.length > 0 && (
            <>
              {/* Summary metric row */}
              <div className="grid grid-cols-3 gap-3">
                <MetricCard
                  label="Best Method"
                  value={winner?.methodName ?? '—'}
                  icon="★"
                  status="good"
                  sub={winner ? `${winner.iterations} iterations` : undefined}
                />
                <MetricCard
                  label="Min Error"
                  value={winner ? winner.absoluteError.toExponential(2) : '—'}
                  icon="ε"
                  status="good"
                  sub="absolute error"
                />
                <MetricCard
                  label="Fastest"
                  value={
                    results.reduce((f, r) => (r.executionTimeMs < f.executionTimeMs ? r : f)).methodName
                  }
                  icon="⚡"
                  status="neutral"
                  sub="wall clock"
                />
              </div>

              {/* Table */}
              <ComparisonResultTable results={results} winnerId={winner?.methodId} />

              {/* Convergence chart */}
              <div className="glass-card p-4">
                <p className="section-label mb-3">Convergence History</p>
                <ConvergenceChart results={results} height={260} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
