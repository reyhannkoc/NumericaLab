import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PracticeExercise as Exercise } from '@/types/numerical.types'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import type { ColorScheme } from '@/types/ui.types'

interface PracticeExerciseProps {
  exercises: Exercise[]
}

const difficultyColor: Record<Exercise['difficulty'], ColorScheme> = {
  easy:   'green',
  medium: 'amber',
  hard:   'red',
}

export default function PracticeExercises({ exercises }: PracticeExerciseProps) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setRevealed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-white">Practice Exercises</h3>
      {exercises.map((ex, i) => (
        <Card key={ex.id} className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="step-badge text-xs">{i + 1}</span>
              <h4 className="font-medium text-sm text-white">{ex.title}</h4>
            </div>
            <Badge color={difficultyColor[ex.difficulty]}>{ex.difficulty}</Badge>
          </div>
          <p className="text-sm text-slate-300 ml-9">{ex.description}</p>
          {ex.hint && (
            <>
              <Button
                variant="ghost"
                size="xs"
                className="ml-9"
                onClick={() => toggle(ex.id)}
              >
                {revealed.has(ex.id) ? 'Hide hint' : 'Show hint'}
              </Button>
              <AnimatePresence>
                {revealed.has(ex.id) && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md p-2 ml-9"
                  >
                    Hint: {ex.hint}
                  </motion.p>
                )}
              </AnimatePresence>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}
