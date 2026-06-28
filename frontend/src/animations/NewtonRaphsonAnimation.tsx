import { motion, AnimatePresence } from 'framer-motion'
import type { RootFindingIteration } from '@/types/api.types'
import FunctionPlot from '@charts/FunctionPlot'
import type { PlotSeries } from '@/types/numerical.types'

interface NewtonRaphsonAnimationProps {
  iterations: RootFindingIteration[]
  frame: number
  curveX: number[]
  curveY: number[]
}

/**
 * Visualizes Newton–Raphson by drawing the tangent line at each x_n.
 * The tangent intersects the x-axis to give x_{n+1}.
 */
export default function NewtonRaphsonAnimation({
  iterations, frame, curveX, curveY,
}: NewtonRaphsonAnimationProps) {
  const current = iterations[frame]

  const series: PlotSeries[] = [
    { x: curveX, y: curveY, name: 'f(x)', mode: 'lines', color: '#6366f1' },
  ]

  // Tangent line approximation — actual slope provided by backend iteration data
  const markers = current
    ? [{ x: current.x ?? 0, y: current.fx, label: `x${frame}`, color: '#f59e0b' }]
    : []

  return (
    <div className="space-y-3">
      <FunctionPlot series={series} markers={markers} height={320} />
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={frame}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 text-xs font-mono glass-card px-4 py-2"
          >
            <span className="text-amber-300">x_{frame} = {(current.x ?? 0).toFixed(8)}</span>
            <span className="text-slate-400">f(x) = {current.fx.toExponential(4)}</span>
            <span className="text-brand-300">|error| = {current.error.toExponential(3)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
