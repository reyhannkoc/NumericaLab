// ─── Lesson Framework Types ───────────────────────────────────────────────────
// Every lesson in NumericaLab must be configured using these types.
// The LessonPage component and all section components consume these types.

import type { ModuleID } from './numerical.types'

// ─── Difficulty & Meta ───────────────────────────────────────────────────────

export type DifficultyLevel = 'introductory' | 'intermediate' | 'advanced'

export type LessonSectionId =
  | 'motivation'
  | 'theory'
  | 'math-foundation'
  | 'visualization'
  | 'animation'
  | 'algorithm'
  | 'error-analysis'
  | 'performance'
  | 'comparison'
  | 'applications'
  | 'mistakes'
  | 'practice'
  | 'challenges'
  | 'summary'

// ─── 1. Lesson Header ────────────────────────────────────────────────────────

export interface LessonPrerequisite {
  title: string
  path: string
  required: boolean
}

export interface LessonHeaderConfig {
  moduleId: ModuleID
  moduleColor: string
  title: string
  subtitle: string
  difficulty: DifficultyLevel
  estimatedMinutes: number
  objectives: string[]
  prerequisites: LessonPrerequisite[]
  tags: string[]
}

// ─── 2. Motivation ───────────────────────────────────────────────────────────

export interface MotivatingExample {
  title: string
  description: string
  expression?: string
  result?: string
}

export interface MotivationConfig {
  problemStatement: string
  whyItMatters: string
  historicalBackground?: string
  engineeringMotivation: string
  motivatingExample?: MotivatingExample
}

// ─── 3. Theory ───────────────────────────────────────────────────────────────

export interface TheoryConfig {
  overview: string
  intuition: string
  advantages: string[]
  limitations: string[]
  keyInsights?: string[]
}

// ─── 4. Mathematical Foundation ──────────────────────────────────────────────

export interface MathFormula {
  label: string
  latex: string
  description?: string
  isKeyFormula?: boolean
}

export interface MathSymbol {
  symbol: string
  definition: string
  unit?: string
}

export interface MathDerivationStep {
  step: number
  description: string
  latex?: string
  note?: string
}

export interface MathFoundationConfig {
  formulas: MathFormula[]
  symbols: MathSymbol[]
  derivationSteps?: MathDerivationStep[]
  assumptions?: string[]
  convergenceCondition?: string
}

// ─── 8. Algorithm Execution ──────────────────────────────────────────────────

export interface AlgorithmExecutionColumn<T> {
  key: keyof T
  header: string
  format?: (value: T[keyof T]) => string
  highlight?: boolean
  tooltip?: string
}

// ─── 9. Error Analysis ───────────────────────────────────────────────────────

export interface ErrorMetric {
  label: string
  formula: string
  description: string
}

export interface ErrorAnalysisConfig {
  metrics: ErrorMetric[]
  stabilityNote?: string
  floatingPointNote?: string
}

// ─── 10. Performance Analysis ────────────────────────────────────────────────

export interface ComplexityInfo {
  timeComplexity: string
  spaceComplexity: string
  convergenceOrder: string
  convergenceOrderNote?: string
}

export interface PerformanceConfig {
  complexity: ComplexityInfo
  bestCase?: string
  worstCase?: string
  typicalIterations?: string
}

// ─── 11. Comparison Center ───────────────────────────────────────────────────

export interface MethodComparisonRow {
  criterion: string
  [method: string]: string
}

export interface ComparisonConfig {
  methods: string[]
  criteria: string[]
  table: MethodComparisonRow[]
  summary?: string
}

// ─── 12. Engineering Applications ───────────────────────────────────────────

export interface EngineeringApplicationConfig {
  field: string
  title: string
  description: string
  example?: string
  icon: string
  difficulty?: DifficultyLevel
}

// ─── 13. Common Mistakes ─────────────────────────────────────────────────────

export interface CommonMistakeItem {
  id: string
  title: string
  description: string
  wrongApproach?: string
  correctApproach?: string
  icon?: string
}

// ─── 14. Practice Problems ───────────────────────────────────────────────────

export type ProblemDifficulty = 'easy' | 'medium' | 'hard'

export interface PracticeProblemItem {
  id: string
  title: string
  description: string
  difficulty: ProblemDifficulty
  expression?: string
  params?: Record<string, unknown>
  hint?: string
  expectedAnswer?: string
}

// ─── 15. Interactive Challenges ──────────────────────────────────────────────

export interface ChallengeStep {
  step: number
  instruction: string
  actionLabel?: string
  expectedOutcome?: string
}

export interface ChallengeItem {
  id: string
  title: string
  description: string
  objective: string
  steps: ChallengeStep[]
  difficulty: ProblemDifficulty
}

// ─── 16. Summary ─────────────────────────────────────────────────────────────

export interface SummaryKeyPoint {
  title: string
  description: string
  icon?: string
}

export interface SummaryNextStep {
  label: string
  description: string
  path: string
}

export interface SummaryConfig {
  keyPoints: SummaryKeyPoint[]
  cheatSheetFormulas: MathFormula[]
  nextSteps?: SummaryNextStep[]
}

// ─── Full Lesson Config ──────────────────────────────────────────────────────
// The complete type a lesson page must satisfy to use the lesson framework.

export interface LessonConfig {
  header: LessonHeaderConfig
  motivation: MotivationConfig
  theory: TheoryConfig
  mathFoundation: MathFoundationConfig
  errorAnalysis: ErrorAnalysisConfig
  performance: PerformanceConfig
  comparison?: ComparisonConfig
  engineeringApplications: EngineeringApplicationConfig[]
  commonMistakes: CommonMistakeItem[]
  practiceProblems: PracticeProblemItem[]
  interactiveChallenges: ChallengeItem[]
  summary: SummaryConfig
}
