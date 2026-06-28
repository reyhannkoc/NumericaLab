import type { ReactNode } from 'react'
import type { LessonSection } from '@/types/numerical.types'
import LessonProgress from '@components/educational/LessonProgress'

interface LessonLayoutProps {
  title: string
  subtitle?: string
  sections: LessonSection[]
  activeSection: string
  onSectionChange: (id: string) => void
  children: ReactNode
}

/**
 * Layout used inside individual lesson pages.
 * Provides a vertical section progress rail on the right
 * and renders children in the scrollable content area.
 */
export default function LessonLayout({
  title,
  subtitle,
  sections,
  activeSection,
  onSectionChange,
  children,
}: LessonLayoutProps) {
  return (
    <div className="flex gap-8">
      {/* Content */}
      <div className="flex-1 min-w-0 space-y-12">
        {/* Lesson header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-slate-400 text-lg">{subtitle}</p>}
        </div>
        {children}
      </div>

      {/* Progress rail */}
      <aside className="hidden xl:block w-48 shrink-0">
        <div className="sticky top-8">
          <p className="section-label mb-4">On this page</p>
          <LessonProgress
            sections={sections}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        </div>
      </aside>
    </div>
  )
}
