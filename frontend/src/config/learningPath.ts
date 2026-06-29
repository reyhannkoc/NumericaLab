import type { LearningPathLesson } from '@/types/progress.types'

export const LEARNING_PATH: LearningPathLesson[] = [
  // ── Module 1: Floating Point ───────────────────────────────────────────────
  { path: '/floating-point',           title: 'Floating Point & Error Analysis', moduleId: 'floating-point',   moduleTitle: 'Floating Point',    moduleColor: '#f59e0b', moduleIcon: '0.1' },

  // ── Module 2: Root Finding ─────────────────────────────────────────────────
  { path: '/root-finding/bisection',       title: 'Bisection Method',       moduleId: 'root-finding', moduleTitle: 'Root Finding', moduleColor: '#10b981', moduleIcon: '√' },
  { path: '/root-finding/newton-raphson',  title: 'Newton–Raphson',         moduleId: 'root-finding', moduleTitle: 'Root Finding', moduleColor: '#10b981', moduleIcon: '√' },
  { path: '/root-finding/secant',          title: 'Secant Method',          moduleId: 'root-finding', moduleTitle: 'Root Finding', moduleColor: '#10b981', moduleIcon: '√' },
  { path: '/root-finding/fixed-point',     title: 'Fixed-Point Iteration',  moduleId: 'root-finding', moduleTitle: 'Root Finding', moduleColor: '#10b981', moduleIcon: '√' },

  // ── Module 3: Interpolation ────────────────────────────────────────────────
  { path: '/interpolation/lagrange',            title: 'Lagrange Polynomial',       moduleId: 'interpolation', moduleTitle: 'Interpolation', moduleColor: '#3b82f6', moduleIcon: '~' },
  { path: '/interpolation/newton-divided-diff', title: 'Newton Divided Differences', moduleId: 'interpolation', moduleTitle: 'Interpolation', moduleColor: '#3b82f6', moduleIcon: '~' },
  { path: '/interpolation/cubic-spline',        title: 'Cubic Spline',               moduleId: 'interpolation', moduleTitle: 'Interpolation', moduleColor: '#3b82f6', moduleIcon: '~' },

  // ── Module 4: Differentiation ──────────────────────────────────────────────
  { path: '/differentiation/forward',  title: 'Forward Difference',  moduleId: 'differentiation', moduleTitle: 'Differentiation', moduleColor: '#8b5cf6', moduleIcon: "f'" },
  { path: '/differentiation/backward', title: 'Backward Difference', moduleId: 'differentiation', moduleTitle: 'Differentiation', moduleColor: '#8b5cf6', moduleIcon: "f'" },
  { path: '/differentiation/central',  title: 'Central Difference',  moduleId: 'differentiation', moduleTitle: 'Differentiation', moduleColor: '#8b5cf6', moduleIcon: "f'" },

  // ── Module 5: Integration ──────────────────────────────────────────────────
  { path: '/integration/trapezoidal',         title: 'Trapezoidal Rule',   moduleId: 'integration', moduleTitle: 'Integration', moduleColor: '#ec4899', moduleIcon: '∫' },
  { path: '/integration/simpsons',            title: "Simpson's Rule",      moduleId: 'integration', moduleTitle: 'Integration', moduleColor: '#ec4899', moduleIcon: '∫' },
  { path: '/integration/gaussian-quadrature', title: 'Gaussian Quadrature', moduleId: 'integration', moduleTitle: 'Integration', moduleColor: '#ec4899', moduleIcon: '∫' },

  // ── Module 6: Linear Systems ───────────────────────────────────────────────
  { path: '/linear-systems/gaussian-elimination', title: 'Gaussian Elimination', moduleId: 'linear-systems', moduleTitle: 'Linear Systems', moduleColor: '#14b8a6', moduleIcon: '[A]' },
  { path: '/linear-systems/gauss-seidel',          title: 'Gauss–Seidel',        moduleId: 'linear-systems', moduleTitle: 'Linear Systems', moduleColor: '#14b8a6', moduleIcon: '[A]' },
  { path: '/linear-systems/jacobi',                title: 'Jacobi Method',        moduleId: 'linear-systems', moduleTitle: 'Linear Systems', moduleColor: '#14b8a6', moduleIcon: '[A]' },

  // ── Module 7: LU Decomposition ─────────────────────────────────────────────
  { path: '/lu-decomposition',          title: 'LU Decomposition (Doolittle)', moduleId: 'lu-decomposition', moduleTitle: 'LU Decomposition', moduleColor: '#f97316', moduleIcon: 'LU' },
  { path: '/lu-decomposition/cholesky', title: 'Cholesky Factorization',       moduleId: 'lu-decomposition', moduleTitle: 'LU Decomposition', moduleColor: '#f97316', moduleIcon: 'LU' },

  // ── Module 8: Optimization ─────────────────────────────────────────────────
  { path: '/optimization/golden-section',   title: 'Golden Section Search', moduleId: 'optimization', moduleTitle: 'Optimization', moduleColor: '#06b6d4', moduleIcon: '↓' },
  { path: '/optimization/gradient-descent', title: 'Gradient Descent',       moduleId: 'optimization', moduleTitle: 'Optimization', moduleColor: '#06b6d4', moduleIcon: '↓' },

  // ── Module 9: ODE ──────────────────────────────────────────────────────────
  { path: '/ode/euler',       title: "Euler's Method",  moduleId: 'ode', moduleTitle: 'ODE Solvers', moduleColor: '#84cc16', moduleIcon: 'dy/dx' },
  { path: '/ode/runge-kutta', title: 'Runge–Kutta 4',  moduleId: 'ode', moduleTitle: 'ODE Solvers', moduleColor: '#84cc16', moduleIcon: 'dy/dx' },

  // ── Module 10: Performance ─────────────────────────────────────────────────
  { path: '/performance', title: 'Performance Analysis', moduleId: 'performance', moduleTitle: 'Performance', moduleColor: '#e11d48', moduleIcon: '⚡' },
]

export const TOTAL_LESSONS = LEARNING_PATH.length

export function getLessonByPath(path: string): LearningPathLesson | undefined {
  return LEARNING_PATH.find((l) => l.path === path)
}

export function getNextLesson(path: string): LearningPathLesson | undefined {
  const idx = LEARNING_PATH.findIndex((l) => l.path === path)
  return idx >= 0 && idx < LEARNING_PATH.length - 1 ? LEARNING_PATH[idx + 1] : undefined
}
