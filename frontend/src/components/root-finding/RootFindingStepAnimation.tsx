import { useState, useMemo } from 'react'
import Plot from 'react-plotly.js'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import type { RootFindingIteration, RootFindingMethod } from '@/types/api.types'

type RFMethod = Extract<RootFindingMethod, 'bisection' | 'newton_raphson' | 'secant'>

interface Props {
  method: RFMethod
  iterations: RootFindingIteration[]
  curveX: number[]
  curveY: number[]
}

// ─── Dark layout ──────────────────────────────────────────────────────────────

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

// ─── Trace builders per method ────────────────────────────────────────────────

function buildBisectionTraces(iter: RootFindingIteration, curveX: number[], curveY: number[]) {
  const a = iter.a ?? 0
  const b = iter.b ?? 1
  const mid = iter.x ?? (a + b) / 2
  const fMid = iter.fx

  const curve = {
    x: curveX, y: curveY,
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#60a5fa', width: 2 }, name: 'f(x)',
  }

  const yMin = Math.min(...curveY.filter(isFinite)) * 0.15
  const yMax = Math.max(...curveY.filter(isFinite)) * 0.15

  const bracket = {
    x: [a, b, b, a, a],
    y: [yMin, yMin, yMax, yMax, yMin],
    type: 'scatter' as const, mode: 'none' as const,
    fill: 'toself' as const,
    fillcolor: 'rgba(16,185,129,0.10)',
    line: { color: 'rgba(16,185,129,0.5)', width: 1.5 },
    name: `Bracket [${a.toFixed(5)}, ${b.toFixed(5)}]`,
  }

  const midPt = {
    x: [mid], y: [fMid],
    type: 'scatter' as const, mode: 'markers+text' as const,
    marker: { color: '#f87171', size: 10, symbol: 'circle' },
    text: [`c = ${mid.toFixed(6)}`],
    textposition: 'top center' as const,
    textfont: { color: '#f87171', size: 10 },
    name: 'Midpoint c',
  }

  return [curve, bracket, midPt]
}

function buildNewtonTraces(iter: RootFindingIteration, curveX: number[], curveY: number[]) {
  const x    = iter.x ?? 0
  const fx   = iter.fx
  const xNew = iter.x_new ?? x

  const curve = {
    x: curveX, y: curveY,
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#60a5fa', width: 2 }, name: 'f(x)',
  }

  // Approximate tangent slope from the step: slope ≈ fx / (x - xNew)
  const slope = Math.abs(x - xNew) > 1e-14 ? fx / (x - xNew) : 0
  const span  = Math.max(Math.abs(xNew - x) * 2.5, 0.5)

  const tangent = {
    x: [x - span, x + span],
    y: [fx - slope * span, fx + slope * span],
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#f59e0b', width: 1.5, dash: 'dash' as const },
    name: "Tangent at xₙ",
  }

  const dropLine = {
    x: [x, x], y: [0, fx],
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#f59e0b', width: 1, dash: 'dot' as const },
    showlegend: false,
  }

  const currentPt = {
    x: [x], y: [fx],
    type: 'scatter' as const, mode: 'markers' as const,
    marker: { color: '#f59e0b', size: 10, symbol: 'circle' },
    name: `xₙ = ${x.toFixed(6)}`,
  }

  const nextPt = {
    x: [xNew], y: [0],
    type: 'scatter' as const, mode: 'markers+text' as const,
    marker: { color: '#34d399', size: 11, symbol: 'triangle-up' },
    text: [`xₙ₊₁ = ${xNew.toFixed(7)}`],
    textposition: 'top center' as const,
    textfont: { color: '#34d399', size: 10 },
    name: `xₙ₊₁ = ${xNew.toFixed(7)}`,
  }

  return [curve, tangent, dropLine, currentPt, nextPt]
}

function buildSecantTraces(iter: RootFindingIteration, prev: RootFindingIteration | undefined, curveX: number[], curveY: number[]) {
  const xCurr  = iter.x  ?? 0
  const fCurr  = iter.fx
  const xPrev  = prev?.x  ?? (xCurr - 0.1)
  const fPrev  = prev?.fx ?? 0
  const xNew   = iter.x_new ?? xCurr

  const curve = {
    x: curveX, y: curveY,
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#60a5fa', width: 2 }, name: 'f(x)',
  }

  const span  = Math.max(Math.abs(xCurr - xPrev), 0.2) * 2.5
  const slope = Math.abs(xCurr - xPrev) > 1e-14 ? (fCurr - fPrev) / (xCurr - xPrev) : 0
  const sMin  = Math.min(xPrev, xCurr, xNew) - span * 0.3
  const sMax  = Math.max(xPrev, xCurr, xNew) + span * 0.3

  const secant = {
    x: [sMin, sMax],
    y: [fCurr + slope * (sMin - xCurr), fCurr + slope * (sMax - xCurr)],
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#c084fc', width: 1.5, dash: 'dash' as const },
    name: 'Secant line',
  }

  const prevPt = {
    x: [xPrev], y: [fPrev],
    type: 'scatter' as const, mode: 'markers' as const,
    marker: { color: '#a78bfa', size: 8, symbol: 'circle' },
    name: `xₙ₋₁ = ${xPrev.toFixed(6)}`,
  }

  const currPt = {
    x: [xCurr], y: [fCurr],
    type: 'scatter' as const, mode: 'markers' as const,
    marker: { color: '#c084fc', size: 10, symbol: 'circle' },
    name: `xₙ = ${xCurr.toFixed(6)}`,
  }

  const nextPt = {
    x: [xNew], y: [0],
    type: 'scatter' as const, mode: 'markers+text' as const,
    marker: { color: '#34d399', size: 11, symbol: 'triangle-up' },
    text: [`xₙ₊₁ = ${xNew.toFixed(7)}`],
    textposition: 'top center' as const,
    textfont: { color: '#34d399', size: 10 },
    name: `xₙ₊₁ = ${xNew.toFixed(7)}`,
  }

  return [curve, secant, prevPt, currPt, nextPt]
}

