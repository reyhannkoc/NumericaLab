import Button from '@components/ui/Button'
import type { AnimationStatus } from '@/hooks/useAnimation'

interface PlaybackControlsProps {
  status: AnimationStatus
  frame: number
  total: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStepForward: () => void
  onStepBackward: () => void
}

export default function PlaybackControls({
  status, frame, total,
  onPlay, onPause, onReset, onStepForward, onStepBackward,
}: PlaybackControlsProps) {
  const isPlaying = status === 'playing'

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={onReset}>⟲</Button>
      <Button variant="secondary" size="sm" onClick={onStepBackward} disabled={frame === 0}>‹</Button>
      <Button
        variant="primary"
        size="sm"
        onClick={isPlaying ? onPause : onPlay}
        disabled={status === 'finished'}
        className="w-16"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <Button variant="secondary" size="sm" onClick={onStepForward} disabled={frame >= total - 1}>›</Button>
      <span className="text-xs font-mono text-slate-500 ml-1">
        {frame + 1} / {total}
      </span>
    </div>
  )
}
