import { useState, useEffect, useMemo } from 'react'
import Plot from 'react-plotly.js'
import { clsx } from 'clsx'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'
import type { RootFindingMethod } from '@/types/api.types'

type RFMethod = Extract<RootFindingMethod, 'bisection' | 'newton_raphson' | 'secant'>

// ─── Preset functions (hard-coded JS — no API needed) ─────────────────────────

interface Preset {
  label: string
  display: string
  f: (x: number) => number
  fp: (x: number) => number
  a: number; b: number
  x0: number; x1: number
  plotMin: number; plotMax: number
}

const PRESETS: Preset[] = [
  {
    label: 'x³ − x − 2',
    display: 'x³ − x − 2 = 0  (root ≈ 1.521)',
    f:  (x) => x ** 3 - x - 2,
    fp: (x) => 3 * x ** 2 - 1,
    a: 1, b: 2, x0: 1.5, x1: 2,
    plotMin: 0.5, plotMax: 2.5,
  },
  {
    label: 'cos x − x',
    display: 'cos(x) − x = 0  (Dottie number ≈ 0.739)',
    f:  (x) => Math.cos(x) - x,
    fp: (x) => -Math.sin(x) - 1,
    a: 0, b: Math.PI / 2, x0: 0.5, x1: 1.0,
    plotMin: -0.3, plotMax: 1.8,
  },
  {
    label: '√2 via x² − 2',
    display: 'x² − 2 = 0  (√2 ≈ 1.414)',
    f:  (x) => x * x - 2,
    fp: (x) => 2 * x,
    a: 1, b: 2, x0: 1.8, x1: 2,
    plotMin: 0.5, plotMax: 2.5,
  },
  {
    label: 'eˣ − 3x',
    display: 'eˣ − 3x = 0  (root near 0.619)',
    f:  (x) => Math.exp(x) - 3 * x,
    fp: (x) => Math.exp(x) - 3,
    a: 0, b: 1, x0: 0.4, x1: 0.8,
    plotMin: -0.2, plotMax: 1.8,
  },
  {
    label: 'x·sin x − 1',
    display: 'x·sin(x) − 1 = 0  (root ≈ 1.114)',
    f:  (x) => x * Math.sin(x) - 1,
    fp: (x) => Math.sin(x) + x * Math.cos(x),
    a: 0.5, b: 2, x0: 1.2, x1: 1.5,
    plotMin: 0, plotMax: 2.5,
  },
]

// ─── Local algorithm implementations ─────────────────────────────────────────

interface BisStep { iteration: number; a: number; b: number; mid: number; fm: number; error: number }
interface NRStep  { iteration: number; x: number; fx: number; fpx: number; xNew: number; error: number }
interface SecStep { iteration: number; xPrev: number; xCurr: number; fPrev: number; fCurr: number; xNew: number; error: number }

function bisectLocal(f: (x:number)=>number, a: number, b: number, maxIter = 25): BisStep[] {
  const steps: BisStep[] = []
  let lo = a, hi = b
  for (let i = 0; i < maxIter; i++) {
    const mid = lo + (hi - lo) / 2
    const fm  = f(mid)
    const err = (hi - lo) / 2
    steps.push({ iteration: i + 1, a: lo, b: hi, mid, fm, error: err })
    if (Math.abs(fm) < 1e-12 || err < 1e-12) break
    if (f(lo) * fm < 0) hi = mid; else lo = mid
  }
  return steps
}

function newtonLocal(f: (x:number)=>number, fp: (x:number)=>number, x0: number, maxIter = 20): NRStep[] {
  const steps: NRStep[] = []
  let x = x0
  for (let i = 0; i < maxIter; i++) {
    const fx  = f(x)
    const fpx = fp(x)
    if (Math.abs(fpx) < 1e-15) break
    const xNew  = x - fx / fpx
    const error = Math.abs(xNew - x)
    steps.push({ iteration: i + 1, x, fx, fpx, xNew, error })
    if (error < 1e-12) break
    x = xNew
  }
  return steps
}

