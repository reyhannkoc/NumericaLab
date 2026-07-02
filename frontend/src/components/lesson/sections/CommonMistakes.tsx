import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx } from 'clsx'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { CommonMistakeItem } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface CommonMistakesProps {
  mistakes: CommonMistakeItem[]
}

export default function CommonMistakes({ mistakes }: CommonMistakesProps) {
  const meta = SECTION_MAP['mistakes']
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <SectionWrapper id="mistakes">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      <div className="space-y-2">
        {mistakes.map((mistake) => {
          const isOpen = expanded === mistake.id

          return (
            <div key={mistake.id} className="glass-card overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : mistake.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left
                           hover:bg-surface-hover/30 transition-colors"
              >
                <span className="text-lg shrink-0">
                  {mistake.icon ?? '⚠'}
                </span>
                <span className="text-sm font-medium text-slate-200 flex-1">
                  {mistake.title}
                </span>
                <span
                  className={clsx(
                    'text-slate-500 text-xs transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                >
                  ▼
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-surface-border pt-3 space-y-3">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {mistake.description}
                      </p>

                      {mistake.wrongApproach && (
                        <div className="rounded-md bg-red-950/30 border border-red-500/20 px-3 py-2">
                          <p className="text-xs text-red-400 font-semibold mb-1">✗ Wrong</p>
                          <p className="text-sm text-slate-300 font-mono">
                            {mistake.wrongApproach}
                          </p>
                        </div>
                      )}

                      {mistake.correctApproach && (
                        <div className="rounded-md bg-green-950/30 border border-green-500/20 px-3 py-2">
                          <p className="text-xs text-green-400 font-semibold mb-1">✓ Correct</p>
                          <p className="text-sm text-slate-300 font-mono">
                            {mistake.correctApproach}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
