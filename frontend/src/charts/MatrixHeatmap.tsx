import Plot from 'react-plotly.js'

interface MatrixHeatmapProps {
  matrix: number[][]
  title?: string
  height?: number
  colorscale?: string
}

export default function MatrixHeatmap({
  matrix, title, height = 320, colorscale = 'RdBu',
}: MatrixHeatmapProps) {
  const n = matrix.length
  const labels = Array.from({ length: n }, (_, i) => `${i + 1}`)

  return (
    <Plot
      data={[{
        z: matrix,
        x: labels,
        y: labels,
        type: 'heatmap',
        colorscale,
        reversescale: true,
        showscale: true,
      }]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor:  'rgba(15,23,42,0.6)',
        font:          { color: '#94a3b8', size: 12 },
        title: title ? { text: title, font: { color: '#e2e8f0', size: 13 } } : undefined,
        xaxis: { title: { text: 'Column' } },
        yaxis: { title: { text: 'Row' }, autorange: 'reversed' },
        margin: { l: 50, r: 16, t: title ? 36 : 16, b: 40 },
        height,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%' }}
    />
  )
}
