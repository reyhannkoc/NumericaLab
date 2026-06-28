import { useState, useMemo } from 'react'
import { clsx } from 'clsx'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import type { PlaygroundPreset } from '@/types/lesson.types'
import { type FloatPrecisionKind, PRECISION_META, getBits } from './BitDisplay'

// ─── Float utilities ──────────────────────────────────────────────────────────

const F32_BUF = new Float32Array(1)
const toF32 = (x: number): number => { F32_BUF[0] = x; return F32_BUF[0] }

/** Decode float16 bit string back to a float64 approximation */
function decodeFloat16(bits: string): number {
  const sign   = parseInt(bits[0], 2)
  const exp5   = parseInt(bits.slice(1, 6), 2)
  const mant10 = parseInt(bits.slice(6), 2)
  if (exp5 === 0)  return (sign ? -1 : 1) * mant10 * Math.pow(2, -24)
  if (exp5 === 31) return mant10 === 0 ? (sign ? -Infinity : Infinity) : NaN
  return (sign ? -1 : 1) * (1 + mant10 / 1024) * Math.pow(2, exp5 - 15)
}

function storedValue(x: number, p: FloatPrecisionKind): number {
  if (p === 'float16') return decodeFloat16(getBits(x, 'float16'))
  if (p === 'float32') return toF32(x)
  return x
}

function fmtNum(x: number, sig = 9): string {
  if (!isFinite(x)) return isNaN(x) ? 'NaN' : x > 0 ? '+∞ (overflow)' : '−∞ (overflow)'
  if (Object.is(x, -0)) return '−0'
  if (x === 0) return '0 (underflow)'
  return x.toPrecision(sig)
}

function sigDigits(relErr: number): string {
  if (!isFinite(relErr) || relErr <= 0) return '∞'
  return Math.max(0, -Math.log10(relErr)).toFixed(1)
}

// ─── Playground presets ───────────────────────────────────────────────────────

const PLAYGROUND_PRESETS: PlaygroundPreset[] = [
  { id: 'fp-01',  label: '0.1',     description: 'Cannot be represented exactly in binary', params: { value: 0.1      } },
  { id: 'fp-03',  label: '0.3',     description: 'Result of 0.1 + 0.2 ≠ 0.3',             params: { value: 0.3      } },
  { id: 'fp-13',  label: '1/3',     description: 'Infinite repeating binary fraction',      params: { value: 1/3      } },
  { id: 'fp-pi',  label: 'π',       description: 'Irrational — infinite binary expansion',  params: { value: Math.PI  } },
  { id: 'fp-s2',  label: '√2',      description: 'Irrational square root',                  params: { value: Math.SQRT2 } },
  { id: 'fp-e',   label: 'e',       description: "Euler's number",                          params: { value: Math.E   } },
  { id: 'fp-big', label: '65504',   description: 'Maximum finite float16 value',            params: { value: 65504    } },
  { id: 'fp-sml', label: '1e-40',   description: 'Below float32 minimum — subnormal',       params: { value: 1e-40    } },
]

// ─── Float experiments table ──────────────────────────────────────────────────

interface FPExperiment extends Record<string, unknown> {
  expression: string
  trueValue:  string
  float32:    string
  float64:    string
  phenomenon: string
}

