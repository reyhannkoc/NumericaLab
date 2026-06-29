import { useMemo } from 'react'
import { clsx } from 'clsx'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import type { PlaygroundPreset } from '@/types/lesson.types'
import type { LUMethodProp } from './LUVisualization'

export interface LUPlaygroundProps {
  method: LUMethodProp
  matrix: number[][]
  vectorB: number[]
  size: 2 | 3 | 4
  onMatrixChange: (m: number[][]) => void
  onVectorChange: (b: number[]) => void
  onSizeChange: (s: 2 | 3 | 4) => void
  result: { L: number[][]; U: number[][]; P?: number[][]; determinant: number; steps: Array<{ step: number; description: string; L_state: number[][]; U_state: number[][] }> } | null
  solution: number[] | null
  isLoading: boolean
  onCompute: () => void
  onReset: () => void
}

const METHOD_COLOR: Record<LUMethodProp, string> = {
  lu:       '#f97316',
  cholesky: '#fb923c',
}

const LU_PRESETS: PlaygroundPreset[] = [
  { id: 'l1', label: '3×3 General', description: 'Standard LU example', params: { size: 3, a: [[2,1,1],[4,3,3],[8,7,9]], b: [4,8,16] } },
  { id: 'l2', label: '3×3 Pivoting', description: 'Requires partial pivoting', params: { size: 3, a: [[0,1,2],[3,0,1],[2,1,0]], b: [3,4,3] } },
  { id: 'l3', label: '4×4 Tridiag', description: 'Sparse tridiagonal', params: { size: 4, a: [[5,-1,0,0],[-1,5,-1,0],[0,-1,5,-1],[0,0,-1,5]], b: [4,3,3,4] } },
  { id: 'l4', label: '2×2 Simple', description: 'Easy to verify by hand', params: { size: 2, a: [[4,2],[2,3]], b: [8,7] } },
]

const CHOL_PRESETS: PlaygroundPreset[] = [
  { id: 'c1', label: '3×3 SPD', description: 'Standard Cholesky example', params: { size: 3, a: [[4,2,1],[2,5,2],[1,2,6]], b: [7,9,9] } },
  { id: 'c2', label: '2×2 Covariance', description: 'Correlation matrix', params: { size: 2, a: [[1,0.8],[0.8,1]], b: [1.8,1.8] } },
  { id: 'c3', label: '4×4 FEM', description: 'FEM stiffness (SPD)', params: { size: 4, a: [[6,-1,0,0],[-1,6,-1,0],[0,-1,6,-1],[0,0,-1,6]], b: [5,4,4,5] } },
  { id: 'c4', label: '3×3 Near-singular', description: 'det ≈ small', params: { size: 3, a: [[4,2,1],[2,5,2],[1,2,3]], b: [7,9,6] } },
]

