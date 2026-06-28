import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx } from 'clsx'
import SectionWrapper from '../shared/SectionWrapper'
import SectionHeader from '../shared/SectionHeader'
import type { EngineeringApplicationConfig } from '@/types/lesson.types'
import { SECTION_MAP } from '@/config/lessonSections'

interface EngineeringApplicationsProps {
  applications: EngineeringApplicationConfig[]
}

const DIFFICULTY_COLOR = {
  introductory: 'text-green-400',
  intermediate:  'text-yellow-400',
  advanced:      'text-red-400',
}

export default function EngineeringApplications({
  applications,
}: EngineeringApplicationsProps) {
  const meta = SECTION_MAP['applications']
  const [selected, setSelected] = useState(0)
  const app = applications[selected]

  return (
    <SectionWrapper id="applications">
      <SectionHeader
        icon={meta.icon}
        title={meta.label}
        subtitle={meta.description}
      />

      {/* Tab selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {applications.map((a, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              i === selected
                ? 'bg-brand-600/20 border border-brand-500/40 text-brand-300'
                : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white',
            )}
          >
            <span>{a.icon}</span>
            {a.field}
          </button>
        ))}
      </div>

      {/* Detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{app.icon}</span>
                <h3 className="text-lg font-semibold text-white">{app.title}</h3>
              </div>
              <p className="text-xs text-slate-500">{app.field}</p>
            </div>
            {app.difficulty && (
              <span className={clsx('text-xs font-medium', DIFFICULTY_COLOR[app.difficulty])}>
                {app.difficulty}
              </span>
            )}
          </div>

          <p className="text-slate-300 leading-relaxed mb-4">{app.description}</p>

          {app.example && (
            <div className="rounded-md bg-slate-900 border border-surface-border px-4 py-3">
              <p className="text-xs text-slate-500 mb-1">Example</p>
              <p className="text-sm text-slate-200 font-mono">{app.example}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  )
}
