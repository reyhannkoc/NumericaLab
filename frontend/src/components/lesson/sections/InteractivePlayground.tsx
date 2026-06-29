import type { ReactNode } from 'react'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { PlaygroundPreset } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface InteractivePlaygroundProps {
  /** Input fields, sliders, selects — lesson-specific */
  controls: ReactNode
  /** Result area (table, chart, indicators) */
  results?: ReactNode
  /** Presets to load example configurations */
  presets?: PlaygroundPreset[]
  onPresetSelect?: (preset: PlaygroundPreset) => void
  onRun?: () => void
  onReset?: () => void
  isLoading?: boolean
  description?: string
  /** Error message from the last solve attempt */
  error?: string | null
}

export default function InteractivePlayground({
  controls,
  results,
  presets,
  onPresetSelect,
  onRun,
  onReset,
  isLoading = false,
  description,
  error,
}: InteractivePlaygroundProps) {
  const meta = SECTION_MAP['playground']

  return (
    <SectionWrapper id="playground">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      {description && (
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">{description}</p>
      )}

      {/* Presets row */}
      {presets && presets.length > 0 && (
        <div className="mb-4">
          <p className="section-label mb-2">Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onPresetSelect?.(preset)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium
                           bg-surface-card border border-surface-border
                           text-slate-300 hover:border-brand-500/60 hover:text-white
                           transition-all"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Controls panel */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4">
          {controls}

          {/* Run / Reset buttons */}
          <div className="flex gap-2 pt-2">
            {onRun && (
              <button
                onClick={onRun}
                disabled={isLoading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Computing…' : 'Run'}
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-lg text-sm font-medium
                           bg-surface-card border border-surface-border
                           text-slate-400 hover:text-white transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3">
          {error ? (
            <div className="glass-card p-5 h-full flex flex-col gap-3 min-h-[200px]">
              <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <span className="mt-0.5 shrink-0 text-red-400">⚠</span>
                <div>
                  <p className="text-sm font-semibold text-red-400 mb-1">Computation Error</p>
                  <p className="text-sm text-red-300/80 font-mono break-all">{error}</p>
                </div>
              </div>
            </div>
          ) : results ?? (
            <div className="glass-card p-5 h-full flex items-center justify-center
                            text-slate-500 text-sm italic min-h-[200px]">
              Configure parameters and click Run to see results.
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
