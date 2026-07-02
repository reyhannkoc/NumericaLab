import { useState, useMemo } from 'react'
import Plot from 'react-plotly.js'
import { clsx } from 'clsx'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'
import type { DifferentiationMethod } from '@/types/api.types'

type DiffMethod = Extract<DifferentiationMethod, 'forward' | 'backward' | 'central'>

// ─── Preset functions ─────────────────────────────────────────────────────────

interface FnPreset {
  label: string
  fn: (x: number) => number
  dfn: (x: number) => number
  xMin: number
  xMax: number
  xDefault: number
}

const FN_PRESETS: FnPreset[] = [
  { label: 'sin(x)', fn: Math.sin, dfn: Math.cos,    xMin: 0,  xMax: 6.28, xDefault: 1.0 },
  { label: 'cos(x)', fn: Math.cos, dfn: (x) => -Math.sin(x), xMin: 0, xMax: 6.28, xDefault: 1.0 },
  { label: 'eˣ',     fn: Math.exp, dfn: Math.exp,    xMin: 0,  xMax: 2.5,  xDefault: 1.0 },
  { label: 'x³',     fn: (x) => x * x * x, dfn: (x) => 3 * x * x, xMin: -2, xMax: 2, xDefault: 1.0 },
  { label: 'x²+1',   fn: (x) => x * x + 1, dfn: (x) => 2 * x,     xMin: -2, xMax: 2, xDefault: 1.0 },
]

const METHOD_COLOR: Record<DiffMethod, string> = {
  forward:  '#60a5fa',
  backward: '#f87171',
  central:  '#34d399',
}

const METHOD_LABEL: Record<DiffMethod, string> = {
  forward:  'Forward  [f(x+h)−f(x)]/h',
  backward: 'Backward [f(x)−f(x−h)]/h',
  central:  'Central  [f(x+h)−f(x−h)]/(2h)',
}

const H_OPTIONS = [1.0, 0.5, 0.2, 0.1, 0.05, 0.01, 0.001]

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 55, r: 20, t: 35, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.01, y: 0.98 },
}
const PLOTLY_CFG = { displayModeBar: false, responsive: true }

interface Props { method: DiffMethod }

