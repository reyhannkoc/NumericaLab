import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { FIXED_POINT_CONFIG } from '@/config/lessons/fixedPoint'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import { rootFindingService } from '@/services/rootFindingService'
import type { RootFindingResult, RootFindingIteration } from '@/types/api.types'
import type { PlaygroundPreset } from '@/types/lesson.types'
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

function buildCobwebFrames() {
  const frames: { xs: number[]; ys: number[]; x: number; step: number; desc: string }[] = []
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

const PRESETS: PlaygroundPreset[] = [
  { id: 'p1', label: 'g(x) = cos(x)',      description: 'x*≈0.7391 (Dottie)',   params: { expr: 'cos(x)',         x0: 0.5 } },
  { id: 'p2', label: 'g(x) = (x+2)^{1/3}', description: 'x³−x−2=0, x*≈1.5214', params: { expr: '(x+2)**(1/3)',   x0: 1.5 } },
  { id: 'p3', label: 'g(x) = 1 + 1/x',     description: 'x²−x−1=0, x*≈φ≈1.618', params: { expr: '1 + 1/x',        x0: 1.5 } },
  { id: 'p4', label: 'g(x) = exp(x)/3',    description: 'x=eˣ/3 (requires x₀ close)', params: { expr: 'exp(x)/3', x0: 0.5 } },
]

type IterRow = Record<string, unknown> & { k: number; x: string; gx: string; err: string }

export default function FixedPointPage() {
  const [gExpr,     setGExpr]     = useState('cos(x)')
  const [x0,        setX0]        = useState(0.5)
  const [tolerance, setTolerance] = useState(1e-8)
  const [maxIter,   setMaxIter]   = useState(100)
  const [result,    setResult]    = useState<RootFindingResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showTable, setShowTable] = useState(false)

  const handleSolve = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await rootFindingService.solve({
        expression: gExpr,
        method: 'fixed_point',
        x0,
        tolerance,
        max_iterations: maxIter,
      })
      setResult(res)
    } catch (err) {
      console.error('[FixedPointPage] error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [gExpr, x0, tolerance, maxIter])

  const handleReset = useCallback(() => { setResult(null) }, [])

  const applyPreset = (p: PlaygroundPreset) => {
    const v = p.params as Record<string, string | number>
    setGExpr(String(v.expr))
    setX0(Number(v.x0))
    setResult(null)
  }

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="section-label">{'g(x) — iterate x_{n+1} = g(x_n)'}</label>
          <input type="text" value={gExpr}
            onChange={e => { setGExpr(e.target.value); handleReset() }}
            className="input-field font-mono"
            placeholder="e.g. cos(x) or (x+2)**(1/3)"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">x₀ (initial guess)</label>
          <input type="number" value={x0} step={0.1}
            onChange={e => { setX0(Number(e.target.value)); handleReset() }}
            className="input-field" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">Tolerance</label>
          <input type="number" value={tolerance} step={1e-9} min={1e-15}
            onChange={e => { setTolerance(Number(e.target.value)); handleReset() }}
            className="input-field" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">Max Iterations</label>
          <input type="number" value={maxIter} step={10} min={5}
            onChange={e => { setMaxIter(Number(e.target.value)); handleReset() }}
            className="input-field" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={handleSolve} disabled={isLoading} className="btn-primary px-6"
          style={!isLoading ? { backgroundColor: COLOR, borderColor: COLOR } : {}}>
          {isLoading ? 'Iterating...' : 'Find Fixed Point'}
        </button>
        {result && <button onClick={handleReset} className="btn-secondary px-4">Reset</button>}
      </div>
    </div>
  )

  const resultsPanel = result ? (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Fixed Point x*', value: result.root.toFixed(10), color: COLOR },
          { label: 'g(x*)', value: result.root.toFixed(8), color: '#22d3ee' },
          { label: 'Iterations', value: String(result.total_iterations), color: '#a78bfa' },
          { label: 'Converged', value: result.converged ? 'Yes ✓' : 'No ✗', color: result.converged ? '#4ade80' : '#f87171' },
        ].map(m => (
          <div key={m.label} className="glass-card p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">{m.label}</div>
            <div className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      {result.iterations.length > 0 && (
        <button onClick={() => setShowTable(t => !t)} className="text-xs transition-colors" style={{ color: COLOR }}>
          {showTable ? 'Hide' : 'Show'} iteration table
        </button>
      )}
    </div>
  ) : undefined

  const iterRows: IterRow[] = result?.iterations.slice(0, 60).map((it: RootFindingIteration) => ({
    k: it.iteration,
    x: (it.x ?? it.x_new ?? 0).toFixed(10),
    gx: (it.x_new ?? it.x ?? 0).toFixed(10),
    err: it.error.toExponential(4),
  })) ?? []

  const iterCols = [
    { key: 'k'  as keyof IterRow, header: 'k' },
    { key: 'x'  as keyof IterRow, header: 'xₙ' },
    { key: 'gx' as keyof IterRow, header: 'g(xₙ)', highlight: true },
    { key: 'err' as keyof IterRow, header: '|error|' },
  ]

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
      liveErrors={result ? { absoluteError: result.final_error, iterations: result.total_iterations } : undefined}
      livePerformance={result ? { measuredMs: result.execution_time_ms, actualIterations: result.total_iterations } : undefined}
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
      renderPlayground={() => (
        <>
          <InteractivePlayground
            controls={controls}
            results={resultsPanel}
            presets={PRESETS}
            onPresetSelect={applyPreset}
            onRun={handleSolve}
            onReset={handleReset}
            isLoading={isLoading}
            description="Solve g(x) = x by iterating x_{n+1} = g(x_n). Convergence requires |g\'(x*)| < 1."
          />
          {showTable && iterRows.length > 0 && (
            <AlgorithmExecution
              iterations={iterRows}
              columns={iterCols}
              status={result?.converged ? 'converged' : 'idle'}
              description="Fixed-point iteration history"
            />
          )}
        </>
      )}
    />
  )
}
