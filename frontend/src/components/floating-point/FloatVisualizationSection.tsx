import { useState, useMemo } from 'react'
import { clsx } from 'clsx'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'
import BitDisplay, { type FloatPrecisionKind, PRECISION_META, getBits } from './BitDisplay'

// ─── Float value helpers ──────────────────────────────────────────────────────

const F32_BUF = new Float32Array(1)
function toF32(x: number): number { F32_BUF[0] = x; return F32_BUF[0] }

function storedValueFor(x: number, precision: FloatPrecisionKind): number {
  if (precision === 'float16') {
    // Decode float16 bits back to a float64 approximation
    const bits = getBits(x, 'float16')
    const sign     = parseInt(bits[0], 2)
    const exp5     = parseInt(bits.slice(1, 6), 2)
    const mant10   = parseInt(bits.slice(6), 2)
    if (exp5 === 0)  return (sign ? -1 : 1) * mant10 * Math.pow(2, -24) // subnormal
    if (exp5 === 31) return mant10 === 0 ? (sign ? -Infinity : Infinity) : NaN
    return (sign ? -1 : 1) * (1 + mant10 / 1024) * Math.pow(2, exp5 - 15)
  }
  if (precision === 'float32') return toF32(x)
  return x
}

// ─── Decimal-to-binary conversion steps ─────────────────────────────────────

interface IntStep { dividend: number; quotient: number; remainder: number }
interface FracStep { value: number; product: number; bit: number }

function decimalToBinarySteps(v: number, maxFracBits = 8) {
  const absV = Math.abs(v)
  const intPart = Math.floor(absV)
  const fracPart = absV - intPart

  const intSteps: IntStep[] = []
  let curr = intPart
  if (curr === 0) {
    intSteps.push({ dividend: 0, quotient: 0, remainder: 0 })
  }
  while (curr > 0) {
    intSteps.push({ dividend: curr, quotient: Math.floor(curr / 2), remainder: curr % 2 })
    curr = Math.floor(curr / 2)
  }

  const fracSteps: FracStep[] = []
  let f = fracPart
  for (let i = 0; i < maxFracBits && f > 0; i++) {
    const p = f * 2
    const bit = Math.floor(p)
    fracSteps.push({ value: +f.toPrecision(6), product: +p.toPrecision(6), bit })
    f = p - bit
  }

  const intBinary = intSteps.map((s) => s.remainder).reverse().join('') || '0'
  const fracBinary = fracSteps.map((s) => s.bit).join('')

  return { intSteps: intSteps.reverse(), fracSteps, intBinary, fracBinary, sign: v < 0 }
}

// ─── Precision panel ──────────────────────────────────────────────────────────

const PRECISION_ORDER: FloatPrecisionKind[] = ['float16', 'float32', 'float64']
const PRECISION_LABELS: Record<FloatPrecisionKind, string> = {
  float16: 'float16 — Half Precision',
  float32: 'float32 — Single Precision',
  float64: 'float64 — Double Precision',
}
const PRECISION_COLOR: Record<FloatPrecisionKind, string> = {
  float16: 'text-rose-400 border-rose-500/30 bg-rose-500/5',
  float32: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
  float64: 'text-blue-400  border-blue-500/30  bg-blue-500/5',
}

// ─── Main component ───────────────────────────────────────────────────────────

const DEFAULT_VALUE = 6.75
const PRESETS: Array<{ label: string; value: number }> = [
  { label: '0.1',   value: 0.1   },
  { label: '0.3',   value: 0.3   },
  { label: '1/3',   value: 1/3   },
  { label: 'π',     value: Math.PI },
  { label: '6.75',  value: 6.75  },
  { label: '65504', value: 65504 },
  { label: '−1.5',  value: -1.5  },
]

