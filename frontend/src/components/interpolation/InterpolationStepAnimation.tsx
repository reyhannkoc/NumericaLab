import { useMemo, useState } from 'react'
import Plot from 'react-plotly.js'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import type { InterpolationMethod, InterpolationResult } from '@/types/api.types'

type InterpMethod = Extract<InterpolationMethod, 'lagrange' | 'cubic_spline'>

interface Props {
  method: InterpMethod
  result: InterpolationResult | null
}

// ─── Plotly config ────────────────────────────────────────────────────────────

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 55, r: 20, t: 35, b: 45 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.65, y: 0.98 },
}
const PLOTLY_CONFIG = { displayModeBar: false, responsive: true }

// ─── Component ────────────────────────────────────────────────────────────────

export default function InterpolationStepAnimation({ method, result }: Props) {
  const [speed, setSpeed] = useState(1)

  const curveX = result?.curve_x ?? []
  const curveY = result?.curve_y ?? []

  const totalFrames = Math.max(1, curveX.length)

  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames,
    fps: speed * 30,
    loop: false,
  })

  // Reveal portion of curve up to current frame
  const visibleX = useMemo(() => curveX.slice(0, frame + 1), [frame, curveX.length]) // eslint-disable-line react-hooks/exhaustive-deps
  const visibleY = useMemo(() => curveY.slice(0, frame + 1), [frame, curveY.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const traces: Plotly.Data[] = result ? [
    {
      x: visibleX, y: visibleY,
      type: 'scatter', mode: 'lines',
      line: { color: method === 'lagrange' ? '#60a5fa' : '#34d399', width: 2.5 },
      name: method === 'lagrange' ? 'Lagrange curve' : 'Cubic spline',
    },
    {
      x: result.query_points, y: result.interpolated_values,
      type: 'scatter', mode: 'markers',
      marker: { color: '#f59e0b', size: 9, symbol: 'circle', line: { color: '#fff', width: 1 } },
      name: 'Query points',
    },
  ] : []

  const xRange = curveX.length > 0
    ? [curveX[0] - 0.1, curveX[curveX.length - 1] + 0.1] as [number, number]
    : undefined

  const pct = totalFrames > 1 ? Math.round((frame / (totalFrames - 1)) * 100) : 100

  const stepDesc = result
    ? `Drawing interpolated curve: ${pct}% complete`
    : 'Run the playground below to load interpolation data into this animation.'

  return (
    <StepAnimation
      totalFrames={totalFrames}
      frame={frame}
      status={status}
      speed={speed}
      onPlay={play}
      onPause={pause}
      onReset={reset}
      onStepBack={stepBackward}
      onStepForward={stepForward}
      onSpeedChange={(s) => {
        setSpeed(s)
        if (status === 'playing') { pause(); setTimeout(play, 50) }
      }}
      stepDescription={stepDesc}
    >
      {!result ? (
        <div className="flex items-center justify-center h-[280px] text-slate-500 text-sm">
          Run the Interactive Playground below — the interpolated curve will animate here.
        </div>
      ) : (
        <Plot
          data={traces}
          layout={{
            ...DARK_LAYOUT,
            xaxis: {
              ...DARK_LAYOUT.xaxis,
              range: xRange,
              title: { text: 'x', font: { color: '#94a3b8' } },
            },
            yaxis: {
              ...DARK_LAYOUT.yaxis,
              title: { text: 'y', font: { color: '#94a3b8' } },
            },
            title: {
              text: `${method === 'lagrange' ? 'Lagrange Polynomial' : 'Cubic Spline'} — curve reveal`,
              font: { color: '#64748b', size: 12 },
              x: 0.01,
            },
          } as Partial<Plotly.Layout>}
          config={PLOTLY_CONFIG}
          style={{ width: '100%', height: '280px' }}
        />
      )}
    </StepAnimation>
  )
}
