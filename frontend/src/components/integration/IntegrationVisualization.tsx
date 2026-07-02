import { useState, useMemo } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import { clsx } from 'clsx'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'

export type IntegMethod = 'trapezoidal' | 'simpsons' | 'gaussian_quadrature'

// ─── Preset functions ─────────────────────────────────────────────────────────

const FUNCTIONS = [
  { label: 'sin(x)', fn: (x: number) => Math.sin(x), exact: (a: number, b: number) => -Math.cos(b) + Math.cos(a) },
  { label: 'eˣ',    fn: (x: number) => Math.exp(x), exact: (a: number, b: number) => Math.exp(b) - Math.exp(a) },
  { label: 'x²',    fn: (x: number) => x * x,        exact: (a: number, b: number) => (b ** 3 - a ** 3) / 3 },
  { label: 'cos(x)', fn: (x: number) => Math.cos(x), exact: (a: number, b: number) => Math.sin(b) - Math.sin(a) },
]

const METHOD_COLOR: Record<IntegMethod, string> = {
  trapezoidal:       '#60a5fa',
  simpsons:          '#34d399',
  gaussian_quadrature: '#f59e0b',
}

const METHOD_LABEL: Record<IntegMethod, string> = {
  trapezoidal:       'Trapezoidal',
  simpsons:          "Simpson's",
  gaussian_quadrature: 'Gauss',
}

const N_OPTIONS = [2, 4, 6, 8, 10, 16, 20, 32]

const GAUSS_NODES: Record<number, { x: number[]; w: number[] }> = {
  2:  { x: [-0.577350269, 0.577350269], w: [1, 1] },
  3:  { x: [-0.774596669, 0, 0.774596669], w: [0.555556, 0.888889, 0.555556] },
  4:  { x: [-0.861136312, -0.339981044, 0.339981044, 0.861136312], w: [0.347854845, 0.652145155, 0.652145155, 0.347854845] },
  5:  { x: [-0.906179846, -0.538469310, 0, 0.538469310, 0.906179846], w: [0.236926885, 0.478628671, 0.568888889, 0.478628671, 0.236926885] },
}

function computeIntegral(fn: (x: number) => number, a: number, b: number, n: number, method: IntegMethod): { value: number; fills: { x: number[]; y: number[] }[] } {
  const fills: { x: number[]; y: number[] }[] = []

  if (method === 'trapezoidal') {
    const h = (b - a) / n
    let sum = 0
    for (let i = 0; i < n; i++) {
      const x0 = a + i * h, x1 = a + (i + 1) * h
      sum += (fn(x0) + fn(x1)) * h / 2
      fills.push({ x: [x0, x1, x1, x0, x0], y: [0, 0, fn(x1), fn(x0), 0] })
    }
    return { value: sum, fills }
  }

  if (method === 'simpsons') {
    const nEven = n % 2 === 0 ? n : n + 1
    const h = (b - a) / nEven
    let sum = fn(a) + fn(b)
    for (let i = 1; i < nEven; i++) sum += (i % 2 === 0 ? 2 : 4) * fn(a + i * h)
    const value = (h / 3) * sum
    for (let i = 0; i < nEven; i += 2) {
      const x0 = a + i * h, x1 = a + (i + 1) * h, x2 = a + (i + 2) * h
      const pts = 20
      const xs = Array.from({ length: pts }, (_, k) => x0 + (x2 - x0) * k / (pts - 1))
      const ys = xs.map(xi => {
        const L0 = fn(x0) * ((xi - x1) * (xi - x2)) / ((x0 - x1) * (x0 - x2))
        const L1 = fn(x1) * ((xi - x0) * (xi - x2)) / ((x1 - x0) * (x1 - x2))
        const L2 = fn(x2) * ((xi - x0) * (xi - x1)) / ((x2 - x0) * (x2 - x1))
        return L0 + L1 + L2
      })
      fills.push({ x: [...xs, ...xs.slice().reverse(), xs[0]], y: [...ys, ...xs.map(() => 0), 0] })
    }
    return { value, fills }
  }

  const gn = Math.min(n, 5)
  const g = GAUSS_NODES[gn] ?? GAUSS_NODES[5]
  const scale = (b - a) / 2, shift = (a + b) / 2
  let value = 0
  g.x.forEach((xi, i) => {
    const x = scale * xi + shift
    value += g.w[i] * fn(x)
    fills.push({ x: [x, x], y: [0, fn(x)] })
  })
  return { value: value * scale, fills }
}

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  margin: { l: 40, r: 20, t: 20, b: 40 },
  showlegend: false,
  autosize: true,
}

