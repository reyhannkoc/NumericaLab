import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LAB_DEFINITIONS } from '@/config/laboratory'

export default function LaboratoryHub() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/15 border border-brand-600/25 flex items-center justify-center text-2xl">
            🧪
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Numerical Laboratory</h1>
            <p className="text-slate-400 mt-0.5">
              Interactive experimentation environment for Numerical Methods
            </p>
          </div>
        </div>

        <p className="text-slate-400 max-w-2xl leading-relaxed">
          Unlike the lesson pages which teach concepts step-by-step, the Laboratory lets you
          freely experiment. Compare methods, explore floating-point behavior, benchmark
          algorithms, and see how mathematics connects to real engineering.
        </p>
      </div>

      {/* Lab cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {LAB_DEFINITIONS.map((lab, i) => (
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
          >
            <Link
              to={lab.path}
              className="glass-card p-6 flex flex-col h-full group hover:border-white/10
                         transition-all duration-200 block"
              style={{ '--lab-color': lab.color } as React.CSSProperties}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-xl text-2xl"
                  style={{
                    backgroundColor: `${lab.color}18`,
                    border: `1px solid ${lab.color}30`,
                  }}
                >
                  {lab.icon}
                </div>

                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    color: lab.color,
                    backgroundColor: `${lab.color}18`,
                  }}
                >
                  {lab.badge}
                </span>
              </div>

              {/* Body */}
              <h2 className="text-base font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">
                {lab.title}
              </h2>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{lab.subtitle}</p>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {lab.features.map((f) => (
                  <span
                    key={f}
                    className="text-xs px-2 py-0.5 rounded-md bg-surface-card border border-surface-border text-slate-500"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <div
                className="mt-5 flex items-center gap-1.5 text-xs font-medium transition-colors"
                style={{ color: lab.color }}
              >
                Open Lab
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom note */}
      <p className="mt-10 text-center text-xs text-slate-600">
        The Laboratory is independent from lessons. No completion tracking — just pure experimentation.
      </p>
    </div>
  )
}
