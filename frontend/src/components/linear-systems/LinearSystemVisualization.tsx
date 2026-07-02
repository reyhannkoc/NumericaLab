import { useState, useMemo } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import { clsx } from 'clsx'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'

export type LinearSolverProp = 'gaussian_elimination' | 'gauss_seidel' | 'jacobi'

const METHOD_COLOR: Record<LinearSolverProp, string> = {
  gaussian_elimination: '#14b8a6',
  gauss_seidel:         '#22d3ee',
  jacobi:               '#a78bfa',
}

// Demo 2×2 systems
interface System2x2 {
  label: string
  a: number[][]
  b: number[]
  description: string
}

const DEMO_SYSTEMS: System2x2[] = [
  { label: '2x+y=5, x+3y=10', a: [[2,1],[1,3]], b: [5,10], description: 'SDD system → iterative converges' },
  { label: '4x-y=6, -x+4y=5', a: [[4,-1],[-1,4]], b: [6,5], description: 'Symmetric positive definite' },
  { label: '3x+y=7, x+3y=5', a: [[3,1],[1,3]], b: [7,5], description: 'Balanced SDD' },
  { label: '5x-y=4, -x+5y=4', a: [[5,-1],[-1,5]], b: [4,4], description: 'Highly diagonal dominant' },
]

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 50, r: 20, t: 30, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.25)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.25)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.01, y: 0.98 },
}
const PLOTLY_CFG = { displayModeBar: false, responsive: true }

function jacobiConvergence(a: number[][], b: number[], maxIter = 40) {
  let x = [0, 0]
  const path: [number, number][] = [[x[0], x[1]]]
  for (let k = 0; k < maxIter; k++) {
    const xNew = [
      (b[0] - a[0][1] * x[1]) / a[0][0],
      (b[1] - a[1][0] * x[0]) / a[1][1],
    ]
    path.push([xNew[0], xNew[1]])
    if (Math.abs(xNew[0] - x[0]) + Math.abs(xNew[1] - x[1]) < 1e-9) break
    x = xNew
  }
  return path
}

function gaussSeidelConvergence(a: number[][], b: number[], maxIter = 40) {
  const x = [0, 0]
  const path: [number, number][] = [[x[0], x[1]]]
  for (let k = 0; k < maxIter; k++) {
    const prevX = [...x]
    x[0] = (b[0] - a[0][1] * x[1]) / a[0][0]
    x[1] = (b[1] - a[1][0] * x[0]) / a[1][1]
    path.push([x[0], x[1]])
    if (Math.abs(x[0] - prevX[0]) + Math.abs(x[1] - prevX[1]) < 1e-9) break
  }
  return path
}

function exact2x2(a: number[][], b: number[]) {
  const det = a[0][0] * a[1][1] - a[0][1] * a[1][0]
  if (Math.abs(det) < 1e-12) return null
  return [(b[0] * a[1][1] - b[1] * a[0][1]) / det, (a[0][0] * b[1] - a[1][0] * b[0]) / det]
}

interface Props { method: LinearSolverProp }

