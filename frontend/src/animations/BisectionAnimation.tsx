import { motion, AnimatePresence } from 'framer-motion'
import type { RootFindingIteration } from '@/types/api.types'
import FunctionPlot from '@charts/FunctionPlot'

interface BisectionAnimationProps {
  iterations: RootFindingIteration[]
  frame: number
  curveX: number[]
  curveY: number[]
}

/**
 * Visualizes the bisection method step by step.
 * Each frame shows the current [a, b] bracket and midpoint c.
 * Requires a pre-computed function curve from the API.
 */
export default function BisectionAnimation({
  iterations, frame, curveX, curveY,
}: BisectionAnimationProps) {
  const current = iterations[frame]

  const markers = current
    ? [
        { x: current.a ?? 0, y: 0, label: 'a', color: '#10b981' },
        { x: current.b ?? 0, y: 0, label: 'b', color: '#ec4899' },
        { x: current.x ?? 0, y: current.fx, label: 'c', color: '#6366f1' },
      ]
    : []

  return (
    <div className="space-y-3">
      <FunctionPlot
        series={[{ x: curveX, y: curveY, name: 'f(x)', mode: 'lines', color: '#6366f1' }]}
        markers={markers}
        height={320}
      />
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={frame}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 text-xs font-mono glass-card px-4 py-2"
          >
            <span className="text-emerald-300">a = {(current.a ?? 0).toFixed(6)}</span>
            <span className="text-pink-300">b = {(current.b ?? 0).toFixed(6)}</span>
            <span className="text-brand-300">c = {(current.x ?? 0).toFixed(6)}</span>
            <span className="text-slate-400">|error| = {current.error.toExponential(3)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
