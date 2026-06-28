import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import { SECTION_MAP } from '@/config/lessonSections'

type AnimationStatus = 'idle' | 'playing' | 'paused' | 'finished'

interface StepAnimationProps {
  /** Total number of frames / steps */
  totalFrames: number
  /** Current frame index (0-based) */
  frame: number
  status: AnimationStatus
  /** Playback speed multiplier (1 = normal) */
  speed?: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStepBack: () => void
  onStepForward: () => void
  onSpeedChange?: (speed: number) => void
  /** The actual animation canvas / chart */
  children: ReactNode
  /** Optional text description of the current step */
  stepDescription?: string
}

const SPEEDS = [0.5, 1, 1.5, 2]

export default function StepAnimation({
  totalFrames,
  frame,
  status,
  speed = 1,
  onPlay,
  onPause,
  onReset,
  onStepBack,
  onStepForward,
  onSpeedChange,
  children,
  stepDescription,
}: StepAnimationProps) {
  const meta = SECTION_MAP['animation']
  const progress = totalFrames > 1 ? (frame / (totalFrames - 1)) * 100 : 0

  return (
    <SectionWrapper id="animation">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="glass-card overflow-hidden">
        {/* Animation canvas */}
        <div className="min-h-[320px]">{children}</div>

        {/* Step label */}
        {stepDescription && (
          <div className="px-4 py-2 border-t border-surface-border bg-surface-card/40 text-sm text-slate-400">
            Step {frame + 1} / {totalFrames}: {stepDescription}
          </div>
        )}

        {/* Progress bar */}
        <div className="h-1 bg-surface-border">
          <div
            className="h-full bg-brand-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
          {/* Playback buttons */}
          <div className="flex items-center gap-2">
            {/* Rewind */}
            <button
              onClick={onReset}
              className="icon-btn"
              title="Reset"
            >
              ⏮
            </button>

            {/* Step back */}
            <button
              onClick={onStepBack}
              disabled={frame === 0}
              className="icon-btn disabled:opacity-30"
              title="Previous step"
            >
              ◀
            </button>

            {/* Play / Pause */}
            <button
              onClick={status === 'playing' ? onPause : onPlay}
              className={clsx(
                'flex items-center justify-center w-9 h-9 rounded-full font-medium text-sm',
                'bg-brand-600 hover:bg-brand-500 text-white transition-colors',
              )}
              title={status === 'playing' ? 'Pause' : 'Play'}
            >
              {status === 'playing' ? '⏸' : '▶'}
            </button>

            {/* Step forward */}
            <button
              onClick={onStepForward}
              disabled={frame >= totalFrames - 1}
              className="icon-btn disabled:opacity-30"
              title="Next step"
            >
              ▶
            </button>
          </div>

          {/* Frame counter */}
          <span className="text-xs text-slate-500 tabular-nums">
            {frame + 1} / {totalFrames}
          </span>

          {/* Speed selector */}
          {onSpeedChange && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Speed</span>
              <div className="flex gap-1">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSpeedChange(s)}
                    className={clsx(
                      'px-2 py-0.5 rounded text-xs transition-colors',
                      speed === s
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-400 hover:text-white bg-surface-card border border-surface-border',
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
