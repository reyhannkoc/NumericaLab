import { Link } from 'react-router-dom'
import { MathJax } from 'better-react-mathjax'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { SummaryConfig } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface LessonSummaryProps {
  config: SummaryConfig
}

export default function LessonSummary({ config }: LessonSummaryProps) {
  const meta = SECTION_MAP['summary']

  return (
    <SectionWrapper id="summary">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="space-y-6">
        {/* Key takeaways */}
        <div>
          <h3 className="section-label mb-3">Key Takeaways</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.keyPoints.map((point, i) => (
              <div key={i} className="glass-card p-4 flex gap-3">
                <span className="text-lg shrink-0">{point.icon ?? '✓'}</span>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{point.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cheat sheet */}
        <div>
          <h3 className="section-label mb-3">Formula Cheat Sheet</h3>
          <div className="glass-card divide-y divide-surface-border">
            {config.cheatSheetFormulas.map((formula, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <div className="w-40 shrink-0 text-xs text-slate-400 font-medium">
                  {formula.label}
                </div>
                <div className="flex-1 text-white overflow-x-auto">
                  <MathJax inline>{`\\(${formula.latex}\\)`}</MathJax>
                </div>
                {formula.description && (
                  <div className="text-xs text-slate-500 hidden lg:block max-w-xs">
                    {formula.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        {config.nextSteps && config.nextSteps.length > 0 && (
          <div>
            <h3 className="section-label mb-3">What's Next?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {config.nextSteps.map((step) => (
                <Link
                  key={step.path}
                  to={step.path}
                  className="glass-card p-4 hover:border-brand-500/40
                             hover:bg-brand-950/10 transition-all group block"
                >
                  <p className="text-sm font-semibold text-white group-hover:text-brand-300
                                transition-colors mb-1">
                    {step.label} →
                  </p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
