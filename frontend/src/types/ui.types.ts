import type { ReactNode } from 'react'

export interface ChildrenProps {
  children: ReactNode
}

export interface ClassNameProps {
  className?: string
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
export type ColorScheme = 'brand' | 'green' | 'blue' | 'purple' | 'amber' | 'red' | 'teal'

export interface SliderConfig {
  min: number
  max: number
  step: number
  value: number
  label: string
  unit?: string
  onChange: (value: number) => void
}

export interface SelectOption<T extends string = string> {
  value: T
  label: string
  description?: string
  disabled?: boolean
}

export interface TabDefinition {
  id: string
  label: string
  icon?: ReactNode
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface TooltipProps {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  children: ReactNode
}
