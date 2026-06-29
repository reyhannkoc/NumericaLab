import { useState, useMemo } from 'react'
import Plot from 'react-plotly.js'
import type Plotly from 'plotly.js'
import { clsx } from 'clsx'
import InteractiveVisualization from '@components/lesson/sections/InteractiveVisualization'

export type LUMethodProp = 'lu' | 'cholesky'

const METHOD_COLOR: Record<LUMethodProp, string> = {
  lu:       '#f97316',
  cholesky: '#fb923c',
}

// Demo matrices
interface DemoMatrix {
  label: string
  A: number[][]
  description: string
  isSPD: boolean
}

const DEMO_MATRICES: DemoMatrix[] = [
  { label: '3×3 General', A: [[2,1,1],[4,3,3],[8,7,9]], description: 'L stores multipliers; U = upper-triangular result', isSPD: false },
  { label: '3×3 SPD', A: [[4,2,1],[2,5,2],[1,2,6]], description: 'Symmetric PD — works for both LU and Cholesky', isSPD: true },
  { label: '2×2 Simple', A: [[4,2],[2,3]], description: 'Cholesky: L=[[2,0],[1,√2]]', isSPD: true },
  { label: '4×4 Tridiag', A: [[5,-1,0,0],[-1,5,-1,0],[0,-1,5,-1],[0,0,-1,5]], description: 'Tridiagonal SPD — sparsity preserved', isSPD: true },
]

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { color: '#94a3b8', size: 11 },
  margin: { l: 10, r: 10, t: 40, b: 10 },
  autosize: true,
}
const PLOTLY_CFG = { displayModeBar: false, responsive: true }

// ─── LU Factorization (without pivoting for display) ─────────────────────────

function luFactor(A: number[][]) {
  const n = A.length
  const L: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0))
  const U = A.map(row => [...row])
  for (let k = 0; k < n; k++) {
    for (let i = k + 1; i < n; i++) {
      const m = U[i][k] / U[k][k]
      L[i][k] = m
      for (let j = k; j < n; j++) U[i][j] -= m * U[k][j]
    }
  }
  return { L, U }
}

function choleskyFactor(A: number[][]) {
  const n = A.length
  const L = Array.from({ length: n }, () => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = A[i][j]
      for (let k = 0; k < j; k++) sum -= L[i][k] * L[j][k]
      if (i === j) {
        if (sum <= 0) return null  // not PD
        L[i][j] = Math.sqrt(sum)
      } else {
        L[i][j] = sum / L[j][j]
      }
    }
  }
  return L
}

function matMul(A: number[][], B: number[][]) {
  const n = A.length
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) =>
      A[i].reduce((s, _, k) => s + A[i][k] * B[k][j], 0)
    )
  )
}

function matrixToTrace(mat: number[][], title: string, color: string): Plotly.Data {
  const n = mat.length
  const z = mat.map(row => [...row])
  return {
    z,
    type: 'heatmap',
    colorscale: [[0, 'transparent'], [0.5, color + '44'], [1, color + 'cc']],
    showscale: false,
    xgap: 2, ygap: 2,
    text: z.map(row => row.map(v => v.toFixed(2))) as string[][],
    texttemplate: '%{text}',
    textfont: { size: n <= 3 ? 12 : 9, color: '#fff' },
    hoverinfo: 'none' as const,
    annotations: [{ text: title, xref: 'paper', yref: 'paper', x: 0.5, y: 1.05, showarrow: false, font: { color, size: 12 } }],
  } as unknown as Plotly.Data
}

interface Props { method: LUMethodProp }

export default function LUVisualization({ method }: Props) {
  const [matIdx, setMatIdx] = useState(method === 'cholesky' ? 1 : 0)
  const demo = DEMO_MATRICES[matIdx]
  const color = METHOD_COLOR[method]

  const { L, U, valid } = useMemo(() => {
    if (method === 'cholesky') {
      if (!demo.isSPD) return { L: null, U: null, valid: false }
      const L = choleskyFactor(demo.A)
      return { L, U: L ? L.map((r, i) => r.map((_, j) => L[j][i])) : null, valid: L !== null }
    }
    const { L, U } = luFactor(demo.A)
    return { L, U, valid: true }
  }, [matIdx, method])  // eslint-disable-line react-hooks/exhaustive-deps

  // Verify reconstruction
  const reconstruct = useMemo(() => {
    if (!L || !U) return null
    return matMul(L, U)
  }, [L, U])

  const maxErr = useMemo(() => {
    if (!reconstruct) return null
    return demo.A.reduce((mx, row, i) =>
      Math.max(mx, row.reduce((m, a, j) => Math.max(m, Math.abs(a - reconstruct[i][j])), 0)), 0)
  }, [reconstruct, demo.A])

  const n = demo.A.length

  const makePlot = (mat: number[][], title: string) => (
    <div className="flex-1">
      <Plot
        data={[matrixToTrace(mat, title, color)]}
        layout={{
          ...DARK_LAYOUT,
          height: n <= 2 ? 160 : n <= 3 ? 200 : 240,
          yaxis: { autorange: 'reversed' as const },
        } as Partial<Plotly.Layout>}
        config={PLOTLY_CFG}
        style={{ width: '100%' }}
      />
    </div>
  )

  const controls = (
    <div className="space-y-3">
      <p className="section-label">Demo Matrix</p>
      <div className="space-y-1.5">
        {DEMO_MATRICES.filter(dm => method === 'lu' || dm.isSPD).map((dm, i) => {
          const realIdx = DEMO_MATRICES.indexOf(dm)
          return (
            <button
              key={i}
              onClick={() => setMatIdx(realIdx)}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors',
                matIdx === realIdx ? 'border text-white' : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white'
              )}
              style={matIdx === realIdx ? { backgroundColor: color + '22', borderColor: color } : {}}
            >
              <span className="font-medium">{dm.label}</span>
              <span className="text-[10px] text-slate-500 ml-2">{dm.description}</span>
            </button>
          )
        })}
      </div>
      {maxErr !== null && (
        <div className="rounded bg-surface-card p-2 text-xs text-center">
          <span className="text-slate-400">Reconstruction error: </span>
          <span className="font-mono font-bold" style={{ color }}>
            {maxErr < 1e-12 ? '< 10⁻¹²' : maxErr.toExponential(3)}
          </span>
          <span className="text-emerald-400 ml-1">{maxErr < 1e-10 ? '✓' : ''}</span>
        </div>
      )}
    </div>
  )

  return (
    <InteractiveVisualization
      description={method === 'cholesky'
        ? 'Cholesky: A = LLᵀ. L has positive diagonal entries. The right panel shows Lᵀ (= U).'
        : 'LU: A = LU. L has 1s on the diagonal (stores multipliers); U is the upper-triangular elimination result.'}
      controls={controls}
    >
      {!valid ? (
        <div className="flex items-center justify-center h-40 text-amber-400 text-sm">
          Matrix is not symmetric positive-definite — Cholesky requires SPD. Select an SPD matrix.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2 items-center text-xs text-slate-400 justify-center">
            <span className="font-mono text-slate-300">A</span>
            <span>=</span>
            <span className="font-mono" style={{ color }}>L</span>
            <span>×</span>
            <span className="font-mono" style={{ color }}>{method === 'cholesky' ? 'Lᵀ' : 'U'}</span>
          </div>
          <div className="flex gap-2">
            {makePlot(demo.A, 'A (original)')}
            {L && makePlot(L, 'L')}
            {U && makePlot(U, method === 'cholesky' ? 'Lᵀ' : 'U')}
          </div>
        </div>
      )}
    </InteractiveVisualization>
  )
}
