import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { RICHARDSON_CONFIG } from '@/config/lessons/richardson'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import { differentiationService } from '@/services/differentiationService'
import type { DifferentiationResult } from '@/types/api.types'
import type { PlaygroundPreset } from '@/types/lesson.types'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'

const COLOR = '#f59e0b'

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 60, r: 20, t: 30, b: 50 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155', color: '#94a3b8' },
  showlegend: true,
  legend: { bgcolor: 'rgba(15,23,42,0.8)', bordercolor: '#334155', borderwidth: 1 },
  autosize: true,
}

// Build a static Richardson table for demo (f = sin(x) at x=1)
const DEMO_F  = (x: number) => Math.sin(x)
const DEMO_X  = 1.0
const DEMO_EXACT = Math.cos(DEMO_X) // f'(x) = cos(x)

function centralDiff(h: number): number {
  return (DEMO_F(DEMO_X + h) - DEMO_F(DEMO_X - h)) / (2 * h)
}

interface RichardsonFrame {
  table: (number | null)[][]
  hValues: number[]
  activeRow: number
  activeCol: number
  desc: string
}

function buildRichardsonFrames(): RichardsonFrame[] {
  const frames: RichardsonFrame[] = []
  const K = 4
  const H_BASE = 0.4
  const hVals = Array.from({ length: K }, (_, k) => H_BASE / Math.pow(2, k))

  // Initialize table with central difference values
  const table: (number | null)[][] = Array.from({ length: K }, () => Array.from({ length: K }, () => null))
  for (let k = 0; k < K; k++) {
    table[k][0] = centralDiff(hVals[k])
  }

  frames.push({
    table: table.map(r => [...r]),
    hValues: hVals,
    activeRow: 0, activeCol: 0,
    desc: `Column 0: Central differences D(h) = (f(x+h)−f(x−h))/(2h). D(h₀)=${table[0][0]!.toFixed(8)}`,
  })

  // Build Richardson table column by column
  for (let j = 1; j < K; j++) {
    for (let k = 0; k < K - j; k++) {
      const q = 4   // 2^p = 4 for p=2
      table[k][j] = (q * table[k + 1][j - 1]! - table[k][j - 1]!) / (q - 1)
      frames.push({
        table: table.map(r => [...r]),
        hValues: hVals,
        activeRow: k, activeCol: j,
        desc: `R[${k}][${j}] = (4·R[${k+1}][${j-1}] − R[${k}][${j-1}]) / 3 = ${table[k][j]!.toFixed(10)} | err=${Math.abs(table[k][j]! - DEMO_EXACT).toExponential(3)}`,
      })
    }
  }
  return frames
}

const RICH_FRAMES = buildRichardsonFrames()

// Error vs h chart data
const H_RANGE = Array.from({ length: 30 }, (_, i) => Math.pow(10, -0.1 * i - 0.5))

const PRESETS: PlaygroundPreset[] = [
  { id: 'r1', label: 'sin(x) at x=1',   description: 'exact cos(1)≈0.5403',  params: { expr: 'sin(x)',  xp: 1,   h: 0.1 } },
  { id: 'r2', label: 'exp(x) at x=0',   description: 'exact 1.0',             params: { expr: 'exp(x)',  xp: 0,   h: 0.1 } },
  { id: 'r3', label: 'x³ at x=2',       description: 'exact 12.0',            params: { expr: 'x**3',   xp: 2,   h: 0.2 } },
  { id: 'r4', label: 'ln(x) at x=1',    description: 'exact 1.0',             params: { expr: 'log(x)', xp: 1,   h: 0.1 } },
]

type TableRow = Record<string, unknown> & { level: number; h: string; central: string; richardson: string; error: string }

