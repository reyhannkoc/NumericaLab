import { useState, useMemo, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { clsx } from 'clsx'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'
import type { InterpolationMethod } from '@/types/api.types'

type InterpMethod = Extract<InterpolationMethod, 'lagrange' | 'cubic_spline'>

// ─── Preset datasets ──────────────────────────────────────────────────────────

interface Preset {
  label: string
  display: string
  xs: number[]
  ys: number[]
  plotMin: number
  plotMax: number
}

const PRESETS: Preset[] = [
  {
    label: 'sin(x)',
    display: 'sin(x) sampled at 6 points',
    xs: [0, 1, 2, 3, 4, 5],
    ys: [0, 0.8415, 0.9093, 0.1411, -0.7568, -0.9589],
    plotMin: -0.2, plotMax: 5.2,
  },
  {
    label: 'x²',
    display: 'x² sampled at 5 points',
    xs: [0, 1, 2, 3, 4],
    ys: [0, 1, 4, 9, 16],
    plotMin: -0.2, plotMax: 4.2,
  },
  {
    label: 'eˣ',
    display: 'eˣ sampled at 4 points',
    xs: [0, 1, 2, 3],
    ys: [1, 2.718, 7.389, 20.086],
    plotMin: -0.2, plotMax: 3.2,
  },
  {
    label: 'Runge',
    display: '1/(1+x²) — Runge function on [-3,3]',
    xs: [-3, -2, -1, 0, 1, 2, 3],
    ys: [0.1, 0.2, 0.5, 1.0, 0.5, 0.2, 0.1],
    plotMin: -3.2, plotMax: 3.2,
  },
  {
    label: 'Oscillating',
    display: 'Oscillating data — tests stability',
    xs: [0, 1, 2, 3, 4],
    ys: [1, -1, 2, -2, 1],
    plotMin: -0.2, plotMax: 4.2,
  },
]

// ─── Local Lagrange evaluation ────────────────────────────────────────────────

function lagrangeEval(xs: number[], ys: number[], x: number): number {
  let result = 0
  for (let i = 0; i < xs.length; i++) {
    let L = 1
    for (let j = 0; j < xs.length; j++) {
      if (j !== i) L *= (x - xs[j]) / (xs[i] - xs[j])
    }
    result += ys[i] * L
  }
  return result
}

// ─── Local natural cubic spline (Thomas algorithm) ────────────────────────────

function naturalCubicSpline(xs: number[], ys: number[]): (x: number) => number {
  const n = xs.length - 1
  if (n < 1) return () => ys[0]
  if (n === 1) {
    const slope = (ys[1] - ys[0]) / (xs[1] - xs[0])
    return (x) => ys[0] + slope * (x - xs[0])
  }

  const h = xs.map((_, i) => i < n ? xs[i + 1] - xs[i] : 0)

  // Right-hand side
  const rhs = Array(n - 1).fill(0)
  for (let i = 1; i < n; i++) {
    rhs[i - 1] = 6 * ((ys[i + 1] - ys[i]) / h[i] - (ys[i] - ys[i - 1]) / h[i - 1])
  }

  // Tridiagonal system (natural BC: M[0]=M[n]=0)
  const diag = Array(n - 1).fill(0).map((_, i) => 2 * (h[i] + h[i + 1]))
  const upper = h.slice(1, n - 1)
  const lower = h.slice(1, n - 1)

  // Thomas forward sweep
  const c2 = [...upper]
  const d2 = [...rhs]
  for (let i = 1; i < n - 1; i++) {
    const w = lower[i - 1] / diag[i - 1]
    diag[i] -= w * c2[i - 1]
    d2[i] -= w * d2[i - 1]
  }

  // Back substitution
  const M = Array(n + 1).fill(0)
  M[n - 1] = d2[n - 2] / diag[n - 2]
  for (let i = n - 3; i >= 0; i--) {
    M[i + 1] = (d2[i] - c2[i] * M[i + 2]) / diag[i]
  }

  // Coefficients
  const a = ys.slice(0, n)
  const b = Array(n).fill(0)
  const c = Array(n).fill(0)
  const d = Array(n).fill(0)

  for (let i = 0; i < n; i++) {
    a[i] = ys[i]
    c[i] = M[i] / 2
    d[i] = (M[i + 1] - M[i]) / (6 * h[i])
    b[i] = (ys[i + 1] - ys[i]) / h[i] - h[i] * (2 * M[i] + M[i + 1]) / 6
  }

  return (x: number) => {
    let seg = 0
    for (let i = 0; i < n - 1; i++) {
      if (x >= xs[i] && x < xs[i + 1]) { seg = i; break }
      if (i === n - 2) seg = n - 1
    }
    if (x >= xs[n]) seg = n - 1
    if (x <= xs[0]) seg = 0
    const dx = x - xs[seg]
    return a[seg] + b[seg] * dx + c[seg] * dx * dx + d[seg] * dx * dx * dx
  }
}

// ─── Build curve data ─────────────────────────────────────────────────────────

function buildCurve(method: InterpMethod, xs: number[], ys: number[], plotMin: number, plotMax: number) {
  const N = 300
  const xCurve = Array.from({ length: N }, (_, i) => plotMin + (plotMax - plotMin) * i / (N - 1))

  let yCurve: number[]
  if (method === 'lagrange') {
    yCurve = xCurve.map((x) => lagrangeEval(xs, ys, x))
  } else {
    const splineFn = naturalCubicSpline(xs, ys)
    yCurve = xCurve.map(splineFn)
  }

  return { xCurve, yCurve }
}

// ─── Plotly config ────────────────────────────────────────────────────────────

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 55, r: 20, t: 30, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.65, y: 0.98 },
}
const PLOTLY_CONFIG = { displayModeBar: false, responsive: true }

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { method: InterpMethod }

