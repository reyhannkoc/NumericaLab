import { useState } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import type { ODEMethodProp } from './ODEVisualization'
import { X0, X_END, DEMO_H, EXACT, buildEulerFrames, buildRK4Frames } from './odeDemoData'

const METHOD_COLOR: Record<ODEMethodProp, string> = {
  euler:          '#84cc16',
  runge_kutta_4:  '#f97316',
}

const EXACT_XS = Array.from({ length: 80 }, (_, i) => X0 + (X_END - X0) * i / 79)
const EXACT_YS = EXACT_XS.map(EXACT)

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 50, r: 20, t: 30, b: 45 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  showlegend: false, autosize: true,
}

interface Props { method: ODEMethodProp }

export default function ODEAnimation({ method }: Props) {
  const [speed, setSpeed] = useState(1)
  const color = METHOD_COLOR[method]

  const eulerFrames = method === 'euler' ? buildEulerFrames() : []
  const rk4Frames   = method === 'runge_kutta_4' ? buildRK4Frames() : []
  const totalFrames = method === 'euler' ? eulerFrames.length : rk4Frames.length

  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames,
    fps: speed * 1.5,
    loop: false,
  })

  let stepDesc = ''
  let plotData: Plotly.Data[] = []
  let stageInfo: { label: string; value: string; color: string }[] = []

  const exactTrace: Plotly.Data = {
    x: EXACT_XS, y: EXACT_YS,
    type: 'scatter', mode: 'lines',
    line: { color: '#8b5cf6', width: 2, dash: 'dash' },
  }

  if (method === 'euler') {
    const f = eulerFrames[Math.min(frame, eulerFrames.length - 1)]
    stepDesc = f.desc
    const y_exact = EXACT(f.x_cur)
    stageInfo = [
      { label: 'xₙ', value: f.x_cur.toFixed(4), color },
      { label: 'yₙ', value: f.y_cur.toFixed(6), color },
      { label: 'slope', value: f.slope.toFixed(6), color: '#22d3ee' },
      { label: 'exact', value: y_exact.toFixed(6), color: '#8b5cf6' },
    ]
    const slopeX = [f.x_cur - 0.05, f.x_cur + 0.05]
    const slopeY = slopeX.map(xi => f.y_cur + f.slope * (xi - f.x_cur))
    plotData = [
      exactTrace,
      {
        x: f.xs, y: f.ys,
        type: 'scatter', mode: 'lines+markers',
        line: { color, width: 2.5 },
        marker: { color, size: 8, symbol: 'circle' },
      } as Plotly.Data,
      {
        x: slopeX, y: slopeY,
        type: 'scatter', mode: 'lines',
        line: { color: '#f59e0b', width: 2, dash: 'dot' },
      } as Plotly.Data,
    ]
  } else {
    const f = rk4Frames[Math.min(frame, rk4Frames.length - 1)]
    stepDesc = f?.desc ?? ''
    const y_exact = EXACT(f?.x_cur ?? 0)
    stageInfo = [
      { label: 'k₁', value: (f?.k1 ?? 0).toFixed(5), color: '#4ade80' },
      { label: 'k₂', value: (f?.k2 ?? 0).toFixed(5), color: '#22d3ee' },
      { label: 'k₃', value: (f?.k3 ?? 0).toFixed(5), color: color },
      { label: 'k₄', value: (f?.k4 ?? 0).toFixed(5), color: '#f59e0b' },
      { label: 'yₙ', value: (f?.y_cur ?? 0).toFixed(6), color: '#f97316' },
      { label: 'exact', value: y_exact.toFixed(6), color: '#8b5cf6' },
    ]
    plotData = [
      exactTrace,
      {
        x: f?.xs ?? [], y: f?.ys ?? [],
        type: 'scatter', mode: 'lines+markers',
        line: { color, width: 2.5 },
        marker: { color, size: 8, symbol: 'diamond' },
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
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">dy/dx = y, y(0) = 1</span>
          <span className="text-xs font-mono font-bold text-violet-400">y = eˣ</span>
        </div>
        <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">h =</span>
          <span className="text-xs font-mono font-bold" style={{ color }}>{DEMO_H}</span>
        </div>
        {stageInfo.map(s => (
          <div key={s.label} className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-xs text-slate-400">{s.label} =</span>
            <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="h-52 rounded-lg overflow-hidden bg-surface">
        <Plot
          data={plotData}
          layout={{
            ...DARK_LAYOUT,
            yaxis: { ...DARK_LAYOUT.yaxis, range: [0.8, 8] },
            xaxis: { ...DARK_LAYOUT.xaxis, range: [-0.05, 2.1] },
          } as Partial<Plotly.Layout>}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '208px' }}
        />
      </div>

      {method === 'runge_kutta_4' && (
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { label: 'k₁ (start)', color: '#4ade80' },
            { label: 'k₂ (mid₁)', color: '#22d3ee' },
            { label: 'k₃ (mid₂)', color: color },
            { label: 'k₄ (end)', color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="bg-surface-card rounded-lg px-2 py-1.5">
              <div className="font-semibold" style={{ color: s.color }}>{s.label}</div>
              <div className="text-slate-500">×{i === 0 || i === 3 ? '1' : '2'} weight</div>
            </div>
          ))}
        </div>
      )}
    </StepAnimation>
  )
}
