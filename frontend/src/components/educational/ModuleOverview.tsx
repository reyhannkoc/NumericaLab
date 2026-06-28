import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ModuleDefinition } from '@/types/numerical.types'
import Badge from '@components/ui/Badge'

interface ModuleOverviewProps {
  module: ModuleDefinition
  introText: string
  whatYouWillLearn: string[]
  prerequisites?: string[]
}

/**
 * Standard module landing page — shows title, intro, what you'll learn,
 * and links to each method page. Used by every top-level module route.
 */
export default function ModuleOverview({
  module,
  introText,
  whatYouWillLearn,
  prerequisites = [],
}: ModuleOverviewProps) {
  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: `${module.color}30`, border: `1.5px solid ${module.color}50` }}
          >
            {module.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{module.title}</h1>
            <p className="text-slate-500 text-sm">{module.subtitle}</p>
          </div>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">{introText}</p>
      </motion.div>

      {/* What you'll learn */}
      <div className="glass-card p-5 space-y-3">
        <h2 className="font-semibold text-white">What you'll learn</h2>
        <ul className="space-y-2">
          {whatYouWillLearn.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-emerald-400 mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Prerequisites */}
      {prerequisites.length > 0 && (
        <div className="glass-card p-4 flex items-start gap-3">
          <span className="text-amber-400 text-lg mt-0.5">⚠</span>
          <div className="text-sm text-slate-300">
            <strong className="text-white">Prerequisites: </strong>
            {prerequisites.join(', ')}
          </div>
        </div>
      )}

      {/* Methods */}
      {module.methods.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-white">Methods in this module</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {module.methods.map((method, i) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={method.path}
                  className="block glass-card p-4 hover:border-brand-600/40 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-white group-hover:text-brand-300 transition-colors">
                        {method.name}
                      </h3>
                      <p className="text-xs text-slate-400">{method.description}</p>
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-400 transition-colors">→</span>
                  </div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <Badge color={
                      method.complexity === 'introductory' ? 'green' :
                      method.complexity === 'intermediate' ? 'amber' : 'red'
                    }>
                      {method.complexity}
                    </Badge>
                    {method.tags.map((tag) => (
                      <Badge key={tag} color="brand">{tag}</Badge>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
