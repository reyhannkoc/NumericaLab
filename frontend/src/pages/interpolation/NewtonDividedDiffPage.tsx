import LessonPage from '@components/lesson/LessonPage'
import { NEWTON_DIVIDED_DIFF_CONFIG } from '@/config/lessons/newtonDividedDiff'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
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

// Fixed demonstration dataset: y = x²
const DATA_XS = [0, 1, 2, 3, 4]
const DATA_YS = [0, 1, 4, 9, 16]
const QUERY_POINTS = [0.5, 1.5, 2.5, 3.5]

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

/** Newton's forward form: p(x) = d0 + d1(x-x0) + d2(x-x0)(x-x1) + ... using the first row of the DD table */
function newtonEval(xs: number[], ddTable: number[][], x: number): number {
  let result = ddTable[0][0]
  let product = 1
  for (let k = 1; k < xs.length; k++) {
    product *= (x - xs[k - 1])
    result += ddTable[0][k] * product
  }
  return result
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

// Fixed demo curve + coefficients (derived once, no live inputs)
const DD_TABLE = buildDDTable(DATA_XS, DATA_YS)
const PLOT_X_MIN = Math.min(...DATA_XS) - 0.5
const PLOT_X_MAX = Math.max(...DATA_XS) + 0.5
const CURVE_X = Array.from({ length: 150 }, (_, i) => PLOT_X_MIN + (PLOT_X_MAX - PLOT_X_MIN) * i / 149)
const CURVE_Y = CURVE_X.map((x) => newtonEval(DATA_XS, DD_TABLE, x))
const INTERPOLATED_VALUES = QUERY_POINTS.map((x) => newtonEval(DATA_XS, DD_TABLE, x))

type CoeffRow = Record<string, unknown> & { k: number; coeff: string; desc: string }

const COEFF_ROWS: CoeffRow[] = DATA_XS.map((_, k) => ({
  k,
  coeff: DD_TABLE[0][k].toFixed(6),
  desc: `d${k} = [y₀${k > 0 ? ',...,y' + k : ''}]`,
}))

const COEFF_COLS = [
  { key: 'k'    as keyof CoeffRow, header: 'k' },
  { key: 'coeff' as keyof CoeffRow, header: 'Coefficient dₖ', highlight: true },
  { key: 'desc'  as keyof CoeffRow, header: 'Divided Difference' },
]

const VIZ_DATA: Plotly.Data[] = [
  {
    x: CURVE_X, y: CURVE_Y, type: 'scatter', mode: 'lines',
    name: 'Newton poly', line: { color: COLOR, width: 2.5 },
  },
  {
    x: DATA_XS, y: DATA_YS, type: 'scatter', mode: 'markers',
    name: 'Data', marker: { color: '#f59e0b', size: 9, symbol: 'circle' },
  },
  ...QUERY_POINTS.map((qx, i) => ({
    x: [qx], y: [INTERPOLATED_VALUES[i]],
    type: 'scatter' as const, mode: 'markers' as const,
    name: `p(${qx})`,
    marker: { color: '#4ade80', size: 9, symbol: 'diamond' },
  }) as Plotly.Data),
]

export default function NewtonDividedDiffPage() {
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
        <InteractiveVisualization description="Newton divided difference polynomial through the demonstration data points. Diamond markers show interpolated query values.">
          <Plot
            data={VIZ_DATA}
            layout={{
              ...DARK_LAYOUT,
              xaxis: { ...DARK_LAYOUT.xaxis, range: [PLOT_X_MIN, PLOT_X_MAX] },
            } as Partial<Plotly.Layout>}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '260px' }}
          />
          <div className="mt-3">
            <p className="text-xs text-slate-400 mb-2">Newton coefficients (first row of DD table):</p>
            <div className="flex flex-wrap gap-2">
              {COEFF_ROWS.map(r => (
                <div key={r.k} className="bg-surface-card rounded px-2 py-1 text-xs font-mono">
                  <span className="text-slate-400">d{r.k}=</span>
                  <span style={{ color: COLOR }}>{r.coeff}</span>
                </div>
              ))}
            </div>
          </div>
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
      renderAlgorithm={() => (
        <AlgorithmExecution
          iterations={COEFF_ROWS}
          columns={COEFF_COLS}
          status="converged"
          description="Newton polynomial coefficients (divided differences) for the demonstration dataset y = x²."
        />
      )}
    />
  )
}
