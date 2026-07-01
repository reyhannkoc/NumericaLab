import type {
  LabDefinition,
  ComparisonMethodDef,
  FloatPrecisionInfo,
  FloatPhenomenonDef,
  BenchmarkAlgorithmDef,
  EngineeringDiscipline,
  ExplorerFormula,
} from '@/types/laboratory.types'

// ─── Lab Registry ─────────────────────────────────────────────────────────────

export const LAB_DEFINITIONS: LabDefinition[] = [
  {
    id: 'comparison',
    title: 'Method Comparison Center',
    subtitle: 'Solve the same problem with multiple methods simultaneously',
    description:
      'Run multiple numerical methods on the same problem and compare results, errors, convergence speed, and stability side by side.',
    icon: '⚖',
    path: '/laboratory/comparison',
    color: '#818cf8',
    badge: 'Live',
    features: ['Multi-method solver', 'Error metrics', 'Convergence chart', 'Stability check'],
  },
  {
    id: 'error-analysis',
    title: 'Error Analysis Laboratory',
    subtitle: 'Explore floating-point precision and numerical errors',
    description:
      'Experiment with float16, float32, and float64. Visualize rounding errors, cancellation, overflow, underflow, and error propagation interactively.',
    icon: 'ε',
    path: '/laboratory/error-analysis',
    color: '#fb923c',
    badge: 'Interactive',
    features: ['Precision comparison', 'Phenomenon explorer', 'Bit analysis', 'Live computation'],
  },
  {
    id: 'benchmark',
    title: 'Performance Benchmark Center',
    subtitle: 'Measure and compare algorithm performance',
    description:
      'Run algorithms side by side and compare runtime, iteration count, convergence rate with modern charts.',
    icon: '⚡',
    path: '/laboratory/benchmark',
    color: '#34d399',
    badge: 'Metrics',
    features: ['Runtime charts', 'Iteration comparison', 'Convergence speed', 'Live results'],
  },
  {
    id: 'engineering',
    title: 'Engineering Applications Explorer',
    subtitle: 'Discover numerical methods by engineering discipline',
    description:
      'Choose an engineering field and explore which numerical methods are commonly used, with explanations and interactive demonstrations.',
    icon: '🔧',
    path: '/laboratory/engineering',
    color: '#60a5fa',
    badge: 'Applied',
    features: ['7 disciplines', 'Real-world problems', 'Method connections', 'Demos'],
  },
  {
    id: 'formula-explorer',
    title: 'Interactive Formula Explorer',
    subtitle: 'Manipulate formulas with live sliders and graphs',
    description:
      'Explore mathematical formulas by adjusting variables with sliders. Formulas and graphs update instantly in real time.',
    icon: '∑',
    path: '/laboratory/formula-explorer',
    color: '#c084fc',
    badge: 'Live',
    features: ['MathJax rendering', 'Variable sliders', 'Instant Plotly graph', 'Formula library'],
  },
]

// ─── Comparison Methods ───────────────────────────────────────────────────────

export const COMPARISON_METHODS: ComparisonMethodDef[] = [
  {
    id: 'bisection',
    name: 'Bisection',
    category: 'root-finding',
    requiresDerivative: false,
    requiresInterval: true,
    apiMethod: 'bisection',
  },
  {
    id: 'newton_raphson',
    name: 'Newton-Raphson',
    category: 'root-finding',
    requiresDerivative: true,
    requiresInterval: false,
    apiMethod: 'newton_raphson',
  },
  {
    id: 'secant',
    name: 'Secant',
    category: 'root-finding',
    requiresDerivative: false,
    requiresInterval: false,
    apiMethod: 'secant',
  },
]

// ─── Float Precision Info ─────────────────────────────────────────────────────

export const FLOAT_PRECISION_INFO: Record<string, FloatPrecisionInfo> = {
  float16: {
    precision: 'float16',
    label: 'float16 (Half)',
    totalBits: 16,
    exponentBits: 5,
    mantissaBits: 10,
    epsilon: 9.77e-4,
    maxFinite: 65504,
    minPositiveNormal: 6.104e-5,
    color: '#fb923c',
  },
  float32: {
    precision: 'float32',
    label: 'float32 (Single)',
    totalBits: 32,
    exponentBits: 8,
    mantissaBits: 23,
    epsilon: 1.19e-7,
    maxFinite: 3.4028235e38,
    minPositiveNormal: 1.175e-38,
    color: '#facc15',
  },
  float64: {
    precision: 'float64',
    label: 'float64 (Double)',
    totalBits: 64,
    exponentBits: 11,
    mantissaBits: 52,
    epsilon: 2.22e-16,
    maxFinite: Number.MAX_VALUE,
    minPositiveNormal: 2.225e-308,
    color: '#34d399',
  },
}