export default function InterpolationVisualization({ method }: Props) {
  const [presetIdx, setPresetIdx] = useState(0)
  const [numPoints, setNumPoints] = useState(3)

  const preset = PRESETS[presetIdx]

  // Cap numPoints to available preset points
  const maxPts = preset.xs.length
  const activePts = Math.min(numPoints, maxPts)

  useEffect(() => {
    setNumPoints(Math.min(3, preset.xs.length))
  }, [presetIdx])

  const activeXs = preset.xs.slice(0, activePts)
  const activeYs = preset.ys.slice(0, activePts)

  const { xCurve, yCurve } = useMemo(
    () => buildCurve(method, activeXs, activeYs, preset.plotMin, preset.plotMax),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [method, presetIdx, activePts],
  )

  const traces: Plotly.Data[] = [
    {
      x: xCurve, y: yCurve,
      type: 'scatter', mode: 'lines',
      line: { color: method === 'lagrange' ? '#60a5fa' : '#34d399', width: 2.5 },
      name: method === 'lagrange' ? `Lagrange P${activePts - 1}(x)` : 'Cubic Spline',
    },
    {
      x: activeXs, y: activeYs,
      type: 'scatter', mode: 'markers',
      marker: { color: '#f59e0b', size: 9, symbol: 'circle', line: { color: '#fff', width: 1 } },
      name: 'Data points',
    },
  ]

  const methodLabel = method === 'lagrange' ? 'Lagrange' : 'Cubic Spline'

  const description =
    method === 'lagrange'
      ? `Using ${activePts} data points → degree-${activePts - 1} Lagrange polynomial. Add more points to see how the polynomial changes.`
      : `Cubic spline through ${activePts} data points (natural boundary conditions). Note the smooth joins.`

  const controls = (
    <div className="space-y-4">
      <div>
        <p className="section-label mb-2">Dataset</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button
              type="button"
              key={p.label}
              onClick={() => setPresetIdx(i)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-mono transition-colors',
                i === presetIdx
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
        <p className="section-label mb-2">
          {methodLabel} — using {activePts} of {maxPts} points
          {method === 'lagrange' ? ` (degree ${activePts - 1})` : ''}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNumPoints((v) => Math.max(2, v - 1))}
            disabled={activePts <= 2}
            className="icon-btn disabled:opacity-30"
          >◀</button>
          <div className="flex-1 h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{ width: `${((activePts - 2) / (maxPts - 2)) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setNumPoints((v) => Math.min(maxPts, v + 1))}
            disabled={activePts >= maxPts}
            className="icon-btn disabled:opacity-30"
          >▶</button>
        </div>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{description}</p>
      </div>
    </div>
  )

  return (
    <InteractiveVisualization
      description={`Step through the effect of adding data points on the ${methodLabel} interpolant. Observe Runge's phenomenon on the "Runge" preset for Lagrange at high degree.`}
      controls={controls}
    >
      <Plot
        data={traces}
        layout={{
          ...DARK_LAYOUT,
          xaxis: { ...DARK_LAYOUT.xaxis, range: [preset.plotMin, preset.plotMax], title: { text: 'x', font: { color: '#94a3b8' } } },
          yaxis: { ...DARK_LAYOUT.yaxis, title: { text: 'y', font: { color: '#94a3b8' } } },
        } as Partial<Plotly.Layout>}
        config={PLOTLY_CONFIG}
        style={{ width: '100%', height: '320px' }}
      />
    </InteractiveVisualization>
  )
}
