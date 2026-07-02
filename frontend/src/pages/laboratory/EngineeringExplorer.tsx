import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx } from 'clsx'
import { LAB_DEFINITIONS, ENGINEERING_DISCIPLINES } from '@/config/laboratory'
import { LabPageHeader } from '@/components/laboratory'
import type { EngineeringDiscipline } from '@/types/laboratory.types'

const lab = LAB_DEFINITIONS.find((l) => l.id === 'engineering')!

export default function EngineeringExplorer() {
  const [selected, setSelected] = useState<EngineeringDiscipline>(ENGINEERING_DISCIPLINES[0])

  return (
    <div>
      <LabPageHeader
        icon={lab.icon}
        title={lab.title}
        subtitle={lab.subtitle}
        badge={lab.badge}
        badgeColor={lab.color}
        description="Choose an engineering discipline to see which numerical methods it relies on and explore real-world application examples."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Discipline selector */}
        <div className="lg:col-span-1 space-y-2">
          <p className="section-label px-1 mb-3">Disciplines</p>
          {ENGINEERING_DISCIPLINES.map((d) => (
            <button
              type="button"
              key={d.id}
              onClick={() => setSelected(d)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                d.id === selected.id
                  ? 'text-white bg-surface-hover'
                  : 'text-slate-400 hover:text-white hover:bg-surface-hover/60',
              )}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg text-base shrink-0"
                style={{
                  backgroundColor: d.id === selected.id ? `${d.color}20` : 'transparent',
                  border: d.id === selected.id ? `1px solid ${d.color}35` : '1px solid transparent',
                }}
              >
                {d.icon}
              </span>
              <span className="text-sm font-medium truncate">{d.name}</span>
            </button>
          ))}

          <div className="glass-card p-3 mt-4">
            <p className="text-xs text-slate-500">More disciplines coming soon — Robotics, Computer Engineering, and more.</p>
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Discipline header */}
              <div
                className="glass-card p-5 border-l-2"
                style={{ borderColor: selected.color }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{selected.icon}</span>
                  <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{selected.description}</p>
              </div>

              {/* Methods used */}
              <div className="glass-card p-4">
                <h3 className="section-label mb-3">Numerical Methods Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.usedMethods.map((method) => (
                    <span
                      key={method}
                      className="inline-flex px-3 py-1 rounded-full text-xs font-medium border"
                      style={{
                        color: selected.color,
                        backgroundColor: `${selected.color}10`,
                        borderColor: `${selected.color}30`,
                      }}
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Application cards */}
              <div>
                <h3 className="section-label mb-3">Applications ({selected.applications.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selected.applications.map((app) => (
                    <div
                      key={app.id}
                      className={clsx(
                        'glass-card p-4',
                        app.placeholder && 'opacity-60',
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{app.icon}</span>
                          <h4 className="text-sm font-semibold text-white">{app.title}</h4>
                        </div>
                        {app.placeholder && (
                          <span className="text-xs text-slate-600 shrink-0">Coming soon</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{app.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {app.usedMethods.map((m) => (
                          <span
                            key={m}
                            className="text-xs px-2 py-0.5 rounded bg-surface-card border border-surface-border text-slate-500"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                      {!app.placeholder && (
                        <button
                          type="button"
                          className="mt-3 text-xs font-medium transition-colors"
                          style={{ color: selected.color }}
                          disabled
                          title="Interactive demo coming in next update"
                        >
                          Interactive Demo →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
