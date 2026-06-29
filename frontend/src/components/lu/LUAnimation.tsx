import { useState } from 'react'
import StepAnimation from '@components/lesson/sections/StepAnimation'
import { useAnimation } from '@/hooks/useAnimation'
import type { LUMethodProp } from './LUVisualization'

// Demo matrix for animation: 3×3
const DEMO_A = [[2, 1, 1], [4, 3, 3], [8, 7, 9]]

const METHOD_COLOR: Record<LUMethodProp, string> = {
  lu:       '#f97316',
  cholesky: '#fb923c',
}

// ─── Build LU steps ───────────────────────────────────────────────────────────

interface MatrixStep {
  label: string
  description: string
  A: number[][]
  L: number[][]
  U: number[][]
  highlight: { row: number; col: number }[]
}

function buildLUSteps(): MatrixStep[] {
  const steps: MatrixStep[] = []
  const U = DEMO_A.map(r => [...r])
  const n = U.length
  const L: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0))

  steps.push({
    label: 'Initial', description: 'Start: A is the augmented matrix. L = I (identity), U = A.',
    A: DEMO_A.map(r => [...r]), L: L.map(r => [...r]), U: U.map(r => [...r]), highlight: [],
  })

  for (let k = 0; k < n - 1; k++) {
    for (let i = k + 1; i < n; i++) {
      const m = U[i][k] / U[k][k]
      steps.push({
        label: `m${i+1}${k+1}`,
        description: `Multiplier m${i+1}${k+1} = a${i+1}${k+1}/a${k+1}${k+1} = ${U[i][k].toFixed(3)}/${U[k][k].toFixed(3)} = ${m.toFixed(4)}`,
        A: DEMO_A.map(r => [...r]), L: L.map(r => [...r]), U: U.map(r => [...r]),
        highlight: [{ row: i, col: k }],
      })
      for (let j = k; j < n; j++) U[i][j] -= m * U[k][j]
      L[i][k] = m
      steps.push({
        label: `R${i+1}`,
        description: `Row op: R${i+1} ← R${i+1} − ${m.toFixed(4)}×R${k+1}. Store ${m.toFixed(4)} in L[${i+1}][${k+1}].`,
        A: DEMO_A.map(r => [...r]), L: L.map(r => [...r]), U: U.map(r => [...r]),
        highlight: [{ row: i, col: k }],
      })
    }
  }

  steps.push({
    label: 'Done',
    description: `Factorization complete. A = L × U. det(A) = ${U.map((r, i) => r[i]).reduce((a, b) => a * b, 1).toFixed(4)}`,
    A: DEMO_A.map(r => [...r]), L: L.map(r => [...r]), U: U.map(r => [...r]),
    highlight: [],
  })

  return steps
}

// ─── Build Cholesky steps ─────────────────────────────────────────────────────

const DEMO_SPD = [[4, 2, 1], [2, 5, 2], [1, 2, 6]]

