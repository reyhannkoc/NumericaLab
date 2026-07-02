import { clsx } from 'clsx'
import type { LessonSection } from '@/types/numerical.types'

interface LessonProgressProps {
  sections: LessonSection[]
  activeSection: string
  onSectionChange: (id: string) => void
}

const typeIcons: Record<string, string> = {
  theory:       '📖',
  math:         '∑',
  visualization:'📊',
  animation:    '▶',
  playground:   '🎮',
  algorithm:    '⚙',
  performance:  '⚡',
  comparison:   '⚖',
  applications: '🔧',
  practice:     '✏',
  summary:      '✓',
}

export default function LessonProgress({
  sections,
  activeSection,
  onSectionChange,
}: LessonProgressProps) {
  return (
    <nav className="space-y-0.5">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => {
            onSectionChange(section.id)
            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className={clsx(
            'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-xs transition-colors',
            activeSection === section.id
              ? 'text-brand-300 bg-brand-600/10'
              : 'text-slate-500 hover:text-slate-300 hover:bg-surface-hover',
          )}
        >
          <span className="w-4 text-center">{typeIcons[section.type] ?? '·'}</span>
          {section.title}
        </button>
      ))}
    </nav>
  )
}
