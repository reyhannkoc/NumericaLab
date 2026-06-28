import MathRenderer from './MathRenderer'

interface NotationEntry {
  symbol: string
  definition: string
}

interface NotationDisplayProps {
  entries: NotationEntry[]
  title?: string
}

/**
 * Renders a notation table — symbol → definition pairs in LaTeX + plain text.
 */
export default function NotationDisplay({ entries, title = 'Notation' }: NotationDisplayProps) {
  return (
    <div className="glass-card p-4">
      <p className="section-label mb-3">{title}</p>
      <dl className="space-y-2">
        {entries.map(({ symbol, definition }) => (
          <div key={symbol} className="flex items-baseline gap-3">
            <dt className="min-w-[5rem] shrink-0">
              <MathRenderer formula={symbol} />
            </dt>
            <dd className="text-sm text-slate-400">{definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
