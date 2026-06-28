import Plot from 'react-plotly.js'

interface ComparisonBarChartProps {
  methods: string[]
  values: number[]
  metric: string
  colors?: string[]
  height?: number
  logScale?: boolean
}

const DEFAULT_COLORS = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#14b8a6']

export default function ComparisonBarChart({
  methods, values, metric, colors, height = 280, logScale = false,
}: ComparisonBarChartProps) {
  const palette = colors ?? DEFAULT_COLORS

  return (
    <Plot
      data={[{
        x: methods,
        y: values,
        type: 'bar',
        marker: { color: palette.slice(0, methods.length) },
      }]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor:  'rgba(15,23,42,0.6)',
        font:          { color: '#94a3b8', size: 12 },
        xaxis: { tickfont: { color: '#94a3b8' }, gridcolor: '#1e293b' },
        yaxis: {
          title: { text: metric },
          type: logScale ? 'log' : 'linear',
          gridcolor: '#1e293b',
          tickfont: { color: '#64748b' },
        },
        margin: { l: 60, r: 16, t: 16, b: 40 },
        height,
        bargap: 0.3,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%' }}
    />
  )
}
