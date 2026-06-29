import { useState } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import type { OptMethodProp } from './OptimizationVisualization'

const PHI = (1 + Math.sqrt(5)) / 2

// Demo function: f(x) = (x−2)² on [0, 4]
const DEMO_FN   = (x: number) => (x - 2) ** 2
const DEMO_DFN  = (x: number) => 2 * (x - 2)
const DEMO_A    = 0
const DEMO_B    = 4
const DEMO_X0   = 3.5

const METHOD_COLOR: Record<OptMethodProp, string> = {
  golden_section:   '#06b6d4',
  gradient_descent: '#818cf8',
}

// ─── Build Golden Section frames ──────────────────────────────────────────────

interface GSFrame {
  a: number; b: number; x1: number; x2: number; step: number; desc: string
}

function buildGSFrames(): GSFrame[] {
  const frames: GSFrame[] = []
  let a = DEMO_A, b = DEMO_B
  let x1 = b - (b - a) / PHI
  let x2 = a + (b - a) / PHI
  frames.push({ a, b, x1, x2, step: 0, desc: `Initial: [${a.toFixed(3)}, ${b.toFixed(3)}]. Probes: x₁=${x1.toFixed(3)}, x₂=${x2.toFixed(3)}` })
  for (let k = 0; k < 20; k++) {
    const f1 = DEMO_FN(x1), f2 = DEMO_FN(x2)
    if (f1 > f2) {
      a = x1; x1 = x2; x2 = a + (b - a) / PHI
      frames.push({ a, b, x1, x2, step: k+1, desc: `f(x₁)>f(x₂): keep [x₁,b]. New x₂=${x2.toFixed(5)}, width=${(b-a).toFixed(5)}` })
    } else {
      b = x2; x2 = x1; x1 = b - (b - a) / PHI
      frames.push({ a, b, x1, x2, step: k+1, desc: `f(x₁)<f(x₂): keep [a,x₂]. New x₁=${x1.toFixed(5)}, width=${(b-a).toFixed(5)}` })
    }
    if (b - a < 1e-6) break
  }
  return frames
}

// ─── Build Gradient Descent frames ───────────────────────────────────────────

interface GDFrame {
  x: number; fx: number; grad: number; step: number; desc: string
}

function buildGDFrames(alpha: number): GDFrame[] {
  const frames: GDFrame[] = []
  let x = DEMO_X0
  frames.push({ x, fx: DEMO_FN(x), grad: DEMO_DFN(x), step: 0, desc: `x₀ = ${x.toFixed(5)}, f(x₀) = ${DEMO_FN(x).toFixed(6)}` })
  for (let k = 0; k < 30; k++) {
    const grad = DEMO_DFN(x)
    x = x - alpha * grad
    const fx = DEMO_FN(x)
    frames.push({ x, fx, grad, step: k + 1, desc: `x${k+1} = ${x.toFixed(6)}, f=${fx.toFixed(8)}, ‖grad‖=${Math.abs(grad).toExponential(3)}` })
    if (Math.abs(grad) < 1e-9) break
  }
  return frames
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
