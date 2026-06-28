import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface Column<T> {
  key: keyof T
  header: string
  format?: (val: T[keyof T]) => string
  highlight?: boolean
}

interface IterationTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  currentIndex?: number
  maxRows?: number
  title?: string
}

/**
 * Generic scrollable iteration table for any numerical algorithm.
 * Highlights the currently active iteration row.
 */
export default function IterationTable<T extends object>({
  columns,
  rows,
  currentIndex,
  maxRows = 20,
  title = 'Iterations',
}: IterationTableProps<T>) {
  const visible = rows.slice(0, maxRows)

  return (
    <div className="glass-card overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-surface-border">
          <h4 className="text-sm font-medium text-slate-300">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="iter-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={clsx(
                  i === currentIndex && 'bg-brand-600/10',
                )}
              >
                {columns.map((col) => {
                  const raw = row[col.key]
                  const display = col.format
                    ? col.format(raw)
                    : typeof raw === 'number'
                    ? raw.toExponential(6)
                    : String(raw)
                  return (
                    <td
                      key={String(col.key)}
                      className={col.highlight ? 'text-brand-300 font-semibold' : ''}
                    >
                      {display}
                    </td>
                  )
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > maxRows && (
        <p className="text-xs text-slate-500 p-3 border-t border-surface-border">
          Showing {maxRows} of {rows.length} iterations
        </p>
      )}
    </div>
  )
}
