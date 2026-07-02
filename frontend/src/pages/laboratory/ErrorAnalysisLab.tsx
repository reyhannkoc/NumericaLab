import { useState } from 'react'
import { clsx } from 'clsx'
import { LAB_DEFINITIONS, FLOAT_PRECISION_INFO, FLOAT_PHENOMENA } from '@/config/laboratory'
import { useFloatAnalysis } from '@/hooks/useFloatAnalysis'
import { LabPageHeader } from '@/components/laboratory'
import type { FloatPhenomenon, FloatPrecision } from '@/types/laboratory.types'

const lab = LAB_DEFINITIONS.find((l) => l.id === 'error-analysis')!
const PRECISIONS: FloatPrecision[] = ['float16', 'float32', 'float64']

export default function ErrorAnalysisLab() {
  const [phenomenon, setPhenomenon] = useState<FloatPhenomenon>('rounding')
  const { inputA, setInputA, inputB, setInputB, analysisA, sumAnalysis } = useFloatAnalysis()

  const currentPhenomenon = FLOAT_PHENOMENA.find((p) => p.id === phenomenon)!

  const handlePhenomenonSelect = (p: FloatPhenomenonDef) => {
    setPhenomenon(p.id)
    setInputA(p.inputA)
    if (p.inputB !== undefined) setInputB(p.inputB)
  }

  return (
    <div>
      <LabPageHeader
        icon={lab.icon}
        title={lab.title}
        subtitle={lab.subtitle}
        badge={lab.badge}
        badgeColor={lab.color}
        description="All computation happens in your browser in real time. Enter any number and see how it is stored in float16, float32, and float64."
      />

      {/* Phenomenon tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FLOAT_PHENOMENA.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => handlePhenomenonSelect(p)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              phenomenon === p.id
                ? 'text-white border border-orange-500/40 bg-orange-500/10'
                : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Controls ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Phenomenon info */}
          <div className="glass-card p-4 border-l-2 border-orange-500">
            <h3 className="text-sm font-semibold text-orange-300 mb-2">{currentPhenomenon.label}</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">{currentPhenomenon.description}</p>
            <div className="rounded-md bg-slate-900 border border-surface-border px-3 py-2">
              <p className="text-xs text-slate-500 mb-1">Classic example</p>
              <p className="text-sm font-mono text-orange-300">{currentPhenomenon.example}</p>
            </div>
          </div>

          {/* Number inputs */}
          <div className="glass-card p-4 space-y-3">
            <p className="section-label">Input Values</p>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Value A</label>
              <input
                type="number"
                value={inputA}
                onChange={(e) => setInputA(+e.target.value)}
                step="any"
                className="input-field w-full font-mono"
              />
            </div>
            {(phenomenon === 'rounding' || phenomenon === 'cancellation') && (
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Value B</label>
                <input
                  type="number"
                  value={inputB}
                  onChange={(e) => setInputB(+e.target.value)}
                  step="any"
                  className="input-field w-full font-mono"
                />
              </div>
            )}
          </div>

          {/* Precision reference */}
          <div className="glass-card p-4">
            <p className="section-label mb-3">Precision Reference</p>
            <div className="space-y-2">
              {PRECISIONS.map((p) => {
                const info = FLOAT_PRECISION_INFO[p]
                return (
                  <div key={p} className="flex items-center justify-between text-xs">
                    <span style={{ color: info.color }} className="font-medium">{info.label}</span>
                    <span className="text-slate-500 font-mono">{info.totalBits} bits ({info.mantissaBits} mantissa)</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Precision analysis table for Value A */}
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-border">
              <p className="text-sm font-semibold text-white">
                Storage Analysis for A = <span className="font-mono text-orange-300">{inputA}</span>
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-surface-border">
                    {['Precision', 'Stored Value', 'Abs Error', 'Rel Error', 'Flags'].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRECISIONS.map((p) => {
                    const r = analysisA[p]
                    const info = FLOAT_PRECISION_INFO[p]
                    return (
                      <tr key={p} className="border-b border-surface-border/50 last:border-0 hover:bg-surface-hover/20">
                        <td className="px-3 py-2.5 font-medium text-xs" style={{ color: info.color }}>
                          {info.label}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-white">
                          {isFinite(r.stored) ? r.stored.toPrecision(10) : (r.stored > 0 ? '+∞' : '−∞')}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-slate-300">
                          {r.absoluteError.toExponential(3)}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-slate-300">
                          {r.relativeError.toExponential(3)}
                        </td>
                        <td className="px-3 py-2.5 text-xs">
                          {r.isExact    && <span className="text-green-400">Exact</span>}
                          {r.isOverflow && <span className="text-red-400">Overflow</span>}
                          {r.isUnderflow && <span className="text-yellow-400">Underflow</span>}
                          {!r.isExact && !r.isOverflow && !r.isUnderflow && (
                            <span className="text-slate-500">Rounded</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sum analysis for rounding/cancellation */}
          {(phenomenon === 'rounding' || phenomenon === 'cancellation') && (
            <div className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-border">
                <p className="text-sm font-semibold text-white">
                  A + B in each precision
                  <span className="text-slate-500 font-normal ml-2 text-xs">
                    (true sum = <span className="font-mono text-white">{(inputA + inputB).toPrecision(12)}</span>)
                  </span>
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm tabular-nums">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Precision', 'Computed Sum', 'Error vs True'].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-xs text-slate-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sumAnalysis.map((s) => {
                      const info = FLOAT_PRECISION_INFO[s.precision]
                      const err = Math.abs(s.storedSum - s.trueSum)
                      return (
                        <tr key={s.precision} className="border-b border-surface-border/50 last:border-0 hover:bg-surface-hover/20">
                          <td className="px-3 py-2.5 text-xs font-medium" style={{ color: info.color }}>
                            {info.label}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-white">
                            {isFinite(s.storedSum) ? s.storedSum.toPrecision(12) : '∞'}
                          </td>
                          <td className={clsx('px-3 py-2.5 font-mono text-xs', err > 1e-6 ? 'text-red-400' : err > 0 ? 'text-yellow-400' : 'text-green-400')}>
                            {err.toExponential(3)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Propagation demo */}
          {phenomenon === 'propagation' && (
            <div className="glass-card p-5">
              <p className="text-sm font-semibold text-white mb-3">
                Error propagation: repeated × {inputA} for n steps
              </p>
              <div className="space-y-2">
                {[1, 5, 10, 20, 50, 100].map((n) => {
                  const f32 = (() => { const a = new Float32Array(1); a[0] = inputA; let v = a[0]; for (let i = 1; i < n; i++) { a[0] = v * a[0]; v = a[0]; } return v })()
                  const f64 = Math.pow(inputA, n)
                  return (
                    <div key={n} className="grid grid-cols-4 gap-2 text-xs">
                      <span className="text-slate-500">n = {n}</span>
                      <span className="font-mono text-green-400">f64: {f64.toExponential(4)}</span>
                      <span className="font-mono text-yellow-400">f32: {f32.toExponential(4)}</span>
                      <span className="font-mono text-red-400">
                        Δ: {Math.abs(f64 - f32).toExponential(2)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Type alias used internally
type FloatPhenomenonDef = typeof FLOAT_PHENOMENA[number]