export default function LinearSystemVisualization({ method }: Props) {
  const [sysIdx, setSysIdx] = useState(0)
  const sys = DEMO_SYSTEMS[sysIdx]
  const color = METHOD_COLOR[method]

  const { line1, line2, path, sol, range } = useMemo(() => {
    const a = sys.a, b = sys.b
    // Determine plot range from solution
    const sol = exact2x2(a, b)
    const cx = sol ? sol[0] : 0
    const cy = sol ? sol[1] : 0
    const margin = Math.max(Math.abs(cx), Math.abs(cy), 3) * 1.6
    const xs = Array.from({ length: 200 }, (_, i) => (cx - margin) + i * (2 * margin / 199))

    // Line 1: a[0][0]*x + a[0][1]*y = b[0] → y = (b[0]-a[0][0]*x)/a[0][1]
    const ys1 = a[0][1] !== 0 ? xs.map(x => (b[0] - a[0][0] * x) / a[0][1]) : xs.map(() => NaN)
    const ys2 = a[1][1] !== 0 ? xs.map(x => (b[1] - a[1][0] * x) / a[1][1]) : xs.map(() => NaN)

    const path = method === 'jacobi'
      ? jacobiConvergence(a, b)
      : gaussSeidelConvergence(a, b)

    return { line1: { xs, ys: ys1 }, line2: { xs, ys: ys2 }, path, sol, range: [cx - margin, cx + margin] }
  }, [sysIdx, method])  // eslint-disable-line react-hooks/exhaustive-deps

  const traces: Plotly.Data[] = [
    {
      x: line1.xs, y: line1.ys,
      type: 'scatter', mode: 'lines',
      line: { color: '#8b5cf6', width: 2 },
      name: `Eq 1: ${sys.a[0][0]}x+${sys.a[0][1]}y=${sys.b[0]}`,
    },
    {
      x: line2.xs, y: line2.ys,
      type: 'scatter', mode: 'lines',
      line: { color: '#f59e0b', width: 2 },
      name: `Eq 2: ${sys.a[1][0]}x+${sys.a[1][1]}y=${sys.b[1]}`,
    },
  ]

  // For iterative methods, add convergence path
  if (method !== 'gaussian_elimination') {
    traces.push({
      x: path.map(p => p[0]),
      y: path.map(p => p[1]),
      type: 'scatter',
      mode: 'lines+markers',
      line: { color, width: 1.5, dash: 'dot' },
      marker: { color, size: 5, symbol: 'circle' },
      name: method === 'jacobi' ? `Jacobi (${path.length-1} iters)` : `Gauss-Seidel (${path.length-1} iters)`,
    } as Plotly.Data)
  }

  if (sol) {
    traces.push({
      x: [sol[0]], y: [sol[1]],
      type: 'scatter', mode: 'text+markers' as const,
      marker: { color: '#f87171', size: 12, symbol: 'star' },
      text: [`(${sol[0].toFixed(2)}, ${sol[1].toFixed(2)})`],
      textposition: 'top right',
      textfont: { color: '#f87171', size: 10 },
      name: 'Solution',
    } as Plotly.Data)
  }

  const controls = (
    <div className="space-y-3">
      <p className="section-label">Demo System</p>
      <div className="space-y-2">
        {DEMO_SYSTEMS.map((s, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setSysIdx(i)}
            className={clsx(
              'w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors',
              i === sysIdx
                ? 'border text-white' : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
            )}
            style={i === sysIdx ? { backgroundColor: color + '22', borderColor: color } : {}}
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.description}</div>
          </button>
        ))}
      </div>
      {sol && (
        <div className="grid grid-cols-2 gap-2 text-xs text-center pt-1">
          <div className="rounded bg-surface-card p-2">
            <div className="font-mono font-bold" style={{ color }}>x = {sol[0].toFixed(5)}</div>
            <div className="text-slate-500 mt-0.5">x*</div>
          </div>
          <div className="rounded bg-surface-card p-2">
            <div className="font-mono font-bold" style={{ color }}>y = {sol[1].toFixed(5)}</div>
            <div className="text-slate-500 mt-0.5">y*</div>
          </div>
        </div>
      )}
      {method !== 'gaussian_elimination' && (
        <div className="rounded bg-surface-card p-2 text-xs text-center">
          <span className="text-slate-400">Converged in </span>
          <span className="font-mono font-bold" style={{ color }}>{path.length - 1}</span>
          <span className="text-slate-400"> iterations</span>
        </div>
      )}
    </div>
  )

  const desc = method === 'gaussian_elimination'
    ? 'The two lines represent the two equations. Their intersection is the exact solution — Gaussian elimination finds it directly.'
    : `The colored dashed path shows how ${method === 'jacobi' ? 'Jacobi' : 'Gauss-Seidel'} converges to the intersection from [0,0].`

  return (
    <InteractiveVisualization description={desc} controls={controls}>
      <Plot
        data={traces}
        layout={{
          ...DARK_LAYOUT,
          xaxis: { ...DARK_LAYOUT.xaxis, range, title: { text: 'x', font: { color: '#94a3b8' } } },
          yaxis: { ...DARK_LAYOUT.yaxis, title: { text: 'y', font: { color: '#94a3b8' } } },
        } as Partial<Plotly.Layout>}
        config={PLOTLY_CFG}
        style={{ width: '100%', height: '340px' }}
      />
    </InteractiveVisualization>
  )
}
