// ─── Generic API response wrapper ───────────────────────────────────────────

export interface APIResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface APIError {
  detail: string
  status_code: number
}

// ─── Root Finding ────────────────────────────────────────────────────────────

export interface RootFindingRequest {
  expression: string        // e.g. "x**3 - x - 2"
  method: RootFindingMethod
  x0?: number               // initial guess (Newton, Fixed-point)
  x1?: number               // second guess (Secant)
  a?: number                // interval lower bound (Bisection)
  b?: number                // interval upper bound (Bisection)
  tolerance: number
  max_iterations: number
}

export type RootFindingMethod =
  | 'bisection'
  | 'newton_raphson'
  | 'secant'
  | 'fixed_point'

export interface RootFindingIteration {
  iteration: number
  a?: number
  b?: number
  x?: number
  x_new?: number
  fx: number
  fx_new?: number
  error: number
}

export interface RootFindingResult {
  root: number
  iterations: RootFindingIteration[]
  converged: boolean
  final_error: number
  total_iterations: number
  method: RootFindingMethod
  execution_time_ms: number
}

// ─── Interpolation ───────────────────────────────────────────────────────────

export interface InterpolationRequest {
  x_points: number[]
  y_points: number[]
  query_points: number[]
  method: InterpolationMethod
}

export type InterpolationMethod =
  | 'lagrange'
  | 'newton_divided_diff'
  | 'cubic_spline'

export interface InterpolationResult {
  query_points: number[]
  interpolated_values: number[]
  curve_x: number[]
  curve_y: number[]
  coefficients?: number[]
  divided_differences?: number[][]
  spline_segments?: SplineSegment[]
  method: InterpolationMethod
}

export interface SplineSegment {
  a: number; b: number; c: number; d: number
  x_start: number; x_end: number
}

// ─── Differentiation ─────────────────────────────────────────────────────────

export interface DifferentiationRequest {
  expression: string
  x_point: number
  h: number
  method: DifferentiationMethod
  order?: number
}

export type DifferentiationMethod =
  | 'forward'
  | 'backward'
  | 'central'
  | 'richardson'

export interface DifferentiationResult {
  derivative: number
  exact_derivative?: number
  absolute_error?: number
  relative_error?: number
  method: DifferentiationMethod
  steps?: RichardsonTable
}

export interface RichardsonTable {
  table: number[][]
  h_values: number[]
}

// ─── Integration ─────────────────────────────────────────────────────────────

export interface IntegrationRequest {
  expression: string
  a: number
  b: number
  n: number
  method: IntegrationMethod
}

export type IntegrationMethod =
  | 'trapezoidal'
  | 'simpsons'
  | 'simpsons_3_8'
  | 'gaussian_quadrature'
  | 'romberg'

export interface IntegrationResult {
  integral: number
  exact_integral?: number
  absolute_error?: number
  relative_error?: number
  method: IntegrationMethod
  intervals?: IntegrationInterval[]
  nodes?: number[]
  weights?: number[]
  romberg_table?: number[][]
}

export interface IntegrationInterval {
  x_start: number
  x_end: number
  area: number
}

// ─── Linear Systems ──────────────────────────────────────────────────────────

export interface LinearSystemRequest {
  matrix_a: number[][]
  vector_b: number[]
  method: LinearSolverMethod
  tolerance?: number
  max_iterations?: number
  x0?: number[]
}

export type LinearSolverMethod =
  | 'gaussian_elimination'
  | 'gauss_seidel'
  | 'jacobi'
  | 'cramer'

export interface LinearSystemResult {
  solution: number[]
  residual: number
  iterations?: LinearIteration[]
  row_operations?: RowOperation[]
  augmented_matrix_steps?: number[][][]
  method: LinearSolverMethod
  execution_time_ms: number
}

export interface LinearIteration {
  iteration: number
  x: number[]
  error: number
}

export interface RowOperation {
  type: 'swap' | 'scale' | 'add'
  description: string
  matrix_state: number[][]
}

// ─── LU Decomposition ────────────────────────────────────────────────────────

export interface LURequest {
  matrix: number[][]
  method: LUMethod
}

export type LUMethod = 'lu' | 'cholesky'

export interface LUResult {
  L: number[][]
  U: number[][]
  P?: number[][]
  determinant: number
  steps: LUStep[]
  method: LUMethod
}

export interface LUStep {
  step: number
  description: string
  L_state: number[][]
  U_state: number[][]
}

// ─── Optimization ────────────────────────────────────────────────────────────

export interface OptimizationRequest {
  expression: string
  method: OptimizationMethod
  a?: number
  b?: number
  x0?: number
  learning_rate?: number
  tolerance: number
  max_iterations: number
}

export type OptimizationMethod =
  | 'golden_section'
  | 'gradient_descent'
  | 'newton'
  | 'brent'

export interface OptimizationResult {
  optimum: number
  optimum_value: number
  iterations: OptimizationIteration[]
  converged: boolean
  method: OptimizationMethod
  execution_time_ms: number
}

export interface OptimizationIteration {
  iteration: number
  x: number
  fx: number
  interval?: [number, number]
  gradient?: number
}

// ─── ODE ─────────────────────────────────────────────────────────────────────

export interface ODERequest {
  expression: string          // dy/dx = f(x, y), provide "f(x, y)" as string
  x0: number
  y0: number
  x_end: number
  h: number
  method: ODEMethod
  exact_expression?: string
}

export type ODEMethod =
  | 'euler'
  | 'heun'
  | 'midpoint'
  | 'runge_kutta_4'
  | 'adams_bashforth'

export interface ODEResult {
  x_values: number[]
  y_values: number[]
  exact_values?: number[]
  global_error?: number[]
  method: ODEMethod
  steps: number
}

// ─── Floating Point ──────────────────────────────────────────────────────────

export interface FloatingPointRequest {
  value: number
  precision?: 'float32' | 'float64'
  operation?: 'add' | 'subtract' | 'multiply' | 'divide'
  operand?: number
}

export interface FloatingPointResult {
  binary_representation: string
  sign: number
  exponent: number
  mantissa: string
  machine_epsilon: number
  rounding_error?: number
  catastrophic_cancellation_demo?: CancellationDemo
}

export interface CancellationDemo {
  a: number; b: number
  naive_result: number
  exact_result: number
  relative_error: number
}

// ─── Performance ─────────────────────────────────────────────────────────────

export interface BenchmarkRequest {
  problem_type: 'root_finding' | 'integration' | 'linear_systems' | 'ode'
  methods: string[]
  problem_size?: number
  expression?: string
  runs?: number
}

export interface BenchmarkResult {
  method: string
  mean_time_ms: number
  std_time_ms: number
  accuracy?: number
  iterations?: number
  convergence_rate?: number
}

export interface BenchmarkResponse {
  results: BenchmarkResult[]
  winner: string
  summary: string
}

// ─── Comparison ──────────────────────────────────────────────────────────────

export interface ComparisonRequest {
  expression: string
  methods: string[]
  common_params: Record<string, unknown>
}

export interface ComparisonEntry {
  method: string
  result: number
  iterations: number
  execution_time_ms: number
  error?: number
  converged: boolean
}

export interface ComparisonResponse {
  entries: ComparisonEntry[]
  best_accuracy: string
  fastest: string
  fewest_iterations: string
}
