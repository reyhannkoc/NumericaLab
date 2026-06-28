import type { ReactNode } from 'react'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import { SECTION_MAP } from '@/config/lessonSections'

interface InteractiveVisualizationProps {
  /** The Plotly chart (or any visualization) to display */
  children: ReactNode
  /** Optional description or instruction above the chart */
  description?: string
  /** Optional controls panel rendered below the chart */
  controls?: ReactNode
}

/**
 * Shell for the interactive visualization section.
 * Accepts any chart as children — keeps section layout consistent
 * regardless of which Plotly trace/layout a specific lesson uses.
 */
export default function InteractiveVisualization({
  children,
  description,
  controls,
}: InteractiveVisualizationProps) {
  const meta = SECTION_MAP['visualization']

  return (
    <SectionWrapper id="visualization">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      {description && (
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">{description}</p>
      )}

      {/* Chart area */}
      <div className="glass-card overflow-hidden">
        <div className="min-h-[360px]">{children}</div>

        {controls && (
          <div className="border-t border-surface-border p-4">
            {controls}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
