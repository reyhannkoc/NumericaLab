import { clsx } from 'clsx'

interface MatrixInputProps {
  label?: string
  matrix: number[][]
  onChange: (matrix: number[][]) => void
  readOnly?: boolean
}

/**
 * Grid-based matrix editor.
 * Each cell is an editable number input; change propagates the whole matrix.
 */
export default function MatrixInput({
  label = 'Matrix A',
  matrix,
  onChange,
  readOnly = false,
}: MatrixInputProps) {
  const handleChange = (row: number, col: number, value: string) => {
    const updated = matrix.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? Number(value) : c)),
    )
    onChange(updated)
  }

  return (
    <div className="param-group">
      {label && <label className="param-label">{label}</label>}
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, auto)` }}>
        {matrix.map((row, ri) =>
          row.map((val, ci) => (
            <input
              key={`${ri}-${ci}`}
              type="number"
              value={val}
              readOnly={readOnly}
              onChange={(e) => handleChange(ri, ci, e.target.value)}
              className={clsx(
                'w-16 text-center bg-surface border border-surface-border rounded px-1.5 py-1',
                'text-sm font-mono text-slate-200',
                'focus:outline-none focus:ring-1 focus:ring-brand-500',
                readOnly && 'opacity-60 cursor-not-allowed',
              )}
            />
          )),
        )}
      </div>
    </div>
  )
}
