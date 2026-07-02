import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import type { TabDefinition } from '@/types/ui.types'

interface TabsProps {
  tabs: TabDefinition[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

interface TabPanelProps {
  id: string
  activeTab: string
  children: ReactNode
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={clsx('flex gap-1 p-1 bg-surface-card rounded-lg border border-surface-border', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-surface-hover',
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ id, activeTab, children }: TabPanelProps) {
  if (id !== activeTab) return null
  return <div>{children}</div>
}
