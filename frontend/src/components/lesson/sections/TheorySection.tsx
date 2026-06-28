import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { TheoryConfig } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface TheorySectionProps {
  config: TheoryConfig
}

export default function TheorySection({ config }: TheorySectionProps) {
  const meta = SECTION_MAP['theory']

  return (
    <SectionWrapper id="theory">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="space-y-5">
        {/* Overview */}
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Overview
          </h3>
          <p className="text-slate-200 leading-relaxed">{config.overview}</p>
        </div>

        {/* Intuition */}
        <div className="glass-card p-5 border-l-2 border-brand-500">
          <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">
            Intuition
          </h3>
          <p className="text-slate-300 leading-relaxed">{config.intuition}</p>
        </div>

        {/* Key insights */}
        {config.keyInsights && config.keyInsights.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Key Insights
            </h3>
            <ul className="space-y-2">
              {config.keyInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="text-brand-400 font-bold mt-0.5 shrink-0">→</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Advantages vs Limitations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">
              Advantages
            </h3>
            <ul className="space-y-2">
              {config.advantages.map((adv, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-green-400 shrink-0 mt-0.5">+</span>
                  {adv}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
              Limitations
            </h3>
            <ul className="space-y-2">
              {config.limitations.map((lim, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-red-400 shrink-0 mt-0.5">−</span>
                  {lim}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
