import { MathJax } from 'better-react-mathjax'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { ErrorAnalysisConfig } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface ErrorAnalysisProps {
  config: ErrorAnalysisConfig
}

export default function ErrorAnalysis({ config }: ErrorAnalysisProps) {
  const meta = SECTION_MAP['error-analysis']

  return (
    <SectionWrapper id="error-analysis">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="space-y-5">
        {/* Error metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.metrics.map((metric, i) => (
            <div key={i} className="glass-card p-4">
              <h3 className="text-sm font-semibold text-white mb-1">{metric.label}</h3>
              <div className="text-white text-base overflow-x-auto py-2">
                <MathJax>{`\\[${metric.formula}\\]`}</MathJax>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Notes */}
        {(config.stabilityNote || config.floatingPointNote) && (
          <div className="space-y-3">
            {config.stabilityNote && (
              <div className="glass-card p-4 border-l-2 border-yellow-500">
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">
                  Numerical Stability
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {config.stabilityNote}
                </p>
              </div>
            )}
            {config.floatingPointNote && (
              <div className="glass-card p-4 border-l-2 border-purple-500">
                <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                  Floating Point Considerations
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {config.floatingPointNote}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
