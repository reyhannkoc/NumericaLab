import { MathJax } from 'better-react-mathjax'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { ErrorAnalysisConfig } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface ErrorAnalysisProps {
  config: ErrorAnalysisConfig
  /** Optional live absolute error from the last computation */
  absoluteError?: number
  /** Optional live relative error */
  relativeError?: number
  /** Optional live iteration count */
  iterations?: number
}

function ErrorBar({
  label,
  value,
  unit = '',
}: {
  label: string
  value: number
  unit?: string
}) {
  const exponent = value > 0 ? Math.floor(Math.log10(value)) : 0
  const level = Math.max(0, Math.min(100, ((exponent + 16) / 16) * 100))

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs text-brand-300 font-mono tabular-nums">
          {value.toExponential(4)}{unit}
        </span>
      </div>
      <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-500"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  )
}

export default function ErrorAnalysis({
  config,
  absoluteError,
  relativeError,
  iterations,
}: ErrorAnalysisProps) {
  const meta = SECTION_MAP['error-analysis']

  return (
    <SectionWrapper id="error-analysis">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="space-y-5">
        {/* Live error display (if computation ran) */}
        {(absoluteError !== undefined || relativeError !== undefined) && (
          <div className="glass-card p-5">
            <h3 className="section-label mb-4">Current Computation Errors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {absoluteError !== undefined && (
                <ErrorBar label="Absolute Error" value={absoluteError} />
              )}
              {relativeError !== undefined && (
                <ErrorBar label="Relative Error" value={relativeError} unit="%" />
              )}
              {iterations !== undefined && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Iterations Used</span>
                    <span className="text-xs text-brand-300 font-mono">{iterations}</span>
                  </div>
                  <div className="h-1.5 bg-surface-border rounded-full" />
                </div>
              )}
            </div>
          </div>
        )}

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
