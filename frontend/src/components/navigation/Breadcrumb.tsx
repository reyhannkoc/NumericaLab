import { Link } from 'react-router-dom'
import type { BreadcrumbItem } from '@/types/ui.types'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slate-700">/</span>}
            {item.href && i < items.length - 1 ? (
              <Link
                to={item.href}
                className="hover:text-slate-300 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? 'text-slate-300' : ''}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
