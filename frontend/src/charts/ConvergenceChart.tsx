import Plot from 'react-plotly.js'
import type { ConvergenceData } from '@/types/numerical.types'

interface ConvergenceChartProps {
  data: ConvergenceData[]
  height?: number
  logScale?: boolean
}

/**
 * Plots |error| vs iteration count, optionally on a log scale.
 * Accepts multiple methods to overlay their convergence curves.
 */
export default function ConvergenceChart({
  data,
  height = 300,
  logScale = true,
}: ConvergenceChartProps) {
  const traces = data.map((d) => ({
    x: d.iterations,
    y: d.errors,
    name: d.method,
    type: 'scatter' as const,
    mode: 'lines+markers' as const,
    line: { color: d.color, width: 2 },
    marker: { color: d.color, size: 5 },
  }))

  return (
    <Plot
      data={traces}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor:  'rgba(15,23,42,0.6)',
        font:          { color: '#94a3b8', size: 12 },
        xaxis: {
          title: { text: 'Iteration' },
          gridcolor: '#1e293b',
          tickfont: { color: '#64748b' },
        },
        yaxis: {
          title: { text: 'Absolute Error' },
          type: logScale ? 'log' : 'linear',
          gridcolor: '#1e293b',
          tickfont: { color: '#64748b' },
        },
        legend: { bgcolor: 'rgba(30,41,59,0.8)', bordercolor: '#334155', borderwidth: 1 },
        margin: { l: 60, r: 16, t: 16, b: 40 },
        height,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%' }}
    />
  )
}
