import { clsx } from 'clsx'
import type { LessonSectionId } from '@/types/lesson.types'
import { LESSON_SECTIONS } from '@/config/lessonSections'

interface LessonProgressSidebarProps {
  /** Which sections this lesson actually includes */
  activeSections: LessonSectionId[]
  /** Currently visible section (from IntersectionObserver) */
  currentSection: LessonSectionId | null
  onNavigate: (id: LessonSectionId) => void
}

/**
 * Fixed right-rail progress tracker.
 * Shows only the sections present in this lesson.
 * Highlights the section currently in the viewport.
 */
export default function LessonProgressSidebar({
  activeSections,
  currentSection,
  onNavigate,
}: LessonProgressSidebarProps) {
  const visible = LESSON_SECTIONS.filter((s) => activeSections.includes(s.id))

  return (
    <nav aria-label="Lesson sections" className="space-y-0.5">
      <p className="section-label mb-3 px-2">On this page</p>

      {visible.map((section, idx) => {
        const isCurrent = currentSection === section.id
        const isPast =
          currentSection !== null &&
          visible.findIndex((s) => s.id === currentSection) > idx

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onNavigate(section.id)}
            className={clsx(
              'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left',
              'text-xs transition-all duration-200',
              isCurrent
                ? 'text-brand-300 bg-brand-600/10 font-medium'
                : isPast
                ? 'text-slate-500 hover:text-slate-300 hover:bg-surface-hover'
                : 'text-slate-500 hover:text-slate-300 hover:bg-surface-hover',
            )}
          >
            {/* Progress dot */}
            <span
              className={clsx(
                'w-1.5 h-1.5 rounded-full shrink-0 transition-colors',
                isCurrent
                  ? 'bg-brand-400'
                  : isPast
                  ? 'bg-slate-600'
                  : 'bg-slate-700',
              )}
            />
            {section.shortLabel}
          </button>
        )
      })}
    </nav>
  )
}
