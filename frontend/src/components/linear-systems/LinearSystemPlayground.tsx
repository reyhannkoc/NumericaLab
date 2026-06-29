import { useState, useMemo } from 'react'
import { clsx } from 'clsx'
import InteractivePlayground from '@components/lesson/sections/InteractivePlayground'
import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import type { PlaygroundPreset } from '@/types/lesson.types'
import type { LinearSolverProp } from './LinearSystemVisualization'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface LinearSystemPlaygroundProps {
  method: LinearSolverProp
  matrixA: number[][]
  vectorB: number[]
  size: 2 | 3
  onMatrixChange: (a: number[][]) => void
  onVectorChange: (b: number[]) => void
  onSizeChange: (s: 2 | 3) => void
  solution: number[] | null
  iterations: Array<{ iteration: number; x: number[]; error: number }> | null
  residual: number | null
  isLoading: boolean
  onCompute: () => void
  onReset: () => void
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: PlaygroundPreset[] = [
  {
    id: 'p1', label: '2×2 SDD',
    description: '[5,-1;-1,5]x=[4,4] → x=[1,1]',
    params: { size: 2, a: [[5,-1],[-1,5]], b: [4,4] },
  },
  {
    id: 'p2', label: '3×3 SDD',
    description: 'Well-conditioned 3×3 diagonal dominant',
    params: { size: 3, a: [[4,-1,0],[-1,4,-1],[0,-1,4]], b: [3,2,3] },
  },
  {
    id: 'p3', label: 'Truss',
    description: '3×3 structural truss forces',
    params: { size: 3, a: [[10,2,1],[2,8,1],[1,1,5]], b: [12,11,7] },
  },
  {
    id: 'p4', label: 'Hilbert 2×2',
    description: '[1,1/2;1/2,1/3] — ill-conditioned',
    params: { size: 2, a: [[1,0.5],[0.5,0.333]], b: [1.5,0.833] },
  },
]

const METHOD_COLOR: Record<LinearSolverProp, string> = {
  gaussian_elimination: '#14b8a6',
  gauss_seidel:         '#22d3ee',
  jacobi:               '#a78bfa',
}
const METHOD_LABEL: Record<LinearSolverProp, string> = {
  gaussian_elimination: 'Gaussian Elimination',
  gauss_seidel:         'Gauss–Seidel',
  jacobi:               'Jacobi',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LinearSystemPlayground({
  method, matrixA, vectorB, size,
  onMatrixChange, onVectorChange, onSizeChange,
  solution, iterations, residual,
  isLoading, onCompute, onReset,
}: LinearSystemPlaygroundProps) {
  const color = METHOD_COLOR[method]
  const label = METHOD_LABEL[method]
  const [showIterTable, setShowIterTable] = useState(false)

  const applyPreset = (preset: PlaygroundPreset) => {
    const p = preset.params as { size: 2|3; a: number[][]; b: number[] }
    onSizeChange(p.size)
    onMatrixChange(p.a)
    onVectorChange(p.b)
    onReset()
  }

  const updateCell = (row: number, col: number, val: string) => {
    const a = matrixA.map(r => [...r])
    a[row][col] = parseFloat(val) || 0
    onMatrixChange(a)
    onReset()
  }

  const updateB = (i: number, val: string) => {
    const b = [...vectorB]
    b[i] = parseFloat(val) || 0
    onVectorChange(b)
    onReset()
  }

  const controls = (
    <div className="space-y-4">
      {/* Size selector */}
      <div className="flex items-center gap-3">
        <span className="section-label">Matrix size:</span>
        {([2, 3] as const).map(s => (
          <button
            key={s}
            onClick={() => { onSizeChange(s); onReset() }}
            className={clsx(
              'px-3 py-1 rounded text-sm font-mono transition-colors',
              size === s ? 'text-white' : 'bg-surface text-slate-400 hover:text-white',
            )}
            style={size === s ? { backgroundColor: color } : {}}
          >
            {s}×{s}
          </button>
        ))}
      </div>

      {/* Matrix input */}
      <div>
        <p className="section-label mb-2">Matrix A and vector b</p>
        <div className="space-y-2">
          {Array.from({ length: size }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-4">R{i+1}</span>
              <span className="text-slate-500 text-sm">[</span>
              {Array.from({ length: size }, (_, j) => (
                <input
                  key={j}
                  type="number"
                  step="0.1"
                  value={matrixA[i]?.[j] ?? 0}
                  onChange={e => updateCell(i, j, e.target.value)}
                  className="input-field w-16 text-center font-mono text-sm px-1"
                />
              ))}
              <span className="text-slate-500 text-sm">]</span>
              <span className="text-slate-500 text-sm ml-1">x =</span>
              <input
                type="number"
                step="0.1"
                value={vectorB[i] ?? 0}
                onChange={e => updateB(i, e.target.value)}
                className="input-field w-16 text-center font-mono text-sm px-1"
                style={{ borderColor: color + '66' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCompute}
          disabled={isLoading}
          className="btn-primary px-6"
          style={!isLoading ? { backgroundColor: color, borderColor: color } : {}}
        >
          {isLoading ? 'Solving...' : `Solve with ${label}`}
        </button>
        {solution && (
          <button onClick={onReset} className="btn-secondary px-4">Reset</button>
        )}
      </div>
    </div>
  )

  const resultsPanel = solution ? (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {solution.map((xi, i) => (
          <div key={i} className="glass-card p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">x{i+1}</div>
            <div className="font-mono text-sm font-bold" style={{ color }}>{xi.toFixed(8)}</div>
          </div>
        ))}
        {residual != null && (
          <div className="glass-card p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">‖Ax−b‖</div>
            <div className="font-mono text-sm font-bold text-amber-400">{residual.toExponential(4)}</div>
          </div>
        )}
        {iterations && iterations.length > 0 && (
          <div className="glass-card p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Iterations</div>
            <div className="font-mono text-sm font-bold text-emerald-400">{iterations.length}</div>
          </div>
        )}
      </div>
      {iterations && iterations.length > 0 && (
        <button
          onClick={() => setShowIterTable(t => !t)}
          className="text-xs text-slate-400 hover:text-white transition-colors"
          style={{ color }}
        >
          {showIterTable ? 'Hide' : 'Show'} iteration history ({iterations.length} rows)
        </button>
      )}
    </div>
  ) : undefined

  // Iteration table rows (capped at 50 for readability)
  type IterRow = Record<string, unknown> & { k: number; error: string; [key: string]: unknown }
  const iterRows: IterRow[] = useMemo(() => {
    if (!iterations) return []
    return iterations.slice(0, 50).map(it => {
      const row: IterRow = { k: it.iteration, error: it.error.toExponential(4) }
      it.x.forEach((xi, i) => { row[`x${i+1}`] = xi.toFixed(8) })
      return row
    })
  }, [iterations])

  const iterColumns = useMemo(() => {
    if (!iterations || iterations.length === 0) return []
    const cols: { key: keyof IterRow; header: string; highlight?: boolean }[] = [
      { key: 'k', header: 'k' },
    ]
    iterations[0].x.forEach((_, i) => cols.push({ key: `x${i+1}`, header: `x${i+1}` }))
    cols.push({ key: 'error', header: '‖error‖', highlight: true })
    return cols
  }, [iterations])

  const executionLog = solution
    ? [`Method: ${label}`, `Size: ${size}×${size}`, ...solution.map((xi, i) => `x${i+1} = ${xi.toFixed(8)}`)]
    : undefined

  return (
    <>
      <InteractivePlayground
        controls={controls}
        results={resultsPanel}
        presets={PRESETS}
        onPresetSelect={applyPreset}
        onRun={onCompute}
        onReset={onReset}
        isLoading={isLoading}
        description={`Solve Ax=b using ${label}. Enter matrix A and vector b, then click Solve.`}
      />

      {showIterTable && iterRows.length > 0 && (
        <AlgorithmExecution
          iterations={iterRows}
          columns={iterColumns}
          status={residual != null && residual < 1e-8 ? 'converged' : 'idle'}
          executionLog={executionLog}
          description={`${label} iteration history`}
        />
      )}
    </>
  )
}