export default function FloatVisualizationSection() {
  const [inputStr, setInputStr] = useState(String(DEFAULT_VALUE))
  const [showConversion, setShowConversion] = useState(false)
  const [selected, setSelected] = useState<FloatPrecisionKind>('float32')

  const value = useMemo(() => {
    const p = parseFloat(inputStr)
    return Number.isFinite(p) ? p : DEFAULT_VALUE
  }, [inputStr])

  const conversion = useMemo(() => decimalToBinarySteps(value), [value])

  const meta = PRECISION_META[selected]
  const storedVal = storedValueFor(value, selected)
  const absError = Math.abs(storedVal - value)
  const relError = value !== 0 ? absError / Math.abs(value) : 0

  return (
    <InteractiveVisualization
      description="Enter any decimal number to inspect how each IEEE 754 format stores it in memory. Toggle between precisions to compare bit patterns."
      controls={
        <div className="flex items-center gap-3 flex-wrap">
          {/* Number input */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 whitespace-nowrap">Value</label>
            <input
              type="number"
              step="any"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              className="input-field w-36 font-mono text-sm"
            />
          </div>

          {/* Preset buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            {PRESETS.map((p) => (
              <button
                type="button"
                key={p.label}
                onClick={() => setInputStr(String(p.value))}
                className="px-2 py-1 rounded text-xs font-mono bg-surface-card border border-surface-border text-slate-300 hover:border-brand-500/50 hover:text-white transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Conversion toggle */}
          <button
            type="button"
            onClick={() => setShowConversion((v) => !v)}
            className="ml-auto px-3 py-1 rounded text-xs border border-surface-border text-slate-400 hover:text-white hover:border-brand-500/50 transition-colors"
          >
            {showConversion ? '▲ Hide' : '▼ Show'} Binary Conversion
          </button>
        </div>
      }
    >
      {/* ── Precision tabs ── */}
      <div className="border-b border-surface-border">
        <div className="flex">
          {PRECISION_ORDER.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setSelected(p)}
              className={clsx(
                'px-5 py-3 text-sm font-medium border-b-2 transition-colors',
                selected === p
                  ? 'border-brand-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bit display panel ── */}
      <div className="p-5">
        {/* Header */}
        <div className={clsx('inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-4', PRECISION_COLOR[selected])}>
          {PRECISION_LABELS[selected]} — {meta.totalBits} bits
        </div>

        {/* Bit grid */}
        <BitDisplay value={value} precision={selected} />

        {/* Decoded metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="glass-card p-3">
            <div className="text-xs text-slate-500 mb-1">Stored value</div>
            <div className="text-sm font-mono text-white truncate">
              {Number.isFinite(storedVal) ? storedVal.toPrecision(10) : String(storedVal)}
            </div>
          </div>
          <div className="glass-card p-3">
            <div className="text-xs text-slate-500 mb-1">Absolute error</div>
            <div className="text-sm font-mono text-rose-400">{absError.toExponential(3)}</div>
          </div>
          <div className="glass-card p-3">
            <div className="text-xs text-slate-500 mb-1">Relative error</div>
            <div className="text-sm font-mono text-amber-400">
              {value !== 0 ? relError.toExponential(3) : '0'}
            </div>
          </div>
          <div className="glass-card p-3">
            <div className="text-xs text-slate-500 mb-1">Machine ε</div>
            <div className="text-sm font-mono text-blue-400">
              2<sup>−{meta.mantissaBits}</sup> ≈ {Math.pow(2, -meta.mantissaBits).toExponential(2)}
            </div>
          </div>
        </div>

        {/* ── All three precisions quick comparison ── */}
        <div className="mt-5">
          <p className="section-label mb-2">All Precisions Side by Side</p>
          <div className="space-y-3">
            {PRECISION_ORDER.map((p) => {
              const sv = storedValueFor(value, p)
              const ae = Math.abs(sv - value)
              return (
                <div key={p} className={clsx('glass-card p-3 border', PRECISION_COLOR[p])}>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium">{p}</span>
                    <span className="text-slate-400">{PRECISION_META[p].totalBits} bits · ε≈{Math.pow(2, -PRECISION_META[p].mantissaBits).toExponential(1)}</span>
                  </div>
                  <BitDisplay value={value} precision={p} size={p === 'float64' ? 'sm' : 'md'} />
                  <div className="mt-2 text-xs text-slate-400 font-mono">
                    Stored: <span className="text-white">{Number.isFinite(sv) ? sv.toPrecision(8) : String(sv)}</span>
                    {' · '}AbsErr: <span className="text-rose-300">{ae.toExponential(2)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Decimal-to-binary steps ── */}
        {showConversion && (
          <div className="mt-5 glass-card p-4">
            <p className="section-label mb-3">How {value} converts to binary</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              {/* Integer part */}
              <div>
                <div className="text-slate-400 mb-2">
                  Integer part: <span className="text-white">{Math.floor(Math.abs(value))}</span>
                  {' '} → <span className="text-amber-400">{conversion.intBinary}</span>
                  <span className="text-slate-600"> (read remainders ↑)</span>
                </div>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-slate-500 border-b border-surface-border">
                      <th className="text-left py-1">n ÷ 2</th>
                      <th className="text-left py-1">Quotient</th>
                      <th className="text-left py-1 text-amber-400">Remainder (bit)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversion.intSteps.slice(0, 12).map((s, i) => (
                      <tr key={i} className="border-b border-surface-border/30">
                        <td className="py-1 text-slate-300">{s.dividend}</td>
                        <td className="py-1 text-slate-300">{s.quotient}</td>
                        <td className="py-1 text-amber-300 font-bold">{s.remainder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fractional part */}
              <div>
                <div className="text-slate-400 mb-2">
                  Fractional part: <span className="text-white">.{String(Math.abs(value) % 1).slice(2, 10) || '0'}</span>
                  {' '} → <span className="text-blue-400">.{conversion.fracBinary || '0'}</span>
                  {conversion.fracBinary.length >= 8 && <span className="text-slate-600">… (repeating)</span>}
                  <span className="text-slate-600"> (read bits ↓)</span>
                </div>
                {conversion.fracSteps.length > 0 ? (
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="text-slate-500 border-b border-surface-border">
                        <th className="text-left py-1">f × 2</th>
                        <th className="text-left py-1">Product</th>
                        <th className="text-left py-1 text-blue-400">Bit (⌊product⌋)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversion.fracSteps.map((s, i) => (
                        <tr key={i} className="border-b border-surface-border/30">
                          <td className="py-1 text-slate-300">{s.value}</td>
                          <td className="py-1 text-slate-300">{s.product}</td>
                          <td className="py-1 text-blue-300 font-bold">{s.bit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-slate-500 italic">No fractional part — exact integer!</div>
                )}
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-400">
              Binary: <span className="text-white font-mono">
                {conversion.sign ? '−' : '+'}{conversion.intBinary}{conversion.fracBinary ? '.' + conversion.fracBinary : ''}{' '}
                {conversion.fracBinary.length >= 8 && <span className="text-slate-500">…</span>}
              </span>
            </div>
          </div>
        )}
      </div>
    </InteractiveVisualization>
  )
}
