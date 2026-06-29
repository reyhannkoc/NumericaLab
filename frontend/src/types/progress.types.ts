// ─── Progress & Learning System Types ────────────────────────────────────────

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number      // 0-based index of the correct option
  explanation: string
}

export interface QuizResult {
  score: number
  total: number
  date: string  // ISO string
}

export interface ProgressState {
  completedLessons: string[]                    // lesson paths e.g. '/root-finding/bisection'
  lastVisited: string[]                         // max 5, most-recent first
  playgroundUsed: boolean
  quizResults: Record<string, QuizResult>       // keyed by lesson path
  earnedAchievements: string[]                  // achievement ids
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (state: ProgressState) => boolean
}

export interface LearningPathLesson {
  path: string
  title: string
  moduleId: string
  moduleTitle: string
  moduleColor: string
  moduleIcon: string
}
