import Plot from 'react-plotly.js'

interface IntegrationAreaChartProps {
  curveX: number[]
  curveY: number[]
  intervals?: { x_start: number; x_end: number; area: number }[]
  height?: number
}

/**
 * Renders the integrand curve with shaded sub-interval areas.
 * Visually demonstrates Riemann-type numerical integration.
 */
export default function IntegrationAreaChart({
  curveX, curveY, intervals = [], height = 340,
}: IntegrationAreaChartProps) {
  const funcTrace = {
    x: curveX, y: curveY, name: 'f(x)',
    type: 'scatter' as const, mode: 'lines' as const,
    line: { color: '#6366f1', width: 2.5 },
  }

  const areaTraces = intervals.map((iv, i) => ({
    x: [iv.x_start, iv.x_start, iv.x_end, iv.x_end],
    y: [0, iv.area / (iv.x_end - iv.x_start), iv.area / (iv.x_end - iv.x_start), 0],
    type: 'scatter' as const,
    mode: 'none' as const,
    fill: 'tozeroy' as const,
    fillcolor: i % 2 === 0 ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.10)',
    showlegend: false,
  }))

  return (
    <Plot
      data={[...areaTraces, funcTrace]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor:  'rgba(15,23,42,0.6)',
        font:          { color: '#94a3b8', size: 12 },
        xaxis: { title: { text: 'x' }, gridcolor: '#1e293b', tickfont: { color: '#64748b' } },
        yaxis: { title: { text: 'f(x)' }, gridcolor: '#1e293b', tickfont: { color: '#64748b' } },
        margin: { l: 50, r: 16, t: 16, b: 40 },
        height,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%' }}
    />
  )
}
