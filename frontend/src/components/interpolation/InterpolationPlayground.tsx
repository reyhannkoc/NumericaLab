import Plot from 'react-plotly.js'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import type { PlaygroundPreset } from '@/types/lesson.types'
import type { InterpolationResult, InterpolationMethod, SplineSegment } from '@/types/api.types'

type InterpMethod = Extract<InterpolationMethod, 'lagrange' | 'cubic_spline'>

// ─── Props ────────────────────────────────────────────────────────────────────

export interface InterpolationPlaygroundProps {
  method: InterpMethod
  xPoints: string
  yPoints: string
  queryPoints: string
  onXPointsChange: (v: string) => void
  onYPointsChange: (v: string) => void
  onQueryPointsChange: (v: string) => void
  result: InterpolationResult | null
  isLoading: boolean
  onCompute: () => void
  onReset: () => void
  error?: string | null
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const LAGRANGE_PRESETS: PlaygroundPreset[] = [
  {
    id: 'l1', label: 'x²',
    description: 'Quadratic — Lagrange degree 4 reproduces exactly',
    params: { x: '0,1,2,3,4', y: '0,1,4,9,16', q: '0.5,1.5,2.5,3.5' },
  },
  {
    id: 'l2', label: 'sin(x)',
    description: 'sin(x) at 6 points',
    params: { x: '0,1,2,3,4,5', y: '0,0.8415,0.9093,0.1411,-0.7568,-0.9589', q: '0.5,1.5,2.5,3.5,4.5' },
  },
  {
    id: 'l3', label: 'eˣ',
    description: 'Exponential — degree 3',
    params: { x: '0,1,2,3', y: '1,2.718,7.389,20.086', q: '0.5,1.5,2.5' },
  },
  {
    id: 'l4', label: 'Runge',
    description: '1/(1+x²) — observe oscillation at endpoints',
    params: { x: '-3,-2,-1,0,1,2,3', y: '0.1,0.2,0.5,1.0,0.5,0.2,0.1', q: '-2.5,-0.5,0.5,2.5' },
  },
  {
    id: 'l5', label: 'Aero',
    description: 'Drag coefficient vs Mach number',
    params: { x: '0.3,0.6,0.9,1.2,1.5', y: '0.018,0.020,0.028,0.035,0.030', q: '0.45,0.75,1.05,1.35' },
  },
]

const SPLINE_PRESETS: PlaygroundPreset[] = [
  {
    id: 's1', label: 'sin(x)',
    description: 'sin(x) — spline vs Lagrange comparison',
    params: { x: '0,1,2,3,4,5', y: '0,0.8415,0.9093,0.1411,-0.7568,-0.9589', q: '0.5,1.5,2.5,3.5,4.5' },
  },
  {
    id: 's2', label: 'Heart rate',
    description: 'Simulated heart rate samples',
    params: { x: '0,1,2,3,4,5,6', y: '72,75,78,82,79,74,71', q: '0.5,1.5,2.5,3.5,4.5,5.5' },
  },
  {
    id: 's3', label: 'eˣ',
    description: 'Exponential — see O(h⁴) accuracy',
    params: { x: '0,1,2,3', y: '1,2.718,7.389,20.086', q: '0.5,1.5,2.5' },
  },
  {
    id: 's4', label: 'Yield curve',
    description: 'Bond yields at benchmark maturities',
    params: { x: '0.25,0.5,1,2,5,10,30', y: '4.8,4.9,4.85,4.7,4.4,4.3,4.5', q: '3,7,15,20' },
  },
  {
    id: 's5', label: 'Oscillating',
    description: 'Alternating data — tests smoothness',
    params: { x: '0,1,2,3,4,5', y: '0,2,-1,3,-2,1', q: '0.5,1.5,2.5,3.5,4.5' },
  },
]

// ─── Table row types ──────────────────────────────────────────────────────────

type QueryRow = { idx: number; x: number; y: number }
type SplineRow = SplineSegment & { idx: number }

// ─── Number formatting ────────────────────────────────────────────────────────

const fmt = (x: unknown) => {
  if (x === undefined || x === null) return '—'
  const n = Number(x)
  if (!isFinite(n)) return String(n)
  if (Number.isInteger(n)) return String(n)
  if (Math.abs(n) > 0.001 && Math.abs(n) < 1e5) return n.toFixed(6)
  return n.toExponential(4)
}

// ─── Result plot ──────────────────────────────────────────────────────────────

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 50, r: 15, t: 20, b: 40 },
  xaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  yaxis: { gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.2)', tickfont: { color: '#64748b' } },
  showlegend: true,
  legend: { bgcolor: 'transparent', bordercolor: 'transparent', x: 0.01, y: 0.98 },
}
const PLOTLY_CONFIG = { displayModeBar: false, responsive: true }

