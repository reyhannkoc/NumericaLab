import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx } from 'clsx'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { ChallengeItem } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface InteractiveChallengesProps {
  challenges: ChallengeItem[]
}

const DIFFICULTY_COLOR = {
  easy:   'text-green-400',
  medium: 'text-yellow-400',
  hard:   'text-red-400',
}

export default function InteractiveChallenges({ challenges }: InteractiveChallengesProps) {
  const meta = SECTION_MAP['challenges']
  const [selected, setSelected] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const challenge = challenges[selected]

  const handleSelectChallenge = (i: number) => {
    setSelected(i)
    setCurrentStep(0)
  }

  return (
    <SectionWrapper id="challenges">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Challenge list */}
        <div className="space-y-2">
          {challenges.map((c, i) => (
            <button
              type="button"
              key={c.id}
              onClick={() => handleSelectChallenge(i)}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-lg border transition-all',
                i === selected
                  ? 'bg-brand-600/10 border-brand-500/40 text-white'
                  : 'bg-surface-card border-surface-border text-slate-400 hover:text-white hover:border-slate-600',
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{c.title}</span>
                <span className={clsx('text-xs', DIFFICULTY_COLOR[c.difficulty])}>
                  {c.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
            </button>
          ))}
        </div>

        {/* Active challenge */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-white mb-1">
              {challenge.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">{challenge.objective}</p>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-1 mb-5">
            {challenge.steps.map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'h-1 flex-1 rounded-full transition-colors',
                  i < currentStep
                    ? 'bg-brand-500'
                    : i === currentStep
                    ? 'bg-brand-400'
                    : 'bg-surface-border',
                )}
              />
            ))}
          </div>

          {/* Current step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="glass-card p-4 mb-4 border-l-2 border-brand-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-brand-400">
                    Step {currentStep + 1} of {challenge.steps.length}
                  </span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {challenge.steps[currentStep].instruction}
                </p>
                {challenge.steps[currentStep].expectedOutcome && (
                  <p className="text-xs text-slate-500 mt-2 italic">
                    Expected: {challenge.steps[currentStep].expectedOutcome}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium
                         bg-surface-card border border-surface-border
                         text-slate-400 hover:text-white transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentStep < challenge.steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium
                           bg-brand-600 hover:bg-brand-500 text-white transition-colors"
              >
                Next Step →
              </button>
            ) : (
              <span className="text-xs text-green-400 font-medium">
                ✓ Challenge complete!
              </span>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
