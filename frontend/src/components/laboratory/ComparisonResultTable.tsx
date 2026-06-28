import { clsx } from 'clsx'
import type { ComparisonResult } from '@/types/laboratory.types'

interface ComparisonResultTableProps {
  results: ComparisonResult[]
  winnerId?: string
}

function fmt(n: number, digits = 4): string {
  if (!isFinite(n)) return '—'
  return n.toExponential(digits)
}

export default function ComparisonResultTable({
  results,
  winnerId,
}: ComparisonResultTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm tabular-nums">
          <thead>
            <tr className="border-b border-surface-border">
              {['Method', 'Root', 'Abs Error', 'Rel Error', 'Iterations', 'Time (ms)', 'Converged', 'Stable'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const isWinner = r.methodId === winnerId
              return (
                <tr
                  key={r.methodId}
                  className={clsx(
                    'border-b border-surface-border/50 last:border-0',
                    isWinner ? 'bg-brand-600/10' : 'hover:bg-surface-hover/20',
                  )}
                >
                  <td className="px-3 py-2.5 font-medium text-white whitespace-nowrap">
                    {isWinner && <span className="mr-1.5 text-yellow-400">★</span>}
                    {r.methodName}
                  </td>
                  <td className="px-3 py-2.5 text-brand-300 font-mono">
                    {r.root !== null ? r.root.toFixed(8) : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 font-mono">{fmt(r.absoluteError)}</td>
                  <td className="px-3 py-2.5 text-slate-300 font-mono">{fmt(r.relativeError)}</td>
                  <td className="px-3 py-2.5 text-slate-300">{r.iterations}</td>
                  <td className="px-3 py-2.5 text-slate-300">{r.executionTimeMs}</td>
                  <td className="px-3 py-2.5">
                    <span className={clsx('text-xs font-medium', r.converged ? 'text-green-400' : 'text-red-400')}>
                      {r.converged ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={clsx('text-xs font-medium', r.stable ? 'text-green-400' : 'text-yellow-400')}>
                      {r.stable ? '✓ Stable' : '⚠ Check'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