function secantLocal(f: (x:number)=>number, x0: number, x1: number, maxIter = 20): SecStep[] {
  const steps: SecStep[] = []
  let xPrev = x0, xCurr = x1
  let fPrev = f(x0), fCurr = f(x1)
  for (let i = 0; i < maxIter; i++) {
    const denom = fCurr - fPrev
    if (Math.abs(denom) < 1e-15) break
    const xNew  = xCurr - fCurr * (xCurr - xPrev) / denom
    const error = Math.abs(xNew - xCurr)
    steps.push({ iteration: i + 1, xPrev, xCurr, fPrev, fCurr, xNew, error })
    if (error < 1e-12) break
    xPrev = xCurr; fPrev = fCurr
    xCurr = xNew; fCurr = f(xNew)
  }
  return steps
}

// ─── Plotly dark base ─────────────────────────────────────────────────────────

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 55, r: 20, t: 30, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.65, y: 0.98 },
}

const PLOTLY_CONFIG = { displayModeBar: false, responsive: true }

// ─── Trace builders ───────────────────────────────────────────────────────────

function buildCurveTrace(preset: Preset) {
  const N = 300
  const xs = Array.from({ length: N }, (_, i) => preset.plotMin + (preset.plotMax - preset.plotMin) * i / (N - 1))
  const ys = xs.map(preset.f)
  return {
    x: xs, y: ys,
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#60a5fa', width: 2 },
    name: 'f(x)',
  }
}

function buildBisectionTraces(step: BisStep | undefined, preset: Preset) {
  if (!step) return []
  // Shaded bracket
  const bracket = {
    x: [step.a, step.b, step.b, step.a, step.a],
    y: [0, 0, 0, 0, 0].map((_, i) => {
      const xv = [step.a, step.b, step.b, step.a, step.a][i]
      const yv = preset.f(xv)
      return [preset.f(step.a) * 0.1, preset.f(step.b) * 0.1, yv, yv, preset.f(step.a) * 0.1][i]
    }),
    type: 'scatter' as const, mode: 'none' as const,
    fill: 'toself' as const,
    fillcolor: 'rgba(16,185,129,0.12)',
    line: { color: 'rgba(16,185,129,0.4)', width: 1 },
    name: `Bracket [${step.a.toFixed(4)}, ${step.b.toFixed(4)}]`,
    showlegend: true,
  }
  // Midpoint
  const mid = {
    x: [step.mid], y: [step.fm],
    type: 'scatter' as const, mode: 'markers+text' as const,
    marker: { color: '#f87171', size: 10, symbol: 'circle' },
    text: [`c = ${step.mid.toFixed(5)}`],
    textposition: 'top center' as const,
    textfont: { color: '#f87171', size: 10 },
    name: 'Midpoint',
  }
  // x-axis markers for a, b
  const bounds = {
    x: [step.a, step.b], y: [preset.f(step.a), preset.f(step.b)],
    type: 'scatter' as const, mode: 'markers' as const,
    marker: { color: '#10b981', size: 8, symbol: 'diamond' },
    name: 'Bracket ends',
  }
  return [bracket, bounds, mid]
}

