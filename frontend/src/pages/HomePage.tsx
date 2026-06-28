import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MODULE_DEFINITIONS } from '@/config/modules'
import ModuleCard from '@components/educational/ModuleCard'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero gradient */}
      <div className="pointer-events-none absolute inset-0 bg-hero-gradient" />

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Tag */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                           bg-brand-600/10 border border-brand-600/25 text-brand-300 text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            Interactive Numerical Methods Platform
          </span>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-balance">
            Learn Numerical Methods
            <br />
            <span className="gradient-text">by Experimenting</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-400 text-balance">
            NumericaLab teaches you every algorithm from first principles — with live
            simulations, step-by-step visualizations, and real engineering applications.
            No prior knowledge required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/modules"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white
                         font-semibold text-base shadow-glow-brand transition-all"
            >
              Explore Modules
            </Link>
            <Link
              to="/root-finding"
              className="px-6 py-3 rounded-xl bg-surface-card border border-surface-border
                         hover:bg-surface-hover text-slate-200 font-semibold text-base transition-all"
            >
              Start with Root Finding →
            </Link>
          </div>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-10"
        >
          {[
            '10 Learning Modules',
            'Interactive Simulations',
            'Step-by-step Algorithms',
            'Real-time Graphs',
            'Engineering Applications',
            'Method Comparisons',
          ].map((label) => (
            <span
              key={label}
              className="px-3 py-1 rounded-full bg-surface-card border border-surface-border
                         text-slate-400 text-xs font-medium"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Modules grid preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label mb-1">Curriculum</p>
            <h2 className="text-2xl font-bold text-white">All Learning Modules</h2>
          </div>
          <Link
            to="/modules"
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULE_DEFINITIONS.map((mod, i) => (
            <ModuleCard key={mod.id} module={mod} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
