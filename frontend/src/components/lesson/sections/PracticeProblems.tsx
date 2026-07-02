import { useState } from 'react'
import { clsx } from 'clsx'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { PracticeProblemItem, ProblemDifficulty } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface PracticeProblemsProps {
  problems: PracticeProblemItem[]
}

const DIFFICULTY_META: Record<ProblemDifficulty, { label: string; color: string }> = {
  easy:   { label: 'Easy',   color: 'text-green-400  bg-green-400/10  border-green-400/25'  },
  medium: { label: 'Medium', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25' },
  hard:   { label: 'Hard',   color: 'text-red-400    bg-red-400/10    border-red-400/25'    },
}

const FILTERS: Array<ProblemDifficulty | 'all'> = ['all', 'easy', 'medium', 'hard']

export default function PracticeProblems({ problems }: PracticeProblemsProps) {
  const meta = SECTION_MAP['practice']
  const [filter, setFilter] = useState<ProblemDifficulty | 'all'>('all')
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const visible = filter === 'all' ? problems : problems.filter((p) => p.difficulty === filter)

  const toggleHint = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <SectionWrapper id="practice">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      {/* Filter bar */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors',
              filter === f
                ? 'bg-brand-600 text-white'
                : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((problem, i) => {
          const diff = DIFFICULTY_META[problem.difficulty]
          const isRevealed = revealed.has(problem.id)

          return (
            <div key={problem.id} className="glass-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono w-6 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{problem.title}</h3>
                </div>
                <span
                  className={clsx(
                    'shrink-0 inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                    diff.color,
                  )}
                >
                  {diff.label}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                {problem.description}
              </p>

              {problem.expression && (
                <div className="rounded-md bg-slate-900 border border-surface-border px-3 py-2 mb-3 font-mono text-sm text-brand-300">
                  {problem.expression}
                </div>
              )}

              <div className="flex items-center gap-3">
                {problem.hint && (
                  <button
                    type="button"
                    onClick={() => toggleHint(problem.id)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline-offset-2 underline"
                  >
                    {isRevealed ? 'Hide hint' : 'Show hint'}
                  </button>
                )}
                {problem.expectedAnswer && isRevealed && (
                  <span className="text-xs text-slate-500">
                    Answer: <span className="text-brand-300 font-mono">{problem.expectedAnswer}</span>
                  </span>
                )}
              </div>

              {problem.hint && isRevealed && (
                <div className="mt-3 rounded-md bg-brand-950/30 border border-brand-500/20 px-3 py-2">
                  <p className="text-xs text-brand-300">💡 {problem.hint}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
