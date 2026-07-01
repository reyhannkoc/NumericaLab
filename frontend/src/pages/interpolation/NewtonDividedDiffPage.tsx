import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { NEWTON_DIVIDED_DIFF_CONFIG } from '@/config/lessons/newtonDividedDiff'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import { interpolationService } from '@/services/interpolationService'
import type { InterpolationResult } from '@/types/api.types'
import type { PlaygroundPreset } from '@/types/lesson.types'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'

const COLOR = '#ec4899'

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 50, r: 20, t: 30, b: 45 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  showlegend: true,
  legend: { bgcolor: 'rgba(15,23,42,0.8)', bordercolor: '#334155', borderwidth: 1 },
  autosize: true,
}

function parseNumbers(s: string): number[] {
  return s.split(',').map(t => parseFloat(t.trim())).filter(isFinite)
}

// Static divided difference demo for animation
const DEMO_XS = [0, 1, 2, 3]
const DEMO_YS = [1, 4, 11, 22]  // y = x² + 2x + 1 sampled

function buildDDTable(xs: number[], ys: number[]): number[][] {
  const n = xs.length
  const D: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => j === 0 ? ys[i] : 0))
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      D[i][j] = (D[i + 1][j - 1] - D[i][j - 1]) / (xs[i + j] - xs[i])
    }
  }
  return D
}

interface DDFrame { table: number[][]; col: number; row: number; desc: string }

function buildDDFrames(): DDFrame[] {
  const frames: DDFrame[] = []
  const n = DEMO_XS.length
  const D: number[][] = Array.from({ length: n }, (_, i) => [DEMO_YS[i], 0, 0, 0])
  frames.push({ table: D.map(r => [...r]), col: 0, row: 0, desc: `Column 0 (function values): D[k][0] = y_k` })
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      D[i][j] = (D[i + 1][j - 1] - D[i][j - 1]) / (DEMO_XS[i + j] - DEMO_XS[i])
      frames.push({
        table: D.map(r => [...r]),
        col: j, row: i,
        desc: `D[${i}][${j}] = (D[${i+1}][${j-1}] − D[${i}][${j-1}]) / (x${i+j} − x${i}) = ${D[i][j].toFixed(4)}`,
      })
    }
  }
  return frames
}

const DD_FRAMES = buildDDFrames()

const PRESETS: PlaygroundPreset[] = [
  { id: 'p1', label: 'Square pts',  description: 'y=x² at x=0..4',        params: { xs: '0,1,2,3,4',     ys: '0,1,4,9,16',    q: '0.5,1.5,2.5,3.5' } },
  { id: 'p2', label: 'sin(x)',      description: 'sin sampled at 6 pts',  params: { xs: '0,1,2,3,4,5',   ys: '0,0.8415,0.9093,0.1411,-0.7568,-0.9589', q: '0.5,2.5,4.5' } },
  { id: 'p3', label: 'Runge data',  description: '1/(1+25x²) on [-1,1]', params: { xs: '-1,-0.5,0,0.5,1', ys: '0.0385,0.1379,1,0.1379,0.0385', q: '-0.75,0.75' } },
  { id: 'p4', label: 'Cubic',       description: 'y=x³ at x=0..3',        params: { xs: '0,1,2,3',        ys: '0,1,8,27',      q: '0.5,1.5,2.5' } },
]

type CoeffRow = Record<string, unknown> & { k: number; coeff: string; desc: string }

