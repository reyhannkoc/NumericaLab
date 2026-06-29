import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'

export type ODEMethodProp = 'euler' | 'runge_kutta_4'

interface Props { method: ODEMethodProp }

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

// Demo ODE: dy/dx = y  (exact: y = e^x)
const EXACT_FN  = (x: number) => Math.exp(x)
const ODE_FN    = (_x: number, y: number) => y    // f(x, y) = y
const X0 = 0, Y0 = 1, X_END = 2

function eulerSolve(h: number) {
  const xs: number[] = [X0], ys: number[] = [Y0]
  let x = X0, y = Y0
  while (x < X_END - 1e-12) {
    const step = Math.min(h, X_END - x)
    y = y + step * ODE_FN(x, y)
    x += step
    xs.push(x); ys.push(y)
  }
  return { xs, ys }
}

function rk4Solve(h: number) {
  const xs: number[] = [X0], ys: number[] = [Y0]
  let x = X0, y = Y0
  while (x < X_END - 1e-12) {
    const step = Math.min(h, X_END - x)
    const k1 = ODE_FN(x, y)
    const k2 = ODE_FN(x + step / 2, y + step / 2 * k1)
    const k3 = ODE_FN(x + step / 2, y + step / 2 * k2)
    const k4 = ODE_FN(x + step, y + step * k3)
    y = y + step / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
    x += step
    xs.push(x); ys.push(y)
  }
  return { xs, ys }
}

const EXACT_XS = Array.from({ length: 100 }, (_, i) => X0 + (X_END - X0) * i / 99)
const EXACT_YS = EXACT_XS.map(EXACT_FN)

export default function ODEVisualization({ method }: Props) {
  const isEuler = method === 'euler'
  const color = '#84cc16'

  const h1 = isEuler ? 0.5 : 0.5
  const h2 = isEuler ? 0.25 : 0.25
  const solve = isEuler ? eulerSolve : rk4Solve
  const sol1 = solve(h1)
  const sol2 = solve(h2)

  const exactTrace: Plotly.Data = {
    x: EXACT_XS, y: EXACT_YS,
    type: 'scatter', mode: 'lines',
    name: 'Exact y = eˣ',
    line: { color: '#8b5cf6', width: 3, dash: 'dash' },
  }

  const traces: Plotly.Data[] = [
    exactTrace,
    {
      x: sol1.xs, y: sol1.ys,
      type: 'scatter', mode: 'lines+markers',
      name: `${isEuler ? 'Euler' : 'RK4'} h=${h1}`,
      line: { color: color, width: 2 },
      marker: { color, size: 6 },
    } as Plotly.Data,
    {
      x: sol2.xs, y: sol2.ys,
      type: 'scatter', mode: 'lines+markers',
      name: `${isEuler ? 'Euler' : 'RK4'} h=${h2}`,
      line: { color: '#f97316', width: 2, dash: 'dot' },
      marker: { color: '#f97316', size: 6 },
    } as Plotly.Data,
  ]

  const e1 = Math.abs(sol1.ys[sol1.ys.length - 1] - EXACT_FN(X_END))
  const e2 = Math.abs(sol2.ys[sol2.ys.length - 1] - EXACT_FN(X_END))
  const ratio = e1 / e2
  const expectedRatio = isEuler ? 2 : 16

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">dy/dx = y, y(0) = 1 — exact: y = eˣ</span>
          <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: color + '22', color }}>
            {isEuler ? 'O(h) — first order' : 'O(h⁴) — fourth order'}
          </span>
        </div>
        <Plot
          data={traces}
          layout={{
            ...DARK_LAYOUT,
            yaxis: { ...DARK_LAYOUT.yaxis, title: { text: 'y(x)', font: { color: '#94a3b8' } } },
            xaxis: { ...DARK_LAYOUT.xaxis, title: { text: 'x', font: { color: '#94a3b8' } } },
          } as Partial<Plotly.Layout>}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '260px' }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: `Error h=${h1}`, value: e1.toExponential(3), color },
          { label: `Error h=${h2}`, value: e2.toExponential(3), color: '#f97316' },
          {
            label: 'Error ratio',
            value: ratio.toFixed(1),
            color: Math.abs(ratio - expectedRatio) < expectedRatio * 0.2 ? '#4ade80' : '#f87171',
          },
        ].map(m => (
          <div key={m.label} className="glass-card rounded-lg px-3 py-2">
            <div className="text-xs text-slate-400 mb-1">{m.label}</div>
            <div className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 text-center">
        Expected ratio ≈ {expectedRatio} → confirms {isEuler ? 'O(h) first-order' : 'O(h⁴) fourth-order'} convergence
      </p>
    </div>
  )
}
