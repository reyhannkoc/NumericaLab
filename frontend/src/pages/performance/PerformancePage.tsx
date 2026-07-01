import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import { Tabs, TabPanel } from '@components/ui/Tabs'
import PerformanceBenchmarkChart from '@charts/PerformanceBenchmarkChart'
import ComparisonBarChart from '@charts/ComparisonBarChart'
import { performanceService } from '@services/performanceService'
import { useNumericalAPI } from '@hooks/useNumericalAPI'
import type { BenchmarkResponse } from '@/types/api.types'

const PROBLEM_TABS = [
  { id: 'root_finding',    label: 'Root Finding' },
  { id: 'integration',     label: 'Integration' },
  { id: 'linear_systems',  label: 'Linear Systems' },
  { id: 'ode',             label: 'ODE Solvers' },
]

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState('root_finding')
  const { data, loading, error, execute } = useNumericalAPI<Parameters<typeof performanceService.benchmark>[0], BenchmarkResponse>(
    performanceService.benchmark,
  )

  const runBenchmark = () =>
    execute({
      problem_type: activeTab as never,
      methods: [],
      runs: 20,
    })

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Performance Analysis</h1>
        <p className="text-slate-400">
          Benchmark all methods on identical problems and compare speed, accuracy,
          convergence rate, and computational cost.
        </p>
      </motion.div>

      <Tabs tabs={PROBLEM_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {PROBLEM_TABS.map((tab) => (
        <TabPanel key={tab.id} id={tab.id} activeTab={activeTab}>
          <div className="space-y-5">
            <Button onClick={runBenchmark} loading={loading}>
              Run Benchmark
            </Button>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {data && (
              <div className="grid lg:grid-cols-2 gap-5">
                <Card>
                  <h3 className="font-semibold text-white mb-3">Execution Time (ms)</h3>
                  <PerformanceBenchmarkChart results={data.results} />
                </Card>
                <Card>
                  <h3 className="font-semibold text-white mb-3">Iterations to Convergence</h3>
                  <ComparisonBarChart
                    methods={data.results.map((r) => r.method)}
                    values={data.results.map((r) => r.iterations ?? 0)}
                    metric="Iterations"
                  />
                </Card>
                <Card className="lg:col-span-2 p-4">
                  <h3 className="font-semibold text-white mb-2">Summary</h3>
                  <p className="text-slate-300 text-sm">{data.summary}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-slate-500">
                      Best accuracy: <strong className="text-emerald-300">{data.results.reduce((b, r) => (r.accuracy ?? -Infinity) > (b.accuracy ?? -Infinity) ? r : b, data.results[0])?.method ?? '—'}</strong>
                    </span>
                    <span className="text-slate-500">
                      Fastest: <strong className="text-brand-300">{data.winner}</strong>
                    </span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </TabPanel>
      ))}
    </div>
  )
}
