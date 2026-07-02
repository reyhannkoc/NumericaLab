import { useState, useMemo } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import { clsx } from 'clsx'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'

export type OptMethodProp = 'golden_section' | 'gradient_descent'

const METHOD_COLOR: Record<OptMethodProp, string> = {
  golden_section:   '#06b6d4',
  gradient_descent: '#818cf8',
}

const PHI = (1 + Math.sqrt(5)) / 2

interface FnPreset {
  label: string
  fn: (x: number) => number
  dfn: (x: number) => number
  a: number
  b: number
  x0: number
}

const PRESETS: FnPreset[] = [
  { label: '(x−2)²', fn: x => (x-2)**2,         dfn: x => 2*(x-2),           a: 0,   b: 4,   x0: 3    },
  { label: 'x²−4x+6', fn: x => x**2-4*x+6,      dfn: x => 2*x-4,             a: 0,   b: 4,   x0: 3.5  },
  { label: 'x⁴−4x²',  fn: x => x**4-4*x**2,     dfn: x => 4*x**3-8*x,        a: 0,   b: 2.5, x0: 2    },
  { label: 'sin(x)+x/4', fn: x => Math.sin(x)+x/4, dfn: x => Math.cos(x)+0.25, a: 1,   b: 5,   x0: 4    },
  { label: '(x−1)²+1', fn: x => (x-1)**2+1,     dfn: x => 2*(x-1),           a: -1,  b: 3,   x0: 2.5  },
]

// ─── Golden section iterations ────────────────────────────────────────────────

function goldenSectionIters(fn: (x: number) => number, a0: number, b0: number, maxIter = 25) {
  let a = a0, b = b0
  const iters: { a: number; b: number; x1: number; x2: number; iter: number }[] = []
  for (let k = 0; k < maxIter; k++) {
    const x1 = b - (b - a) / PHI
    const x2 = a + (b - a) / PHI
    iters.push({ a, b, x1, x2, iter: k + 1 })
    if (fn(x1) > fn(x2)) a = x1
    else b = x2
    if (b - a < 1e-9) break
  }
  return iters
}

// ─── Gradient descent iterations ─────────────────────────────────────────────

function gradientDescentIters(fn: (x: number) => number, dfn: (x: number) => number, x0: number, alpha: number, maxIter = 40) {
  let x = x0
  const iters: { x: number; fx: number; iter: number }[] = [{ x, fx: fn(x), iter: 0 }]
  for (let k = 0; k < maxIter; k++) {
    const grad = dfn(x)
    x = x - alpha * grad
    iters.push({ x, fx: fn(x), iter: k + 1 })
    if (Math.abs(grad) < 1e-9) break
  }
  return iters
}

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 50, r: 20, t: 30, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)' },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)' },
  showlegend: false, autosize: true,
}
const PLOTLY_CFG = { displayModeBar: false, responsive: true }

interface Props { method: OptMethodProp }

