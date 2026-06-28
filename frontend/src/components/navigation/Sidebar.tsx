import { NavLink } from 'react-router-dom'
import { MODULE_DEFINITIONS } from '@/config/modules'

export default function Sidebar() {
  return (
    <nav className="p-4 space-y-6">
      {MODULE_DEFINITIONS.map((mod) => (
        <div key={mod.id}>
          {/* Module header */}
          <NavLink
            to={mod.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? 'text-white bg-surface-hover'
                  : 'text-slate-300 hover:text-white hover:bg-surface-hover'
              }`
            }
          >
            <span
              className="module-dot"
              style={{ backgroundColor: mod.color }}
            />
            {mod.title}
          </NavLink>

          {/* Method sub-links */}
          {mod.methods.length > 0 && (
            <div className="ml-5 mt-0.5 space-y-0.5 border-l border-surface-border pl-3">
              {mod.methods.map((method) => (
                <NavLink
                  key={method.id}
                  to={method.path}
                  className={({ isActive }) =>
                    `sidebar-item text-xs ${isActive ? 'active' : ''}`
                  }
                >
                  {method.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
