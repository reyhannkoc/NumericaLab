import { useCallback, useRef, useState } from 'react'

export type AnimationStatus = 'idle' | 'playing' | 'paused' | 'finished'

interface UseAnimationOptions {
  totalFrames: number
  fps?: number
  loop?: boolean
}

interface UseAnimationReturn {
  frame: number
  status: AnimationStatus
  play: () => void
  pause: () => void
  reset: () => void
  stepForward: () => void
  stepBackward: () => void
  seek: (frame: number) => void
}

/**
 * Controls frame-based animations for algorithm visualizations.
 * Components drive their visuals from `frame` index.
 */
export function useAnimation({
  totalFrames,
  fps = 2,
  loop = false,
}: UseAnimationOptions): UseAnimationReturn {
  const [frame, setFrame] = useState(0)
  const [status, setStatus] = useState<AnimationStatus>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    stop()
    setStatus('playing')
    intervalRef.current = setInterval(() => {
      setFrame((prev) => {
        if (prev >= totalFrames - 1) {
          if (loop) return 0
          stop()
          setStatus('finished')
          return prev
        }
        return prev + 1
      })
    }, 1000 / fps)
  }, [fps, loop, stop, totalFrames])

  const pause = useCallback(() => {
    stop()
    setStatus('paused')
  }, [stop])

  const reset = useCallback(() => {
    stop()
    setFrame(0)
    setStatus('idle')
  }, [stop])

  const stepForward = useCallback(() => {
    setFrame((prev) => Math.min(prev + 1, totalFrames - 1))
  }, [totalFrames])

  const stepBackward = useCallback(() => {
    setFrame((prev) => Math.max(prev - 1, 0))
  }, [])

  const seek = useCallback((f: number) => {
    setFrame(Math.max(0, Math.min(f, totalFrames - 1)))
  }, [totalFrames])

  return { frame, status, play, pause, reset, stepForward, stepBackward, seek }
}