export default function NewtonDividedDiffPage() {
  const [xPoints,     setXPoints]     = useState('0,1,2,3,4')
  const [yPoints,     setYPoints]     = useState('0,1,4,9,16')
  const [queryPts,    setQueryPts]    = useState('0.5,1.5,2.5,3.5')
  const [result,      setResult]      = useState<InterpolationResult | null>(null)
  const [isLoading,   setIsLoading]   = useState(false)
  const [showTable,   setShowTable]   = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  const handleCompute = useCallback(async () => {
    const xs = parseNumbers(xPoints)
    const ys = parseNumbers(yPoints)
    const qs = parseNumbers(queryPts)
    if (xs.length < 2 || xs.length !== ys.length || qs.length === 0) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await interpolationService.interpolate({
        x_points: xs, y_points: ys, query_points: qs, method: 'newton_divided_diff',
      })
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [xPoints, yPoints, queryPts])

  const handleReset = useCallback(() => { setResult(null); setError(null) }, [])

  const applyPreset = (p: PlaygroundPreset) => {
    const v = p.params as Record<string, string>
    setXPoints(v.xs); setYPoints(v.ys); setQueryPts(v.q); setResult(null)
  }

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'x points (comma-separated)', val: xPoints, set: setXPoints },
          { label: 'y points (comma-separated)', val: yPoints, set: setYPoints },
          { label: 'Query points',               val: queryPts, set: setQueryPts },
        ].map(f => (
          <div key={f.label} className="flex flex-col gap-1">
            <label className="section-label">{f.label}</label>
            <input type="text" value={f.val}
              onChange={e => { f.set(e.target.value); handleReset() }}
              className="input-field font-mono text-sm" />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={handleCompute} disabled={isLoading} className="btn-primary px-6"
          style={!isLoading ? { backgroundColor: COLOR, borderColor: COLOR } : {}}>
          {isLoading ? 'Computing...' : 'Interpolate (Newton DD)'}
        </button>
        {result && <button onClick={handleReset} className="btn-secondary px-4">Reset</button>}
      </div>
    </div>
  )

  const resultsPanel = result ? (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-surface-border">
            {['Query x', 'p(x)', 'Method'].map(h => (
              <th key={h} className="text-left py-2 px-3 text-slate-400">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {result.query_points.map((qx, i) => (
              <tr key={i} className="border-b border-surface-border/50">
                <td className="py-1 px-3 font-mono text-xs text-slate-300">{qx}</td>
                <td className="py-1 px-3 font-mono text-xs text-white font-bold">{result.interpolated_values[i].toFixed(8)}</td>
                <td className="py-1 px-3 text-xs" style={{ color: COLOR }}>Newton DD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.divided_differences && (
        <button onClick={() => setShowTable(t => !t)} className="text-xs transition-colors" style={{ color: COLOR }}>
          {showTable ? 'Hide' : 'Show'} divided difference table
        </button>
      )}
    </div>
  ) : undefined

  // Visualization: show the polynomial curve
  const xs = parseNumbers(xPoints)
  const ys = parseNumbers(yPoints)
  const hasData = xs.length >= 2 && xs.length === ys.length
  const plotXMin = hasData ? Math.min(...xs) - 0.5 : -1
  const plotXMax = hasData ? Math.max(...xs) + 0.5 : 5
  const curveX = result?.curve_x ?? []
  const curveY = result?.curve_y ?? []

  const vizData: Plotly.Data[] = [
    ...(curveX.length > 0 ? [{
      x: curveX, y: curveY, type: 'scatter' as const, mode: 'lines' as const,
      name: 'Newton poly', line: { color: COLOR, width: 2.5 },
    }] : []),
    {
      x: xs, y: ys, type: 'scatter', mode: 'markers',
      name: 'Data', marker: { color: '#f59e0b', size: 9, symbol: 'circle' },
    } as Plotly.Data,
    ...(result ? result.query_points.map((qx, i) => ({
      x: [qx], y: [result.interpolated_values[i]],
      type: 'scatter' as const, mode: 'markers' as const,
      name: `p(${qx})`,
      marker: { color: '#4ade80', size: 9, symbol: 'diamond' },
    } as Plotly.Data)) : []),
  ]

  // DD table frame for visualization
  const ddTable = hasData ? buildDDTable(xs, ys) : null

  const coeffRows: CoeffRow[] = ddTable
    ? xs.map((_, k) => ({
        k,
        coeff: ddTable[0][k].toFixed(6),
        desc: `d${k} = [y₀${k > 0 ? ',...,y' + k : ''}]`,
      }))
    : []
  const coeffCols = [
    { key: 'k'    as keyof CoeffRow, header: 'k' },
    { key: 'coeff' as keyof CoeffRow, header: 'Coefficient dₖ', highlight: true },
    { key: 'desc'  as keyof CoeffRow, header: 'Divided Difference' },
  ]

  // Animation: divided difference table building
  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames: DD_FRAMES.length,
    fps: 1.5,
    loop: false,
  })
  const af = DD_FRAMES[Math.min(frame, DD_FRAMES.length - 1)]

  return (
    <LessonPage
      config={NEWTON_DIVIDED_DIFF_CONFIG}
      primaryMethod="newton_divided_diff"
      renderVisualization={() => (
        <InteractiveVisualization description="Newton divided difference polynomial through your data points. Diamond markers show interpolated query values.">
          <Plot
            data={vizData}
            layout={{
              ...DARK_LAYOUT,
              xaxis: { ...DARK_LAYOUT.xaxis, range: [plotXMin, plotXMax] },
            } as Partial<Plotly.Layout>}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '260px' }}
          />
          {coeffRows.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-2">Newton coefficients (first row of DD table):</p>
              <div className="flex flex-wrap gap-2">
                {coeffRows.map(r => (
                  <div key={r.k} className="bg-surface-card rounded px-2 py-1 text-xs font-mono">
                    <span className="text-slate-400">d{r.k}=</span>
                    <span style={{ color: COLOR }}>{r.coeff}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InteractiveVisualization>
      )}
      renderAnimation={() => (
        <StepAnimation
          totalFrames={DD_FRAMES.length}
          frame={frame}
          status={status}
          speed={1}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onStepBack={stepBackward}
          onStepForward={stepForward}
          onSpeedChange={() => {}}
          stepDescription={af.desc}
        >
          <p className="text-xs text-slate-400 mb-2">Building divided difference table for: (0,1), (1,4), (2,11), (3,22)</p>
          <div className="overflow-x-auto">
            <table className="text-xs font-mono w-full">
              <thead><tr className="border-b border-surface-border">
                <th className="text-left py-1 px-2 text-slate-400">xᵢ</th>
                <th className="text-left py-1 px-2 text-slate-400">yᵢ</th>
                {[1, 2, 3].map(j => (
                  <th key={j} className="text-left py-1 px-2 text-slate-400">Order {j}</th>
                ))}
              </tr></thead>
              <tbody>
                {DEMO_XS.map((x, i) => (
                  <tr key={i} className="border-b border-surface-border/30">
                    <td className="py-1 px-2 text-slate-300">{x}</td>
                    {af.table[i].slice(0, 4).map((val, j) => (
                      <td key={j} className="py-1 px-2"
                        style={{
                          color: (i === 0 && j === af.col && i === af.row) || (i === af.row && j === af.col)
                            ? '#f59e0b'
                            : val !== 0 ? COLOR : '#334155',
                        }}>
                        {val !== 0 || j === 0 ? val.toFixed(3) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Coefficients d₀, d₁, d₂, d₃ = first row: {af.table[0].map(v => v.toFixed(3)).join(', ')}</p>
        </StepAnimation>
      )}
      renderPlayground={() => (
        <>
          <InteractivePlayground
            controls={controls}
            results={resultsPanel}
            presets={PRESETS}
            onPresetSelect={applyPreset}
            onRun={handleCompute}
            onReset={handleReset}
            isLoading={isLoading}
            error={error}
            description="Newton divided differences interpolation. Enter x and y data points, then query values to interpolate."
          />
          {showTable && coeffRows.length > 0 && (
            <AlgorithmExecution
              iterations={coeffRows}
              columns={coeffCols}
              status="converged"
              description="Newton polynomial coefficients (divided differences)"
            />
          )}
        </>
      )}
    />
  )
}
