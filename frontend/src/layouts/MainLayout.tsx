import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@components/navigation/Navbar'

export default function MainLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-surface bg-grid-pattern">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
