import type { SliderConfig } from '@/types/ui.types'
import { clsx } from 'clsx'

interface SliderProps extends SliderConfig {
  className?: string
}

export default function Slider({
  min, max, step, value, label, unit, onChange, className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={clsx('param-group', className)}>
      <div className="param-label">
        <span>{label}</span>
        <span className="param-value">
          {value}
          {unit && <span className="text-slate-500 ml-0.5">{unit}</span>}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 appearance-none rounded-full cursor-pointer
                     bg-surface-border
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-brand-500
                     [&::-webkit-slider-thumb]:shadow-glow-brand/50
                     [&::-webkit-slider-thumb]:cursor-grab"
          style={{
            background: `linear-gradient(to right, #6366f1 ${percentage}%, #334155 ${percentage}%)`,
          }}
        />
      </div>
    </div>
  )
}
