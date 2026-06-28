import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { LAB_DEFINITIONS } from '@/config/laboratory'

export default function LabNav() {
  return (
    <nav className="p-3 space-y-1">
      <p className="section-label px-2 mb-3">Laboratories</p>

      {LAB_DEFINITIONS.map((lab) => (
        <NavLink
          key={lab.id}
          to={lab.path}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
              isActive
                ? 'text-white bg-surface-hover'
                : 'text-slate-400 hover:text-white hover:bg-surface-hover/60',
            )
          }
        >
          {({ isActive }) => (
            <>
              {/* Accent dot */}
              <span
                className="flex items-center justify-center w-7 h-7 rounded-md text-base shrink-0"
                style={{
                  backgroundColor: isActive ? `${lab.color}22` : 'transparent',
                  border: isActive ? `1px solid ${lab.color}44` : '1px solid transparent',
                }}
              >
                {lab.icon}
              </span>

              <div className="min-w-0 flex-1">
                <p className={clsx('font-medium truncate', isActive ? 'text-white' : '')}>
                  {lab.title.replace(' Center', '').replace(' Laboratory', '').replace(' Explorer', '')}
                </p>
              </div>

              {/* Badge */}
              <span
                className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
                style={{
                  color: lab.color,
                  backgroundColor: `${lab.color}18`,
                }}
              >
                {lab.badge}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
