import type { Achievement, ProgressState } from '@/types/progress.types'

const ROOT_FINDING_PATHS = [
  '/root-finding/bisection',
  '/root-finding/newton-raphson',
  '/root-finding/secant',
  '/root-finding/fixed-point',
]

const INTERPOLATION_PATHS = [
  '/interpolation/lagrange',
  '/interpolation/newton-divided-diff',
  '/interpolation/cubic-spline',
]

const DIFFERENTIATION_PATHS = [
  '/differentiation/forward',
  '/differentiation/backward',
  '/differentiation/central',
]

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'First Lesson Complete',
    description: 'Completed your first lesson on NumericaLab.',
    icon: '🎓',
    condition: (s: ProgressState) => s.completedLessons.length >= 1,
  },
  {
    id: 'playground_explorer',
    title: 'Playground Explorer',
    description: 'Used the interactive playground for the first time.',
    icon: '🧪',
    condition: (s: ProgressState) => s.playgroundUsed,
  },
  {
    id: 'beginner',
    title: 'Numerical Methods Beginner',
    description: 'Completed 5 or more lessons.',
    icon: '🌱',
    condition: (s: ProgressState) => s.completedLessons.length >= 5,
  },
  {
    id: 'root_finding_master',
    title: 'Root Finding Master',
    description: 'Completed all Root Finding lessons.',
    icon: '🔍',
    condition: (s: ProgressState) =>
      ROOT_FINDING_PATHS.every((p) => s.completedLessons.includes(p)),
  },
  {
    id: 'interpolation_explorer',
    title: 'Interpolation Explorer',
    description: 'Completed all Interpolation lessons.',
    icon: '〰',
    condition: (s: ProgressState) =>
      INTERPOLATION_PATHS.every((p) => s.completedLessons.includes(p)),
  },
  {
    id: 'diff_explorer',
    title: 'Differentiation Explorer',
    description: 'Completed all Numerical Differentiation lessons.',
    icon: "f'",
    condition: (s: ProgressState) =>
      DIFFERENTIATION_PATHS.every((p) => s.completedLessons.includes(p)),
  },
  {
    id: 'quiz_ace',
    title: 'Quiz Ace',
    description: 'Scored 100% on a knowledge check quiz.',
    icon: '⭐',
    condition: (s: ProgressState) =>
      Object.values(s.quizResults).some((r) => r.score === r.total && r.total > 0),
  },
  {
    id: 'halfway',
    title: 'Halfway There',
    description: 'Completed at least 50% of the learning path.',
    icon: '🏅',
    condition: (s: ProgressState) => s.completedLessons.length >= 12,
  },
]
