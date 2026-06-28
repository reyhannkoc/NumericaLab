import Plot from 'react-plotly.js'
import type { PlotSeries } from '@/types/numerical.types'
import { usePlotData } from '@hooks/usePlotData'

interface FunctionPlotProps {
  series: PlotSeries[]
  title?: string
  xLabel?: string
  yLabel?: string
  height?: number
  showZeroLine?: boolean
  markers?: { x: number; y: number; label: string; color: string }[]
}

const DARK_LAYOUT = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor:  'rgba(15,23,42,0.6)',
  font:          { color: '#94a3b8', family: 'Inter, sans-serif', size: 12 },
  xaxis: {
    gridcolor: '#1e293b',
    zerolinecolor: '#334155',
    tickfont: { color: '#64748b' },
  },
  yaxis: {
    gridcolor: '#1e293b',
    zerolinecolor: '#334155',
    tickfont: { color: '#64748b' },
  },
  legend: {
    bgcolor: 'rgba(30,41,59,0.8)',
    bordercolor: '#334155',
    borderwidth: 1,
  },
  margin: { l: 50, r: 16, t: 36, b: 40 },
}

/**
 * Primary plot component for rendering mathematical functions, roots,
 * iteration points, and method-specific visual elements.
 */
export default function FunctionPlot({
  series,
  title,
  xLabel = 'x',
  yLabel = 'y',
  height = 360,
  markers = [],
}: FunctionPlotProps) {
  const traces = usePlotData(series)

  const markerTrace = markers.length > 0
    ? [{
        x: markers.map((m) => m.x),
        y: markers.map((m) => m.y),
        text: markers.map((m) => m.label),
        type: 'scatter' as const,
        mode: 'text+markers' as const,
        textposition: 'top center',
        marker: { color: markers.map((m) => m.color), size: 10, symbol: 'circle' },
        showlegend: false,
      }]
    : []

  return (
    <Plot
      data={[...traces, ...markerTrace] as Plotly.Data[]}
      layout={{
        ...DARK_LAYOUT,
        title: title ? { text: title, font: { color: '#e2e8f0', size: 14 } } : undefined,
        xaxis: { ...DARK_LAYOUT.xaxis, title: { text: xLabel } },
        yaxis: { ...DARK_LAYOUT.yaxis, title: { text: yLabel } },
        height,
      }}
      config={{ responsive: true, displayModeBar: true, displaylogo: false }}
      style={{ width: '100%' }}
    />
  )
}