// ─── Float Phenomena ──────────────────────────────────────────────────────────

export const FLOAT_PHENOMENA: FloatPhenomenonDef[] = [
  {
    id: 'rounding',
    label: 'Rounding Error',
    description:
      'Most real numbers cannot be represented exactly in binary floating-point. The stored value is the nearest representable number.',
    example: '0.1 + 0.2 ≠ 0.3 in float arithmetic',
    inputA: 0.1,
    inputB: 0.2,
  },
  {
    id: 'cancellation',
    label: 'Catastrophic Cancellation',
    description:
      'Subtracting two nearly-equal numbers causes severe loss of significant digits. The relative error becomes enormous.',
    example: '1000000.1 − 1000000.0',
    inputA: 1000000.1,
    inputB: 1000000.0,
  },
  {
    id: 'overflow',
    label: 'Overflow',
    description:
      'A number exceeds the maximum representable value and becomes ±Infinity. float16 overflows at 65,504.',
    example: '65600 overflows float16',
    inputA: 65600,
  },
  {
    id: 'underflow',
    label: 'Underflow',
    description:
      'A number is smaller than the minimum representable positive value and rounds to zero, losing all information.',
    example: '1e-7 underflows float16 to 0',
    inputA: 1e-7,
  },
  {
    id: 'propagation',
    label: 'Error Propagation',
    description:
      'A small initial rounding error grows through arithmetic operations, especially multiplications and iterations.',
    example: 'Repeated multiplication of 1.001',
    inputA: 1.001,
  },
]

// ─── Benchmark Algorithms ─────────────────────────────────────────────────────

export const BENCHMARK_ALGORITHMS: BenchmarkAlgorithmDef[] = [
  { id: 'bisection',      name: 'Bisection',      category: 'root-finding', apiMethod: 'bisection',      color: '#818cf8' },
  { id: 'newton_raphson', name: 'Newton-Raphson', category: 'root-finding', apiMethod: 'newton_raphson', color: '#34d399' },
  { id: 'secant',         name: 'Secant',         category: 'root-finding', apiMethod: 'secant',         color: '#fb923c' },
]

// ─── Engineering Disciplines ──────────────────────────────────────────────────