export default function DifferentiationVisualization({ method }: Props) {
  const [fnIdx,  setFnIdx]  = useState(0)
  const [hIdx,   setHIdx]   = useState(3)  // default h=0.1
  const [xPctRaw, setXPct] = useState(50) // 0-100 → maps to xMin..xMax

  const preset = FN_PRESETS[fnIdx]
  const h = H_OPTIONS[hIdx]
  const x = preset.xMin + (xPctRaw / 100) * (preset.xMax - preset.xMin)
  const color = METHOD_COLOR[method]

  const { curvePts, secantPts, tangentPts, approxPoints } = useMemo(() => {
    const N = 300
    const xs = Array.from({ length: N }, (_, i) => preset.xMin + (preset.xMax - preset.xMin) * i / (N - 1))
    const ys = xs.map(preset.fn)

    // Exact tangent at x: y = f(x) + f'(x)*(t-x)
    const fx  = preset.fn(x)
    const dfx = preset.dfn(x)
    const tLen = (preset.xMax - preset.xMin) * 0.15
    const tPts = [x - tLen, x + tLen]
    const tVals = tPts.map((t) => fx + dfx * (t - x))

    // Secant / approximation slope
    let slope: number
    let ptAx: number, ptBx: number
    if (method === 'forward') {
      ptAx = x;      ptBx = x + h
      slope = (preset.fn(ptBx) - preset.fn(ptAx)) / h
    } else if (method === 'backward') {
      ptAx = x - h;  ptBx = x
      slope = (preset.fn(ptBx) - preset.fn(ptAx)) / h
    } else {
      ptAx = x - h;  ptBx = x + h
      slope = (preset.fn(ptBx) - preset.fn(ptAx)) / (2 * h)
    }
    const ptAy = preset.fn(ptAx)
    const ptBy = preset.fn(ptBx)
    const sPts = [ptAx - tLen * 0.4, ptBx + tLen * 0.4]
    const sVals = sPts.map((t) => ptAy + slope * (t - ptAx))

    return {
      curvePts:  { xs, ys },
      secantPts: { xs: sPts, ys: sVals },
      tangentPts:{ xs: tPts, ys: tVals },
      approxPoints: [
        { x: ptAx, y: ptAy, label: method === 'forward' ? 'f(x)' : method === 'backward' ? 'f(x−h)' : 'f(x−h)', color: color },
        { x: ptBx, y: ptBy, label: method === 'forward' ? 'f(x+h)' : method === 'backward' ? 'f(x)' : 'f(x+h)', color: color },
        { x, y: preset.fn(x), label: 'x', color: '#f59e0b' },
      ],
    }
  }, [fnIdx, method, h, xPctRaw]) // eslint-disable-line react-hooks/exhaustive-deps

  const traces: Plotly.Data[] = [
    {
      x: curvePts.xs, y: curvePts.ys,
      type: 'scatter', mode: 'lines',
      line: { color: '#8b5cf6', width: 2.5 },
      name: preset.label,
    },
    {
      x: tangentPts.xs, y: tangentPts.ys,
      type: 'scatter', mode: 'lines',
      line: { color: '#f59e0b', width: 1.5, dash: 'dash' },
      name: 'Exact tangent',
    },
    {
      x: secantPts.xs, y: secantPts.ys,
      type: 'scatter', mode: 'lines',
      line: { color, width: 2, dash: 'dot' },
      name: METHOD_LABEL[method],
    },
    {
      x: approxPoints.map((p) => p.x),
      y: approxPoints.map((p) => p.y),
      text: approxPoints.map((p) => p.label),
      type: 'scatter',
      mode: 'text+markers' as const,
      textposition: 'top center',
      textfont: { color: approxPoints.map((p) => p.color), size: 10 },
      marker: { color: approxPoints.map((p) => p.color), size: 9, symbol: 'circle' },
      showlegend: false,
    },
  ]

  const approxDeriv = (() => {
    if (method === 'forward')  return (preset.fn(x + h) - preset.fn(x)) / h
    if (method === 'backward') return (preset.fn(x) - preset.fn(x - h)) / h
    return (preset.fn(x + h) - preset.fn(x - h)) / (2 * h)
  })()
  const exact = preset.dfn(x)
  const absErr = Math.abs(approxDeriv - exact)

  const controls = (
    <div className="space-y-4">
      <div>
        <p className="section-label mb-2">Function</p>
        <div className="flex flex-wrap gap-2">
          {FN_PRESETS.map((p, i) => (
            <button
              type="button"
              key={p.label}
              onClick={() => { setFnIdx(i); setXPct(50) }}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-mono transition-colors',
                i === fnIdx
                  ? 'bg-brand-600 text-white border border-brand-500'
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="section-label mb-1">
          Evaluation point: x = {x.toFixed(3)}
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={xPctRaw}
          onChange={(e) => setXPct(Number(e.target.value))}
          className="w-full accent-violet-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-0.5">
          <span>{preset.xMin}</span><span>{preset.xMax}</span>
        </div>
      </div>

      <div>
        <p className="section-label mb-2">Step size h = {h}</p>
        <div className="flex flex-wrap gap-1.5">
          {H_OPTIONS.map((hv, i) => (
            <button
              type="button"
              key={hv}
              onClick={() => setHIdx(i)}
              className={clsx(
                'px-2.5 py-1 rounded text-xs font-mono transition-colors',
                i === hIdx
                  ? 'bg-brand-600 text-white border border-brand-500'
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
              )}
            >
              {hv}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        {[
          { label: 'Approx f\'(x)', value: approxDeriv.toFixed(6), color: 'text-violet-300' },
          { label: 'Exact f\'(x)',  value: exact.toFixed(6),        color: 'text-amber-300' },
          { label: 'Abs error',    value: absErr.toExponential(2),  color: 'text-rose-300'  },
        ].map(({ label, value, color: tc }) => (
          <div key={label} className="rounded bg-surface-card p-2">
            <div className={clsx('font-mono font-medium', tc)}>{value}</div>
            <div className="text-slate-500 mt-0.5 text-[10px]">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <InteractiveVisualization
      description={`Adjust x and h to see how ${METHOD_LABEL[method].split('[')[0].trim()} approximates the slope. Amber dashed = exact tangent; colored dotted = secant approximation.`}
      controls={controls}
    >
      <Plot
        data={traces}
        layout={{
          ...DARK_LAYOUT,
          xaxis: { ...DARK_LAYOUT.xaxis, range: [preset.xMin - 0.1, preset.xMax + 0.1], title: { text: 'x', font: { color: '#94a3b8' } } },
          yaxis: { ...DARK_LAYOUT.yaxis, title: { text: 'f(x)', font: { color: '#94a3b8' } } },
        } as Partial<Plotly.Layout>}
        config={PLOTLY_CFG}
        style={{ width: '100%', height: '320px' }}
      />
    </InteractiveVisualization>
  )
}
