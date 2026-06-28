import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import type { LessonHeaderConfig, DifficultyLevel } from '@/types/lesson.types'

interface LessonHeaderProps {
  config: LessonHeaderConfig
}

const DIFFICULTY_META: Record<DifficultyLevel, { label: string; color: string }> = {
  introductory: { label: 'Introductory', color: 'text-green-400 bg-green-400/10 border-green-400/25' },
  intermediate:  { label: 'Intermediate', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25' },
  advanced:      { label: 'Advanced',     color: 'text-red-400   bg-red-400/10   border-red-400/25'   },
}

export default function LessonHeader({ config }: LessonHeaderProps) {
  const diff = DIFFICULTY_META[config.difficulty]

  return (
    <header className="pb-10 mb-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/modules" className="hover:text-slate-300 transition-colors">Modules</Link>
        <span>/</span>
        <span className="text-slate-400">{config.title}</span>
      </nav>

      {/* Module color accent bar */}
      <div
        className="w-12 h-1 rounded-full mb-5"
        style={{ backgroundColor: config.moduleColor }}
      />

      {/* Title block */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
        {config.title}
      </h1>
      <p className="text-lg text-slate-400 mb-6">{config.subtitle}</p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
            diff.color,
          )}
        >
          {config.difficulty === 'introductory' && '●'}
          {config.difficulty === 'intermediate'  && '●●'}
          {config.difficulty === 'advanced'       && '●●●'}
          {diff.label}
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                         text-slate-400 bg-surface-card border border-surface-border">
          ⏱ {config.estimatedMinutes} min
        </span>

        {config.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex px-2 py-0.5 rounded-md text-xs
                       text-slate-500 bg-surface-card border border-surface-border"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Two-column: Objectives + Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Learning objectives */}
        <div className="glass-card p-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Learning Objectives
          </h2>
          <ul className="space-y-2">
            {config.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-brand-400 mt-0.5 shrink-0">✓</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Prerequisites */}
        <div className="glass-card p-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Prerequisites
          </h2>
          {config.prerequisites.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No prerequisites — start here!</p>
          ) : (
            <ul className="space-y-2">
              {config.prerequisites.map((pre) => (
                <li key={pre.path} className="flex items-center gap-2 text-sm">
                  <span
                    className={clsx(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      pre.required ? 'bg-red-400' : 'bg-slate-600',
                    )}
                  />
                  <Link
                    to={pre.path}
                    className="text-brand-400 hover:text-brand-300 transition-colors underline-offset-2 hover:underline"
                  >
                    {pre.title}
                  </Link>
                  {!pre.required && (
                    <span className="text-xs text-slate-500">(optional)</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  )
}