export const ENGINEERING_DISCIPLINES: EngineeringDiscipline[] = [
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    icon: '⚡',
    color: '#facc15',
    description:
      'Circuit analysis, signal processing, and power systems all rely heavily on numerical methods for solving non-linear equations and differential systems.',
    usedMethods: ['Root Finding', 'Linear Systems', 'ODE Solvers', 'Fourier Methods'],
    applications: [
      {
        id: 'ee-1',
        title: 'Non-linear Circuit Analysis',
        description: 'Find operating point of transistor circuits using Newton-Raphson on KVL/KCL equations.',
        usedMethods: ['Newton-Raphson', 'Gaussian Elimination'],
        icon: '🔌',
        placeholder: false,
      },
      {
        id: 'ee-2',
        title: 'Control System Simulation',
        description: 'Simulate LTI systems by solving ODEs representing differential equations of the system.',
        usedMethods: ['Runge-Kutta', 'Euler Method'],
        icon: '🎛',
        placeholder: false,
      },
      {
        id: 'ee-3',
        title: 'Signal Reconstruction',
        description: 'Reconstruct signals from sample points using polynomial and spline interpolation.',
        usedMethods: ['Lagrange Interpolation', 'Cubic Spline'],
        icon: '📡',
        placeholder: true,
      },
    ],
  },
  {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    icon: '⚙',
    color: '#60a5fa',
    description:
      'Structural analysis, fluid dynamics, and heat transfer are computed using numerical integration, linear systems, and ODE solvers.',
    usedMethods: ['Integration', 'Linear Systems', 'ODE Solvers', 'Optimization'],
    applications: [
      {
        id: 'me-1',
        title: 'Beam Deflection Analysis',
        description: 'Compute deflection of a loaded beam by numerically integrating the moment equation.',
        usedMethods: ["Simpson's Rule", 'Gaussian Quadrature'],
        icon: '🏗',
        placeholder: false,
      },
      {
        id: 'me-2',
        title: 'Heat Transfer Simulation',
        description: 'Solve steady-state heat conduction using Gauss-Seidel iteration on discretized PDE.',
        usedMethods: ['Gauss-Seidel', 'Jacobi Iteration'],
        icon: '🌡',
        placeholder: false,
      },
      {
        id: 'me-3',
        title: 'Spring-Mass Dynamics',
        description: 'Simulate oscillating mass-spring-damper systems with Runge-Kutta ODE integration.',
        usedMethods: ['Runge-Kutta 4th Order', 'Euler Method'],
        icon: '🔩',
        placeholder: true,
      },
    ],
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    icon: '🤖',
    color: '#c084fc',
    description:
      'Machine learning training loops, optimization, and data fitting are built on gradient descent, root-finding, and linear algebra.',
    usedMethods: ['Optimization', 'Linear Systems', 'Root Finding', 'Interpolation'],
    applications: [
      {
        id: 'ai-1',
        title: 'Gradient Descent Training',
        description: 'Minimize a loss function using gradient descent and its variants (SGD, Adam).',
        usedMethods: ['Gradient Descent', 'Golden Section'],
        icon: '📉',
        placeholder: false,
      },
      {
        id: 'ai-2',
        title: 'Logistic Regression Root Finding',
        description: 'Newton-Raphson solves the log-likelihood equation in logistic regression exactly.',
        usedMethods: ['Newton-Raphson'],
        icon: '🧠',
        placeholder: false,
      },
      {
        id: 'ai-3',
        title: 'Kernel Regression / RBF Fitting',
        description: 'Fit radial basis function models to data using least-squares linear systems.',
        usedMethods: ['Gaussian Elimination', 'LU Decomposition'],
        icon: '📊',
        placeholder: true,
      },
    ],
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    icon: '🏛',
    color: '#94a3b8',
    description:
      'Structural load analysis, soil mechanics, and hydraulics use matrix solvers, optimization, and numerical integration.',
    usedMethods: ['Linear Systems', 'Integration', 'Optimization'],
    applications: [
      { id: 'cv-1', title: 'FEM Structural Analysis', description: 'Assemble and solve global stiffness matrices for truss and frame structures.', usedMethods: ['LU Decomposition', 'Gaussian Elimination'], icon: '🏗', placeholder: true },
      { id: 'cv-2', title: 'Open Channel Flow', description: 'Solve Manning\'s equation for flow velocity using bisection root-finding.', usedMethods: ['Bisection', 'Secant'], icon: '🌊', placeholder: true },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💹',
    color: '#34d399',
    description:
      'Option pricing, yield curve fitting, and risk models use root-finding, interpolation, and stochastic ODE solvers.',
    usedMethods: ['Root Finding', 'Interpolation', 'ODE Solvers'],
    applications: [
      { id: 'fin-1', title: 'Implied Volatility (Black-Scholes)', description: 'Invert the Black-Scholes formula for implied volatility using Newton-Raphson.', usedMethods: ['Newton-Raphson'], icon: '📈', placeholder: true },
      { id: 'fin-2', title: 'Bond Yield to Maturity', description: 'Find YTM by solving the bond price equation using bisection.', usedMethods: ['Bisection', 'Secant'], icon: '💰', placeholder: true },
    ],
  },
]

// ─── Explorer Formulas ────────────────────────────────────────────────────────