function buildNewtonTraces(step: NRStep | undefined) {
  if (!step) return []
  const { x, fx, fpx, xNew } = step
  // Tangent line: y - fx = fpx(X - x)  =>  y = fpx*(X - x) + fx
  const span = Math.abs(xNew - x) * 2.5 + 0.3
  const tMin = x - span, tMax = x + span
  const tangent = {
    x: [tMin, tMax],
    y: [fpx * (tMin - x) + fx, fpx * (tMax - x) + fx],
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#f59e0b', width: 1.5, dash: 'dash' as const },
    name: "Tangent at xₙ",
  }
  const currentPoint = {
    x: [x], y: [fx],
    type: 'scatter' as const, mode: 'markers+text' as const,
    marker: { color: '#f59e0b', size: 10, symbol: 'circle' },
    text: [`xₙ = ${x.toFixed(5)}`],
    textposition: 'top center' as const,
    textfont: { color: '#f59e0b', size: 10 },
    name: 'Current xₙ',
  }
  const nextPoint = {
    x: [xNew], y: [0],
    type: 'scatter' as const, mode: 'markers+text' as const,
    marker: { color: '#34d399', size: 10, symbol: 'triangle-up' },
    text: [`xₙ₊₁ = ${xNew.toFixed(5)}`],
    textposition: 'top center' as const,
    textfont: { color: '#34d399', size: 10 },
    name: 'Next xₙ₊₁',
  }
  const dropLine = {
    x: [x, x], y: [0, fx],
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#f59e0b', width: 1, dash: 'dot' as const },
    showlegend: false,
  }
  return [tangent, dropLine, currentPoint, nextPoint]
}

function buildSecantTraces(step: SecStep | undefined) {
  if (!step) return []
  const { xPrev, xCurr, fPrev, fCurr, xNew } = step
  const span = Math.max(Math.abs(xCurr - xPrev), 0.2) * 2
  const sMin = Math.min(xPrev, xCurr, xNew) - span * 0.3
  const sMax = Math.max(xPrev, xCurr, xNew) + span * 0.3
  const slope = (fCurr - fPrev) / (xCurr - xPrev)
  const secant = {
    x: [sMin, sMax],
    y: [fCurr + slope * (sMin - xCurr), fCurr + slope * (sMax - xCurr)],
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#c084fc', width: 1.5, dash: 'dash' as const },
    name: 'Secant line',
  }
  const prevPt = {
    x: [xPrev], y: [fPrev],
    type: 'scatter' as const, mode: 'markers+text' as const,
    marker: { color: '#a78bfa', size: 8, symbol: 'circle' },
    text: [`xₙ₋₁`], textposition: 'top right' as const,
    textfont: { color: '#a78bfa', size: 9 },
    name: 'xₙ₋₁',
  }
  const currPt = {
    x: [xCurr], y: [fCurr],
    type: 'scatter' as const, mode: 'markers+text' as const,
    marker: { color: '#c084fc', size: 10, symbol: 'circle' },
    text: [`xₙ`], textposition: 'top right' as const,
    textfont: { color: '#c084fc', size: 10 },
    name: 'xₙ (current)',
  }
  const nextPt = {
    x: [xNew], y: [0],
    type: 'scatter' as const, mode: 'markers+text' as const,
    marker: { color: '#34d399', size: 10, symbol: 'triangle-up' },
    text: [`xₙ₊₁ = ${xNew.toFixed(5)}`],
    textposition: 'top center' as const,
    textfont: { color: '#34d399', size: 10 },
    name: 'xₙ₊₁',
  }
  return [secant, prevPt, currPt, nextPt]
}

// ─── Step description helpers ─────────────────────────────────────────────────

function getBisDescription(step: BisStep) {
  return `Iter ${step.iteration}: bracket [${step.a.toFixed(4)}, ${step.b.toFixed(4)}], mid = ${step.mid.toFixed(6)}, f(mid) = ${step.fm.toExponential(3)}, error ≤ ${step.error.toExponential(3)}`
}

function getNRDescription(step: NRStep) {
  return `Iter ${step.iteration}: xₙ = ${step.x.toFixed(6)}, f(xₙ) = ${step.fx.toExponential(3)}, xₙ₊₁ = ${step.xNew.toFixed(8)}, |step| = ${step.error.toExponential(3)}`
}

