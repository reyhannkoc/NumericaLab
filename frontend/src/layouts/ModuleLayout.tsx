import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@components/navigation/Navbar'
import Sidebar from '@components/navigation/Sidebar'
import Breadcrumb from '@components/navigation/Breadcrumb'
import ErrorBoundary from '@components/ErrorBoundary'
import { useBreadcrumbs } from '@hooks/useBreadcrumbs'

export default function ModuleLayout() {
  const { pathname } = useLocation()
  const breadcrumbs = useBreadcrumbs()

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-surface-border overflow-y-auto no-scrollbar">
          <Sidebar />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="px-6 py-3 border-b border-surface-border">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ErrorBoundary resetKey={pathname}>
                <Outlet />
              </ErrorBoundary>
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