export const EXPLORER_FORMULAS: ExplorerFormula[] = [
  {
    id: 'bisection-error',
    name: 'Bisection Convergence Bound',
    category: 'Root Finding',
    description: 'Upper bound on the error after n bisection iterations starting with interval [a, b].',
    latex: 'e_n \\leq \\frac{b - a}{2^{n+1}}',
    variables: [
      { symbol: 'a', name: 'Interval left',   min: 0,   max: 5,   step: 0.1, defaultValue: 0 },
      { symbol: 'b', name: 'Interval right',  min: 0.1, max: 10,  step: 0.1, defaultValue: 4 },
    ],
    plotXVar: 'n',
    xMin: 0,
    xMax: 40,
    xLabel: 'Iterations n',
    yLabel: 'Error bound',
    evaluate: (vars, n) => (vars.b - vars.a) / Math.pow(2, n + 1),
  },
  {
    id: 'newton-convergence',
    name: 'Newton-Raphson Quadratic Convergence',
    category: 'Root Finding',
    description: 'Illustrates quadratic convergence: each iteration roughly squares the error.',
    latex: 'e_{n+1} \\approx C \\cdot e_n^2',
    variables: [
      { symbol: 'e0', name: 'Initial error e₀', min: 0.001, max: 1,    step: 0.001, defaultValue: 0.5 },
      { symbol: 'C',  name: 'Constant C',       min: 0.1,   max: 5,    step: 0.1,   defaultValue: 1 },
    ],
    plotXVar: 'n',
    xMin: 0,
    xMax: 10,
    xLabel: 'Iterations n',
    yLabel: 'Error',
    evaluate: (vars, n) => {
      let e = vars.e0
      for (let i = 0; i < n; i++) e = vars.C * e * e
      return e
    },
  },
  {
    id: 'trapezoidal-error',
    name: 'Trapezoidal Rule Error Bound',
    category: 'Integration',
    description: 'Maximum error of the trapezoidal rule over [a, b] with n subintervals and |f\'\'(x)| ≤ M.',
    latex: '\\left|E_T\\right| \\leq \\frac{(b-a)^3}{12 n^2} M',
    variables: [
      { symbol: 'a', name: 'Left bound a',     min: 0,   max: 5,   step: 0.1, defaultValue: 0 },
      { symbol: 'b', name: 'Right bound b',    min: 0.5, max: 10,  step: 0.1, defaultValue: 2 },
      { symbol: 'M', name: 'Max |f\'\'|',      min: 0.1, max: 10,  step: 0.1, defaultValue: 1 },
    ],
    plotXVar: 'n',
    xMin: 1,
    xMax: 50,
    xLabel: 'Number of subintervals n',
    yLabel: 'Error bound',
    evaluate: (vars, n) =>
      (Math.pow(vars.b - vars.a, 3) * vars.M) / (12 * n * n),
  },
  {
    id: 'damped-oscillation',
    name: 'Damped Oscillation',
    category: 'ODE / Engineering',
    description: 'Solution to a damped harmonic oscillator: amplitude decays exponentially while oscillating.',
    latex: 'x(t) = A e^{-\\alpha t} \\cos(\\omega t + \\phi)',
    variables: [
      { symbol: 'A',     name: 'Amplitude A',    min: 0.1, max: 5,    step: 0.1, defaultValue: 2,        unit: 'm'    },
      { symbol: 'alpha', name: 'Damping α',      min: 0,   max: 2,    step: 0.05, defaultValue: 0.3      },
      { symbol: 'omega', name: 'Frequency ω',    min: 0.5, max: 5,    step: 0.1, defaultValue: 2,        unit: 'rad/s'},
      { symbol: 'phi',   name: 'Phase φ',        min: 0,   max: 6.28, step: 0.1, defaultValue: 0,        unit: 'rad'  },
    ],
    plotXVar: 't',
    xMin: 0,
    xMax: 20,
    xLabel: 'Time t (s)',
    yLabel: 'Displacement x (m)',
    evaluate: (vars, t) =>
      vars.A * Math.exp(-vars.alpha * t) * Math.cos(vars.omega * t + vars.phi),
  },
  {
    id: 'taylor-sin',
    name: 'Taylor Series: sin(x)',
    category: 'Approximation',
    description: 'Taylor polynomial approximation of sin(x) around x = 0, showing how accuracy improves with more terms.',
    latex: '\\sin(x) \\approx \\sum_{k=0}^{n} \\frac{(-1)^k x^{2k+1}}{(2k+1)!}',
    variables: [
      { symbol: 'n', name: 'Number of terms', min: 1, max: 10, step: 1, defaultValue: 3 },
    ],
    plotXVar: 'x',
    xMin: -2 * Math.PI,
    xMax: 2 * Math.PI,
    xLabel: 'x',
    yLabel: 'Value',
    evaluate: (vars, x) => {
      let sum = 0
      let factorial = 1
      for (let k = 0; k <= vars.n; k++) {
        if (k > 0) factorial *= (2 * k) * (2 * k + 1)
        sum += (Math.pow(-1, k) * Math.pow(x, 2 * k + 1)) / factorial
      }
      return sum
    },
  },
]
