import { useState } from 'react'
import { clsx } from 'clsx'
import type { QuizQuestion } from '@/types/progress.types'

interface QuizSectionProps {
  questions: QuizQuestion[]
  lessonTitle: string
  onComplete: (score: number, total: number) => void
}

type AnswerMap = Record<string, number>  // question id → chosen index

export default function QuizSection({ questions, lessonTitle, onComplete }: QuizSectionProps) {
  const [answers,   setAnswers]   = useState<AnswerMap>({})
  const [submitted, setSubmitted] = useState(false)
  const [score,     setScore]     = useState(0)

  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  const handleSubmit = () => {
    const s = questions.filter((q) => answers[q.id] === q.correct).length
    setScore(s)
    setSubmitted(true)
    onComplete(s, questions.length)
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  const pct = Math.round((score / questions.length) * 100)

  return (
    <div className="mt-12 border-t-2 border-brand-500/30 pt-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🧠</span>
            <h2 className="text-lg font-bold text-white">Knowledge Check</h2>
          </div>
          <p className="text-sm text-slate-400">{lessonTitle} — {questions.length} questions</p>
        </div>
        {submitted && (
          <div className={clsx(
            'text-center px-4 py-2 rounded-xl border',
            pct >= 80
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : pct >= 60
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          )}>
            <div className="text-2xl font-bold tabular-nums">{score}/{questions.length}</div>
            <div className="text-xs mt-0.5">{pct}%</div>
          </div>
        )}
      </div>

      {/* Score bar (only after submit) */}
      {submitted && (
        <div className="mb-6 glass-card p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Score</span>
            <span className={clsx('font-semibold', pct >= 80 ? 'text-green-400' : pct >= 60 ? 'text-yellow-400' : 'text-rose-400')}>
              {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good effort' : 'Keep studying'}
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-card overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all duration-700', pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-rose-500')}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((q, qi) => {
          const chosen = answers[q.id]
          const isCorrect = chosen === q.correct
          const showResult = submitted

          return (
            <div
              key={q.id}
              className={clsx(
                'glass-card p-5 transition-all',
                showResult && isCorrect   && 'border-green-500/40',
                showResult && !isCorrect  && chosen !== undefined && 'border-rose-500/40',
              )}
            >
              {/* Question text */}
              <p className="text-sm font-medium text-white mb-3">
                <span className="text-brand-400 mr-2">Q{qi + 1}.</span>
                {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen  = chosen === oi
                  const isCorrectOpt = oi === q.correct

                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                      className={clsx(
                        'w-full text-left flex items-start gap-3 px-4 py-2.5 rounded-lg text-sm transition-all',
                        !submitted && isChosen   && 'bg-brand-600/20 border border-brand-500/50 text-white',
                        !submitted && !isChosen  && 'bg-surface-card border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-white',
                        submitted && isCorrectOpt && 'bg-green-500/15 border border-green-500/50 text-green-300',
                        submitted && isChosen && !isCorrectOpt && 'bg-rose-500/15 border border-rose-500/50 text-rose-300',
                        submitted && !isChosen && !isCorrectOpt && 'bg-surface-card border border-surface-border text-slate-500',
                      )}
                    >
                      <span className={clsx(
                        'w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold mt-0.5',
                        submitted && isCorrectOpt ? 'border-green-500 text-green-400' :
                        submitted && isChosen && !isCorrectOpt ? 'border-rose-500 text-rose-400' :
                        isChosen ? 'border-brand-400 bg-brand-600/30 text-brand-300' :
                        'border-surface-border text-slate-500',
                      )}>
                        {submitted
                          ? isCorrectOpt ? '✓' : (isChosen ? '✗' : String.fromCharCode(65 + oi))
                          : String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {submitted && (
                <div className={clsx(
                  'mt-3 rounded-lg px-4 py-2.5 text-xs leading-relaxed border',
                  isCorrect
                    ? 'bg-green-500/8 border-green-500/20 text-green-300'
                    : 'bg-brand-500/8 border-brand-500/20 text-brand-300',
                )}>
                  <span className="font-semibold mr-1">{isCorrect ? 'Correct!' : 'Explanation:'}</span>
                  {q.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Answers
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-surface-card border border-surface-border text-slate-300 hover:text-white transition-colors"
          >
            Try Again
          </button>
        )}
        {!allAnswered && !submitted && (
          <span className="text-xs text-slate-500">
            Answer all {questions.length} questions to submit.
          </span>
        )}
      </div>
    </div>
  )
}
