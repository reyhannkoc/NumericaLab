import { motion, AnimatePresence } from 'framer-motion'
import type { RowOperation } from '@/types/api.types'
import MatrixHeatmap from '@charts/MatrixHeatmap'

interface GaussianEliminationAnimationProps {
  operations: RowOperation[]
  frame: number
}

/**
 * Shows the augmented matrix transforming step by step via
 * Gaussian elimination row operations.
 */
export default function GaussianEliminationAnimation({
  operations, frame,
}: GaussianEliminationAnimationProps) {
  const current = operations[frame]

  return (
    <div className="space-y-3">
      {current && (
        <>
          <MatrixHeatmap matrix={current.matrix_state} title="Augmented Matrix State" height={280} />
          <AnimatePresence mode="wait">
            <motion.div
              key={frame}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card px-4 py-2 text-sm"
            >
              <span className="text-slate-400 mr-2">Step {frame + 1}:</span>
              <span className="text-brand-300">{current.description}</span>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