export default function OptimizationVisualization({ method }: Props) {
  const [fnIdx, setFnIdx] = useState(0)
  const [alpha, setAlpha] = useState(0.1)
  const preset = PRESETS[fnIdx]
  const color = METHOD_COLOR[method]

  const { curveXs, curveYs, gsIters, gdIters } = useMemo(() => {
    const N = 300
    const xs = Array.from({ length: N }, (_, i) => preset.a + (preset.b - preset.a) * i / (N - 1))
    const ys = xs.map(preset.fn)
    const gsIters = method === 'golden_section' ? goldenSectionIters(preset.fn, preset.a, preset.b) : []
    const gdIters = method === 'gradient_descent' ? gradientDescentIters(preset.fn, preset.dfn, preset.x0, alpha) : []
    return { curveXs: xs, curveYs: ys, gsIters, gdIters }
  }, [fnIdx, method, alpha])  // eslint-disable-line react-hooks/exhaustive-deps

  const lastGS = gsIters[gsIters.length - 1]
  const lastGD = gdIters[gdIters.length - 1]
  const optX = method === 'golden_section' ? (lastGS ? (lastGS.a + lastGS.b) / 2 : preset.a) : lastGD?.x ?? preset.x0

  const traces: Plotly.Data[] = [
    {
      x: curveXs, y: curveYs,
      type: 'scatter', mode: 'lines',
      line: { color: '#8b5cf6', width: 2 },
    },
  ]

  if (method === 'golden_section' && gsIters.length > 0) {
    const last = gsIters[gsIters.length - 1]
    traces.push(
      {
        x: [last.a, last.b, last.b, last.a, last.a],
        y: [preset.fn(last.a), preset.fn(last.b), preset.fn(last.b) - 0.5, preset.fn(last.a) - 0.5, preset.fn(last.a)],
        type: 'scatter', mode: 'lines',
        fill: 'toself',
        fillcolor: color + '22',
        line: { color, width: 2 },
      } as Plotly.Data,
      {
        x: [last.x1, last.x2],
        y: [preset.fn(last.x1), preset.fn(last.x2)],
        type: 'scatter', mode: 'markers',
        marker: { color: [color, color], size: 10, symbol: 'diamond' },
      } as Plotly.Data,
    )
  }

  if (method === 'gradient_descent' && gdIters.length > 1) {
    traces.push({
      x: gdIters.map(it => it.x),
      y: gdIters.map(it => it.fx),
      type: 'scatter', mode: 'lines+markers',
      line: { color, width: 1.5, dash: 'dot' },
      marker: { color, size: 5 },
    } as Plotly.Data)
  }

  // Star at optimum
  traces.push({
    x: [optX], y: [preset.fn(optX)],
    type: 'scatter', mode: 'text+markers',
    marker: { color: '#f87171', size: 12, symbol: 'star' },
    text: [`x*≈${optX.toFixed(3)}`],
    textposition: 'top center',
    textfont: { color: '#f87171', size: 10 },
  } as Plotly.Data)

  const controls = (
    <div className="space-y-4">
      <div>
        <p className="section-label mb-2">Function</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button type="button" key={i} onClick={() => setFnIdx(i)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-mono transition-colors',
                i === fnIdx ? 'border text-white' : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white'
              )}
              style={i === fnIdx ? { backgroundColor: color + '22', borderColor: color } : {}}
            >{p.label}</button>
          ))}
        </div>
      </div>
      {method === 'gradient_descent' && (
        <div>
          <p className="section-label mb-1">Learning rate α = {alpha}</p>
          <input type="range" min={0.01} max={0.5} step={0.01} value={alpha}
            onChange={e => setAlpha(Number(e.target.value))} className="w-full accent-cyan-500" />
          <div className="flex justify-between text-xs text-slate-500 mt-0.5">
            <span>0.01</span><span>0.5</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 text-xs text-center">
        <div className="rounded bg-surface-card p-2">
          <div className="font-mono font-bold" style={{ color }}>x* ≈ {optX.toFixed(5)}</div>
          <div className="text-slate-500 mt-0.5">Optimum location</div>
        </div>
        <div className="rounded bg-surface-card p-2">
          <div className="font-mono font-bold" style={{ color }}>{preset.fn(optX).toFixed(5)}</div>
          <div className="text-slate-500 mt-0.5">f(x*)</div>
        </div>
      </div>
      <div className="rounded bg-surface-card p-2 text-xs text-center">
        <span className="text-slate-400">Iters: </span>
        <span className="font-mono font-bold" style={{ color }}>
          {method === 'golden_section' ? gsIters.length : gdIters.length - 1}
        </span>
      </div>
    </div>
  )

  return (
    <InteractiveVisualization
      description={method === 'golden_section'
        ? 'The shaded region shows the current bracket [a, b]. Diamond markers show the two golden-ratio probe points.'
        : 'The dashed path shows gradient descent iterates converging to the minimum. Adjust α to see stability.'}
      controls={controls}
    >
      <Plot
        data={traces}
        layout={{
          ...DARK_LAYOUT,
          xaxis: { ...DARK_LAYOUT.xaxis, title: { text: 'x', font: { color: '#94a3b8' } } },
          yaxis: { ...DARK_LAYOUT.yaxis, title: { text: 'f(x)', font: { color: '#94a3b8' } } },
        } as Partial<Plotly.Layout>}
        config={PLOTLY_CFG}
        style={{ width: '100%', height: '300px' }}
      />
    </InteractiveVisualization>
  )
}
