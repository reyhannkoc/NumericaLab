import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { useProgress } from '@/contexts/ProgressContext'
import { ACHIEVEMENTS } from '@/config/achievements'
import { LEARNING_PATH, TOTAL_LESSONS, getLessonByPath, getNextLesson } from '@/config/learningPath'
import { MODULE_DEFINITIONS } from '@/config/modules'
import AchievementBadge from '@components/learning/AchievementBadge'

// ─── Module completion summary ────────────────────────────────────────────────

interface ModuleStat {
  id: string
  title: string
  color: string
  icon: string
  total: number
  done: number
}

function buildModuleStats(completedLessons: string[]): ModuleStat[] {
  return MODULE_DEFINITIONS.map((mod) => {
    const modLessons = LEARNING_PATH.filter((l) => l.moduleId === mod.id)
    const done = modLessons.filter((l) => completedLessons.includes(l.path)).length
    return { id: mod.id, title: mod.title, color: mod.color, icon: mod.icon, total: modLessons.length, done }
  }).filter((m) => m.total > 0)
}

// ─── Recent activity item ─────────────────────────────────────────────────────

function RecentItem({ path, completed }: { path: string; completed: boolean }) {
  const lesson = getLessonByPath(path)
  if (!lesson) return null
  return (
    <Link
      to={path}
      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover/30 transition-colors rounded-lg"
    >
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ background: lesson.moduleColor }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
        <p className="text-xs text-slate-500 truncate">{lesson.moduleTitle}</p>
      </div>
      {completed && <span className="text-green-400 text-sm shrink-0">✓</span>}
    </Link>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { state, completionPct, resetProgress } = useProgress()
  const { completedLessons, lastVisited, earnedAchievements, quizResults } = state

  const moduleStats = buildModuleStats(completedLessons)
  const nextLesson  = (() => {
    for (const lesson of LEARNING_PATH) {
      if (!completedLessons.includes(lesson.path)) return lesson
    }
    return null
  })()

  const totalQuizzes = Object.keys(quizResults).length
  const avgScore = totalQuizzes > 0
    ? Math.round(Object.values(quizResults).reduce((sum, r) => sum + (r.score / r.total) * 100, 0) / totalQuizzes)
    : null

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label mb-1">Learning Dashboard</p>
          <h1 className="text-2xl font-bold text-white">Your Progress</h1>
        </div>
        <button
          type="button"
          onClick={() => { if (window.confirm('Reset all progress? This cannot be undone.')) resetProgress() }}
          className="text-xs text-slate-500 hover:text-rose-400 transition-colors px-3 py-1.5 rounded border border-surface-border hover:border-rose-500/40"
        >
          Reset Progress
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Completed',   value: completedLessons.length,         sub: `of ${TOTAL_LESSONS} lessons`,   color: 'text-brand-300'  },
          { label: 'Completion',  value: `${completionPct}%`,              sub: 'overall course',                 color: 'text-green-400'  },
          { label: 'Quizzes',     value: totalQuizzes,                     sub: 'attempted',                      color: 'text-blue-400'   },
          { label: 'Avg Score',   value: avgScore != null ? `${avgScore}%` : '—', sub: 'quiz average',            color: 'text-amber-400'  },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <div className={clsx('text-2xl font-bold tabular-nums', color)}>{value}</div>
            <div className="text-white text-xs font-semibold mt-0.5">{label}</div>
            <div className="text-slate-500 text-[11px] mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-white">Course Completion</span>
          <span className="text-brand-300 font-bold tabular-nums">{completionPct}%</span>
        </div>
        <div className="h-3 rounded-full bg-surface-card overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{completedLessons.length} lessons completed</span>
          <span>{TOTAL_LESSONS - completedLessons.length} remaining</span>
        </div>
      </div>

      {/* Next lesson + recent activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next lesson */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-semibold text-white text-sm">Recommended Next Lesson</h2>
          {nextLesson ? (
            <Link
              to={nextLesson.path}
              className="flex items-center gap-4 p-4 rounded-xl border border-brand-500/30 bg-brand-950/20 hover:bg-brand-950/40 transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: nextLesson.moduleColor + '30', border: `1px solid ${nextLesson.moduleColor}40` }}
              >
                {nextLesson.moduleIcon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
                  {nextLesson.title}
                </p>
                <p className="text-xs text-slate-400 truncate">{nextLesson.moduleTitle}</p>
              </div>
              <span className="text-brand-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ) : (
            <div className="p-4 rounded-xl border border-green-500/30 bg-green-950/20 text-center">
              <div className="text-2xl mb-1">🎉</div>
              <p className="text-sm font-semibold text-green-300">All lessons complete!</p>
              <p className="text-xs text-slate-400 mt-1">Excellent work — you've finished the course.</p>
            </div>
          )}

          <div>
            <h3 className="section-label mb-2">View Full Path</h3>
            <Link
              to="/learning-path"
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              See all {TOTAL_LESSONS} lessons in order →
            </Link>
          </div>
        </div>

        {/* Recent activity */}
        <div className="glass-card p-5 space-y-2">
          <h2 className="font-semibold text-white text-sm mb-3">Recent Activity</h2>
          {lastVisited.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No lessons visited yet. Start learning!</p>
          ) : (
            <div className="-mx-1">
              {lastVisited.map((path) => (
                <RecentItem key={path} path={path} completed={completedLessons.includes(path)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module grid */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="font-semibold text-white text-sm">Module Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {moduleStats.map((mod) => {
            const pct = mod.total > 0 ? Math.round((mod.done / mod.total) * 100) : 0
            return (
              <div key={mod.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: mod.color + '30', border: `1px solid ${mod.color}40` }}
                >
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-white truncate">{mod.title}</span>
                    <span className="text-slate-400 ml-2 shrink-0 tabular-nums">{mod.done}/{mod.total}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-card overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: mod.color }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Achievements</h2>
          <span className="text-sm text-slate-400">
            {earnedAchievements.length} / {ACHIEVEMENTS.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((ach) => (
            <AchievementBadge
              key={ach.id}
              achievement={ach}
              earned={earnedAchievements.includes(ach.id)}
            />
          ))}
        </div>
      </div>

      {/* Quiz history */}
      {totalQuizzes > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-surface-border">
            <h2 className="font-semibold text-white text-sm">Quiz History</h2>
          </div>
          <div className="divide-y divide-surface-border/50">
            {Object.entries(quizResults).map(([path, result]) => {
              const lesson = getLessonByPath(path)
              const pct = Math.round((result.score / result.total) * 100)
              return (
                <div key={path} className="flex items-center gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{lesson?.title ?? path}</p>
                    <p className="text-xs text-slate-500">{new Date(result.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={clsx(
                      'text-sm font-semibold tabular-nums',
                      pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-yellow-400' : 'text-rose-400',
                    )}>
                      {result.score}/{result.total}
                    </div>
                    <div className="text-xs text-slate-500">{pct}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Next unlocked lesson from current path */}
      {nextLesson && (() => {
        const next = getNextLesson(nextLesson.path)
        return next ? (
          <div className="glass-card p-4 flex items-center gap-4">
            <span className="text-slate-400 text-sm">After that:</span>
            <Link to={next.path} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
              {next.title} →
            </Link>
          </div>
        ) : null
      })()}
    </div>
  )
}
