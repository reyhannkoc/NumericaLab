// Types shared across the numerical modules UI layer

export type ModuleID =
  | 'floating-point'
  | 'root-finding'
  | 'interpolation'
  | 'differentiation'
  | 'integration'
  | 'linear-systems'
  | 'lu-decomposition'
  | 'optimization'
  | 'ode'
  | 'performance'

export interface ModuleDefinition {
  id: ModuleID
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  path: string
  methods: MethodDefinition[]
  prerequisites: ModuleID[]
}

export interface MethodDefinition {
  id: string
  name: string
  path: string
  description: string
  complexity: 'introductory' | 'intermediate' | 'advanced'
  tags: string[]
}

export interface LessonSection {
  id: string
  title: string
  type: LessonSectionType
  completed?: boolean
}

export type LessonSectionType =
  | 'theory'
  | 'math'
  | 'visualization'
  | 'animation'
  | 'playground'
  | 'algorithm'
  | 'performance'
  | 'comparison'
  | 'applications'
  | 'practice'
  | 'summary'

export interface EngineeringApplication {
  field: string
  title: string
  description: string
  icon: string
  example?: string
}

export interface PracticeExercise {
  id: string
  title: string
  description: string
  hint?: string
  expression?: string
  params?: Record<string, unknown>
  expected_root?: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface AlgorithmStep {
  step: number
  title: string
  description: string
  formula?: string
  highlight?: string
  code?: string
}

export interface ConvergenceData {
  iterations: number[]
  errors: number[]
  method: string
  color: string
}

export interface PlotSeries {
  x: number[]
  y: number[]
  name: string
  mode: 'lines' | 'markers' | 'lines+markers'
  color?: string
  dash?: 'solid' | 'dash' | 'dot' | 'dashdot'
  width?: number
}
