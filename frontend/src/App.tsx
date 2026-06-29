import { Routes, Route } from 'react-router-dom'
import MainLayout from '@layouts/MainLayout'
import ModuleLayout from '@layouts/ModuleLayout'
import LaboratoryLayout from '@layouts/LaboratoryLayout'

// Top-level pages
import HomePage from '@pages/HomePage'
import ModulesPage from '@pages/ModulesPage'
import NotFoundPage from '@pages/NotFoundPage'
import DashboardPage from '@pages/DashboardPage'
import LearningPathPage from '@pages/LearningPathPage'

// Laboratory pages
import LaboratoryHub      from '@pages/laboratory/LaboratoryHub'
import ComparisonCenter   from '@pages/laboratory/ComparisonCenter'
import ErrorAnalysisLab   from '@pages/laboratory/ErrorAnalysisLab'
import BenchmarkCenter    from '@pages/laboratory/BenchmarkCenter'
import EngineeringExplorer from '@pages/laboratory/EngineeringExplorer'
import FormulaExplorer    from '@pages/laboratory/FormulaExplorer'

// Module overview pages
import FloatingPointPage from '@pages/floating-point/FloatingPointPage'
import RootFindingPage from '@pages/root-finding/RootFindingPage'
import InterpolationPage from '@pages/interpolation/InterpolationPage'
import DifferentiationPage from '@pages/differentiation/DifferentiationPage'
import IntegrationPage from '@pages/integration/IntegrationPage'
import LinearSystemsPage from '@pages/linear-systems/LinearSystemsPage'
import LUDecompositionPage from '@pages/lu-decomposition/LUDecompositionPage'
import OptimizationPage from '@pages/optimization/OptimizationPage'
import ODEPage from '@pages/ode/ODEPage'
import PerformancePage from '@pages/performance/PerformancePage'

// Root Finding sub-pages
import BisectionPage from '@pages/root-finding/BisectionPage'
import NewtonRaphsonPage from '@pages/root-finding/NewtonRaphsonPage'
import SecantPage from '@pages/root-finding/SecantPage'
import FixedPointPage from '@pages/root-finding/FixedPointPage'
import RootComparisonPage from '@pages/root-finding/RootComparisonPage'

// Interpolation sub-pages
import LagrangePage from '@pages/interpolation/LagrangePage'
import NewtonDividedDiffPage from '@pages/interpolation/NewtonDividedDiffPage'
import CubicSplinePage from '@pages/interpolation/CubicSplinePage'
import InterpolationComparisonPage from '@pages/interpolation/InterpolationComparisonPage'

// Differentiation sub-pages
import ForwardDifferencePage from '@pages/differentiation/ForwardDifferencePage'
import BackwardDifferencePage from '@pages/differentiation/BackwardDifferencePage'
import CentralDifferencePage from '@pages/differentiation/CentralDifferencePage'
import RichardsonPage from '@pages/differentiation/RichardsonPage'
import DifferentiationComparisonPage from '@pages/differentiation/DifferentiationComparisonPage'

// Integration sub-pages
import TrapezoidalPage from '@pages/integration/TrapezoidalPage'
import SimpsonsPage from '@pages/integration/SimpsonsPage'
import GaussianQuadraturePage from '@pages/integration/GaussianQuadraturePage'
import IntegrationComparisonPage from '@pages/integration/IntegrationComparisonPage'

// Linear Systems sub-pages
import GaussianEliminationPage from '@pages/linear-systems/GaussianEliminationPage'
import GaussSeidelPage from '@pages/linear-systems/GaussSeidelPage'
import JacobiPage from '@pages/linear-systems/JacobiPage'
import LinearComparisonPage from '@pages/linear-systems/LinearComparisonPage'

// LU sub-pages
import CholeskyPage from '@pages/lu-decomposition/CholeskyPage'

// Optimization sub-pages
import GoldenSectionPage from '@pages/optimization/GoldenSectionPage'
import GradientDescentPage from '@pages/optimization/GradientDescentPage'
import OptimizationComparisonPage from '@pages/optimization/OptimizationComparisonPage'

// ODE sub-pages
import EulerMethodPage from '@pages/ode/EulerMethodPage'
import RungeKuttaPage from '@pages/ode/RungeKuttaPage'
import ODEComparisonPage from '@pages/ode/ODEComparisonPage'

