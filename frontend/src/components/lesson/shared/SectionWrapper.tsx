import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { LessonSectionId } from '@/types/lesson.types'

interface SectionWrapperProps {
  id: LessonSectionId
  children: ReactNode
  className?: string
  /** Visually separates the section with a top border line */
  divided?: boolean
}

/**
 * Wraps every lesson section with:
 * - A scroll-target `id` for anchor navigation
 * - A consistent top margin / scroll offset
 * - A fade-in + slide-up entry animation via Framer Motion
 * - Optional top divider
 */
export default function SectionWrapper({
  id,
  children,
  className,
  divided = true,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      className={clsx(
        'scroll-mt-24',
        divided && 'pt-12 border-t border-surface-border',
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}
