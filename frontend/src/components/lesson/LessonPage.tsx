import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { MathJaxContext } from 'better-react-mathjax'
import type { LessonConfig, LessonSectionId } from '@/types/lesson.types'
import { useProgress } from '@/contexts/ProgressContext'
import { QUIZ_REGISTRY } from '@/config/quizzes'
import QuizSection from '@components/learning/QuizSection'

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
  renderVisualization?: () => ReactNode
  renderAnimation?: () => ReactNode
  renderAlgorithm?: () => ReactNode
  primaryMethod?: string
}

export default function LessonPage({
  config,
  renderVisualization,
  renderAnimation,
  renderAlgorithm,
  primaryMethod,
}: LessonPageProps) {
  const [currentSection, setCurrentSection] = useState<LessonSectionId | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const { pathname } = useLocation()
  const { visitLesson, submitQuiz } = useProgress()

  // Track visits
  useEffect(() => {
    visitLesson(pathname)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Which sections this lesson actually renders
  const activeSections: LessonSectionId[] = [
    'motivation', 'theory', 'math-foundation',
    ...(renderVisualization ? ['visualization' as const] : []),
    ...(renderAnimation     ? ['animation'     as const] : []),
    ...(renderAlgorithm     ? ['algorithm'     as const] : []),
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
  }, [activeSections.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  const navigateTo = useCallback((id: LessonSectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Quiz questions for this lesson (undefined if no quiz exists)
  const quizQuestions = QUIZ_REGISTRY[pathname]

  const handleQuizComplete = useCallback((score: number, total: number) => {
    submitQuiz(pathname, score, total)
  }, [pathname, submitQuiz])

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

            {renderVisualization?.()}
            {renderAnimation?.()}
            {renderAlgorithm?.()}

            <ErrorAnalysis config={config.errorAnalysis} />
            <PerformanceAnalysis config={config.performance} />

            {config.comparison && (
              <ComparisonCenter config={config.comparison} primaryMethod={primaryMethod} />
            )}

            <EngineeringApplications applications={config.engineeringApplications} />
            <CommonMistakes mistakes={config.commonMistakes} />
            <PracticeProblems problems={config.practiceProblems} />
            <InteractiveChallenges challenges={config.interactiveChallenges} />
            <LessonSummary config={config.summary} />

            {/* ── Knowledge Check (auto-appended after summary) ── */}
            {quizQuestions && (
              <QuizSection
                questions={quizQuestions}
                lessonTitle={config.header.title}
                onComplete={handleQuizComplete}
              />
            )}
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
