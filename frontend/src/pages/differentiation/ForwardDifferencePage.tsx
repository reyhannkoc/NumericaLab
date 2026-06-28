import LessonPageShell from '@components/educational/LessonPageShell'
import TheorySection from '@components/educational/TheorySection'
import type { LessonSection } from '@/types/numerical.types'

const SECTIONS: LessonSection[] = [
  { id: 'theory',       title: 'Theory',                  type: 'theory' },
  { id: 'math',         title: 'Mathematical Background',  type: 'math' },
  { id: 'algorithm',    title: 'Algorithm',                type: 'algorithm' },
  { id: 'playground',   title: 'Interactive Playground',   type: 'playground' },
  { id: 'animation',    title: 'Animation',                type: 'animation' },
  { id: 'convergence',  title: 'Convergence Analysis',     type: 'performance' },
  { id: 'comparison',   title: 'Method Comparison',        type: 'comparison' },
  { id: 'applications', title: 'Engineering Applications', type: 'applications' },
  { id: 'practice',     title: 'Practice',                 type: 'practice' },
  { id: 'summary',      title: 'Summary',                  type: 'summary' },
]

// TODO: Implement full lesson content
export default function Page() {
  return (
    <LessonPageShell
      title="Forward Difference"
      subtitle="First-order O(h) derivative approximation"
      complexity="introductory"
      tags={["O(h)"]}
      moduleColor=""
      sections={SECTIONS}
    >
      <TheorySection id="theory" title="Theory">
        <p className="text-slate-300">
          Full lesson content for <strong className="text-white">Forward Difference</strong> will be implemented here.
          This page follows the standard NumericaLab lesson structure: Theory → Math → Algorithm →
          Playground → Animation → Convergence → Comparison → Applications → Practice → Summary.
        </p>
      </TheorySection>
      {/* Additional sections to be implemented */}
    </LessonPageShell>
  )
}