function buildCholeskySteps(): MatrixStep[] {
  const steps: MatrixStep[] = []
  const A = DEMO_SPD
  const n = A.length
  const L = Array.from({ length: n }, () => Array(n).fill(0))

  steps.push({
    label: 'Start', description: 'Cholesky: factor A = LLᵀ, column by column.',
    A, L: L.map(r => [...r]), U: L.map(r => [...r]), highlight: [],
  })

  for (let i = 0; i < n; i++) {
    let sum = A[i][i]
    for (let k = 0; k < i; k++) sum -= L[i][k] ** 2
    L[i][i] = Math.sqrt(sum)
    steps.push({
      label: `l${i+1}${i+1}`,
      description: `Diagonal: l${i+1}${i+1} = √(${A[i][i]}${i > 0 ? ` − ${i > 0 ? Array.from({length:i},(_,k)=>L[i][k]**2).reduce((a,b)=>a+b,0).toFixed(4)+' (sum of l²)' : ''}` : ''}) = ${L[i][i].toFixed(6)}`,
      A, L: L.map(r => [...r]), U: L.map(r => [...r]),
      highlight: [{ row: i, col: i }],
    })
    for (let j = i + 1; j < n; j++) {
      let s = A[j][i]
      for (let k = 0; k < i; k++) s -= L[j][k] * L[i][k]
      L[j][i] = s / L[i][i]
      steps.push({
        label: `l${j+1}${i+1}`,
        description: `Subdiag: l${j+1}${i+1} = (${A[j][i]}${i > 0 ? ' − dot product' : ''}) / ${L[i][i].toFixed(4)} = ${L[j][i].toFixed(6)}`,
        A, L: L.map(r => [...r]), U: L.map(r => [...r]),
        highlight: [{ row: j, col: i }],
      })
    }
  }

  steps.push({
    label: 'Done',
    description: `Cholesky complete. A = LLᵀ. det(A) = ${Math.pow(L.map((r, i) => r[i]).reduce((a, b) => a * b, 1), 2).toFixed(4)}`,
    A, L: L.map(r => [...r]), U: L.map(r => [...r]),
    highlight: [],
  })

  return steps
}

// ─── Matrix display ───────────────────────────────────────────────────────────

function MatrixDisplay({
  data, title, highlight, color,
}: {
  data: number[][]
  title: string
  highlight: { row: number; col: number }[]
  color: string
}) {
  const isHighlighted = (r: number, c: number) => highlight.some(h => h.row === r && h.col === c)
  return (
    <div>
      <div className="text-xs font-mono font-bold mb-1.5 text-center" style={{ color }}>{title}</div>
      <div className="space-y-0.5">
        {data.map((row, i) => (
          <div key={i} className="flex gap-0.5">
            {row.map((v, j) => (
              <div
                key={j}
                className={`w-12 h-8 flex items-center justify-center rounded text-xs font-mono transition-colors ${
                  isHighlighted(i, j) ? 'text-white' : Math.abs(v) < 1e-9 ? 'bg-surface text-slate-600' : 'bg-surface-card text-slate-300'
                }`}
                style={isHighlighted(i, j) ? { backgroundColor: color + '55', borderLeft: `2px solid ${color}` } : {}}
              >
                {Math.abs(v) < 1e-9 ? '0' : v.toFixed(2)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface Props { method: LUMethodProp }

export default function LUAnimation({ method }: Props) {
  const [speed, setSpeed] = useState(1)
  const color = METHOD_COLOR[method]

  const steps = method === 'lu' ? buildLUSteps() : buildCholeskySteps()

  const { frame, status, play, pause, reset, stepForward, stepBackward } = useAnimation({
    totalFrames: steps.length,
    fps: speed * 1.2,
    loop: false,
  })

  const f = steps[Math.min(frame, steps.length - 1)]

  return (
    <StepAnimation
      totalFrames={steps.length}
      frame={frame}
      status={status}
      speed={speed}
      onPlay={play}
      onPause={pause}
      onReset={reset}
      onStepBack={stepBackward}
      onStepForward={stepForward}
      onSpeedChange={s => {
        setSpeed(s)
        if (status === 'playing') { pause(); setTimeout(play, 50) }
      }}
      stepDescription={f.description}
    >
      <div className="flex flex-wrap gap-4 justify-center items-start">
        <MatrixDisplay data={f.A} title="A" highlight={f.highlight} color="#8b5cf6" />
        <div className="flex items-center text-xl text-slate-500 pt-6">=</div>
        <MatrixDisplay data={f.L} title="L" highlight={f.highlight} color={color} />
        <div className="flex items-center text-xl text-slate-500 pt-6">×</div>
        <MatrixDisplay
          data={method === 'lu' ? f.U : f.L[0].map((_, i) => f.L.map(r => r[i]))}
          title={method === 'cholesky' ? 'Lᵀ' : 'U'}
          highlight={f.highlight}
          color={color}
        />
      </div>
    </StepAnimation>
  )
}
