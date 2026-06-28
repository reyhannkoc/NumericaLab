import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@components/navigation/Navbar'
import LabNav from '@components/laboratory/LabNav'

export default function LaboratoryLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Lab navigation sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 border-r border-surface-border overflow-y-auto no-scrollbar">
          <LabNav />
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
