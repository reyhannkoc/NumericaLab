import { motion } from 'framer-motion'
import { MODULE_DEFINITIONS } from '@/config/modules'
import ModuleCard from '@components/educational/ModuleCard'

export default function ModulesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="space-y-2">
          <p className="section-label">Curriculum</p>
          <h1 className="text-3xl font-bold text-white">All Modules</h1>
          <p className="text-slate-400 max-w-xl">
            Each module follows the same pedagogical sequence: theory → visualization →
            interactive playground → engineering applications → practice.
          </p>
        </div>

        {/* Learning path note */}
        <div className="glass-card p-4 flex gap-3">
          <span className="text-xl mt-0.5">💡</span>
          <div className="text-sm text-slate-300">
            <strong className="text-white">Recommended path:</strong> Start with{' '}
            <strong>Floating Point</strong> to understand error fundamentals, then work
            through <strong>Root Finding</strong>, <strong>Interpolation</strong>, and{' '}
            <strong>Integration</strong> before tackling <strong>Linear Systems</strong>{' '}
            and <strong>ODE Solvers</strong>.
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULE_DEFINITIONS.map((mod, i) => (
            <ModuleCard key={mod.id} module={mod} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
