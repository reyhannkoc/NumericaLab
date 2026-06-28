import { useState, useMemo } from 'react'
import { MathJaxContext, MathJax } from 'better-react-mathjax'
import Plot from 'react-plotly.js'
import { clsx } from 'clsx'
import { LAB_DEFINITIONS, EXPLORER_FORMULAS } from '@/config/laboratory'
import { LabPageHeader } from '@/components/laboratory'

const MATHJAX_CONFIG = {
  loader: { load: ['[tex]/html'] },
  tex: { packages: { '[+]': ['html'] }, inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
}

const lab = LAB_DEFINITIONS.find((l) => l.id === 'formula-explorer')!

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'transparent',
  font:          { color: '#94a3b8', size: 11 },
  xaxis: { gridcolor: '#1e293b', color: '#475569', zeroline: true, zerolinecolor: '#334155' },
  yaxis: { gridcolor: '#1e293b', color: '#475569', zeroline: true, zerolinecolor: '#334155' },
  margin: { l: 50, r: 20, t: 20, b: 50 },
}

const N_POINTS = 300

export default function FormulaExplorer() {
  const [selectedId, setSelectedId] = useState(EXPLORER_FORMULAS[0].id)
  const [varValues, setVarValues] = useState<Record<string, number>>({})

  const formula = EXPLORER_FORMULAS.find((f) => f.id === selectedId) ?? EXPLORER_FORMULAS[0]

  // Merge defaults with current overrides
  const vars = useMemo(() => {
    const defaults = Object.fromEntries(formula.variables.map((v) => [v.symbol, v.defaultValue]))
    return { ...defaults, ...varValues }
  }, [formula, varValues])

  // Compute plot data
  const plotData = useMemo(() => {
    const xs: number[] = []
    const ys: number[] = []
    const xMin = formula.xMin
    const xMax = formula.xMax
    const step = (xMax - xMin) / N_POINTS

    for (let i = 0; i <= N_POINTS; i++) {
      const x = xMin + i * step
      try {
        const y = formula.evaluate(vars, x)
        if (isFinite(y) && Math.abs(y) < 1e10) {
          xs.push(x)
          ys.push(y)
        }
      } catch {
        // skip non-finite
      }
    }
    return { xs, ys }
  }, [formula, vars])

  const handleFormulaChange = (id: string) => {
    setSelectedId(id)
    setVarValues({})
  }

  const handleSlider = (symbol: string, value: number) => {
    setVarValues((prev) => ({ ...prev, [symbol]: value }))
  }

  // Group formulas by category
  const categories = [...new Set(EXPLORER_FORMULAS.map((f) => f.category))]

  return (
    <MathJaxContext config={MATHJAX_CONFIG}>
      <div>
        <LabPageHeader
          icon={lab.icon}
          title={lab.title}
          subtitle={lab.subtitle}
          badge={lab.badge}
          badgeColor={lab.color}
          description="Select a formula and drag the sliders. The formula display and graph update instantly."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Controls ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Formula selector */}
            <div className="glass-card p-4">
              <p className="section-label mb-3">Formula Library</p>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <div key={cat}>
                    <p className="text-xs text-slate-600 uppercase tracking-wider px-2 py-1.5 mt-2">
                      {cat}
                    </p>
                    {EXPLORER_FORMULAS.filter((f) => f.category === cat).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleFormulaChange(f.id)}
                        className={clsx(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          f.id === selectedId
                            ? 'bg-purple-600/15 border border-purple-500/30 text-purple-300'
                            : 'text-slate-400 hover:text-white hover:bg-surface-hover',
                        )}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Variable sliders */}
            <div className="glass-card p-4 space-y-4">
              <p className="section-label">Variables</p>
              {formula.variables.map((v) => {
                const val = vars[v.symbol] ?? v.defaultValue
                return (
                  <div key={v.symbol}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-slate-300">
                        <MathJax inline>{`\\(${v.symbol}\\)`}</MathJax>
                        <span className="text-slate-500 ml-2 text-xs">{v.name}</span>
                      </label>
                      <span className="text-sm font-mono text-purple-300 tabular-nums">
                        {Number.isInteger(val) ? val : val.toFixed(3)}
                        {v.unit && <span className="text-slate-500 ml-1 text-xs">{v.unit}</span>}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={v.min}
                      max={v.max}
                      step={v.step}
                      value={val}
                      onChange={(e) => handleSlider(v.symbol, +e.target.value)}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                      <span>{v.min}</span>
                      <span>{v.max}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Display ── */}
          <div className="lg:col-span-3 space-y-4">
            {/* Formula display */}
            <div className="glass-card p-6 text-center">
              <p className="section-label mb-4">{formula.name}</p>
              <div className="text-white text-xl overflow-x-auto py-3">
                <MathJax>{`\\[${formula.latex}\\]`}</MathJax>
              </div>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">{formula.description}</p>
            </div>

            {/* Current values display */}
            <div className="glass-card p-4">
              <p className="section-label mb-3">Current Variable Values</p>
              <div className="flex flex-wrap gap-3">
                {formula.variables.map((v) => (
                  <div key={v.symbol} className="flex items-center gap-1.5 text-sm">
                    <MathJax inline>{`\\(${v.symbol}\\)`}</MathJax>
                    <span className="text-slate-500">=</span>
                    <span className="font-mono text-purple-300">
                      {Number.isInteger(vars[v.symbol]) ? vars[v.symbol] : vars[v.symbol]?.toFixed(3)}
                    </span>
                    {v.unit && <span className="text-xs text-slate-600">{v.unit}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Live graph */}
            <div className="glass-card p-4">
              <p className="section-label mb-2">
                Graph — <span className="text-purple-300">{formula.yLabel}</span> vs <span className="text-slate-400">{formula.xLabel}</span>
              </p>
              <Plot
                data={[{
                  x: plotData.xs,
                  y: plotData.ys,
                  type: 'scatter',
                  mode: 'lines',
                  line: { color: '#c084fc', width: 2.5 },
                  name: formula.yLabel,
                }]}
                layout={{
                  ...DARK_LAYOUT,
                  height: 280,
                  xaxis: { ...DARK_LAYOUT.xaxis, title: formula.xLabel },
                  yaxis: { ...DARK_LAYOUT.yaxis, title: formula.yLabel },
                }}
                config={{ displayModeBar: false, responsive: true }}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  )
}
