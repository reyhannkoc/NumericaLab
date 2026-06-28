import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/modules',    label: 'Modules' },
  { to: '/laboratory', label: 'Laboratory' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-brand">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-white tracking-tight">
              Numerica<span className="text-brand-400">Lab</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-brand-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-surface-hover'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-600/25 text-brand-300 text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
            Educational Platform
          </motion.div>
        </div>
      </div>
    </header>
  )
}
