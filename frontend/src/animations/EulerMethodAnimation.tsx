import { motion } from 'framer-motion'
import Plot from 'react-plotly.js'
import type { ODEResult } from '@/types/api.types'

interface EulerMethodAnimationProps {
  result: ODEResult
  frame: number
}

/**
 * Animates Euler's method by incrementally plotting each step.
 * Shows how the approximate solution diverges from the exact solution.
 */
export default function EulerMethodAnimation({ result, frame }: EulerMethodAnimationProps) {
  const xVis = result.x_values.slice(0, frame + 1)
  const yVis = result.y_values.slice(0, frame + 1)

  const traces: Plotly.Data[] = [
    {
      x: xVis,
      y: yVis,
      name: "Euler's",
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#6366f1', width: 2 },
      marker: { color: '#6366f1', size: 5 },
    },
  ]

  if (result.exact_values) {
    traces.push({
      x: result.x_values,
      y: result.exact_values,
      name: 'Exact',
      type: 'scatter',
      mode: 'lines',
      line: { color: '#94a3b8', width: 1.5, dash: 'dot' },
    })
  }

  return (
    <div className="space-y-3">
      <Plot
        data={traces}
        layout={{
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor:  'rgba(15,23,42,0.6)',
          font:          { color: '#94a3b8', size: 12 },
          xaxis: { title: { text: 'x' }, gridcolor: '#1e293b', tickfont: { color: '#64748b' } },
          yaxis: { title: { text: 'y' }, gridcolor: '#1e293b', tickfont: { color: '#64748b' } },
          legend: { bgcolor: 'rgba(30,41,59,0.8)', bordercolor: '#334155', borderwidth: 1 },
          margin: { l: 50, r: 16, t: 16, b: 40 },
          height: 320,
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%' }}
      />
      <motion.div
        key={frame}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs font-mono glass-card px-4 py-2 flex gap-4"
      >
        <span className="text-slate-400">Step: {frame + 1}</span>
        <span className="text-brand-300">x = {(xVis[frame] ?? 0).toFixed(4)}</span>
        <span className="text-brand-300">y ≈ {(yVis[frame] ?? 0).toFixed(6)}</span>
      </motion.div>
    </div>
  )
}
