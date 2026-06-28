import { motion } from 'framer-motion'
import type { IntegrationInterval } from '@/types/api.types'
import IntegrationAreaChart from '@charts/IntegrationAreaChart'

interface RiemannSumAnimationProps {
  curveX: number[]
  curveY: number[]
  intervals: IntegrationInterval[]
  frame: number
  total: number
}

/**
 * Progressively reveals integration sub-intervals, frame by frame.
 * Demonstrates how the sum accumulates as intervals are added.
 */
export default function RiemannSumAnimation({
  curveX, curveY, intervals, frame,
}: RiemannSumAnimationProps) {
  const visibleIntervals = intervals.slice(0, frame + 1)
  const partialSum = visibleIntervals.reduce((acc, iv) => acc + iv.area, 0)

  return (
    <div className="space-y-3">
      <IntegrationAreaChart curveX={curveX} curveY={curveY} intervals={visibleIntervals} height={320} />
      <motion.div
        key={frame}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 text-xs font-mono glass-card px-4 py-2"
      >
        <span className="text-slate-400">Intervals shown: {frame + 1}</span>
        <span className="text-brand-300">Partial sum ≈ {partialSum.toFixed(6)}</span>
      </motion.div>
    </div>
  )
}