function ResultPlot({ result, method }: { result: InterpolationResult; method: InterpMethod }) {
  const traces: Plotly.Data[] = [
    {
      x: result.curve_x, y: result.curve_y,
      type: 'scatter', mode: 'lines',
      line: { color: method === 'lagrange' ? '#60a5fa' : '#34d399', width: 2 },
      name: method === 'lagrange' ? 'Lagrange P(x)' : 'Cubic Spline',
    },
    {
      x: result.query_points, y: result.interpolated_values,
      type: 'scatter', mode: 'markers',
      marker: { color: '#f59e0b', size: 8, symbol: 'diamond' },
      name: 'Query results',
    },
  ]

  return (
    <Plot
      data={traces}
      layout={{ ...DARK_LAYOUT } as Partial<Plotly.Layout>}
      config={PLOTLY_CONFIG}
      style={{ width: '100%', height: '240px' }}
    />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InterpolationPlayground(props: InterpolationPlaygroundProps) {
  const {
    method, xPoints, yPoints, queryPoints,
    onXPointsChange, onYPointsChange, onQueryPointsChange,
    result, isLoading, onCompute, onReset, error,
  } = props

  const presets = method === 'lagrange' ? LAGRANGE_PRESETS : SPLINE_PRESETS

  const handlePreset = (preset: PlaygroundPreset) => {
    const p = preset.params
    if (typeof p['x'] === 'string') onXPointsChange(p['x'])
    if (typeof p['y'] === 'string') onYPointsChange(p['y'])
    if (typeof p['q'] === 'string') onQueryPointsChange(p['q'])
    onReset()
  }

  const controls = (
    <div className="space-y-4">
      <div>
        <label className="section-label mb-1.5 block">x points (comma-separated)</label>
        <input
          type="text"
          value={xPoints}
          onChange={(e) => { onXPointsChange(e.target.value); onReset() }}
          className="input-field w-full font-mono text-sm"
          placeholder="0,1,2,3,4"
        />
      </div>
      <div>
        <label className="section-label mb-1.5 block">y points (comma-separated)</label>
        <input
          type="text"
          value={yPoints}
          onChange={(e) => { onYPointsChange(e.target.value); onReset() }}
          className="input-field w-full font-mono text-sm"
          placeholder="0,1,4,9,16"
        />
      </div>
      <div>
        <label className="section-label mb-1.5 block">Query points (comma-separated)</label>
        <input
          type="text"
          value={queryPoints}
          onChange={(e) => { onQueryPointsChange(e.target.value); onReset() }}
          className="input-field w-full font-mono text-sm"
          placeholder="0.5,1.5,2.5"
        />
      </div>
    </div>
  )

  const resultsPanel = result ? (
    <div className="space-y-3">
      <div className="glass-card overflow-hidden">
        <ResultPlot result={result} method={method} />
      </div>
      <div className="glass-card p-3 flex items-center gap-3">
        <span className="text-xs px-2 py-0.5 rounded bg-brand-600/20 border border-brand-500/30 text-brand-300 font-medium">
          {method === 'lagrange' ? 'Lagrange' : 'Cubic Spline'}
        </span>
        <span className="text-xs text-slate-400">
          {result.query_points.length} query points computed
          {result.spline_segments && ` · ${result.spline_segments.length} segments`}
        </span>
      </div>
    </div>
  ) : undefined

  // Build AlgorithmExecution data
  const queryRows: QueryRow[] = result
    ? result.query_points.map((x, i) => ({ idx: i + 1, x, y: result.interpolated_values[i] }))
    : []

  const splineRows: SplineRow[] = result?.spline_segments
    ? result.spline_segments.map((seg, i) => ({ ...seg, idx: i }))
    : []

  const queryStatus = result ? 'converged' as const : 'idle' as const

  return (
    <>
      <InteractivePlayground
        description={
          method === 'lagrange'
            ? 'Enter data points (x,y) and query locations. The Lagrange polynomial passes exactly through all your data points.'
            : 'Enter data points (x,y) and query locations. Natural cubic spline: C² smooth, no Runge oscillation.'
        }
        controls={controls}
        results={resultsPanel}
        presets={presets}
        onPresetSelect={handlePreset}
        onRun={onCompute}
        onReset={onReset}
        isLoading={isLoading}
        error={error}
      />

      {/* Lagrange: show query results table */}
      {method === 'lagrange' && (
        <AlgorithmExecution<Record<string, unknown>>
          iterations={queryRows as unknown as Record<string, unknown>[]}
          columns={[
            { key: 'idx' as never,  header: '#',    tooltip: 'Query index' },
            { key: 'x'   as never,  header: 'x',    tooltip: 'Query x',    highlight: true, format: (v) => fmt(v) },
            { key: 'y'   as never,  header: 'P(x)', tooltip: 'Lagrange polynomial value at x', highlight: true, format: (v) => fmt(v) },
          ]}
          status={queryStatus}
          description="Lagrange polynomial P(x) evaluated at each query point."
          executionLog={result ? [
            `Method: Lagrange polynomial`,
            `Degree: ${result.query_points.length > 0 ? 'n (data points minus 1)' : '—'}`,
            `Query points: ${result.query_points.length}`,
          ] : undefined}
        />
      )}

      {/* Cubic spline: show segment coefficients table */}
      {method === 'cubic_spline' && (
        <AlgorithmExecution<Record<string, unknown>>
          iterations={splineRows as unknown as Record<string, unknown>[]}
          columns={[
            { key: 'idx'     as never, header: 'Seg',   tooltip: 'Segment index' },
            { key: 'x_start' as never, header: 'x_i',   tooltip: 'Segment start', format: (v) => fmt(v) },
            { key: 'x_end'   as never, header: 'x_i+1', tooltip: 'Segment end',   format: (v) => fmt(v) },
            { key: 'a'       as never, header: 'a',      tooltip: 'Constant term a = y_i',               highlight: true, format: (v) => fmt(v) },
            { key: 'b'       as never, header: 'b',      tooltip: 'Linear coefficient',                  format: (v) => fmt(v) },
            { key: 'c'       as never, header: 'c',      tooltip: 'Quadratic coefficient',               format: (v) => fmt(v) },
            { key: 'd'       as never, header: 'd',      tooltip: 'Cubic coefficient',                   highlight: true, format: (v) => fmt(v) },
          ]}
          status={queryStatus}
          description="Spline coefficients: S_i(x) = a + b(x−x_i) + c(x−x_i)² + d(x−x_i)³ for each segment."
          executionLog={result ? [
            `Method: Natural Cubic Spline`,
            `Segments: ${result.spline_segments?.length ?? 0}`,
            `Query points: ${result.query_points.length}`,
            `Boundary conditions: natural (S''=0 at endpoints)`,
          ] : undefined}
        />
      )}
    </>
  )
}
