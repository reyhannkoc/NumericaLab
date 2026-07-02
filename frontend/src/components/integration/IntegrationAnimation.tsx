import { useState } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import type { IntegMethod } from './IntegrationVisualization'
import { DEMO_FN, DEMO_EXACT, DEMO_A, DEMO_B, METHOD_COLOR, METHOD_LABEL, GAUSS } from './integrationDemoData'

const N_FRAMES = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 30, 50]

function buildFrame(n: number, method: IntegMethod): { value: number; fills: { x: number[]; y: number[] }[] } {
  const fills: { x: number[]; y: number[] }[] = []
  const a = DEMO_A, b = DEMO_B

  if (method === 'trapezoidal') {
    const h = (b - a) / n
    let sum = 0
    for (let i = 0; i < n; i++) {
      const x0 = a + i * h, x1 = a + (i + 1) * h
      sum += (DEMO_FN(x0) + DEMO_FN(x1)) * h / 2
      fills.push({ x: [x0, x1, x1, x0, x0], y: [0, 0, DEMO_FN(x1), DEMO_FN(x0), 0] })
    }
    return { value: sum, fills }
  }

  if (method === 'simpsons') {
    const nEven = n % 2 === 0 ? n : n + 1
    const h = (b - a) / nEven
    let sum = DEMO_FN(a) + DEMO_FN(b)
    for (let i = 1; i < nEven; i++) sum += (i % 2 === 0 ? 2 : 4) * DEMO_FN(a + i * h)
    const value = (h / 3) * sum
    for (let i = 0; i < nEven; i += 2) {
      const x0 = a + i * h, x1 = a + (i + 1) * h, x2 = a + (i + 2) * h
      const numPts = 16
      const xs = Array.from({ length: numPts }, (_, k) => x0 + (x2 - x0) * k / (numPts - 1))
      const ys = xs.map(xi => {
        const L0 = DEMO_FN(x0) * ((xi - x1) * (xi - x2)) / ((x0 - x1) * (x0 - x2))
        const L1 = DEMO_FN(x1) * ((xi - x0) * (xi - x2)) / ((x1 - x0) * (x1 - x2))
        const L2 = DEMO_FN(x2) * ((xi - x0) * (xi - x1)) / ((x2 - x0) * (x2 - x1))
        return L0 + L1 + L2
      })
      fills.push({ x: [...xs, ...xs.slice().reverse(), xs[0]], y: [...ys, ...xs.map(() => 0), 0] })
    }
    return { value, fills }
  }

  const gn = Math.min(n, 5)
  const g = GAUSS[gn] ?? GAUSS[5]
  const scale = (b - a) / 2, shift = (a + b) / 2
  let value = 0
  g.x.forEach((xi, i) => {
    const x = scale * xi + shift
    value += g.w[i] * DEMO_FN(x)
    fills.push({ x: [x, x], y: [0, DEMO_FN(x)] })
  })
  return { value: value * scale, fills }
}

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 45, r: 20, t: 30, b: 40 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  showlegend: false,
  autosize: true,
}

interface Props { method: IntegMethod }

export default function IntegrationAnimation({ method }: Props) {
  const [speed, setSpeed] = useState(1)
  const color = METHOD_COLOR[method]
  const label = METHOD_LABEL[method]

  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames: N_FRAMES.length,
    fps: speed * 1.5,
    loop: false,
  })

  const n = N_FRAMES[frame]
  const { value, fills } = buildFrame(n, method)
  const absErr = Math.abs(value - DEMO_EXACT)

  const curveX = Array.from({ length: 300 }, (_, i) => DEMO_A + (DEMO_B - DEMO_A) * i / 299)
  const curveY = curveX.map(DEMO_FN)

  const fillTraces: Plotly.Data[] = fills.map(f => ({
    x: f.x as number[], y: f.y as number[],
    fill: method === 'gaussian_quadrature' ? undefined : 'toself',
    fillcolor: color + '28',
    line: { color, width: method === 'gaussian_quadrature' ? 2 : 1 },
    type: 'scatter' as const,
    mode: method === 'gaussian_quadrature' ? ('lines+markers' as const) : ('lines' as const),
    marker: method === 'gaussian_quadrature' ? { color, size: 8 } : undefined,
    hoverinfo: 'skip' as const,
  }))

  const curveLine: Plotly.Data = {
    x: curveX, y: curveY,
    type: 'scatter', mode: 'lines',
    line: { color: '#8b5cf6', width: 2 },
  }

  const stepDesc = `n = ${method === 'gaussian_quadrature' ? Math.min(n, 5) : n} → ${label} ≈ ${value.toFixed(8)} | |error| = ${absErr.toExponential(3)}`

  return (
    <StepAnimation
      totalFrames={N_FRAMES.length}
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
      {/* Badges */}
      <div className="flex flex-wrap gap-3 mb-3">
        <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">n =</span>
          <span className="text-sm font-mono font-bold" style={{ color }}>
            {method === 'gaussian_quadrature' ? Math.min(n, 5) : n}
          </span>
        </div>
        <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">Approx =</span>
          <span className="text-sm font-mono font-bold text-white">{value.toFixed(8)}</span>
        </div>
        <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">|Error| =</span>
          <span className="text-sm font-mono font-bold text-red-400">{absErr.toExponential(3)}</span>
        </div>
      </div>

      <div className="text-xs text-slate-500 mb-2 text-center">
        ∫₀π sin(x) dx = 2 (exact)
      </div>

      <div className="h-52 rounded-lg overflow-hidden bg-surface">
        <Plot
          data={[...fillTraces, curveLine] as Plotly.Data[]}
          layout={DARK_LAYOUT as Partial<Plotly.Layout>}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </StepAnimation>
  )
}
