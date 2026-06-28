import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface TheorySectionProps {
  id: string
  title: string
  children: ReactNode
  className?: string
}

/**
 * Wrapper for a lesson theory section.
 * Adds consistent heading style and scroll-target id.
 */
export default function TheorySection({ id, title, children, className }: TheorySectionProps) {
  return (
    <motion.section
      id={id}
      className={clsx('scroll-mt-20', className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="space-y-4 text-slate-300 leading-relaxed">{children}</div>
    </motion.section>
  )
}
