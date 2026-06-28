import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ModuleDefinition } from '@/types/numerical.types'
import Badge from '@components/ui/Badge'

interface ModuleCardProps {
  module: ModuleDefinition
  index?: number
}

export default function ModuleCard({ module, index = 0 }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        to={module.path}
        className="block glass-card p-5 hover:border-opacity-60 transition-all hover:shadow-card group"
        style={{ '--tw-border-opacity': '0.2', borderColor: module.color } as React.CSSProperties}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: `${module.color}25`, border: `1px solid ${module.color}40` }}
            >
              {module.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                {module.title}
              </h3>
              <p className="text-xs text-slate-500">{module.subtitle}</p>
            </div>
          </div>
          <span className="text-slate-600 group-hover:text-slate-400 transition-colors text-sm">→</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-3 leading-relaxed">{module.description}</p>

        {/* Methods */}
        {module.methods.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {module.methods.slice(0, 3).map((m) => (
              <Badge key={m.id} color="brand">
                {m.name}
              </Badge>
            ))}
            {module.methods.length > 3 && (
              <Badge color="brand">+{module.methods.length - 3} more</Badge>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  )
}
