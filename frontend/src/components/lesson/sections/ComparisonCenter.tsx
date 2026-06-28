import { useState } from 'react'
import { clsx } from 'clsx'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { ComparisonConfig } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface ComparisonCenterProps {
  config: ComparisonConfig
  /** Name of the lesson's primary method (highlighted in table) */
  primaryMethod?: string
}

const CELL_COLORS: Record<string, string> = {
  'Yes':           'text-green-400',
  'No':            'text-red-400',
  'Always':        'text-green-400',
  'Never':         'text-red-400',
  'Sometimes':     'text-yellow-400',
  'Fast':          'text-green-400',
  'Slow':          'text-red-400',
  'Medium':        'text-yellow-400',
  'Linear':        'text-yellow-400',
  'Quadratic':     'text-green-400',
  'Superlinear':   'text-emerald-400',
}

export default function ComparisonCenter({
  config,
  primaryMethod,
}: ComparisonCenterProps) {
  const meta = SECTION_MAP['comparison']
  const [view, setView] = useState<'table' | 'summary'>('table')

  return (
    <SectionWrapper id="comparison">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      {/* View toggle */}
      <div className="flex gap-2 mb-5">
        {(['table', 'summary'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
              view === v
                ? 'bg-brand-600 text-white'
                : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'table' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Criterion
                  </th>
                  {config.methods.map((method) => (
                    <th
                      key={method}
                      className={clsx(
                        'px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider',
                        method === primaryMethod
                          ? 'text-brand-300'
                          : 'text-slate-400',
                      )}
                    >
                      {method}
                      {method === primaryMethod && (
                        <span className="ml-1 text-brand-500">★</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {config.table.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-surface-border/50 last:border-0 hover:bg-surface-hover/20"
                  >
                    <td className="px-4 py-3 text-slate-400 text-xs font-medium whitespace-nowrap">
                      {row.criterion}
                    </td>
                    {config.methods.map((method) => (
                      <td
                        key={method}
                        className={clsx(
                          'px-4 py-3 text-center text-xs',
                          CELL_COLORS[row[method]] ?? 'text-slate-300',
                          method === primaryMethod && 'font-semibold',
                        )}
                      >
                        {row[method] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'summary' && config.summary && (
        <div className="glass-card p-5">
          <p className="text-slate-300 leading-relaxed">{config.summary}</p>
        </div>
      )}
    </SectionWrapper>
  )
}
