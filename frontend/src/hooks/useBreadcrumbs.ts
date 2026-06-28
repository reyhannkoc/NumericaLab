import { useLocation } from 'react-router-dom'
import type { BreadcrumbItem } from '@/types/ui.types'

const LABELS: Record<string, string> = {
  '':                    'Home',
  'floating-point':      'Floating Point',
  'root-finding':        'Root Finding',
  'bisection':           'Bisection',
  'newton-raphson':      'Newton–Raphson',
  'secant':              'Secant Method',
  'fixed-point':         'Fixed-Point',
  'comparison':          'Method Comparison',
  'interpolation':       'Interpolation',
  'lagrange':            'Lagrange',
  'newton-divided-diff': 'Newton Divided Diff.',
  'cubic-spline':        'Cubic Spline',
  'differentiation':     'Differentiation',
  'forward':             'Forward Difference',
  'backward':            'Backward Difference',
  'central':             'Central Difference',
  'richardson':          'Richardson Extrapolation',
  'integration':         'Integration',
  'trapezoidal':         'Trapezoidal Rule',
  'simpsons':            "Simpson's Rule",
  'gaussian-quadrature': 'Gaussian Quadrature',
  'linear-systems':      'Linear Systems',
  'gaussian-elimination':'Gaussian Elimination',
  'gauss-seidel':        'Gauss–Seidel',
  'jacobi':              'Jacobi Method',
  'lu-decomposition':    'LU Decomposition',
  'cholesky':            'Cholesky',
  'optimization':        'Optimization',
  'golden-section':      'Golden Section',
  'gradient-descent':    'Gradient Descent',
  'ode':                 'ODE Solvers',
  'euler':               "Euler's Method",
  'runge-kutta':         'Runge–Kutta 4',
  'performance':         'Performance Analysis',
  'modules':             'All Modules',
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)

  const crumbs: BreadcrumbItem[] = [{ label: 'NumericaLab', href: '/' }]

  parts.forEach((part, i) => {
    crumbs.push({
      label: LABELS[part] ?? part,
      href: i < parts.length - 1 ? '/' + parts.slice(0, i + 1).join('/') : undefined,
    })
  })

  return crumbs
}
