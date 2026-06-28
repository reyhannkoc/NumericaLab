import { useState, useMemo } from 'react'
import type { FloatPrecision, FloatAnalysisResult } from '@/types/laboratory.types'
import { FLOAT_PRECISION_INFO } from '@/config/laboratory'

function toFloat32(x: number): number {
  const arr = new Float32Array(1)
  arr[0] = x
  return arr[0]
}

function toFloat16(x: number): number {
  if (!isFinite(x)) return x
  if (Math.abs(x) > 65504) return x > 0 ? Infinity : -Infinity
  if (Math.abs(x) < 5.96e-8) return 0

  const buf = new ArrayBuffer(4)
  const view = new DataView(buf)
  view.setFloat32(0, x)
  const bits = view.getUint32(0)

  const sign = (bits >>> 31) & 1
  const exp8 = (bits >>> 23) & 0xff
  const mant = bits & 0x7fffff

  const newExp = exp8 - 127 + 15
  if (newExp <= 0) return 0
  if (newExp >= 31) return sign ? -Infinity : Infinity

  const mant10 = (mant >> 13) & 0x3ff
  const roundBit = (mant >> 12) & 1
  const adjustedMant = mant10 + roundBit

  return (sign ? -1 : 1) *
    Math.pow(2, newExp - 15) *
    (1 + (adjustedMant & 0x3ff) / 1024)
}

function analyzeAt(original: number, precision: FloatPrecision): FloatAnalysisResult {
  const info = FLOAT_PRECISION_INFO[precision]

  let stored: number
  if (precision === 'float16')    stored = toFloat16(original)
  else if (precision === 'float32') stored = toFloat32(original)
  else                              stored = original

  const isOverflow  = !isFinite(stored) && isFinite(original) && Math.abs(original) > info.maxFinite
  const isUnderflow = stored === 0 && original !== 0 && Math.abs(original) < info.minPositiveNormal

  const absoluteError = Math.abs(stored - original)
  const relativeError = original !== 0 ? absoluteError / Math.abs(original) : 0

  return {
    precision,
    original,
    stored,
    absoluteError,
    relativeError,
    isOverflow,
    isUnderflow,
    isExact: absoluteError === 0,
  }
}

export function useFloatAnalysis() {
  const [inputA, setInputA] = useState(0.1)
  const [inputB, setInputB] = useState(0.2)

  const analysisA = useMemo<Record<FloatPrecision, FloatAnalysisResult>>(
    () => ({
      float16: analyzeAt(inputA, 'float16'),
      float32: analyzeAt(inputA, 'float32'),
      float64: analyzeAt(inputA, 'float64'),
    }),
    [inputA],
  )

  const analysisB = useMemo<Record<FloatPrecision, FloatAnalysisResult>>(
    () => ({
      float16: analyzeAt(inputB, 'float16'),
      float32: analyzeAt(inputB, 'float32'),
      float64: analyzeAt(inputB, 'float64'),
    }),
    [inputB],
  )

  const sumAnalysis = useMemo(() => {
    const precisions: FloatPrecision[] = ['float16', 'float32', 'float64']
    return precisions.map((p) => ({
      precision: p,
      storedSum: analysisA[p].stored + analysisB[p].stored,
      trueSum: inputA + inputB,
    }))
  }, [inputA, inputB, analysisA, analysisB])

  return {
    inputA, setInputA,
    inputB, setInputB,
    analysisA,
    analysisB,
    sumAnalysis,
    analyzeAt,
  }
}
