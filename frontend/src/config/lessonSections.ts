// ─── Lesson Section Registry ─────────────────────────────────────────────────
// Single source of truth for section ordering, IDs, labels, and icons.
// Every lesson uses this list for sidebar progress tracking.

import type { LessonSectionId } from '@/types/lesson.types'

export interface SectionMeta {
  id: LessonSectionId
  label: string
  shortLabel: string
  icon: string
  description: string
}

export const LESSON_SECTIONS: SectionMeta[] = [
  {
    id:           'motivation',
    label:        'Motivation',
    shortLabel:   'Why',
    icon:         '💡',
    description:  'Why this method exists and what problem it solves',
  },
  {
    id:           'theory',
    label:        'Theory',
    shortLabel:   'Theory',
    icon:         '📖',
    description:  'Beginner-friendly explanation and intuition',
  },
  {
    id:           'math-foundation',
    label:        'Mathematical Foundation',
    shortLabel:   'Math',
    icon:         '∑',
    description:  'Formulas, derivations, and notation',
  },
  {
    id:           'visualization',
    label:        'Interactive Visualization',
    shortLabel:   'Graph',
    icon:         '📊',
    description:  'Live graph with dynamic controls',
  },
  {
    id:           'animation',
    label:        'Step-by-Step Animation',
    shortLabel:   'Animate',
    icon:         '▶',
    description:  'Animated walkthrough of the algorithm',
  },
  {
    id:           'algorithm',
    label:        'Algorithm Execution',
    shortLabel:   'Steps',
    icon:         '⚙',
    description:  'Iteration table and execution log',
  },
  {
    id:           'error-analysis',
    label:        'Error Analysis',
    shortLabel:   'Error',
    icon:         'ε',
    description:  'Absolute error, relative error, and stability',
  },
  {
    id:           'performance',
    label:        'Performance Analysis',
    shortLabel:   'Perf',
    icon:         '⚡',
    description:  'Execution time, complexity, and convergence rate',
  },
  {
    id:           'comparison',
    label:        'Comparison Center',
    shortLabel:   'Compare',
    icon:         '⚖',
    description:  'Head-to-head comparison with other methods',
  },
  {
    id:           'applications',
    label:        'Engineering Applications',
    shortLabel:   'Apps',
    icon:         '🔧',
    description:  'Real-world engineering use cases',
  },
  {
    id:           'mistakes',
    label:        'Common Mistakes',
    shortLabel:   'Mistakes',
    icon:         '⚠',
    description:  'Mistakes beginners typically make',
  },
  {
    id:           'practice',
    label:        'Practice Problems',
    shortLabel:   'Practice',
    icon:         '✏',
    description:  'Easy, medium, and hard exercises',
  },
  {
    id:           'challenges',
    label:        'Interactive Challenges',
    shortLabel:   'Challenges',
    icon:         '🏆',
    description:  'Guided experiments to deepen understanding',
  },
  {
    id:           'summary',
    label:        'Summary',
    shortLabel:   'Summary',
    icon:         '✓',
    description:  'Key takeaways, cheat sheet, and next steps',
  },
]

export const SECTION_MAP = Object.fromEntries(
  LESSON_SECTIONS.map((s) => [s.id, s]),
) as Record<LessonSectionId, SectionMeta>