function buildExperiments(): FPExperiment[] {
  const sum01_f32 = (() => {
    let s = 0; for (let i = 0; i < 10; i++) s = toF32(s + toF32(0.1)); return s
  })()

  return [
    {
      expression: '0.1 + 0.2',
      trueValue:  '0.3 (exact)',
      float32:    fmtNum(toF32(toF32(0.1) + toF32(0.2))),
      float64:    fmtNum(0.1 + 0.2),
      phenomenon: 'Binary fraction rounding',
    },
    {
      expression: '1 / 3',
      trueValue:  '0.333… (∞ digits)',
      float32:    fmtNum(toF32(1 / 3)),
      float64:    fmtNum(1 / 3),
      phenomenon: 'Repeating binary',
    },
    {
      expression: 'π',
      trueValue:  '3.14159265358979…',
      float32:    fmtNum(toF32(Math.PI)),
      float64:    fmtNum(Math.PI),
      phenomenon: 'Irrational constant',
    },
    {
      expression: '1e8 + 1 − 1e8',
      trueValue:  '1',
      float32:    fmtNum(toF32(toF32(toF32(1e8) + toF32(1)) - toF32(1e8))),
      float64:    fmtNum(1e8 + 1 - 1e8),
      phenomenon: 'Catastrophic cancellation',
    },
    {
      expression: '1e38 × 2  (f32)',
      trueValue:  '2e38',
      float32:    fmtNum(toF32(1e38) * 2),
      float64:    fmtNum(1e38 * 2),
      phenomenon: 'float32 overflow',
    },
    {
      expression: '1e-40  (f32)',
      trueValue:  '~1.00 × 10⁻⁴⁰',
      float32:    fmtNum(toF32(1e-40)),
      float64:    fmtNum(1e-40),
      phenomenon: 'Subnormal / underflow',
    },
    {
      expression: '0.1 × 10  (10 sums)',
      trueValue:  '1.0',
      float32:    fmtNum(sum01_f32),
      float64:    fmtNum(0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1),
      phenomenon: 'Accumulated rounding error',
    },
    {
      expression: '(1/49) × 49',
      trueValue:  '1.0',
      float32:    fmtNum(toF32(toF32(1 / 49) * toF32(49))),
      float64:    fmtNum((1 / 49) * 49),
      phenomenon: 'Composition of rounding',
    },
  ]
}

const EXPERIMENTS = buildExperiments()

const EXP_COLUMNS = [
  { key: 'expression' as const, header: 'Expression',  tooltip: 'The mathematical expression being evaluated' },
  { key: 'trueValue'  as const, header: 'True Value',  tooltip: 'Exact mathematical result'                 },
  { key: 'float32'    as const, header: 'float32',     highlight: true, tooltip: 'Computed in float32 (single precision)' },
  { key: 'float64'    as const, header: 'float64',     highlight: true, tooltip: 'Computed in float64 (double precision)' },
  { key: 'phenomenon' as const, header: 'Phenomenon',  tooltip: 'The type of floating-point behaviour illustrated' },
]

// ─── Playground result types ──────────────────────────────────────────────────

type PrecisionKind = FloatPrecisionKind

interface PrecisionResult {
  precision:   PrecisionKind
  stored:      number
  absError:    number
  relError:    number
  sigDigits:   string
  bitsTotal:   number
}

function computeResults(x: number): PrecisionResult[] {
  return (['float16', 'float32', 'float64'] as PrecisionKind[]).map((p) => {
    const sv = storedValue(x, p)
    const ae = Math.abs(sv - x)
    const re = x !== 0 ? ae / Math.abs(x) : 0
    return {
      precision: p,
      stored:    sv,
      absError:  ae,
      relError:  re,
      sigDigits: sigDigits(re),
      bitsTotal: PRECISION_META[p].totalBits,
    }
  })
}

const PRECISION_COLORS: Record<PrecisionKind, string> = {
  float16: 'text-rose-400',
  float32: 'text-amber-400',
  float64: 'text-blue-400',
}

// ─── Component ────────────────────────────────────────────────────────────────

const DEFAULT_INPUT = '3.14159265358979'