function MatrixGrid({ data, title, color }: { data: number[][]; title: string; color: string }) {
  const n = data.length
  return (
    <div>
      <p className="text-xs font-mono font-bold text-center mb-1" style={{ color }}>{title}</p>
      <div className="space-y-0.5">
        {data.map((row, i) => (
          <div key={i} className="flex gap-0.5">
            {row.map((v, j) => (
              <div key={j} className={`flex items-center justify-center rounded font-mono text-xs ${n <= 3 ? 'w-14 h-8' : 'w-11 h-7'} ${Math.abs(v) < 1e-9 ? 'bg-surface text-slate-600' : 'bg-surface-card text-slate-300'}`}>
                {Math.abs(v) < 1e-9 ? '0' : v.toFixed(n <= 3 ? 3 : 2)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LUPlayground({
  method, matrix, vectorB, size,
  onMatrixChange, onVectorChange, onSizeChange,
  result, solution, isLoading, onCompute, onReset,
}: LUPlaygroundProps) {
  const color = METHOD_COLOR[method]
  const presets = method === 'lu' ? LU_PRESETS : CHOL_PRESETS

  const applyPreset = (p: PlaygroundPreset) => {
    const v = p.params as { size: 2|3|4; a: number[][]; b: number[] }
    onSizeChange(v.size)
    onMatrixChange(v.a)
    onVectorChange(v.b)
    onReset()
  }

  const updateCell = (i: number, j: number, val: string) => {
    const a = matrix.map(r => [...r])
    a[i][j] = parseFloat(val) || 0
    if (method === 'cholesky') a[j][i] = a[i][j]  // keep symmetric
    onMatrixChange(a)
    onReset()
  }

  const updateB = (i: number, val: string) => {
    const b = [...vectorB]
    b[i] = parseFloat(val) || 0
    onVectorChange(b)
    onReset()
  }

  const defaultSizes = useMemo(() => {
    if (size === 2) return method === 'lu' ? { a: [[4,2],[2,3]], b: [8,7] } : { a: [[4,2],[2,3]], b: [8,7] }
    if (size === 3) return method === 'lu' ? { a: [[2,1,1],[4,3,3],[8,7,9]], b: [4,8,16] } : { a: [[4,2,1],[2,5,2],[1,2,6]], b: [7,9,9] }
    return method === 'lu'
      ? { a: [[5,-1,0,0],[-1,5,-1,0],[0,-1,5,-1],[0,0,-1,5]], b: [4,3,3,4] }
      : { a: [[6,-1,0,0],[-1,6,-1,0],[0,-1,6,-1],[0,0,-1,6]], b: [5,4,4,5] }
  }, [size, method])

  const controls = (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="section-label">Size:</span>
        {([2, 3, 4] as const).map(s => (
          <button key={s}
            onClick={() => { onSizeChange(s); onMatrixChange(defaultSizes.a.slice(0,s).map(r=>r.slice(0,s)) as number[][]); onVectorChange(defaultSizes.b.slice(0,s)); onReset() }}
            className={clsx('px-3 py-1 rounded text-sm font-mono transition-colors', size === s ? 'text-white' : 'bg-surface text-slate-400 hover:text-white')}
            style={size === s ? { backgroundColor: color } : {}}
          >{s}×{s}</button>
        ))}
        {method === 'cholesky' && <span className="text-xs text-slate-500">(symmetric — editing one cell mirrors the other)</span>}
      </div>

      <div>
        <p className="section-label mb-2">Matrix A {method === 'cholesky' ? '(must be SPD)' : ''}</p>
        <div className="space-y-2">
          {Array.from({ length: size }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-4">R{i+1}</span>
              {Array.from({ length: size }, (_, j) => (
                <input key={j} type="number" step="0.1"
                  value={matrix[i]?.[j] ?? 0}
                  onChange={e => updateCell(i, j, e.target.value)}
                  className="input-field w-14 text-center font-mono text-sm px-1"
                  readOnly={method === 'cholesky' && i < j}
                  style={method === 'cholesky' && i < j ? { opacity: 0.5 } : {}}
                />
              ))}
              <span className="text-slate-500 text-sm ml-1">x =</span>
              <input type="number" step="0.1"
                value={vectorB[i] ?? 0}
                onChange={e => updateB(i, e.target.value)}
                className="input-field w-14 text-center font-mono text-sm px-1"
                style={{ borderColor: color + '66' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onCompute} disabled={isLoading}
          className="btn-primary px-6"
          style={!isLoading ? { backgroundColor: color, borderColor: color } : {}}
        >
          {isLoading ? 'Factoring...' : method === 'lu' ? 'Factor (LU)' : 'Factor (Cholesky)'}
        </button>
        {result && <button onClick={onReset} className="btn-secondary px-4">Reset</button>}
      </div>
    </div>
  )

  const resultsPanel = result ? (
    <div className="space-y-4">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">det(A)</div>
          <div className="font-mono text-sm font-bold" style={{ color }}>{result.determinant.toFixed(6)}</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">Method</div>
          <div className="font-mono text-sm font-bold" style={{ color }}>{method.toUpperCase()}</div>
        </div>
        {solution && solution.map((xi, i) => (
          <div key={i} className="glass-card p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">x{i+1}</div>
            <div className="font-mono text-sm font-bold" style={{ color }}>{xi.toFixed(8)}</div>
          </div>
        ))}
      </div>

      {/* L and U matrices */}
      <div className="flex flex-wrap gap-6 justify-center">
        <MatrixGrid data={result.L} title="L" color={color} />
        <MatrixGrid data={result.U} title={method === 'cholesky' ? 'Lᵀ' : 'U'} color={color} />
        {result.P && <MatrixGrid data={result.P} title="P (pivots)" color="#8b5cf6" />}
      </div>

      {/* Step log */}
      {result.steps.length > 0 && (
        <div className="glass-card p-3">
          <p className="section-label mb-2">Factorization Steps</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {result.steps.map(s => (
              <div key={s.step} className="text-xs text-slate-400">
                <span className="font-mono text-slate-500 mr-2">{s.step}.</span>
                {s.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : undefined

  return (
    <InteractivePlayground
      controls={controls}
      results={resultsPanel}
      presets={presets}
      onPresetSelect={applyPreset}
      onRun={onCompute}
      onReset={onReset}
      isLoading={isLoading}
      description={method === 'lu'
        ? 'Factor A = LU (with partial pivoting). Optionally provide b to also solve Ax = b.'
        : 'Factor A = LLᵀ (Cholesky). A must be symmetric positive-definite.'}
    />
  )
}
