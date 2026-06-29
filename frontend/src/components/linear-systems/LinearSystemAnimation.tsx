import { useMemo, useState } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import type { LinearSolverProp } from './LinearSystemVisualization'

// Demo system: [5,-1;-1,5]x=[4,4] — solution x=[1,1]
const A = [[5, -1], [-1, 5]]
const B = [4, 4]
const EXACT = [1, 1]

// ─── Gaussian Elimination frames ─────────────────────────────────────────────

interface GEFrame {
  matrix: number[][]
  description: string
  highlight: number[]  // row indices being operated on
}

function buildGEFrames(): GEFrame[] {
  const frames: GEFrame[] = []
  const m: number[][] = [
    [A[0][0], A[0][1], B[0]],
    [A[1][0], A[1][1], B[1]],
  ]

  frames.push({
    matrix: m.map(r => [...r]),
    description: 'Start: augmented matrix [A|b]',
    highlight: [],
  })

  // Pivot on row 0
  const factor = m[1][0] / m[0][0]
  frames.push({
    matrix: m.map(r => [...r]),
    description: `Multiplier m₂₁ = a₂₁/a₁₁ = ${m[1][0]}/${m[0][0]} = ${factor.toFixed(3)}`,
    highlight: [0],
  })

  for (let j = 0; j <= 2; j++) m[1][j] -= factor * m[0][j]
  frames.push({
    matrix: m.map(r => [...r]),
    description: `R₂ ← R₂ − (${factor.toFixed(3)})×R₁ → upper triangular`,
    highlight: [1],
  })

  // Back substitution
  const x2 = m[1][2] / m[1][1]
  frames.push({
    matrix: m.map(r => [...r]),
    description: `Back sub: x₂ = ${m[1][2].toFixed(4)} / ${m[1][1].toFixed(4)} = ${x2.toFixed(6)}`,
    highlight: [1],
  })

  const x1 = (m[0][2] - m[0][1] * x2) / m[0][0]
  frames.push({
    matrix: m.map(r => [...r]),
    description: `Back sub: x₁ = (${m[0][2].toFixed(3)} − ${m[0][1].toFixed(3)}×${x2.toFixed(4)}) / ${m[0][0]} = ${x1.toFixed(6)}`,
    highlight: [0],
  })

  frames.push({
    matrix: m.map(r => [...r]),
    description: `Solution: x = [${x1.toFixed(6)}, ${x2.toFixed(6)}] (exact!)`,
    highlight: [0, 1],
  })

  return frames
}

// ─── Iterative frames ─────────────────────────────────────────────────────────

interface IterFrame {
  x: number[]
  error: number
  iteration: number
}

function buildIterFrames(method: 'gauss_seidel' | 'jacobi'): IterFrame[] {
  const frames: IterFrame[] = [{ x: [0, 0], error: Math.hypot(...EXACT), iteration: 0 }]
  let x = [0, 0]
  for (let k = 0; k < 20; k++) {
    let xNew: number[]
    if (method === 'jacobi') {
      xNew = [
        (B[0] - A[0][1] * x[1]) / A[0][0],
        (B[1] - A[1][0] * x[0]) / A[1][1],
      ]
    } else {
      const xgs = [...x]
      xgs[0] = (B[0] - A[0][1] * xgs[1]) / A[0][0]
      xgs[1] = (B[1] - A[1][0] * xgs[0]) / A[1][1]
      xNew = xgs
    }
    const err = Math.hypot(xNew[0] - EXACT[0], xNew[1] - EXACT[1])
    frames.push({ x: xNew, error: err, iteration: k + 1 })
    if (err < 1e-10) break
    x = xNew
  }
  return frames
}

const GE_FRAMES = buildGEFrames()

const METHOD_COLOR: Record<LinearSolverProp, string> = {
  gaussian_elimination: '#14b8a6',
  gauss_seidel:         '#22d3ee',
  jacobi:               '#a78bfa',
}
const METHOD_LABEL: Record<LinearSolverProp, string> = {
  gaussian_elimination: 'Gaussian Elimination',
  gauss_seidel:         'Gauss–Seidel',
  jacobi:               'Jacobi',
}

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 55, r: 20, t: 30, b: 45 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  showlegend: false,
  autosize: true,
}

interface Props { method: LinearSolverProp }

