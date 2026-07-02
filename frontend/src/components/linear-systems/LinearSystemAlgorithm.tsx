import AlgorithmExecution from '@components/lesson/sections/AlgorithmExecution'
import { buildIterFrames } from './linearSystemDemoData'

type IterativeMethod = 'gauss_seidel' | 'jacobi'

interface Props {
  method: IterativeMethod
}

type IterRow = Record<string, unknown> & { k: number; error: string; [key: string]: unknown }

const METHOD_LABEL: Record<IterativeMethod, string> = {
  gauss_seidel: 'Gauss–Seidel',
  jacobi:       'Jacobi',
}

export default function LinearSystemAlgorithm({ method }: Props) {
  const frames = buildIterFrames(method)
  const label = METHOD_LABEL[method]

  const iterRows: IterRow[] = frames.map((f) => {
    const row: IterRow = { k: f.iteration, error: f.error.toExponential(4) }
    f.x.forEach((xi, i) => { row[`x${i + 1}`] = xi.toFixed(8) })
    return row
  })

  const iterColumns: { key: keyof IterRow; header: string; highlight?: boolean }[] = [
    { key: 'k', header: 'k' },
    ...frames[0].x.map((_, i) => ({ key: `x${i + 1}` as keyof IterRow, header: `x${i + 1}` })),
    { key: 'error', header: '‖error‖', highlight: true },
  ]

  return (
    <AlgorithmExecution
      iterations={iterRows}
      columns={iterColumns}
      status="converged"
      executionLog={[`Method: ${label}`, `Size: 2×2`, `Iterations: ${frames.length - 1}`]}
      description={`${label} iteration history for the demonstration system [5,-1;-1,5]x=[4,4].`}
    />
  )
}
