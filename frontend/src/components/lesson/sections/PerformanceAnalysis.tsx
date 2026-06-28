import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { PerformanceConfig } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'
import { MathJax } from 'better-react-mathjax'

interface PerformanceAnalysisProps {
  config: PerformanceConfig
  /** Measured execution time in milliseconds from last run */
  measuredMs?: number
  /** Actual iteration count from last run */
  actualIterations?: number
}

interface MetricTileProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

function MetricTile({ label, value, sub, accent }: MetricTileProps) {
  return (
    <div className={`glass-card p-4 ${accent ? 'border-brand-500/30' : ''}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold font-mono ${accent ? 'text-brand-300' : 'text-white'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

export default function PerformanceAnalysis({
  config,
  measuredMs,
  actualIterations,
}: PerformanceAnalysisProps) {
  const meta = SECTION_MAP['performance']

  return (
    <SectionWrapper id="performance">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="space-y-5">
        {/* Live metrics (if a computation ran) */}
        {(measuredMs !== undefined || actualIterations !== undefined) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {measuredMs !== undefined && (
              <MetricTile
                label="Execution Time"
                value={`${measuredMs.toFixed(2)} ms`}
                accent
              />
            )}
            {actualIterations !== undefined && (
              <MetricTile
                label="Iterations Used"
                value={String(actualIterations)}
                accent
              />
            )}
          </div>
        )}

        {/* Complexity grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass-card p-4">
            <p className="section-label mb-2">Time Complexity</p>
            <div className="text-white overflow-x-auto py-1">
              <MathJax>{`\\(${config.complexity.timeComplexity}\\)`}</MathJax>
            </div>
          </div>
          <div className="glass-card p-4">
            <p className="section-label mb-2">Space Complexity</p>
            <div className="text-white overflow-x-auto py-1">
              <MathJax>{`\\(${config.complexity.spaceComplexity}\\)`}</MathJax>
            </div>
          </div>
          <div className="glass-card p-4">
            <p className="section-label mb-2">Convergence Order</p>
            <div className="text-brand-300 overflow-x-auto py-1 font-mono text-lg font-bold">
              <MathJax>{`\\(${config.complexity.convergenceOrder}\\)`}</MathJax>
            </div>
            {config.complexity.convergenceOrderNote && (
              <p className="text-xs text-slate-500 mt-1">
                {config.complexity.convergenceOrderNote}
              </p>
            )}
          </div>
        </div>

        {/* Best / worst / typical */}
        {(config.bestCase || config.worstCase || config.typicalIterations) && (
          <div className="glass-card p-5">
            <h3 className="section-label mb-4">Practical Performance</h3>
            <dl className="space-y-3">
              {config.bestCase && (
                <div className="flex gap-3 text-sm">
                  <dt className="w-36 shrink-0 text-slate-500">Best case</dt>
                  <dd className="text-slate-200">{config.bestCase}</dd>
                </div>
              )}
              {config.worstCase && (
                <div className="flex gap-3 text-sm">
                  <dt className="w-36 shrink-0 text-slate-500">Worst case</dt>
                  <dd className="text-slate-200">{config.worstCase}</dd>
                </div>
              )}
              {config.typicalIterations && (
                <div className="flex gap-3 text-sm">
                  <dt className="w-36 shrink-0 text-slate-500">Typical iterations</dt>
                  <dd className="text-slate-200">{config.typicalIterations}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
