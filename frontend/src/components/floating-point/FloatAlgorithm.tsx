import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'

// ─── Float utilities ──────────────────────────────────────────────────────────

const F32_BUF = new Float32Array(1)
const toF32 = (x: number): number => { F32_BUF[0] = x; return F32_BUF[0] }

function fmtNum(x: number, sig = 9): string {
  if (!isFinite(x)) return isNaN(x) ? 'NaN' : x > 0 ? '+∞ (overflow)' : '−∞ (overflow)'
  if (Object.is(x, -0)) return '−0'
  if (x === 0) return '0 (underflow)'
  return x.toPrecision(sig)
}

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

export default function FloatAlgorithm() {
  return (
    <AlgorithmExecution
      iterations={EXPERIMENTS}
      columns={EXP_COLUMNS}
      status="idle"
      description="Classic floating-point quirks — all values computed live in your browser using JavaScript's native float32 (via Float32Array) and float64 (native JS numbers)."
    />
  )
}
