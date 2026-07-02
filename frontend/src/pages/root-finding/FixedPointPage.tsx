import LessonPage from '@components/lesson/LessonPage'
import { FIXED_POINT_CONFIG } from '@/config/lessons/fixedPoint'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'

const COLOR = '#6366f1'

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 50, r: 20, t: 30, b: 45 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  showlegend: true,
  legend: { bgcolor: 'rgba(15,23,42,0.8)', bordercolor: '#334155', borderwidth: 1 },
  autosize: true,
}

// Static demo: g(x) = cos(x), x* ≈ 0.7391 (Dottie's number)
const DEMO_G  = (x: number) => Math.cos(x)
const DEMO_X0 = 0.5
const DEMO_XSTAR = 0.7390851332

interface CobwebFrame { xs: number[]; ys: number[]; x: number; step: number; desc: string }

function buildCobwebFrames(): CobwebFrame[] {
  const frames: CobwebFrame[] = []
  const xs: number[] = [DEMO_X0], ys: number[] = [0]
  let x = DEMO_X0, step = 0
  frames.push({ xs: [...xs], ys: [...ys], x, step, desc: `x₀ = ${x.toFixed(5)} (start)` })
  for (let i = 0; i < 12; i++) {
    const gx = DEMO_G(x)
    // Move up to y = g(x)
    xs.push(x); ys.push(gx)
    // Move right to y = x line
    xs.push(gx); ys.push(gx)
    step++
    x = gx
    frames.push({ xs: [...xs], ys: [...ys], x, step, desc: `x${step} = g(${x.toFixed(5)}) = ${gx.toFixed(5)}, err=${Math.abs(x - DEMO_XSTAR).toExponential(3)}` })
    if (Math.abs(x - DEMO_XSTAR) < 1e-10) break
  }
  return frames
}

const COBWEB_FRAMES = buildCobwebFrames()
const CURVE_XS = Array.from({ length: 100 }, (_, i) => 0 + 1.2 * i / 99)
const CURVE_GX = CURVE_XS.map(x => Math.cos(x))

type IterRow = Record<string, unknown> & { k: number; x: string; gx: string; err: string }

const ITER_ROWS: IterRow[] = COBWEB_FRAMES.slice(1).map((f, i) => ({
  k: f.step,
  x: COBWEB_FRAMES[i].x.toFixed(10),
  gx: f.x.toFixed(10),
  err: Math.abs(f.x - DEMO_XSTAR).toExponential(4),
}))

const ITER_COLS = [
  { key: 'k'  as keyof IterRow, header: 'k' },
  { key: 'x'  as keyof IterRow, header: 'xₙ' },
  { key: 'gx' as keyof IterRow, header: 'g(xₙ)', highlight: true },
  { key: 'err' as keyof IterRow, header: '|error|' },
]

export default function FixedPointPage() {
  // Cobweb animation
  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames: COBWEB_FRAMES.length,
    fps: 1.5,
    loop: false,
  })
  const cf = COBWEB_FRAMES[Math.min(frame, COBWEB_FRAMES.length - 1)]

  const cobwebData: Plotly.Data[] = [
    { x: CURVE_XS, y: CURVE_XS, type: 'scatter', mode: 'lines', name: 'y = x', line: { color: '#94a3b8', width: 1.5, dash: 'dot' } },
    { x: CURVE_XS, y: CURVE_GX, type: 'scatter', mode: 'lines', name: 'y = cos(x)', line: { color: '#8b5cf6', width: 2 } },
    { x: cf.xs, y: cf.ys, type: 'scatter', mode: 'lines', name: 'cobweb', line: { color: COLOR, width: 2 } },
    { x: [DEMO_XSTAR], y: [DEMO_XSTAR], type: 'scatter', mode: 'markers', name: 'x*', marker: { color: '#4ade80', size: 10, symbol: 'circle' } },
  ]

  return (
    <LessonPage
      config={FIXED_POINT_CONFIG}
      primaryMethod="fixed_point"
      renderVisualization={() => (
        <InteractiveVisualization description="Cobweb diagram for g(x) = cos(x). The cobweb spirals in because |g\'(x*)| = |−sin(0.739)| ≈ 0.67 < 1.">
          <Plot
            data={cobwebData}
            layout={{
              ...DARK_LAYOUT,
              yaxis: { ...DARK_LAYOUT.yaxis, range: [0, 1.2] },
              xaxis: { ...DARK_LAYOUT.xaxis, range: [0, 1.2] },
            } as Partial<Plotly.Layout>}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '260px' }}
          />
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>g(x) = cos(x), x₀ = 0.5</span>
            <span style={{ color: COLOR }}>x* ≈ 0.7391 (Dottie&apos;s constant)</span>
          </div>
        </InteractiveVisualization>
      )}
      renderAnimation={() => (
        <StepAnimation
          totalFrames={COBWEB_FRAMES.length}
          frame={frame}
          status={status}
          speed={1}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onStepBack={stepBackward}
          onStepForward={stepForward}
          onSpeedChange={() => {}}
          stepDescription={cf.desc}
        >
          <div className="h-52 rounded-lg overflow-hidden bg-surface">
            <Plot
              data={cobwebData}
              layout={{
                ...DARK_LAYOUT,
                showlegend: false,
                yaxis: { ...DARK_LAYOUT.yaxis, range: [0, 1.2] },
                xaxis: { ...DARK_LAYOUT.xaxis, range: [0, 1.2] },
                margin: { l: 40, r: 10, t: 15, b: 35 },
              } as Partial<Plotly.Layout>}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: '208px' }}
            />
          </div>
        </StepAnimation>
      )}
      renderAlgorithm={() => (
        <AlgorithmExecution
          iterations={ITER_ROWS}
          columns={ITER_COLS}
          status="converged"
          description="Fixed-point iteration history for the demonstration problem g(x) = cos(x)."
        />
      )}
    />
  )
}
