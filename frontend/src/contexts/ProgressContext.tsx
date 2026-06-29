import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { ProgressState, QuizResult } from '@/types/progress.types'
import { ACHIEVEMENTS } from '@/config/achievements'
import { TOTAL_LESSONS } from '@/config/learningPath'

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'numericalab_progress'
const MAX_VISITED = 5

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProgressState
  } catch { /* ignore */ }
  return { completedLessons: [], lastVisited: [], playgroundUsed: false, quizResults: {}, earnedAchievements: [] }
}

function saveState(state: ProgressState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

function withAchievements(state: ProgressState): ProgressState {
  const earned = ACHIEVEMENTS
    .filter((a) => a.condition(state))
    .map((a) => a.id)
  return { ...state, earnedAchievements: earned }
}

// ─── Context type ─────────────────────────────────────────────────────────────

interface ProgressContextValue {
  state: ProgressState
  completionPct: number
  markLessonComplete: (path: string) => void
  visitLesson: (path: string) => void
  markPlaygroundUsed: () => void
  submitQuiz: (lessonPath: string, score: number, total: number) => void
  resetProgress: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProgressContext = createContext<ProgressContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadState())

  const update = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = withAchievements(updater(prev))
      saveState(next)
      return next
    })
  }, [])

  const markLessonComplete = useCallback((path: string) => {
    update((prev) => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(path)
        ? prev.completedLessons
        : [...prev.completedLessons, path],
    }))
  }, [update])

  const visitLesson = useCallback((path: string) => {
    update((prev) => {
      const filtered = prev.lastVisited.filter((p) => p !== path)
      return {
        ...prev,
        lastVisited: [path, ...filtered].slice(0, MAX_VISITED),
      }
    })
  }, [update])

  const markPlaygroundUsed = useCallback(() => {
    update((prev) => prev.playgroundUsed ? prev : { ...prev, playgroundUsed: true })
  }, [update])

  const submitQuiz = useCallback((lessonPath: string, score: number, total: number) => {
    const result: QuizResult = { score, total, date: new Date().toISOString() }
    update((prev) => ({
      ...prev,
      quizResults: { ...prev.quizResults, [lessonPath]: result },
      completedLessons: prev.completedLessons.includes(lessonPath)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonPath],
    }))
  }, [update])

  const resetProgress = useCallback(() => {
    const fresh: ProgressState = { completedLessons: [], lastVisited: [], playgroundUsed: false, quizResults: {}, earnedAchievements: [] }
    saveState(fresh)
    setState(fresh)
  }, [])

  const completionPct = Math.round((state.completedLessons.length / TOTAL_LESSONS) * 100)

  return (
    <ProgressContext.Provider value={{ state, completionPct, markLessonComplete, visitLesson, markPlaygroundUsed, submitQuiz, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}
