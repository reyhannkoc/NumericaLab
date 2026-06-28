import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { MotivationConfig } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface MotivationSectionProps {
  config: MotivationConfig
}

export default function MotivationSection({ config }: MotivationSectionProps) {
  const meta = SECTION_MAP['motivation']

  return (
    <SectionWrapper id="motivation">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="space-y-5">
        {/* Why it matters */}
        <div className="glass-card p-5 border-l-2 border-brand-500">
          <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">
            The Problem
          </h3>
          <p className="text-slate-200 leading-relaxed">{config.problemStatement}</p>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Why It Matters
          </h3>
          <p className="text-slate-300 leading-relaxed">{config.whyItMatters}</p>
        </div>

        {/* Historical background */}
        {config.historicalBackground && (
          <div className="glass-card p-5 border-l-2 border-slate-600">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Historical Background
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">{config.historicalBackground}</p>
          </div>
        )}

        {/* Engineering motivation */}
        <div className="glass-card p-5 bg-emerald-950/20 border-l-2 border-emerald-500">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Engineering Motivation
          </h3>
          <p className="text-slate-300 leading-relaxed">{config.engineeringMotivation}</p>
        </div>

        {/* Motivating example */}
        {config.motivatingExample && (
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Motivating Example — {config.motivatingExample.title}
            </h3>
            <p className="text-slate-300 mb-3 text-sm leading-relaxed">
              {config.motivatingExample.description}
            </p>
            {config.motivatingExample.expression && (
              <div className="rounded-md bg-slate-900 border border-surface-border px-4 py-2 font-mono text-sm text-brand-300">
                {config.motivatingExample.expression}
              </div>
            )}
            {config.motivatingExample.result && (
              <p className="text-slate-400 text-xs mt-2">{config.motivatingExample.result}</p>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
