import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { useProgress } from '@/contexts/ProgressContext'
import { LEARNING_PATH, TOTAL_LESSONS } from '@/config/learningPath'

// Group by moduleId to display sections
interface Group {
  moduleId: string
  moduleTitle: string
  moduleColor: string
  moduleIcon: string
  lessons: typeof LEARNING_PATH
}

function groupByModule(path: typeof LEARNING_PATH): Group[] {
  const groups: Group[] = []
  for (const lesson of path) {
    const last = groups[groups.length - 1]
    if (last && last.moduleId === lesson.moduleId) {
      last.lessons.push(lesson)
    } else {
      groups.push({
        moduleId: lesson.moduleId,
        moduleTitle: lesson.moduleTitle,
        moduleColor: lesson.moduleColor,
        moduleIcon: lesson.moduleIcon,
        lessons: [lesson],
      })
    }
  }
  return groups
}

export default function LearningPathPage() {
  const { state, completionPct } = useProgress()
  const { completedLessons } = state
  const groups = groupByModule(LEARNING_PATH)

  let globalIndex = 0

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card p-6 space-y-4">
        <div>
          <p className="section-label mb-1">Recommended Order</p>
          <h1 className="text-2xl font-bold text-white">Learning Path</h1>
          <p className="text-sm text-slate-400 mt-1">
            {TOTAL_LESSONS} lessons · Follow this order for the best learning experience.
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>{completedLessons.length} completed</span>
            <span className="text-brand-300 font-semibold">{completionPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-card overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        <Link to="/dashboard" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Path */}
      <div className="space-y-8">
        {groups.map((group, gi) => (
          <div key={group.moduleId} className="relative">
            {/* Module header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: group.moduleColor + '25', border: `2px solid ${group.moduleColor}50` }}
              >
                {group.moduleIcon}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Module {gi + 1}</p>
                <h2 className="text-base font-bold text-white">{group.moduleTitle}</h2>
              </div>
            </div>

            {/* Lessons */}
            <div className="ml-5 border-l-2 pl-6 space-y-3" style={{ borderColor: group.moduleColor + '30' }}>
              {group.lessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.path)
                const idx = ++globalIndex

                return (
                  <Link
                    key={lesson.path}
                    to={lesson.path}
                    className={clsx(
                      'flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all group',
                      isCompleted
                        ? 'bg-green-950/15 border-green-500/30 hover:bg-green-950/25'
                        : 'glass-card hover:border-brand-500/40',
                    )}
                  >
                    {/* Status circle */}
                    <div className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2 transition-all',
                      isCompleted
                        ? 'bg-green-500/20 border-green-500/60 text-green-400'
                        : 'bg-surface-card border-surface-border text-slate-500 group-hover:border-brand-500/50',
                    )}>
                      {isCompleted ? '✓' : idx}
                    </div>

                    {/* Lesson info */}
                    <div className="flex-1 min-w-0">
                      <p className={clsx(
                        'text-sm font-semibold truncate transition-colors',
                        isCompleted ? 'text-green-300' : 'text-white group-hover:text-brand-300',
                      )}>
                        {lesson.title}
                      </p>
                    </div>

                    {/* Arrow */}
                    <span className={clsx(
                      'text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all',
                      isCompleted && 'text-green-500',
                    )}>
                      →
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Connector to next module */}
            {gi < groups.length - 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <div className="w-0.5 h-4 bg-surface-border" />
                  <span className="text-xs">↓</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="glass-card p-4 text-center text-sm text-slate-400">
        Complete all lessons in order to unlock the full suite of achievements.
        <br />
        <Link to="/dashboard" className="text-brand-400 hover:text-brand-300 transition-colors mt-1 inline-block">
          View your achievements →
        </Link>
      </div>
    </div>
  )
}
