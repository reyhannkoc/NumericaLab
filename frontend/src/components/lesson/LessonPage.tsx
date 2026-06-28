import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react'
import { MathJaxContext } from 'better-react-mathjax'
import type { LessonConfig, LessonSectionId } from '@/types/lesson.types'
import { LESSON_SECTIONS } from '@/config/lessonSections'

import LessonHeader from './sections/LessonHeader'
import MotivationSection from './sections/MotivationSection'
import TheorySection from './sections/TheorySection'
import MathFoundation from './sections/MathFoundation'
import ErrorAnalysis from './sections/ErrorAnalysis'
import PerformanceAnalysis from './sections/PerformanceAnalysis'
import ComparisonCenter from './sections/ComparisonCenter'
import EngineeringApplications from './sections/EngineeringApplications'
import CommonMistakes from './sections/CommonMistakes'
import PracticeProblems from './sections/PracticeProblems'
import InteractiveChallenges from './sections/InteractiveChallenges'
import LessonSummary from './sections/LessonSummary'
import LessonProgressSidebar from './shared/LessonProgressSidebar'

const MATHJAX_CONFIG = {
  loader: { load: ['[tex]/html'] },
  tex: { packages: { '[+]': ['html'] }, inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
}

interface LessonPageProps {
  config: LessonConfig
  /**
   * Render props for the three interactive sections that require
   * lesson-specific logic (chart, animation, playground).
   * All three are optional — the page renders gracefully without them.
   */
  renderVisualization?: () => ReactNode
  renderAnimation?: () => ReactNode
  renderPlayground?: () => ReactNode
  /** Primary method name used to highlight column in ComparisonCenter */
  primaryMethod?: string
  /** Live error values fed from the playground computation */
  liveErrors?: {
    absoluteError?: number
    relativeError?: number
    iterations?: number
  }
  /** Live performance metrics from the playground computation */
  livePerformance?: {
    measuredMs?: number
    actualIterations?: number
  }
}

/**
 * Universal lesson page orchestrator.
 *
 * Every lesson page must:
 *   1. Define a LessonConfig object
 *   2. Wrap it with <LessonPage config={config} ... />
 *   3. Pass render props for the three interactive sections
 *
 * This component owns:
 *   - MathJax context
 *   - IntersectionObserver for active-section tracking
 *   - Progress sidebar rendering
 *   - Ordered section layout
 */
export default function LessonPage({
  config,
  renderVisualization,
  renderAnimation,
  renderPlayground,
  primaryMethod,
  liveErrors,
  livePerformance,
}: LessonPageProps) {
  const [currentSection, setCurrentSection] = useState<LessonSectionId | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Which sections this lesson actually renders
  const activeSections: LessonSectionId[] = [
    'motivation', 'theory', 'math-foundation',
    ...(renderVisualization ? ['visualization' as const] : []),
    ...(renderAnimation     ? ['animation'     as const] : []),
    ...(renderPlayground    ? ['playground'    as const] : []),
    'algorithm',
    'error-analysis', 'performance',
    ...(config.comparison ? ['comparison' as const] : []),
    'applications', 'mistakes', 'practice', 'challenges', 'summary',
  ]

  useEffect(() => {
    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id as LessonSectionId)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )

    const obs = observerRef.current
    activeSections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })

    return () => obs.disconnect()
  }, [activeSections.join(',')])

  const navigateTo = useCallback((id: LessonSectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <MathJaxContext config={MATHJAX_CONFIG}>
      <div className="max-w-screen-xl mx-auto px-4 py-8 lg:grid lg:grid-cols-[1fr_200px] lg:gap-10">
        {/* ── Main content ── */}
        <main className="min-w-0">
          <LessonHeader config={config.header} />

          <div className="space-y-0">
            <MotivationSection config={config.motivation} />
            <TheorySection config={config.theory} />
            <MathFoundation config={config.mathFoundation} />

            {/* Interactive sections — rendered by individual lesson pages */}
            {renderVisualization?.()}
            {renderAnimation?.()}
            {renderPlayground?.()}

            {/* Algorithm Execution slot — rendered by individual lesson pages via renderPlayground */}
            {/* Error & Performance */}
            <ErrorAnalysis
              config={config.errorAnalysis}
              absoluteError={liveErrors?.absoluteError}
              relativeError={liveErrors?.relativeError}
              iterations={liveErrors?.iterations}
            />
            <PerformanceAnalysis
              config={config.performance}
              measuredMs={livePerformance?.measuredMs}
              actualIterations={livePerformance?.actualIterations}
            />

            {/* Optional comparison */}
            {config.comparison && (
              <ComparisonCenter config={config.comparison} primaryMethod={primaryMethod} />
            )}

            <EngineeringApplications applications={config.engineeringApplications} />
            <CommonMistakes mistakes={config.commonMistakes} />
            <PracticeProblems problems={config.practiceProblems} />
            <InteractiveChallenges challenges={config.interactiveChallenges} />
            <LessonSummary config={config.summary} />
          </div>
        </main>

        {/* ── Progress sidebar (desktop only) ── */}
        <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pb-8">
          <LessonProgressSidebar
            activeSections={activeSections}
            currentSection={currentSection}
            onNavigate={navigateTo}
          />
        </aside>
      </div>
    </MathJaxContext>
  )
}
