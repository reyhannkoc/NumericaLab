// ─── Numerical Laboratory Types ───────────────────────────────────────────────

export type LabId =
  | 'comparison'
  | 'error-analysis'
  | 'benchmark'
  | 'engineering'
  | 'formula-explorer'

export interface LabDefinition {
  id: LabId
  title: string
  subtitle: string
  description: string
  icon: string
  path: string
  color: string      // hex accent
  badge: string
  features: string[]
}

// ─── 1. Method Comparison Center ──────────────────────────────────────────────

export type ComparisonCategory =
  | 'root-finding'
  | 'integration'
  | 'differentiation'
  | 'optimization'
  | 'ode'

export interface ComparisonMethodDef {
  id: string
  name: string
  category: ComparisonCategory
  requiresDerivative: boolean
  requiresInterval: boolean
  apiMethod: string
}

export interface ComparisonParams {
  category: ComparisonCategory
  expression: string
  derivativeExpression: string
  a: number
  b: number
  x0: number
  x1: number
  tolerance: number
  maxIterations: number
  selectedMethodIds: string[]
}

export interface ComparisonResult {
  methodId: string
  methodName: string
  root: number | null
  absoluteError: number
  relativeError: number
  iterations: number
  executionTimeMs: number
  converged: boolean
  stable: boolean
  convergenceHistory: number[]
}

export type ComparisonStatus = 'idle' | 'running' | 'complete' | 'error'

// ─── 2. Error Analysis Laboratory ─────────────────────────────────────────────

export type FloatPrecision = 'float16' | 'float32' | 'float64'

export type FloatPhenomenon =
  | 'rounding'
  | 'cancellation'
  | 'overflow'
  | 'underflow'
  | 'propagation'

export interface FloatPrecisionInfo {
  precision: FloatPrecision
  label: string
  totalBits: number
  exponentBits: number
  mantissaBits: number
  epsilon: number
  maxFinite: number
  minPositiveNormal: number
  color: string
}

export interface FloatPhenomenonDef {
  id: FloatPhenomenon
  label: string
  description: string
  example: string
  inputA: number
  inputB?: number
}

export interface FloatAnalysisResult {
  precision: FloatPrecision
  original: number
  stored: number
  absoluteError: number
  relativeError: number
  isOverflow: boolean
  isUnderflow: boolean
  isExact: boolean
}

export interface CancellationDemo {
  a: number
  b: number
  trueResult: number
  float32Result: number
  float64Result: number
  float32Loss: number
  float64Loss: number
}

// ─── 3. Performance Benchmark Center ──────────────────────────────────────────

export interface BenchmarkAlgorithmDef {
  id: string
  name: string
  category: string
  apiMethod: string
  color: string
}

export interface BenchmarkRun {
  algorithmId: string
  algorithmName: string
  runtimeMs: number
  iterations: number
  converged: boolean
  absoluteError: number | null
  color: string
}

export interface BenchmarkSuite {
  expression: string
  runs: BenchmarkRun[]
  timestamp: number
}

export type BenchmarkStatus = 'idle' | 'running' | 'complete' | 'error'

// ─── 4. Engineering Applications Explorer ─────────────────────────────────────

export interface EngineeringApplication {
  id: string
  title: string
  description: string
  usedMethods: string[]
  icon: string
  placeholder: boolean
}

export interface EngineeringDiscipline {
  id: string
  name: string
  icon: string
  color: string
  description: string
  usedMethods: string[]
  applications: EngineeringApplication[]
}

// ─── 5. Interactive Formula Explorer ──────────────────────────────────────────

export interface FormulaVariable {
  symbol: string
  name: string
  min: number
  max: number
  step: number
  defaultValue: number
  unit?: string
}

export interface ExplorerFormula {
  id: string
  name: string
  category: string
  description: string
  latex: string
  variables: FormulaVariable[]
  plotXVar: string
  xMin: number
  xMax: number
  xLabel: string
  yLabel: string
  evaluate: (vars: Record<string, number>, x: number) => number
}
