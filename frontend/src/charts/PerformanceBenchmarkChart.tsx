import Plot from 'react-plotly.js'
import type { BenchmarkResult } from '@/types/api.types'

interface PerformanceBenchmarkChartProps {
  results: BenchmarkResult[]
  height?: number
}

const COLORS = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#14b8a6']

export default function PerformanceBenchmarkChart({ results, height = 320 }: PerformanceBenchmarkChartProps) {
  return (
    <Plot
      data={[
        {
          x: results.map((r) => r.method),
          y: results.map((r) => r.mean_time_ms),
          error_y: { type: 'data', array: results.map((r) => r.std_time_ms), visible: true },
          type: 'bar',
          marker: { color: COLORS.slice(0, results.length) },
          name: 'Mean Time (ms)',
        },
      ]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor:  'rgba(15,23,42,0.6)',
        font:          { color: '#94a3b8', size: 12 },
        xaxis: { tickfont: { color: '#94a3b8' }, gridcolor: '#1e293b' },
        yaxis: { title: { text: 'Time (ms)' }, gridcolor: '#1e293b', tickfont: { color: '#64748b' } },
        margin: { l: 60, r: 16, t: 16, b: 40 },
        height,
        bargap: 0.3,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%' }}
    />
  )
}
