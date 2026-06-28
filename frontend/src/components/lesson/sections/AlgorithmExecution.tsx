import { useState } from 'react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import { SECTION_MAP } from '@/config/lessonSections'

interface Column<T> {
  key: keyof T
  header: string
  format?: (value: T[keyof T]) => string
  highlight?: boolean
  tooltip?: string
}

interface AlgorithmExecutionProps<T extends Record<string, unknown>> {
  iterations: T[]
  columns: Column<T>[]
  /** 'converged' | 'diverged' | 'running' | 'idle' */
  status?: 'converged' | 'diverged' | 'running' | 'idle'
  executionLog?: string[]
  /** Row index to highlight (e.g., best iteration) */
  highlightRow?: number
  convergedAt?: number
  description?: string
}

const STATUS_BADGE = {
  converged: 'bg-green-500/15 border-green-500/30 text-green-400',
  diverged:  'bg-red-500/15   border-red-500/30   text-red-400',
  running:   'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
  idle:      'bg-slate-700/40  border-surface-border text-slate-400',
}

export default function AlgorithmExecution<T extends Record<string, unknown>>({
  iterations,
  columns,
  status = 'idle',
  executionLog,
  highlightRow,
  convergedAt,
  description,
}: AlgorithmExecutionProps<T>) {
  const meta = SECTION_MAP['algorithm']
  const [showLog, setShowLog] = useState(false)

  const fmt = (col: Column<T>, row: T): string => {
    const val = row[col.key]
    if (col.format) return col.format(val)
    if (typeof val === 'number') {
      return Number.isInteger(val) ? String(val) : val.toExponential(4)
    }
    return String(val ?? '—')
  }

  return (
    <SectionWrapper id="algorithm">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      {description && (
        <p className="text-sm text-slate-400 mb-4">{description}</p>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
            STATUS_BADGE[status],
          )}
        >
          {status === 'converged' && '✓ Converged'}
          {status === 'diverged'  && '✗ Diverged'}
          {status === 'running'   && '⟳ Running'}
          {status === 'idle'      && '○ Idle'}
          {convergedAt !== undefined && status === 'converged' && ` at iteration ${convergedAt}`}
        </span>
        <span className="text-xs text-slate-500">
          {iterations.length} iteration{iterations.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Iteration table */}
      {iterations.length > 0 && (
        <div className="glass-card overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="border-b border-surface-border">
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className="px-4 py-2.5 text-left text-xs font-semibold
                                 text-slate-400 uppercase tracking-wider whitespace-nowrap"
                      title={col.tooltip}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {iterations.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: Math.min(i * 0.03, 0.4) }}
                      className={clsx(
                        'border-b border-surface-border/50 last:border-0',
                        i === highlightRow
                          ? 'bg-brand-600/10'
                          : 'hover:bg-surface-hover/30',
                        i === convergedAt && 'bg-green-900/10',
                      )}
                    >
                      {columns.map((col) => (
                        <td
                          key={String(col.key)}
                          className={clsx(
                            'px-4 py-2.5 text-xs',
                            col.highlight
                              ? 'text-brand-300 font-medium'
                              : 'text-slate-300',
                          )}
                        >
                          {fmt(col, row)}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Execution log (collapsible) */}
      {executionLog && executionLog.length > 0 && (
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => setShowLog((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs
                       text-slate-400 hover:text-white hover:bg-surface-hover/30 transition-colors"
          >
            <span>Execution Log ({executionLog.length} lines)</span>
            <span>{showLog ? '▲' : '▼'}</span>
          </button>
          {showLog && (
            <div className="px-4 pb-4 border-t border-surface-border">
              <pre className="text-xs text-slate-400 font-mono leading-relaxed
                              max-h-48 overflow-y-auto bg-slate-950 rounded-md p-3 mt-2">
                {executionLog.join('\n')}
              </pre>
            </div>
          )}
        </div>
      )}
    </SectionWrapper>
  )
}
