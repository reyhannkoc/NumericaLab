import { motion } from 'framer-motion'
import type { ConvergenceData } from '@/types/numerical.types'

interface ConvergenceIndicatorProps {
  data: ConvergenceData[]
  converged?: boolean
  finalError?: number
  totalIterations?: number
}

export default function ConvergenceIndicator({
  converged,
  finalError,
  totalIterations,
}: ConvergenceIndicatorProps) {
  return (
    <div className="glass-card p-4 flex flex-wrap gap-4">
      {/* Status chip */}
      <div className="flex items-center gap-2">
        <motion.div
          className={`w-2.5 h-2.5 rounded-full ${converged ? 'bg-emerald-400' : 'bg-red-400'}`}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <span className="text-sm font-medium">
          {converged === undefined ? 'Not run' : converged ? 'Converged' : 'Did not converge'}
        </span>
      </div>

      {finalError !== undefined && (
        <div className="text-sm">
          <span className="text-slate-500 mr-1">Final error:</span>
          <span className="font-mono text-brand-300">{finalError.toExponential(4)}</span>
        </div>
      )}

      {totalIterations !== undefined && (
        <div className="text-sm">
          <span className="text-slate-500 mr-1">Iterations:</span>
          <span className="font-mono text-brand-300">{totalIterations}</span>
        </div>
      )}
    </div>
  )
}
