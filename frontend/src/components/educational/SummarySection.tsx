import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import Card from '@components/ui/Card'

interface SummaryItem {
  title: string
  description: string
  icon?: string
}

interface SummarySectionProps {
  keyPoints: SummaryItem[]
  nextSteps?: { label: string; path: string }[]
  children?: ReactNode
}

export default function SummarySection({ keyPoints, children }: SummarySectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Summary</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {keyPoints.map((point, i) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="flex items-start gap-3 h-full">
              {point.icon && <span className="text-xl mt-0.5">{point.icon}</span>}
              <div>
                <h4 className="font-semibold text-sm text-white mb-1">{point.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{point.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      {children}
    </section>
  )
}