// ─── Step description ─────────────────────────────────────────────────────────

function getStepDesc(method: RFMethod, iter: RootFindingIteration, prev?: RootFindingIteration): string {
  if (method === 'bisection') {
    const a = iter.a ?? 0, b = iter.b ?? 1
    const mid = iter.x ?? (a + b) / 2
    return `Iter ${iter.iteration}: interval [${a.toFixed(5)}, ${b.toFixed(5)}], width = ${(b - a).toFixed(5)}, midpoint = ${mid.toFixed(7)}, f(mid) = ${iter.fx.toExponential(4)}, error = ${iter.error.toExponential(3)}`
  }
  if (method === 'newton_raphson') {
    const x = iter.x ?? 0
    const xn = iter.x_new ?? x
    return `Iter ${iter.iteration}: xₙ = ${x.toFixed(7)}, f(xₙ) = ${iter.fx.toExponential(4)}, xₙ₊₁ = ${xn.toFixed(9)}, |Δx| = ${iter.error.toExponential(3)}`
  }
  // secant
  const xCurr = iter.x ?? 0
  const xPrev = prev?.x ?? 0
  const xNew  = iter.x_new ?? xCurr
  return `Iter ${iter.iteration}: xₙ₋₁ = ${xPrev.toFixed(6)}, xₙ = ${xCurr.toFixed(6)}, xₙ₊₁ = ${xNew.toFixed(8)}, |Δx| = ${iter.error.toExponential(3)}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RootFindingStepAnimation({ method, iterations, curveX, curveY }: Props) {
  const [speed, setSpeed] = useState(1)

  const totalFrames = Math.max(1, iterations.length)

  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames,
    fps: speed,
    loop: false,
  })

  const clampedFrame = Math.min(frame, iterations.length - 1)
  const iter         = iterations[clampedFrame]
  const prevIter     = iterations[clampedFrame - 1]

  const traces = useMemo(() => {
    if (iterations.length === 0 || !iter) return []
    if (method === 'bisection')    return buildBisectionTraces(iter, curveX, curveY)
    if (method === 'newton_raphson') return buildNewtonTraces(iter, curveX, curveY)
    return buildSecantTraces(iter, prevIter, curveX, curveY)
  }, [method, clampedFrame, curveX.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const stepDesc = iterations.length === 0
    ? 'Run the playground below first to load iteration data into this animation.'
    : iter ? getStepDesc(method, iter, prevIter) : 'Complete.'

  const xRange = curveX.length > 0
    ? [Math.min(...curveX), Math.max(...curveX)] as [number, number]
    : undefined

  const yRange = curveY.length > 0 && curveY.some(isFinite)
    ? (() => {
        const fin = curveY.filter(isFinite)
        const mn = Math.min(...fin), mx = Math.max(...fin)
        const pad = (mx - mn) * 0.15
        return [mn - pad, mx + pad] as [number, number]
      })()
    : undefined

  return (
    <StepAnimation
      totalFrames={totalFrames}
      frame={frame}
      status={status}
      speed={speed}
      onPlay={play}
      onPause={pause}
      onReset={reset}
      onStepBack={stepBackward}
      onStepForward={stepForward}
      onSpeedChange={(s) => {
        setSpeed(s)
        if (status === 'playing') { pause(); setTimeout(play, 50) }
      }}
      stepDescription={stepDesc}
    >
      {iterations.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-slate-500 text-sm">
          Run the Interactive Playground below — iteration data will appear here automatically.
        </div>
      ) : (
        <Plot
          data={traces as Plotly.Data[]}
          layout={{
            ...DARK_LAYOUT,
            xaxis: {
              ...DARK_LAYOUT.xaxis,
              range: xRange,
              title: { text: 'x', font: { color: '#94a3b8' } },
            },
            yaxis: {
              ...DARK_LAYOUT.yaxis,
              range: yRange,
              title: { text: 'f(x)', font: { color: '#94a3b8' } },
            },
            shapes: xRange ? [{
              type: 'line' as const,
              x0: xRange[0], x1: xRange[1], y0: 0, y1: 0,
              line: { color: 'rgba(255,255,255,0.2)', width: 1 },
            }] : [],
            title: {
              text: `Iteration ${clampedFrame + 1} / ${iterations.length}`,
              font: { color: '#64748b', size: 12 },
              x: 0.01,
            },
          } as Partial<Plotly.Layout>}
          config={PLOTLY_CONFIG}
          style={{ width: '100%', height: '280px' }}
        />
      )}
    </StepAnimation>
  )
}