export default function LinearSystemAnimation({ method }: Props) {
  const [speed, setSpeed] = useState(1)
  const color = METHOD_COLOR[method]
  const label = METHOD_LABEL[method]

  const isGE = method === 'gaussian_elimination'
  const iterFrames = useMemo(
    () => isGE ? [] : buildIterFrames(method as 'gauss_seidel' | 'jacobi'),
    [method, isGE],
  )

  const totalFrames = isGE ? GE_FRAMES.length : iterFrames.length

  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames,
    fps: speed * 1.5,
    loop: false,
  })

  // ─── GE rendering ────────────────────────────────────────────────────────────
  let stepDesc = ''
  let plotData: Plotly.Data[] = []

  if (isGE) {
    const f = GE_FRAMES[Math.min(frame, GE_FRAMES.length - 1)]
    stepDesc = f.description

    const cellColors = f.matrix.map((_, ri) =>
      f.matrix[ri].map(() => f.highlight.includes(ri) ? color + '44' : 'transparent')
    )

    plotData = [{
      type: 'table',
      header: {
        values: ['Row', 'a₁', 'a₂', 'b'],
        fill: { color: '#0f172a' },
        font: { color: '#94a3b8', size: 11 },
        line: { color: '#334155' },
      },
      cells: {
        values: [
          ['R₁', 'R₂'],
          f.matrix.map(r => r[0].toFixed(4)),
          f.matrix.map(r => r[1].toFixed(4)),
          f.matrix.map(r => r[2].toFixed(4)),
        ],
        fill: { color: cellColors.map(row => row.map(() => '#1e293b')) },
        font: { color: f.matrix.map((_, ri) => f.matrix[ri].map(() => f.highlight.includes(ri) ? color : '#94a3b8')), size: 11 },
        line: { color: '#334155' },
        align: 'center',
      },
    } as unknown as Plotly.Data]
  } else {
    // Iterative: convergence error plot up to current frame
    const slice = iterFrames.slice(0, frame + 1)
    stepDesc = frame === 0
      ? 'Iteration 0: x = [0, 0] — starting point'
      : `Iteration ${iterFrames[frame]?.iteration}: x = [${iterFrames[frame]?.x[0].toFixed(6)}, ${iterFrames[frame]?.x[1].toFixed(6)}] | error = ${iterFrames[frame]?.error.toExponential(3)}`

    plotData = [
      {
        x: slice.map(f => f.iteration),
        y: slice.map(f => Math.max(f.error, 1e-15)),
        type: 'scatter', mode: 'lines+markers',
        line: { color, width: 2 },
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
      {/* Info badges */}
      <div className="flex flex-wrap gap-3 mb-3">
        <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">Method</span>
          <span className="text-sm font-mono font-bold" style={{ color }}>{label}</span>
        </div>
        {!isGE && frame > 0 && (
          <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-xs text-slate-400">‖error‖ =</span>
            <span className="text-sm font-mono font-bold text-red-400">
              {iterFrames[frame]?.error.toExponential(3) ?? '—'}
            </span>
          </div>
        )}
        <div className="bg-surface-card rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-slate-400">System</span>
          <span className="text-xs font-mono text-slate-300">[5,-1;-1,5]x=[4,4]</span>
        </div>
      </div>

      <div className="text-xs text-slate-500 mb-2 text-center">
        {isGE ? 'Augmented matrix [A|b] during row reduction' : '‖error‖ vs iteration — [5,-1;-1,5]x=[4,4], x*=[1,1]'}
      </div>

      <div className={isGE ? 'rounded-lg overflow-hidden bg-surface' : 'h-52 rounded-lg overflow-hidden bg-surface'}>
        <Plot
          data={plotData}
          layout={isGE
            ? ({ ...DARK_LAYOUT, height: 200 } as Partial<Plotly.Layout>)
            : ({
                ...DARK_LAYOUT,
                yaxis: { ...DARK_LAYOUT.yaxis, type: 'log', title: { text: '‖error‖', font: { color: '#94a3b8' } } },
                xaxis: { ...DARK_LAYOUT.xaxis, title: { text: 'Iteration k', font: { color: '#94a3b8' } } },
              } as Partial<Plotly.Layout>)
          }
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: isGE ? '200px' : '208px' }}
        />
      </div>
    </StepAnimation>
  )
}
