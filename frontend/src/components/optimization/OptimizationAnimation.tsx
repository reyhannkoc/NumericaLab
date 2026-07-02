import { useState } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import type { OptMethodProp } from './OptimizationVisualization'
import { DEMO_FN, DEMO_A, DEMO_B, buildGSFrames, buildGDFrames } from './optimizationDemoData'

const METHOD_COLOR: Record<OptMethodProp, string> = {
  golden_section:   '#06b6d4',
  gradient_descent: '#818cf8',
}

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 50, r: 20, t: 30, b: 45 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  showlegend: false, autosize: true,
}

// Curve data
const CURVE_XS = Array.from({ length: 200 }, (_, i) => DEMO_A + (DEMO_B - DEMO_A) * i / 199)
const CURVE_YS = CURVE_XS.map(DEMO_FN)

interface Props { method: OptMethodProp }

export default function OptimizationAnimation({ method }: Props) {
  const [speed, setSpeed] = useState(1)
  const [alpha, setAlpha] = useState(0.3)
  const color = METHOD_COLOR[method]

  const gsFrames = method === 'golden_section' ? buildGSFrames() : []
  const gdFrames = method === 'gradient_descent' ? buildGDFrames(alpha) : []
  const totalFrames = method === 'golden_section' ? gsFrames.length : gdFrames.length

  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames,
    fps: speed * 1.5,
    loop: false,
  })

  let stepDesc = ''
  let plotData: Plotly.Data[] = []

  const curveLine: Plotly.Data = {
    x: CURVE_XS, y: CURVE_YS,
    type: 'scatter', mode: 'lines',
    line: { color: '#8b5cf6', width: 2 },
  }

  if (method === 'golden_section') {
    const f = gsFrames[Math.min(frame, gsFrames.length - 1)]
    stepDesc = f.desc
    plotData = [
      curveLine,
      {
        x: [f.a, f.a, f.b, f.b, f.a],
        y: [-0.5, 5, 5, -0.5, -0.5],
        type: 'scatter', mode: 'lines',
        fill: 'toself', fillcolor: color + '18',
        line: { color, width: 2 },
      } as Plotly.Data,
      {
        x: [f.x1, f.x2],
        y: [DEMO_FN(f.x1), DEMO_FN(f.x2)],
        type: 'scatter', mode: 'markers',
        marker: { color: [color, '#f97316'], size: 10, symbol: ['diamond', 'diamond'] },
      } as Plotly.Data,
    ]
  } else {
    const slice = gdFrames.slice(0, frame + 1)
    const f = gdFrames[Math.min(frame, gdFrames.length - 1)]
    stepDesc = f?.desc ?? ''
    plotData = [
      curveLine,
      {
        x: slice.map(it => it.x),
        y: slice.map(it => it.fx),
        type: 'scatter', mode: 'lines+markers',
        line: { color, width: 1.5, dash: 'dot' },
        marker: { color, size: 6 },
      } as Plotly.Data,
    ]
  }

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
      onSpeedChange={s => {
        setSpeed(s)
        if (status === 'playing') { pause(); setTimeout(play, 50) }
      }}
      stepDescription={stepDesc}
    >
      <div className="flex flex-wrap gap-3 mb-3">
        <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">f(x) = (x−2)²</span>
          <span className="text-xs font-mono font-bold" style={{ color }}>x* = 2</span>
        </div>
        {method === 'gradient_descent' && (
          <div className="flex items-center gap-2 bg-surface-card rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-400">α =</span>
            <input type="range" min={0.05} max={0.9} step={0.05} value={alpha}
              onChange={e => { setAlpha(Number(e.target.value)); reset() }}
              className="w-20 accent-indigo-500"
            />
            <span className="text-xs font-mono font-bold" style={{ color }}>{alpha}</span>
          </div>
        )}
        {method === 'golden_section' && (
          <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-xs text-slate-400">Width =</span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {method === 'golden_section' && gsFrames[Math.min(frame, gsFrames.length-1)]
                ? (gsFrames[Math.min(frame, gsFrames.length-1)].b - gsFrames[Math.min(frame, gsFrames.length-1)].a).toExponential(3)
                : '—'}
            </span>
          </div>
        )}
      </div>

      <div className="h-52 rounded-lg overflow-hidden bg-surface">
        <Plot
          data={plotData}
          layout={{
            ...DARK_LAYOUT,
            yaxis: { ...DARK_LAYOUT.yaxis, range: [-0.5, 5] },
          } as Partial<Plotly.Layout>}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '208px' }}
        />
      </div>
    </StepAnimation>
  )
}
