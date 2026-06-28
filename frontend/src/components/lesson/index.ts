// ─── Lesson Framework — Public API ────────────────────────────────────────────
// Import everything a lesson page needs from this single barrel.

export { default as LessonPage } from './LessonPage'

// Shared primitives (exported for edge cases where a lesson needs them directly)
export { default as SectionWrapper }        from './shared/SectionWrapper'
export { default as SectionHeader }         from './shared/SectionHeader'
export { default as LessonProgressSidebar } from './shared/LessonProgressSidebar'

// Individual sections (exported in the mandated 16-section order)
export { default as LessonHeader }            from './sections/LessonHeader'
export { default as MotivationSection }       from './sections/MotivationSection'
export { default as TheorySection }           from './sections/TheorySection'
export { default as MathFoundation }          from './sections/MathFoundation'
export { default as InteractiveVisualization } from './sections/InteractiveVisualization'
export { default as StepAnimation }           from './sections/StepAnimation'
export { default as InteractivePlayground }   from './sections/InteractivePlayground'
export { default as AlgorithmExecution }      from './sections/AlgorithmExecution'
export { default as ErrorAnalysis }           from './sections/ErrorAnalysis'
export { default as PerformanceAnalysis }     from './sections/PerformanceAnalysis'
export { default as ComparisonCenter }        from './sections/ComparisonCenter'
export { default as EngineeringApplications } from './sections/EngineeringApplications'
export { default as CommonMistakes }          from './sections/CommonMistakes'
export { default as PracticeProblems }        from './sections/PracticeProblems'
export { default as InteractiveChallenges }   from './sections/InteractiveChallenges'
export { default as LessonSummary }           from './sections/LessonSummary'

// Types (re-exported so lesson pages only need one import path)
export type {
  LessonConfig,
  LessonHeaderConfig,
  MotivationConfig,
  TheoryConfig,
  MathFoundationConfig,
  MathFormula,
  MathSymbol,
  MathDerivationStep,
  ErrorAnalysisConfig,
  ErrorMetric,
  PerformanceConfig,
  ComplexityInfo,
  ComparisonConfig,
  MethodComparisonRow,
  EngineeringApplicationConfig,
  CommonMistakeItem,
  PracticeProblemItem,
  ChallengeItem,
  ChallengeStep,
  SummaryConfig,
  SummaryKeyPoint,
  SummaryNextStep,
  PlaygroundPreset,
  LessonSectionId,
  DifficultyLevel,
  ProblemDifficulty,
  LessonPrerequisite,
} from '@/types/lesson.types'