interface Props { method: IntegMethod }

export default function IntegrationVisualization({ method }: Props) {
  const [funcIdx, setFuncIdx] = useState(0)
  const [n, setN] = useState(4)
  const [a, setA] = useState(0)
  const [b, setB] = useState(Math.PI)

  const { fn, exact } = FUNCTIONS[funcIdx]
  const color = METHOD_COLOR[method]
  const label = METHOD_LABEL[method]

  const { value: approx, fills } = useMemo(
    () => computeIntegral(fn, a, b, n, method),
    [fn, a, b, n, method]
  )

  const exactVal = exact(a, b)
  const absErr = Math.abs(approx - exactVal)

  const curveX = Array.from({ length: 200 }, (_, i) => a + (b - a) * i / 199)
  const curveY = curveX.map(fn)

  const fillTraces: Plotly.Data[] = fills.map(f => ({
    x: f.x as number[], y: f.y as number[],
    fill: method === 'gaussian_quadrature' ? undefined : 'toself',
    fillcolor: color + '30',
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
    name: FUNCTIONS[funcIdx].label,
  }

  const controls = (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-400">Function</span>
        <div className="flex gap-1">
          {FUNCTIONS.map((f, i) => (
            <button
              type="button"
              key={f.label}
              onClick={() => setFuncIdx(i)}
              className={clsx(
                'px-2 py-1 rounded text-xs font-medium transition-colors',
                funcIdx === i ? 'text-white' : 'bg-surface text-slate-400 hover:text-white'
              )}
              style={funcIdx === i ? { backgroundColor: color } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-400">
          n = {method === 'gaussian_quadrature' ? Math.min(n, 5) : n}
        </span>
        <input
          type="range"
          min={2}
          max={method === 'gaussian_quadrature' ? 5 : 32}
          step={method === 'simpsons' ? 2 : 1}
          value={n}
          onChange={e => setN(Number(e.target.value))}
          className="w-28 accent-pink-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-400">Interval [a, b]</span>
        <div className="flex items-center gap-2">
          <input
            type="number" value={a} step={0.1}
            onChange={e => { const v = Number(e.target.value); if (v < b) setA(v) }}
            className="input-field w-16 text-sm"
          />
          <span className="text-slate-400 text-sm">to</span>
          <input
            type="number" value={b.toFixed(4)} step={0.1}
            onChange={e => { const v = Number(e.target.value); if (v > a) setB(v) }}
            className="input-field w-20 text-sm"
          />
        </div>
      </div>
    </div>
  )

  return (
    <InteractiveVisualization
      description={`Visualize how ${label} quadrature approximates the area under the curve`}
      controls={controls}
    >
      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[
          { label: `${label} ≈`, value: approx.toFixed(8), c: color },
          { label: 'Exact', value: isFinite(exactVal) ? exactVal.toFixed(8) : '—', c: '#8b5cf6' },
          { label: 'Abs Error', value: isFinite(absErr) ? absErr.toExponential(3) : '—', c: '#f87171' },
        ].map(m => (
          <div key={m.label} className="bg-surface-card rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">{m.label}</div>
            <div className="text-sm font-mono font-bold" style={{ color: m.c }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Plot */}
      <div className="h-64 rounded-lg overflow-hidden bg-surface">
        <Plot
          data={[...fillTraces, curveLine] as Plotly.Data[]}
          layout={{
            ...DARK_LAYOUT,
            xaxis: { ...DARK_LAYOUT.xaxis, title: 'x' },
            yaxis: { ...DARK_LAYOUT.yaxis, title: 'f(x)' },
          } as Partial<Plotly.Layout>}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {method !== 'gaussian_quadrature' && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs text-slate-400">Quick n:</span>
          {N_OPTIONS.map(opt => (
            <button
              type="button"
              key={opt}
              onClick={() => setN(method === 'simpsons' && opt % 2 !== 0 ? opt + 1 : opt)}
              className={clsx(
                'px-2 py-0.5 rounded text-xs font-mono transition-colors',
                n === opt ? 'text-white' : 'bg-surface text-slate-400 hover:text-white'
              )}
              style={n === opt ? { backgroundColor: color } : {}}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </InteractiveVisualization>
  )
}
