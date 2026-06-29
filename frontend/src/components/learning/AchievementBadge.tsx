import { clsx } from 'clsx'
import type { Achievement } from '@/types/progress.types'

interface AchievementBadgeProps {
  achievement: Achievement
  earned: boolean
  size?: 'sm' | 'md'
}

export default function AchievementBadge({ achievement, earned, size = 'md' }: AchievementBadgeProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border flex items-start gap-3 transition-all',
        size === 'md' ? 'p-4' : 'p-3',
        earned
          ? 'glass-card border-brand-500/30 bg-brand-950/20'
          : 'bg-surface-card/40 border-surface-border opacity-50',
      )}
      title={earned ? 'Earned!' : 'Not yet unlocked'}
    >
      <span className={clsx('shrink-0', size === 'md' ? 'text-2xl' : 'text-lg', !earned && 'grayscale')}>
        {achievement.icon}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className={clsx('font-semibold text-white truncate', size === 'md' ? 'text-sm' : 'text-xs')}>
            {achievement.title}
          </p>
          {earned && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300">
              Earned
            </span>
          )}
        </div>
        <p className={clsx('text-slate-400 leading-relaxed mt-0.5', size === 'md' ? 'text-xs' : 'text-[11px]')}>
          {achievement.description}
        </p>
      </div>
    </div>
  )
}
