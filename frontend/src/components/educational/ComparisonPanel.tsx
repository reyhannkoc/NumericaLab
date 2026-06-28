import type { ReactNode } from 'react'
import Card from '@components/ui/Card'

interface ComparisonColumn {
  method: string
  color: string
  content: ReactNode
}

interface ComparisonPanelProps {
  columns: ComparisonColumn[]
  title?: string
}

/**
 * Side-by-side panel for comparing two or more algorithm results.
 */
export default function ComparisonPanel({ columns, title }: ComparisonPanelProps) {
  return (
    <div className="space-y-3">
      {title && <h3 className="font-semibold text-white">{title}</h3>}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((col) => (
          <Card
            key={col.method}
            className="space-y-3"
            style={{ borderColor: `${col.color}30` } as React.CSSProperties}
          >
            <div
              className="flex items-center gap-2 pb-2 border-b border-surface-border"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: col.color }}
              />
              <span className="font-semibold text-sm text-white">{col.method}</span>
            </div>
            {col.content}
          </Card>
        ))}
      </div>
    </div>
  )
}
