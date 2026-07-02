import { useMemo, useState } from 'react'
import Plot from 'react-plotly.js'
import { useAnimation } from '@/hooks/useAnimation'
import StepAnimation from '@components/lesson/sections/StepAnimation'

// ─── Float32 simulation ───────────────────────────────────────────────────────

const F32_BUF = new Float32Array(1)
function toF32(x: number): number { F32_BUF[0] = x; return F32_BUF[0] }

function accumulateF32(step: number, n: number): number {
  const sf32 = toF32(step)
  let sum = 0
  for (let i = 0; i < n; i++) sum = toF32(sum + sf32)
  return sum
}

// ─── Frame data ───────────────────────────────────────────────────────────────

interface PropFrame {
  iteration:  number
  trueValue:  number
  f32Sum:     number
  f64Sum:     number
  error32:    number
  error64:    number
}

function buildFrames(step: number, maxIter: number): PropFrame[] {
  const frames: PropFrame[] = []
  let f64Sum = 0
  for (let n = 1; n <= maxIter; n++) {
    const trueValue = n / (1 / step)  // exact rational: n * step
    const f32Sum    = accumulateF32(step, n)
    f64Sum += step                    // native float64 accumulation
    frames.push({
      iteration: n,
      trueValue,
      f32Sum,
      f64Sum,
      error32: Math.abs(f32Sum - trueValue),
      error64: Math.abs(f64Sum - trueValue),
    })
  }
  return frames
}

// ─── Dark layout base ─────────────────────────────────────────────────────────

const BASE_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'transparent',
  font:          { color: '#94a3b8', size: 11 },
  margin:        { t: 20, r: 20, b: 50, l: 65 },
  xaxis: {
    title: 'Iteration',
    gridcolor: '#1e293b',
    color: '#475569',
    showline: true,
    linecolor: '#1e293b',
    zeroline: false,
  },
  yaxis: {
    title: 'Absolute Error',
    type: 'log' as const,
    gridcolor: '#1e293b',
    color: '#475569',
    showline: true,
    linecolor: '#1e293b',
    zeroline: false,
  },
  legend: {
    bgcolor: 'transparent',
    bordercolor: '#1e293b',
    borderwidth: 1,
  },
}

// ─── Settings options ─────────────────────────────────────────────────────────

const STEP_OPTIONS = [0.001, 0.01, 0.1, 1.0]
const MAX_ITER     = 200

// ─── Component ────────────────────────────────────────────────────────────────

export default function ErrorPropagationSection() {
  const [step, setStep]       = useState(0.1)
  const [speed, setSpeed]     = useState(1)

  // Build all frames (memoized per step value)
  const frames = useMemo(() => buildFrames(step, MAX_ITER), [step])

  const anim = useAnimation({ totalFrames: MAX_ITER, fps: 10 * speed })

  const currentFrame = frames[anim.frame]

  // Chart data: show only up to current frame
  const visible = frames.slice(0, anim.frame + 1)
  const xs = visible.map((f) => f.iteration)

  const chartData: Plotly.Data[] = [
    {
      x: xs,
      y: visible.map((f) => f.error32),
      type: 'scatter',
      mode: 'lines',
      name: 'float32 error',
      line: { color: '#fb7185', width: 2 },
    },
    {
      x: xs,
      y: visible.map((f) => f.error64),
      type: 'scatter',
      mode: 'lines',
      name: 'float64 error',
      line: { color: '#60a5fa', width: 2, dash: 'dot' },
    },
  ]

  const handleStepChange = (newStep: number) => {
    setStep(newStep)
    anim.reset()
  }

  const stepDesc =
    anim.status === 'idle'
      ? 'Press Play to watch error accumulate as the sum grows'
      : anim.status === 'finished'
      ? `Finished — ${MAX_ITER} additions of ${step} completed`
      : `Iter ${currentFrame.iteration}: True=${currentFrame.trueValue.toFixed(4)} · f32err=${currentFrame.error32.toExponential(2)} · f64err=${currentFrame.error64.toExponential(2)}`

  return (
    <StepAnimation
      totalFrames={MAX_ITER}
      frame={anim.frame}
      status={anim.status}
      speed={speed}
      onPlay={anim.play}
      onPause={anim.pause}
      onReset={anim.reset}
      onStepBack={anim.stepBackward}
      onStepForward={anim.stepForward}
      onSpeedChange={setSpeed}
      stepDescription={stepDesc}
    >
      {/* Settings row */}
      <div className="flex items-center gap-4 px-5 pt-4 pb-2 border-b border-surface-border flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Step value:</span>
          <div className="flex gap-1">
            {STEP_OPTIONS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => handleStepChange(s)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  step === s
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Simulates adding <span className="text-white font-mono">{step}</span> to a running sum, {MAX_ITER} times.
          Compares accumulated rounding error in float32 vs float64.
        </div>
      </div>

      {/* Chart */}
      <Plot
        data={chartData}
        layout={{
          ...BASE_LAYOUT,
          height: 280,
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
        useResizeHandler
      />

      {/* Live metrics */}
      <div className="grid grid-cols-3 gap-3 px-5 py-4 border-t border-surface-border">
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Iteration</div>
          <div className="text-lg font-mono font-bold text-white tabular-nums">
            {currentFrame.iteration}
          </div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">float32 error</div>
          <div className="text-lg font-mono font-bold text-rose-400 tabular-nums">
            {currentFrame.error32.toExponential(2)}
          </div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">float64 error</div>
          <div className="text-lg font-mono font-bold text-blue-400 tabular-nums">
            {currentFrame.error64.toExponential(2)}
          </div>
        </div>
      </div>

      {/* Insight callout */}
      {anim.frame > 10 && (
        <div className="mx-5 mb-4 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          At iteration {currentFrame.iteration}: float32 error is{' '}
          <strong>
            {currentFrame.error32 > 0 && currentFrame.error64 > 0
              ? `~${Math.round(currentFrame.error32 / Math.max(currentFrame.error64, 1e-20))} ×`
              : '∞'}{' '}
          </strong>
          larger than float64. Error grows roughly linearly — the hallmark of a numerically <em>stable</em> algorithm
          (accumulation is stable; the per-step rounding error just adds up).
        </div>
      )}
    </StepAnimation>
  )
}