export default function App() {
  return (
    <Routes>
      {/* Public / landing routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
      </Route>

      {/* Learning module routes — use ModuleLayout with sidebar */}
      <Route element={<ModuleLayout />}>
        {/* Floating Point */}
        <Route path="/floating-point" element={<FloatingPointPage />} />

        {/* Root Finding */}
        <Route path="/root-finding" element={<RootFindingPage />} />
        <Route path="/root-finding/bisection" element={<BisectionPage />} />
        <Route path="/root-finding/newton-raphson" element={<NewtonRaphsonPage />} />
        <Route path="/root-finding/secant" element={<SecantPage />} />
        <Route path="/root-finding/fixed-point" element={<FixedPointPage />} />
        <Route path="/root-finding/comparison" element={<RootComparisonPage />} />

        {/* Interpolation */}
        <Route path="/interpolation" element={<InterpolationPage />} />
        <Route path="/interpolation/lagrange" element={<LagrangePage />} />
        <Route path="/interpolation/newton-divided-diff" element={<NewtonDividedDiffPage />} />
        <Route path="/interpolation/cubic-spline" element={<CubicSplinePage />} />
        <Route path="/interpolation/comparison" element={<InterpolationComparisonPage />} />

        {/* Differentiation */}
        <Route path="/differentiation" element={<DifferentiationPage />} />
        <Route path="/differentiation/forward" element={<ForwardDifferencePage />} />
        <Route path="/differentiation/backward" element={<BackwardDifferencePage />} />
        <Route path="/differentiation/central" element={<CentralDifferencePage />} />
        <Route path="/differentiation/richardson" element={<RichardsonPage />} />
        <Route path="/differentiation/comparison" element={<DifferentiationComparisonPage />} />

        {/* Integration */}
        <Route path="/integration" element={<IntegrationPage />} />
        <Route path="/integration/trapezoidal" element={<TrapezoidalPage />} />
        <Route path="/integration/simpsons" element={<SimpsonsPage />} />
        <Route path="/integration/gaussian-quadrature" element={<GaussianQuadraturePage />} />
        <Route path="/integration/comparison" element={<IntegrationComparisonPage />} />

        {/* Linear Systems */}
        <Route path="/linear-systems" element={<LinearSystemsPage />} />
        <Route path="/linear-systems/gaussian-elimination" element={<GaussianEliminationPage />} />
        <Route path="/linear-systems/gauss-seidel" element={<GaussSeidelPage />} />
        <Route path="/linear-systems/jacobi" element={<JacobiPage />} />
        <Route path="/linear-systems/comparison" element={<LinearComparisonPage />} />

        {/* LU Decomposition */}
        <Route path="/lu-decomposition" element={<LUDecompositionPage />} />
        <Route path="/lu-decomposition/cholesky" element={<CholeskyPage />} />

        {/* Optimization */}
        <Route path="/optimization" element={<OptimizationPage />} />
        <Route path="/optimization/golden-section" element={<GoldenSectionPage />} />
        <Route path="/optimization/gradient-descent" element={<GradientDescentPage />} />
        <Route path="/optimization/comparison" element={<OptimizationComparisonPage />} />

        {/* ODE */}
        <Route path="/ode" element={<ODEPage />} />
        <Route path="/ode/euler" element={<EulerMethodPage />} />
        <Route path="/ode/runge-kutta" element={<RungeKuttaPage />} />
        <Route path="/ode/comparison" element={<ODEComparisonPage />} />

        {/* Performance */}
        <Route path="/performance" element={<PerformancePage />} />
      </Route>

      {/* Numerical Laboratory */}
      <Route element={<LaboratoryLayout />}>
        <Route path="/laboratory"                  element={<LaboratoryHub />} />
        <Route path="/laboratory/comparison"       element={<ComparisonCenter />} />
        <Route path="/laboratory/error-analysis"   element={<ErrorAnalysisLab />} />
        <Route path="/laboratory/benchmark"        element={<BenchmarkCenter />} />
        <Route path="/laboratory/engineering"      element={<EngineeringExplorer />} />
        <Route path="/laboratory/formula-explorer" element={<FormulaExplorer />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
