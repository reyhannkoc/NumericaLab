import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { AlgorithmStep } from '@/types/numerical.types'
import MathRenderer from '@components/math/MathRenderer'
import Button from '@components/ui/Button'

interface AlgorithmStepperProps {
  steps: AlgorithmStep[]
  title?: string
}

/**
 * Interactive step-by-step algorithm walkthrough.
 * Each step reveals the next action, formula, and description.
 */
export default function AlgorithmStepper({ steps, title = 'Algorithm' }: AlgorithmStepperProps) {
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState<Set<number>>(new Set([0]))

  const go = (idx: number) => {
    setCurrent(idx)
    setRevealed((prev) => new Set([...prev, idx]))
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <div className="flex gap-2 flex-wrap">
        {steps.map((step, i) => (
          <button
            key={step.step}
            onClick={() => go(i)}
            className={`step-badge transition-all ${
              i === current
                ? 'scale-110 shadow-glow-brand'
                : revealed.has(i)
                ? 'opacity-80'
                : 'opacity-30'
            }`}
          >
            {step.step}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <h4 className="font-medium text-brand-300">{steps[current]?.title}</h4>
          <p className="text-sm text-slate-300">{steps[current]?.description}</p>
          {steps[current]?.formula && (
            <div className="formula-box text-base">
              <MathRenderer formula={steps[current].formula!} display />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 pt-1">
        <Button
          variant="secondary"
          size="sm"
          disabled={current === 0}
          onClick={() => go(current - 1)}
        >
          ← Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={current === steps.length - 1}
          onClick={() => go(current + 1)}
        >
          Next →
        </Button>
        <span className="ml-auto text-xs text-slate-500 self-center">
          Step {current + 1} / {steps.length}
        </span>
      </div>
    </div>
  )
}
