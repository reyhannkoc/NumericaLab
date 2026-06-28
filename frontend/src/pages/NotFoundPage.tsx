import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-5"
      >
        <div className="text-8xl font-black gradient-text">404</div>
        <h1 className="text-2xl font-bold text-white">Page not found</h1>
        <p className="text-slate-400">This page doesn't exist — yet.</p>
        <Link
          to="/"
          className="inline-flex px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
