import Plot from 'react-plotly.js'
import type { ComparisonResult } from '@/types/laboratory.types'

interface ConvergenceChartProps {
  results: ComparisonResult[]
  height?: number
}

const METHOD_COLORS = ['#818cf8', '#34d399', '#fb923c', '#c084fc', '#facc15', '#60a5fa']

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'transparent',
  font:          { color: '#94a3b8', size: 11 },
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
    type: 'log',
    gridcolor: '#1e293b',
    color: '#475569',
    showline: true,
    linecolor: '#1e293b',
    zeroline: false,
    exponentformat: 'power',
  },
  legend: {
    bgcolor: 'transparent',
    font: { color: '#94a3b8', size: 10 },
    x: 1,
    xanchor: 'right',
    y: 1,
  },
  margin: { l: 55, r: 20, t: 20, b: 45 },
}

export default function ConvergenceChart({ results, height = 300 }: ConvergenceChartProps) {
  const traces = results
    .filter((r) => r.convergenceHistory.length > 0)
    .map((r, i) => ({
      x: Array.from({ length: r.convergenceHistory.length }, (_, k) => k + 1),
      y: r.convergenceHistory.map((e) => Math.max(e, 1e-20)),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: r.methodName,
      line:   { color: METHOD_COLORS[i % METHOD_COLORS.length], width: 2 },
      marker: { color: METHOD_COLORS[i % METHOD_COLORS.length], size: 4 },
    }))

  if (traces.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-slate-500 text-sm italic"
        style={{ height }}
      >
        No convergence data yet.
      </div>
    )
  }

  return (
    <Plot
      data={traces}
      layout={{ ...DARK_LAYOUT, height }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%' }}
    />
  )
}
