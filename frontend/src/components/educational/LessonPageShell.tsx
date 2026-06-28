import type { ReactNode } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import LessonLayout from '@layouts/LessonLayout'
import type { LessonSection } from '@/types/numerical.types'
import Badge from '@components/ui/Badge'
import type { ColorScheme } from '@/types/ui.types'

interface LessonPageShellProps {
  title: string
  subtitle: string
  complexity: 'introductory' | 'intermediate' | 'advanced'
  tags: string[]
  moduleColor: string
  sections: LessonSection[]
  children: ReactNode
}

const complexityColor: Record<string, ColorScheme> = {
  introductory: 'green',
  intermediate: 'amber',
  advanced: 'red',
}

/**
 * Outer shell for individual lesson pages.
 * Provides section navigation, active-section tracking via IntersectionObserver,
 * and the LessonLayout rail. All lesson content is passed as children.
 */
export default function LessonPageShell({
  title,
  subtitle,
  complexity,
  tags,
  moduleColor,
  sections,
  children,
}: LessonPageShellProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '')

  // Track which section is currently visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  const handleSectionChange = useCallback((id: string) => {
    setActiveSection(id)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Badge row */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
          style={{ backgroundColor: `${moduleColor}30`, border: `1.5px solid ${moduleColor}50` }}
        >
          N
        </div>
        <Badge color={complexityColor[complexity]}>{complexity}</Badge>
        {tags.map((tag) => <Badge key={tag} color="brand">{tag}</Badge>)}
      </div>

      <LessonLayout
        title={title}
        subtitle={subtitle}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {children}
      </LessonLayout>
    </motion.div>
  )
}
