import { useState, useCallback } from 'react'
import Plot from 'react-plotly.js'
import { clsx } from 'clsx'
import { LAB_DEFINITIONS, BENCHMARK_ALGORITHMS } from '@/config/laboratory'
import { runSingleMethod } from '@/services/laboratory.service'
import { LabPageHeader, MetricCard } from '@/components/laboratory'
import type { BenchmarkRun, BenchmarkStatus } from '@/types/laboratory.types'

const lab = LAB_DEFINITIONS.find((l) => l.id === 'benchmark')!

const DARK_LAYOUT_BASE: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'transparent',
  font:          { color: '#94a3b8', size: 11 },
  margin:        { l: 55, r: 20, t: 30, b: 50 },
}

export default function BenchmarkCenter() {
  const [expression, setExpression] = useState('x**3 - x - 2')
  const [derivExpr, setDerivExpr]   = useState('3*x**2 - 1')
  const [selectedIds, setSelectedIds] = useState<string[]>(['bisection', 'newton_raphson', 'secant'])
  const [suite, setSuite]   = useState<BenchmarkRun[]>([])
  const [status, setStatus] = useState<BenchmarkStatus>('idle')
  const [error, setError]   = useState<string | null>(null)

  const toggleAlgo = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const runBenchmark = useCallback(async () => {
    if (selectedIds.length === 0) return
    setStatus('running')
    setError(null)
    setSuite([])

    const params = {
      category: 'root-finding' as const,
      expression,
      derivativeExpression: derivExpr,
      a: 1, b: 2, x0: 1.5, x1: 2,
      tolerance: 1e-8,
      maxIterations: 100,
      selectedMethodIds: selectedIds,
    }

    try {
      const settled = await Promise.allSettled(
        selectedIds.map((id) => runSingleMethod(params, id)),
      )
      const runs: BenchmarkRun[] = settled
        .filter((r): r is PromiseFulfilledResult<typeof r extends PromiseFulfilledResult<infer V> ? V : never> => r.status === 'fulfilled')
        .map((r) => {
          const v = (r as PromiseFulfilledResult<Awaited<ReturnType<typeof runSingleMethod>>>).value
          const algo = BENCHMARK_ALGORITHMS.find((a) => a.id === v.methodId)!
          return {
            algorithmId:   v.methodId,
            algorithmName: v.methodName,
            runtimeMs:     v.executionTimeMs,
            iterations:    v.iterations,
            converged:     v.converged,
            absoluteError: v.absoluteError,
            color:         algo?.color ?? '#818cf8',
          }
        })
      setSuite(runs)
      setStatus('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Benchmark failed')
      setStatus('error')
    }
  }, [expression, derivExpr, selectedIds])

  const fastest = suite.length ? suite.reduce((f, r) => r.runtimeMs < f.runtimeMs ? r : f) : null
  const fewest  = suite.length ? suite.reduce((f, r) => r.converged && r.iterations < f.iterations ? r : f) : null

  return (
    <div>
      <LabPageHeader
        icon={lab.icon}
        title={lab.title}
        subtitle={lab.subtitle}
        badge={lab.badge}
        badgeColor={lab.color}
        description="Select algorithms and a test function. Click Run Benchmark to measure real execution times and compare convergence speed."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-4 space-y-3">
            <p className="section-label">Test Problem</p>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">f(x) =</label>
              <input type="text" value={expression} onChange={(e) => setExpression(e.target.value)} className="input-field w-full font-mono text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">f′(x) =</label>
              <input type="text" value={derivExpr} onChange={(e) => setDerivExpr(e.target.value)} className="input-field w-full font-mono text-sm" />
            </div>
          </div>

          <div className="glass-card p-4">
            <p className="section-label mb-3">Algorithms</p>
            <div className="space-y-2">
              {BENCHMARK_ALGORITHMS.map((a) => (
                <label key={a.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(a.id)}
                    onChange={() => toggleAlgo(a.id)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: a.color }}
                  />
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-sm text-slate-300 group-hover:text-white">{a.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={runBenchmark}
            disabled={status === 'running' || selectedIds.length === 0}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'running' ? 'Benchmarking…' : 'Run Benchmark'}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 px-3 py-2 rounded-md">{error}</p>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {status === 'idle' && (
            <div className="glass-card p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <p className="text-4xl mb-3">⚡</p>
              <p className="text-slate-400 text-sm">Configure and click <strong className="text-white">Run Benchmark</strong></p>
            </div>
          )}

          {status === 'running' && (
            <div className="glass-card p-10 flex items-center justify-center min-h-[300px]">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Benchmarking {selectedIds.length} algorithm(s)…
              </div>
            </div>
          )}

          {status === 'complete' && suite.length > 0 && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Fastest" value={fastest?.algorithmName ?? '—'} unit={`${fastest?.runtimeMs} ms`} icon="⚡" status="good" />
                <MetricCard label="Fewest Iterations" value={fewest?.algorithmName ?? '—'} unit={`${fewest?.iterations} iter`} icon="⟳" status="good" />
              </div>

              {/* Runtime bar chart */}
              <div className="glass-card p-4">
                <p className="section-label mb-3">Execution Time (ms)</p>
                <Plot
                  data={[{
                    type: 'bar',
                    x: suite.map((r) => r.algorithmName),
                    y: suite.map((r) => r.runtimeMs),
                    marker: { color: suite.map((r) => r.color) },
                    text: suite.map((r) => `${r.runtimeMs} ms`),
                    textposition: 'outside',
                  }]}
                  layout={{ ...DARK_LAYOUT_BASE, height: 200, yaxis: { title: 'ms', gridcolor: '#1e293b', color: '#475569' }, xaxis: { gridcolor: '#1e293b', color: '#475569' } }}
                  config={{ displayModeBar: false, responsive: true }}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Iterations bar chart */}
              <div className="glass-card p-4">
                <p className="section-label mb-3">Iterations to Converge</p>
                <Plot
                  data={[{
                    type: 'bar',
                    x: suite.map((r) => r.algorithmName),
                    y: suite.map((r) => r.iterations),
                    marker: { color: suite.map((r) => r.color) },
                    text: suite.map((r) => String(r.iterations)),
                    textposition: 'outside',
                  }]}
                  layout={{ ...DARK_LAYOUT_BASE, height: 200, yaxis: { title: 'Iterations', gridcolor: '#1e293b', color: '#475569' }, xaxis: { gridcolor: '#1e293b', color: '#475569' } }}
                  config={{ displayModeBar: false, responsive: true }}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Data table */}
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm tabular-nums">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Algorithm', 'Time (ms)', 'Iterations', 'Abs Error', 'Converged'].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-xs text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {suite.map((r) => (
                      <tr key={r.algorithmId} className="border-b border-surface-border/50 last:border-0 hover:bg-surface-hover/20">
                        <td className="px-3 py-2.5 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                          <span className="text-sm text-white">{r.algorithmName}</span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-slate-300">{r.runtimeMs}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-slate-300">{r.iterations}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-slate-300">{r.absoluteError?.toExponential(3) ?? '—'}</td>
                        <td className={clsx('px-3 py-2.5 text-xs font-medium', r.converged ? 'text-green-400' : 'text-red-400')}>
                          {r.converged ? '✓ Yes' : '✗ No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
