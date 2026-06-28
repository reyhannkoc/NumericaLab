import { motion } from 'framer-motion'
import type { EngineeringApplication as Application } from '@/types/numerical.types'
import Card from '@components/ui/Card'

interface EngineeringApplicationProps {
  applications: Application[]
}

/**
 * Displays a grid of real-world engineering application cards
 * for each numerical module.
 */
export default function EngineeringApplications({ applications }: EngineeringApplicationProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-white">Engineering Applications</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app, i) => (
          <motion.div
            key={app.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Card hoverable className="h-full space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{app.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {app.field}
                </span>
              </div>
              <h4 className="font-semibold text-sm text-white">{app.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{app.description}</p>
              {app.example && (
                <p className="text-xs font-mono text-brand-300 bg-surface p-2 rounded">
                  {app.example}
                </p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