function getSecDescription(step: SecStep) {
  return `Iter ${step.iteration}: xₙ = ${step.xCurr.toFixed(6)}, xₙ₊₁ = ${step.xNew.toFixed(8)}, |step| = ${step.error.toExponential(3)}`
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { method: RFMethod }

export default function RootFindingVisualization({ method }: Props) {
  const [presetIdx, setPresetIdx] = useState(0)
  const [stepIdx,   setStepIdx]   = useState(0)

  const preset = PRESETS[presetIdx]

  const steps = useMemo(() => {
    if (method === 'bisection')    return bisectLocal(preset.f, preset.a, preset.b)
    if (method === 'newton_raphson') return newtonLocal(preset.f, preset.fp, preset.x0)
    return secantLocal(preset.f, preset.x0, preset.x1)
  }, [method, presetIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setStepIdx(0) }, [presetIdx, method])

  const curStep = steps[Math.min(stepIdx, steps.length - 1)]
  const curveTrace = useMemo(() => buildCurveTrace(preset), [presetIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  const methodTraces = useMemo(() => {
    if (method === 'bisection')    return buildBisectionTraces(curStep as BisStep, preset)
    if (method === 'newton_raphson') return buildNewtonTraces(curStep as NRStep)
    return buildSecantTraces(curStep as SecStep)
  }, [method, stepIdx, presetIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  const description = curStep
    ? method === 'bisection'
      ? getBisDescription(curStep as BisStep)
      : method === 'newton_raphson'
        ? getNRDescription(curStep as NRStep)
        : getSecDescription(curStep as SecStep)
    : 'Step through the algorithm to see each iteration.'

  const methodLabel = method === 'bisection' ? 'Bisection' : method === 'newton_raphson' ? 'Newton–Raphson' : 'Secant'

  const controls = (
    <div className="space-y-4">
      {/* Preset selector */}
      <div>
        <p className="section-label mb-2">Function</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button
              type="button"
              key={p.label}
              onClick={() => setPresetIdx(i)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-mono transition-colors',
                i === presetIdx
                  ? 'bg-brand-600 text-white border border-brand-500'
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step controls */}
      <div>
        <p className="section-label mb-2">
          {methodLabel} — Iteration {stepIdx + 1} / {steps.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStepIdx(0)}
            disabled={stepIdx === 0}
            className="icon-btn disabled:opacity-30"
          >⏮</button>
          <button
            type="button"
            onClick={() => setStepIdx((v) => Math.max(0, v - 1))}
            disabled={stepIdx === 0}
            className="icon-btn disabled:opacity-30"
          >◀</button>
          <div className="flex-1 h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setStepIdx((v) => Math.min(steps.length - 1, v + 1))}
            disabled={stepIdx >= steps.length - 1}
            className="icon-btn disabled:opacity-30"
          >▶</button>
          <button
            type="button"
            onClick={() => setStepIdx(steps.length - 1)}
            disabled={stepIdx >= steps.length - 1}
            className="icon-btn disabled:opacity-30"
          >⏭</button>
        </div>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{description}</p>
      </div>
    </div>
  )

  return (
    <InteractiveVisualization
      description={`Visual walkthrough of the ${methodLabel} algorithm. Select a function and step through iterations to see how the method converges.`}
      controls={controls}
    >
      <Plot
        data={[curveTrace, ...methodTraces] as Plotly.Data[]}
        layout={{
          ...DARK_LAYOUT,
          xaxis: {
            ...DARK_LAYOUT.xaxis,
            range: [preset.plotMin - 0.1, preset.plotMax + 0.1],
            title: { text: 'x', font: { color: '#94a3b8' } },
          },
          yaxis: {
            ...DARK_LAYOUT.yaxis,
            title: { text: 'f(x)', font: { color: '#94a3b8' } },
          },
          shapes: [{
            type: 'line' as const,
            x0: preset.plotMin, x1: preset.plotMax, y0: 0, y1: 0,
            line: { color: 'rgba(255,255,255,0.25)', width: 1 },
          }],
        } as Partial<Plotly.Layout>}
        config={PLOTLY_CONFIG}
        style={{ width: '100%', height: '320px' }}
      />
    </InteractiveVisualization>
  )
}
