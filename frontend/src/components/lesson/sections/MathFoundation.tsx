import { useState } from 'react'
import { MathJax } from 'better-react-mathjax'
import { clsx } from 'clsx'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { MathFoundationConfig, MathFormula } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface MathFoundationProps {
  config: MathFoundationConfig
}

function FormulaCard({ formula, accent = false }: { formula: MathFormula; accent?: boolean }) {
  return (
    <div
      className={clsx(
        'glass-card p-4',
        accent && 'border-l-2 border-brand-500 bg-brand-950/20',
      )}
    >
      {formula.label && (
        <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
          {formula.label}
        </p>
      )}
      <div className="flex items-center justify-center py-3 text-white text-lg overflow-x-auto">
        <MathJax>{`\\[${formula.latex}\\]`}</MathJax>
      </div>
      {formula.description && (
        <p className="text-xs text-slate-400 mt-2 text-center">{formula.description}</p>
      )}
    </div>
  )
}

export default function MathFoundation({ config }: MathFoundationProps) {
  const meta = SECTION_MAP['math-foundation']
  const [derivationOpen, setDerivationOpen] = useState(false)

  return (
    <SectionWrapper id="math-foundation">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="space-y-6">
        {/* Key formulas */}
        <div>
          <h3 className="section-label mb-3">Core Formulas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.formulas.map((formula, i) => (
              <FormulaCard key={i} formula={formula} accent={formula.isKeyFormula} />
            ))}
          </div>
        </div>

        {/* Assumptions */}
        {config.assumptions && config.assumptions.length > 0 && (
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">
              Assumptions
            </h3>
            <ul className="space-y-1.5">
              {config.assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-yellow-400 shrink-0 mt-0.5">⚠</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Convergence condition */}
        {config.convergenceCondition && (
          <div className="glass-card p-4 border-l-2 border-emerald-500 bg-emerald-950/10">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Convergence Condition
            </h3>
            <div className="text-white overflow-x-auto py-1">
              <MathJax>{`\\[${config.convergenceCondition}\\]`}</MathJax>
            </div>
          </div>
        )}

        {/* Symbol table */}
        {config.symbols.length > 0 && (
          <div className="glass-card p-4">
            <h3 className="section-label mb-3">Symbol Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    <th className="text-left py-2 pr-6 text-xs font-semibold text-slate-400 uppercase tracking-wider w-20">
                      Symbol
                    </th>
                    <th className="text-left py-2 pr-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Definition
                    </th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">
                      Unit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {config.symbols.map((sym, i) => (
                    <tr
                      key={i}
                      className="border-b border-surface-border/50 last:border-0 hover:bg-surface-hover/30"
                    >
                      <td className="py-2 pr-6 font-mono text-brand-300">
                        <MathJax inline>{`\\(${sym.symbol}\\)`}</MathJax>
                      </td>
                      <td className="py-2 pr-6 text-slate-300">{sym.definition}</td>
                      <td className="py-2 text-slate-500 text-xs">
                        {sym.unit ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Derivation (collapsible) */}
        {config.derivationSteps && config.derivationSteps.length > 0 && (
          <div className="glass-card overflow-hidden">
            <button
              type="button"
              onClick={() => setDerivationOpen((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4
                         text-sm font-medium text-slate-300 hover:text-white
                         hover:bg-surface-hover/40 transition-colors"
            >
              <span>Derivation</span>
              <span className="text-slate-500 text-xs">{derivationOpen ? '▲ collapse' : '▼ expand'}</span>
            </button>

            {derivationOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-surface-border">
                {config.derivationSteps.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full
                                 bg-brand-600/20 border border-brand-600/30
                                 text-brand-300 text-xs font-bold shrink-0 mt-1"
                    >
                      {step.step}
                    </div>
                    <div>
                      <p className="text-sm text-slate-300 mb-1">{step.description}</p>
                      {step.latex && (
                        <div className="text-white overflow-x-auto">
                          <MathJax>{`\\[${step.latex}\\]`}</MathJax>
                        </div>
                      )}
                      {step.note && (
                        <p className="text-xs text-slate-500 mt-1 italic">{step.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