export default function FloatInteractiveSection() {
  const [inputStr, setInputStr]  = useState(DEFAULT_INPUT)
  const [results, setResults]    = useState<PrecisionResult[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const parsedValue = useMemo(() => {
    const p = parseFloat(inputStr)
    return Number.isFinite(p) ? p : null
  }, [inputStr])

  const handlePreset = (preset: PlaygroundPreset) => {
    const v = preset.params['value']
    if (typeof v === 'number') {
      setInputStr(String(v))
      setResults(null)
    }
  }

  const handleRun = () => {
    if (parsedValue === null) return
    setIsLoading(true)
    setTimeout(() => {
      setResults(computeResults(parsedValue))
      setIsLoading(false)
    }, 50)
  }

  const handleReset = () => {
    setInputStr(DEFAULT_INPUT)
    setResults(null)
  }

  const playgroundControls = (
    <div className="space-y-4">
      <div>
        <label className="section-label mb-1.5 block">Decimal value</label>
        <input
          type="number"
          step="any"
          value={inputStr}
          onChange={(e) => { setInputStr(e.target.value); setResults(null) }}
          className="input-field w-full font-mono"
          placeholder="e.g. 0.1"
        />
        {parsedValue === null && inputStr.trim() !== '' && (
          <p className="text-xs text-rose-400 mt-1">Invalid number</p>
        )}
      </div>

      <div className="text-xs text-slate-500 leading-relaxed">
        Enter any decimal number and click <strong className="text-slate-300">Run</strong> to compare
        how float16, float32, and float64 store and approximate it.
      </div>
    </div>
  )

  const playgroundResults = results ? (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-border">
        <span className="text-sm font-medium text-white">
          Precision comparison for{' '}
          <span className="font-mono text-brand-300">{parsedValue}</span>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs tabular-nums">
          <thead>
            <tr className="border-b border-surface-border text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="px-4 py-2 text-left">Precision</th>
              <th className="px-4 py-2 text-left">Stored Value</th>
              <th className="px-4 py-2 text-left">Abs Error</th>
              <th className="px-4 py-2 text-left">Rel Error</th>
              <th className="px-4 py-2 text-left">Sig. Digits</th>
              <th className="px-4 py-2 text-left">Memory</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.precision} className={clsx('border-b border-surface-border/40 last:border-0', i % 2 === 0 ? 'bg-surface-card/20' : '')}>
                <td className={clsx('px-4 py-2.5 font-medium font-mono', PRECISION_COLORS[r.precision])}>
                  {r.precision}
                </td>
                <td className="px-4 py-2.5 text-white font-mono text-[11px] max-w-[160px] truncate">
                  {fmtNum(r.stored)}
                </td>
                <td className="px-4 py-2.5 text-rose-400 font-mono">
                  {r.absError.toExponential(3)}
                </td>
                <td className="px-4 py-2.5 text-amber-400 font-mono">
                  {r.relError > 0 ? r.relError.toExponential(3) : '0'}
                </td>
                <td className={clsx(
                  'px-4 py-2.5 font-mono font-semibold',
                  parseFloat(r.sigDigits) > 10 ? 'text-green-400'
                  : parseFloat(r.sigDigits) > 5 ? 'text-amber-400'
                  : 'text-rose-400',
                )}>
                  ~{r.sigDigits}
                </td>
                <td className="px-4 py-2.5 text-slate-400 font-mono">
                  {r.bitsTotal / 8} B
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Hint */}
      <div className="px-4 py-3 border-t border-surface-border text-xs text-slate-500">
        Sig. digits = −log₁₀(relative error). float64 gives ~15 correct decimal digits for most values.
      </div>
    </div>
  ) : undefined

  return (
    <>
      {/* Section 6 — Precision Explorer Playground */}
      <InteractivePlayground
        description="Enter a decimal number to compare how float16, float32, and float64 represent it in memory. Use the presets to explore famous floating-point examples."
        controls={playgroundControls}
        results={playgroundResults}
        presets={PLAYGROUND_PRESETS}
        onPresetSelect={handlePreset}
        onRun={handleRun}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Section 7 — Famous Floating-Point Experiments (also satisfies id="algorithm") */}
      <AlgorithmExecution
        iterations={EXPERIMENTS}
        columns={EXP_COLUMNS}
        status="idle"
        description="Classic floating-point quirks — all values computed live in your browser using JavaScript's native float32 (via Float32Array) and float64 (native JS numbers)."
      />
    </>
  )
}
