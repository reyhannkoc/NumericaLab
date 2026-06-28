import { clsx } from 'clsx'

export type FloatPrecisionKind = 'float16' | 'float32' | 'float64'

// ─── IEEE 754 bit extraction ──────────────────────────────────────────────────

function getFloat32Bits(v: number): string {
  const buf = new ArrayBuffer(4)
  const dv = new DataView(buf)
  dv.setFloat32(0, v)
  return dv.getUint32(0).toString(2).padStart(32, '0')
}

function getFloat64Bits(v: number): string {
  const buf = new ArrayBuffer(8)
  const dv = new DataView(buf)
  dv.setFloat64(0, v)
  const hi = dv.getUint32(0).toString(2).padStart(32, '0')
  const lo = dv.getUint32(4).toString(2).padStart(32, '0')
  return hi + lo
}

/** Approximate float16 bit pattern from a float64 value. */
function getFloat16Bits(v: number): string {
  if (isNaN(v))         return '0' + '11111' + '1' + '0'.repeat(9) // NaN
  if (!isFinite(v))     return (v > 0 ? '0' : '1') + '11111' + '0'.repeat(10) // ±Inf
  if (Math.abs(v) > 65504) return (v > 0 ? '0' : '1') + '11111' + '0'.repeat(10) // overflow

  const buf = new ArrayBuffer(4)
  const dv  = new DataView(buf)
  dv.setFloat32(0, v)
  const bits32 = dv.getUint32(0)

  const sign  = (bits32 >>> 31) & 1
  const exp8  = (bits32 >>> 23) & 0xFF
  const mant  = bits32 & 0x7FFFFF

  const newExp = exp8 - 127 + 15
  if (newExp <= 0) return (sign ? '1' : '0') + '00000' + '0'.repeat(10) // underflow → 0

  const mant10 = (mant >> 13) & 0x3FF
  const bits16 = (sign << 15) | (newExp << 10) | mant10
  return bits16.toString(2).padStart(16, '0')
}

export function getBits(v: number, precision: FloatPrecisionKind): string {
  if (precision === 'float16') return getFloat16Bits(v)
  if (precision === 'float32') return getFloat32Bits(v)
  return getFloat64Bits(v)
}

// ─── Precision metadata ───────────────────────────────────────────────────────

interface PrecisionMeta {
  totalBits:    number
  signBits:     number
  exponentBits: number
  mantissaBits: number
  bias:         number
  label:        string
}

export const PRECISION_META: Record<FloatPrecisionKind, PrecisionMeta> = {
  float16: { totalBits: 16, signBits: 1, exponentBits: 5,  mantissaBits: 10, bias: 15,  label: 'float16 (Half)' },
  float32: { totalBits: 32, signBits: 1, exponentBits: 8,  mantissaBits: 23, bias: 127, label: 'float32 (Single)' },
  float64: { totalBits: 64, signBits: 1, exponentBits: 11, mantissaBits: 52, bias: 1023, label: 'float64 (Double)' },
}

// ─── BitCell ──────────────────────────────────────────────────────────────────

type Region = 'sign' | 'exponent' | 'mantissa'

const REGION_COLORS: Record<Region, string> = {
  sign:     'bg-rose-500/80   border-rose-400/60   text-white',
  exponent: 'bg-amber-500/80  border-amber-400/60  text-white',
  mantissa: 'bg-blue-600/70   border-blue-500/60   text-white',
}

const REGION_LABEL_COLORS: Record<Region, string> = {
  sign:     'text-rose-400',
  exponent: 'text-amber-400',
  mantissa: 'text-blue-400',
}

interface BitCellProps {
  bit:    string
  region: Region
  size:   'sm' | 'md'
}

function BitCell({ bit, region, size }: BitCellProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded border font-mono font-bold select-none',
        REGION_COLORS[region],
        size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 text-xs',
      )}
    >
      {bit}
    </span>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

interface BitDisplayProps {
  value:     number
  precision: FloatPrecisionKind
  /** 'sm' for float64 (many bits), 'md' for float16/32 */
  size?:     'sm' | 'md'
}

export default function BitDisplay({ value, precision, size }: BitDisplayProps) {
  const meta = PRECISION_META[precision]
  const bits = getBits(value, precision)
  const cellSize = size ?? (precision === 'float64' ? 'sm' : 'md')

  // Annotate each bit with its region
  const annotated: Array<{ bit: string; region: Region }> = bits.split('').map((b, i) => ({
    bit: b,
    region:
      i < meta.signBits
        ? 'sign'
        : i < meta.signBits + meta.exponentBits
        ? 'exponent'
        : 'mantissa',
  }))

  // For float64 wrap at 32 bits so it fits the screen
  const rows: Array<typeof annotated> =
    precision === 'float64'
      ? [annotated.slice(0, 32), annotated.slice(32)]
      : [annotated]

  // Decode for display
  const signVal = bits[0]
  const expVal  = parseInt(bits.slice(meta.signBits, meta.signBits + meta.exponentBits), 2)
  const trueExp = expVal - meta.bias

  return (
    <div className="font-mono">
      {/* Bit rows */}
      <div className="space-y-1">
        {rows.map((row, ri) => (
          <div key={ri} className="flex flex-wrap gap-0.5">
            {row.map(({ bit, region }, i) => (
              <BitCell
                key={ri * 32 + i}
                bit={bit}
                region={region}
                size={cellSize}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs">
        {(['sign', 'exponent', 'mantissa'] as Region[]).map((r) => (
          <div key={r} className="flex items-center gap-1.5">
            <span className={clsx('w-3 h-3 rounded-sm border', REGION_COLORS[r])} />
            <span className={REGION_LABEL_COLORS[r]}>
              {r === 'sign'     && `Sign (${meta.signBits}b)`}
              {r === 'exponent' && `Exponent (${meta.exponentBits}b)`}
              {r === 'mantissa' && `Mantissa (${meta.mantissaBits}b)`}
            </span>
          </div>
        ))}
      </div>

      {/* Decoded value */}
      <div className="mt-2 text-xs text-slate-500 space-x-3">
        <span>Sign: <span className="text-rose-400">{signVal === '0' ? '+' : '−'}</span></span>
        <span>
          Exp (stored): <span className="text-amber-400">{expVal}</span>
          {' → '}2<sup>{trueExp}</sup>
        </span>
        <span>Bits: <span className="text-slate-400">{meta.totalBits}</span></span>
      </div>
    </div>
  )
}
