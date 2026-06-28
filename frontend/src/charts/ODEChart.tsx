import Plot from 'react-plotly.js'
import type { ODEResult } from '@/types/api.types'

interface ODEChartProps {
  results: ODEResult[]
  methodNames: string[]
  colors?: string[]
  height?: number
  showExact?: boolean
}

const DEFAULT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899']

export default function ODEChart({
  results, methodNames, colors, height = 340, showExact = true,
}: ODEChartProps) {
  const palette = colors ?? DEFAULT_COLORS

  const traces = results.flatMap((res, i) => {
    const t: Plotly.Data[] = [{
      x: res.x_values,
      y: res.y_values,
      name: methodNames[i],
      type: 'scatter',
      mode: 'lines',
      line: { color: palette[i], width: 2 },
    }]
    if (showExact && res.exact_values) {
      t.push({
        x: res.x_values,
        y: res.exact_values,
        name: 'Exact',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#94a3b8', width: 1.5, dash: 'dot' },
        showlegend: i === 0,
      })
    }
    return t
  })

  return (
    <Plot
      data={traces}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor:  'rgba(15,23,42,0.6)',
        font:          { color: '#94a3b8', size: 12 },
        xaxis: { title: { text: 'x' }, gridcolor: '#1e293b', tickfont: { color: '#64748b' } },
        yaxis: { title: { text: 'y(x)' }, gridcolor: '#1e293b', tickfont: { color: '#64748b' } },
        legend: { bgcolor: 'rgba(30,41,59,0.8)', bordercolor: '#334155', borderwidth: 1 },
        margin: { l: 50, r: 16, t: 16, b: 40 },
        height,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%' }}
    />
  )
}
