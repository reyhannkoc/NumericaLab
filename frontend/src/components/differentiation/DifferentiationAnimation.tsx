import { useState } from 'react'
import Plot from 'react-plotly.js'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import { type DiffMethod, DEMO_FN, DEMO_DFN, DEMO_X, DEMO_LABEL, METHOD_COLOR } from './differentiationDemoData'

// ─── Animation config ─────────────────────────────────────────────────────────

const H_FRAMES = [1.0, 0.75, 0.5, 0.35, 0.25, 0.18, 0.12, 0.08, 0.05, 0.03, 0.02, 0.01]

// ─── Plotly config ────────────────────────────────────────────────────────────

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 55, r: 20, t: 35, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.65, y: 0.98 },
}
const PLOTLY_CFG = { displayModeBar: false, responsive: true }

// ─── Build frame data ─────────────────────────────────────────────────────────

function buildFrame(h: number, method: DiffMethod) {
  const N = 300
  const xMin = -0.5, xMax = 3.2
  const curveXs = Array.from({ length: N }, (_, i) => xMin + (xMax - xMin) * i / (N - 1))
  const curveYs = curveXs.map(DEMO_FN)

  const fx  = DEMO_FN(DEMO_X)
  const dfx = DEMO_DFN(DEMO_X)

  // Exact tangent
  const tLen = 0.6
  const tXs = [DEMO_X - tLen, DEMO_X + tLen]
  const tYs = tXs.map((t) => fx + dfx * (t - DEMO_X))

  // Secant line
  let ptAx: number, ptBx: number, slope: number
  if (method === 'forward') {
    ptAx = DEMO_X; ptBx = DEMO_X + h
    slope = (DEMO_FN(ptBx) - DEMO_FN(ptAx)) / h
  } else if (method === 'backward') {
    ptAx = DEMO_X - h; ptBx = DEMO_X
    slope = (DEMO_FN(ptBx) - DEMO_FN(ptAx)) / h
  } else {
    ptAx = DEMO_X - h; ptBx = DEMO_X + h
    slope = (DEMO_FN(ptBx) - DEMO_FN(ptAx)) / (2 * h)
  }
  const ptAy = DEMO_FN(ptAx)
  const ptBy = DEMO_FN(ptBx)
  const sLen = Math.max(h * 1.4, 0.3)
  const sXs = [ptAx - sLen * 0.2, ptBx + sLen * 0.2]
  const sYs = sXs.map((t) => ptAy + slope * (t - ptAx))

  const approxDeriv = slope
  const exact = dfx
  const err = Math.abs(approxDeriv - exact)

  return { curveXs, curveYs, tXs, tYs, sXs, sYs, ptAx, ptAy, ptBx, ptBy, approxDeriv, exact, err }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { method: DiffMethod }

export default function DifferentiationAnimation({ method }: Props) {
  const [speed, setSpeed] = useState(1)
  const totalFrames = H_FRAMES.length
  const color = METHOD_COLOR[method]

  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames,
    fps: speed * 2,
    loop: false,
  })

  const h = H_FRAMES[frame]
  const { curveXs, curveYs, tXs, tYs, sXs, sYs, ptAx, ptAy, ptBx, ptBy, approxDeriv, exact, err } = buildFrame(h, method)

  const traces: Plotly.Data[] = [
    {
      x: curveXs, y: curveYs,
      type: 'scatter', mode: 'lines',
      line: { color: '#8b5cf6', width: 2.5 },
      name: DEMO_LABEL,
    },
    {
      x: tXs, y: tYs,
      type: 'scatter', mode: 'lines',
      line: { color: '#f59e0b', width: 1.5, dash: 'dash' },
      name: `Exact tangent (${exact.toFixed(4)})`,
    },
    {
      x: sXs, y: sYs,
      type: 'scatter', mode: 'lines',
      line: { color, width: 2.5, dash: 'dot' },
      name: `Approx slope (${approxDeriv.toFixed(4)})`,
    },
    {
      x: [ptAx, ptBx],
      y: [ptAy, ptBy],
      type: 'scatter',
      mode: 'text+markers' as const,
      text: [
        method === 'forward' ? 'f(x)' : 'f(x−h)',
        method === 'forward' ? 'f(x+h)' : method === 'backward' ? 'f(x)' : 'f(x+h)',
      ],
      textposition: 'top center',
      textfont: { color, size: 10 },
      marker: { color, size: 10, symbol: 'circle' },
      showlegend: false,
    },
  ]

  const methodNames: Record<DiffMethod, string> = {
    forward:  'Forward',
    backward: 'Backward',
    central:  'Central',
  }

  const stepDesc = `h = ${h} → error = ${err.toExponential(3)} | Secant slope = ${approxDeriv.toFixed(5)} (exact: ${exact.toFixed(5)})`

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
      <div className="relative">
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
          <div className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-mono">
            h = {h}
          </div>
          <div className="text-xs px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/20 text-rose-300 font-mono">
            err ≈ {err.toExponential(2)}
          </div>
        </div>

        <Plot
          data={traces}
          layout={{
            ...DARK_LAYOUT,
            title: {
              text: `${methodNames[method]} Difference — h shrinking toward 0`,
              font: { color: '#64748b', size: 12 },
              x: 0.01,
            },
            xaxis: { ...DARK_LAYOUT.xaxis, range: [-0.5, 3.2], title: { text: 'x', font: { color: '#94a3b8' } } },
            yaxis: { ...DARK_LAYOUT.yaxis, range: [-1.3, 1.5], title: { text: 'f(x)', font: { color: '#94a3b8' } } },
          } as Partial<Plotly.Layout>}
          config={PLOTLY_CFG}
          style={{ width: '100%', height: '310px' }}
        />
      </div>
    </StepAnimation>
  )
}