export default function RichardsonPage() {
  const [expression, setExpression] = useState('sin(x)')
  const [xPoint,     setXPoint]     = useState(1.0)
  const [h,          setH]          = useState(0.1)
  const [result,     setResult]     = useState<DifferentiationResult | null>(null)
  const [isLoading,  setIsLoading]  = useState(false)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await differentiationService.differentiate({
        expression, x_point: xPoint, h, method: 'richardson',
      })
      setResult(res)
    } catch (err) {
      console.error('[RichardsonPage] error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [expression, xPoint, h])

  const handleReset = useCallback(() => setResult(null), [])

  const applyPreset = (p: PlaygroundPreset) => {
    const v = p.params as Record<string, string | number>
    setExpression(String(v.expr))
    setXPoint(Number(v.xp))
    setH(Number(v.h))
    setResult(null)
  }

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="section-label">f(x)</label>
          <input type="text" value={expression}
            onChange={e => { setExpression(e.target.value); handleReset() }}
            className="input-field font-mono"
            placeholder="e.g. sin(x)" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">x₀</label>
          <input type="number" value={xPoint} step={0.1}
            onChange={e => { setXPoint(Number(e.target.value)); handleReset() }}
            className="input-field" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="section-label">h (initial step)</label>
          <input type="number" value={h} step={0.01} min={1e-6}
            onChange={e => { setH(Number(e.target.value)); handleReset() }}
            className="input-field" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={handleCompute} disabled={isLoading} className="btn-primary px-6"
          style={!isLoading ? { backgroundColor: COLOR, borderColor: COLOR } : {}}>
          {isLoading ? 'Computing...' : 'Differentiate (Richardson)'}
        </button>
        {result && <button onClick={handleReset} className="btn-secondary px-4">Reset</button>}
      </div>
    </div>
  )

  const resultsPanel = result ? (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: "f'(x₀)", value: result.derivative.toFixed(12), color: COLOR },
        { label: 'Exact',  value: result.exact_derivative !== undefined ? result.exact_derivative.toFixed(12) : 'N/A', color: '#8b5cf6' },
        { label: '|Error|', value: result.absolute_error !== undefined ? result.absolute_error.toExponential(4) : 'N/A', color: result.absolute_error !== undefined && result.absolute_error < 1e-8 ? '#4ade80' : '#f87171' },
        { label: 'Method', value: 'Richardson', color: COLOR },
      ].map(m => (
        <div key={m.label} className="glass-card p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">{m.label}</div>
          <div className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
        </div>
      ))}
    </div>
  ) : undefined

  // Build Richardson table rows for AlgorithmExecution
  const richTable: TableRow[] = result?.steps
    ? result.steps.h_values.map((hv, i) => ({
        level: i,
        h: hv.toExponential(4),
        central: (result.steps!.table[i]?.[0] ?? 0).toFixed(10),
        richardson: (result.steps!.table[i]?.[i] ?? 0).toFixed(10),
        error: result.exact_derivative !== undefined
          ? Math.abs((result.steps!.table[i]?.[i] ?? 0) - result.exact_derivative).toExponential(4)
          : '—',
      }))
    : []

  const richCols = [
    { key: 'level'      as keyof TableRow, header: 'Level' },
    { key: 'h'          as keyof TableRow, header: 'h' },
    { key: 'central'    as keyof TableRow, header: 'D(h) central' },
    { key: 'richardson' as keyof TableRow, header: 'Richardson R[k][k]', highlight: true },
    { key: 'error'      as keyof TableRow, header: '|Error|' },
  ]

  // Visualization: error vs h for central vs Richardson
  const centralErrors = H_RANGE.map(hv => {
    const d = centralDiff(hv)
    return Math.abs(d - DEMO_EXACT)
  })
  const richErrors = H_RANGE.map(hv => {
    const d1 = centralDiff(hv)
    const d2 = centralDiff(hv / 2)
    const r1 = (4 * d2 - d1) / 3
    return Math.abs(r1 - DEMO_EXACT)
  })

  const vizData: Plotly.Data[] = [
    {
      x: H_RANGE, y: centralErrors.map(e => Math.max(e, 1e-17)),
      type: 'scatter', mode: 'lines', name: 'Central O(h²)',
      line: { color: '#8b5cf6', width: 2.5 },
    },
    {
      x: H_RANGE, y: richErrors.map(e => Math.max(e, 1e-17)),
      type: 'scatter', mode: 'lines', name: 'Richardson O(h⁴)',
      line: { color: COLOR, width: 2.5 },
    },
  ]

  // Animation: Richardson table building
  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames: RICH_FRAMES.length,
    fps: 1.5,
    loop: false,
  })
  const af = RICH_FRAMES[Math.min(frame, RICH_FRAMES.length - 1)]
  const K = 4

  return (
    <LessonPage
      config={RICHARDSON_CONFIG}
      primaryMethod="richardson"
      liveErrors={result ? { absoluteError: result.absolute_error } : undefined}
      renderVisualization={() => (
        <InteractiveVisualization description="Error vs h for central difference O(h²) vs Richardson O(h⁴). For f=sin(x), x=1. Richardson achieves same accuracy with h 4× larger.">
          <Plot
            data={vizData}
            layout={{
              ...DARK_LAYOUT,
              xaxis: { ...DARK_LAYOUT.xaxis, type: 'log', title: { text: 'h', font: { color: '#94a3b8' } }, autorange: 'reversed' },
              yaxis: { ...DARK_LAYOUT.yaxis, type: 'log', title: { text: '|error|', font: { color: '#94a3b8' } } },
            } as Partial<Plotly.Layout>}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '260px' }}
          />
          <p className="text-xs text-slate-400 mt-2 text-center">
            Both slopes visible: central O(h²) drops as h², Richardson O(h⁴) drops as h⁴ — 4× steeper on log-log.
          </p>
        </InteractiveVisualization>
      )}
      renderAnimation={() => (
        <StepAnimation
          totalFrames={RICH_FRAMES.length}
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
          <p className="text-xs text-slate-400 mb-3">Building Richardson table for f=sin(x), x=1 (exact: cos(1) = {DEMO_EXACT.toFixed(10)})</p>
          <div className="overflow-x-auto">
            <table className="text-xs font-mono w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-1 px-2 text-slate-400">h</th>
                  {Array.from({ length: K }, (_, j) => (
                    <th key={j} className="text-left py-1 px-2 text-slate-400">
                      {j === 0 ? 'D(h) O(h²)' : `R[·][${j}] O(h${2*j+2}⁾)`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {af.hValues.map((hv, i) => (
                  <tr key={i} className="border-b border-surface-border/30">
                    <td className="py-1 px-2 text-slate-300">{hv.toFixed(4)}</td>
                    {af.table[i].map((val, j) => (
                      <td key={j} className="py-1 px-2 transition-colors"
                        style={{
                          color: i === af.activeRow && j === af.activeCol
                            ? '#f59e0b'
                            : val !== null
                            ? j === 0 ? '#8b5cf6' : COLOR
                            : '#334155',
                        }}>
                        {val !== null ? val.toFixed(8) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Highlighted cell: currently computing. Each column eliminates one order of error.
          </div>
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
            description="Richardson extrapolation for numerical differentiation. Achieves O(h⁴) accuracy by combining D(h) and D(h/2) central difference estimates."
          />
          {richTable.length > 0 && (
            <AlgorithmExecution
              iterations={richTable}
              columns={richCols}
              status="converged"
              description="Richardson extrapolation table (exact derivative in column R[0][k])"
            />
          )}
        </>
      )}
    />
  )
}
