https://frontend-wi09.onrender.com/

# NumericaLab

**An interactive, browser-based platform for learning Numerical Methods through visualizations, step-by-step animations, and engineering case studies.**

NumericaLab presents each numerical algorithm as a complete educational chapter: motivation → theory → mathematics → interactive visualization → animated step-by-step walkthrough → algorithm execution table → engineering applications → practice problems. No database. No login. Just open it and learn.

> **Stability note:** as of the final submission build, every lesson's Step-by-Step Animation and Algorithm Execution table runs entirely on predefined demonstration data computed in the browser — they load instantly and never depend on the backend. Live, backend-driven computation (type any expression, run any method) is still available in the **Comparison Center** pages and the **Numerical Laboratory**.

---

## Features

- **10 complete learning modules** — Floating Point, Root Finding, Interpolation, Differentiation, Integration, Linear Systems, LU Decomposition, Optimization, ODEs, Performance Analysis
- **Universal Lesson Framework** — every lesson follows a consistent section structure (motivation, theory, math foundation, visualization, animation, algorithm execution, error analysis, performance, comparison, engineering applications, common mistakes, practice, challenges, summary) with a sticky progress sidebar and MathJax-rendered LaTeX
- **Step-by-Step Animation** — play, pause, step forward/backward through each iteration; method-specific visuals (bisection bracket, Newton tangent line, secant line). Runs on predefined demonstration data computed client-side — loads instantly, no backend call required
- **Algorithm Execution table** — full iteration table for the demonstration problem, shown alongside the animation, also self-contained and instant-loading
- **Educational Visualization** — static concept walkthrough computed locally in the browser with 5 preset functions and step-by-step controls
- **Root Finding Comparison Center** — race Bisection, Newton–Raphson, and Secant on the same equation with live convergence graphs, performance bar charts, and winner badges (this is where live, backend-driven "type any expression" computation lives)
- **5 Engineering Case Studies per module** — IRR/NPV, diode circuits, Kepler's equation, implied volatility, power flow, chemical equilibrium, structural deflection
- **Numerical Laboratory** — 5 standalone labs: Algorithm Comparison, Error Analysis, Benchmark Center, Engineering Explorer, Formula Explorer
- **Dark theme** — glass-card UI with Tailwind CSS, Framer Motion animations, Plotly.js charts
- **No database** — the FastAPI backend (NumPy, SciPy, SymPy) powers the Comparison Center and Laboratory; lesson pages themselves need no backend at all

---

## Tech Stack

### Frontend

| Technology | Version | Role |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.3 | Build tool & dev server |
| React Router | v6 | Client-side routing |
| TailwindCSS | 3.4 | Styling (dark glass-card theme) |
| Framer Motion | 11.3 | Animations & transitions |
| Plotly.js | 2.34 | Interactive charts |
| better-react-mathjax | 2.0 | LaTeX rendering |
| Axios | 1.7 | HTTP client |
| clsx | 2.1 | Conditional class names |

### Backend

| Technology | Version | Role |
|---|---|---|
| FastAPI | 0.111 | REST API framework |
| Uvicorn | 0.30 | ASGI server |
| NumPy | 1.26 | Numerical computation |
| SciPy | 1.13 | Scientific algorithms |
| SymPy | 1.12 | Symbolic differentiation |
| Pydantic | 2.8 | Request/response models |

---

## Project Structure

```
NumWeb/
├── frontend/                  # React + TypeScript SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── lesson/        # Universal Lesson Framework (LOCKED)
│   │   │   │   ├── LessonPage.tsx          # Orchestrator — wraps every lesson
│   │   │   │   ├── sections/               # Header, Theory, MathFoundation, StepAnimation, AlgorithmExecution, …
│   │   │   │   └── shared/                 # SectionWrapper, SectionHeader, sidebar
│   │   │   ├── root-finding/  # RootFindingVisualization, RootFindingStepAnimation, RootFindingAlgorithm
│   │   │   │   #   (per-module *Animation / *Algorithm components are self-contained —
│   │   │   │   #    they take only a `method` prop and compute their own demo data,
│   │   │   │   #    often sharing a `*DemoData.ts` module between the two)
│   │   │   ├── floating-point/# Floating Point visualizations
│   │   │   ├── laboratory/    # Lab-specific components (live backend calls)
│   │   │   └── ui/            # Button, Card, …
│   │   ├── config/
│   │   │   ├── lessons/       # LessonConfig objects (bisection.ts, …)
│   │   │   ├── lessonSections.ts           # Section registry (FIXED ORDER)
│   │   │   └── laboratory.ts
│   │   ├── pages/
│   │   │   ├── root-finding/  # BisectionPage, NewtonRaphsonPage, SecantPage, RootComparisonPage
│   │   │   ├── floating-point/
│   │   │   ├── laboratory/
│   │   │   └── …              # One folder per module
│   │   ├── hooks/
│   │   │   └── useAnimation.ts# Frame-based animation controller
│   │   ├── services/           # Used only by Comparison Center pages + Laboratory
│   │   │   ├── api.ts         # Axios base instance
│   │   │   └── rootFindingService.ts
│   │   ├── types/
│   │   │   ├── lesson.types.ts# LessonConfig, all section types
│   │   │   └── api.types.ts   # RootFindingRequest/Result, …
│   │   └── styles/
│   │       └── globals.css    # Tailwind base + custom utilities
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                   # FastAPI Python backend
│   ├── main.py                # App factory + router registration + CORS
│   ├── requirements.txt
│   ├── .env.example           # Environment variable template
│   └── app/
│       ├── config.py          # Settings (MAX_ITERATIONS, DEFAULT_TOLERANCE, …)
│       ├── routers/           # 10 API routers (one per module)
│       │   ├── root_finding.py
│       │   ├── floating_point.py
│       │   └── …
│       ├── services/          # Business logic (calls numerical/)
│       ├── numerical/         # Pure numerical algorithms (NumPy/SciPy/SymPy)
│       ├── models/            # Pydantic request/response models
│       └── utils/
│           └── function_parser.py  # Safe expression evaluator
│
├── docs/
│   └── REPORT.md
├── PROJECT_SPEC.md
├── README.md
└── LICENSE
```

---

## Installation

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- **Python** ≥ 3.10
- Git

### 1. Clone the repository

```bash
git clone https://github.com/your-username/numericalab.git
cd numericalab
```

### 2. Frontend setup

```bash
cd frontend
npm install
```

### 3. Backend setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt

# (Optional) Copy environment config
cp .env.example .env
```

---

## Running the Application

### Start the backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

### Start the frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

> Both services must be running simultaneously. The frontend proxies `/api` requests to port 8000.

### Production build

```bash
cd frontend
npm run build      # Output in frontend/dist/
```

---

## API Overview

The backend exposes 10 REST endpoints under `/api/`:

| Prefix | Module |
|---|---|
| `/api/root-finding` | Bisection, Newton–Raphson, Secant, Fixed-Point |
| `/api/floating-point` | IEEE 754 analysis, precision comparison |
| `/api/interpolation` | Lagrange, Newton Divided Diff, Cubic Spline |
| `/api/differentiation` | Forward, Backward, Central, Richardson |
| `/api/integration` | Trapezoidal, Simpson's, Gaussian, Romberg |
| `/api/linear-systems` | Gaussian elimination, Gauss-Seidel, Jacobi |
| `/api/lu` | LU decomposition, Cholesky |
| `/api/optimization` | Golden Section, Gradient Descent, Newton, Brent |
| `/api/ode` | Euler, Heun, Midpoint, RK4, Adams-Bashforth |
| `/api/performance` | Benchmarking across methods |

---

## Screenshots

> _Screenshots will be added after the UI is finalized._

| Page | Description |
|---|---|
| `docs/screenshots/home.png` | Home page with module grid |
| `docs/screenshots/bisection.png` | Bisection lesson — visualization section |
| `docs/screenshots/newton-animation.png` | Newton–Raphson tangent line animation |
| `docs/screenshots/comparison.png` | Root Finding Comparison Center |
| `docs/screenshots/laboratory.png` | Numerical Laboratory |

---

## Module Status

| # | Module | Status |
|---|---|---|
| 1 | Floating Point Error Analysis | Complete |
| 2 | Root Finding (Bisection, Newton–Raphson, Secant, Fixed-Point) | Complete |
| 3 | Interpolation (Lagrange, Newton Divided Diff, Cubic Spline) | Complete |
| 4 | Numerical Differentiation (Forward, Backward, Central, Richardson) | Complete |
| 5 | Numerical Integration (Trapezoidal, Simpson's, Gaussian Quadrature) | Complete |
| 6 | Linear Systems (Gaussian Elimination, Gauss-Seidel, Jacobi) | Complete |
| 7 | LU Decomposition (LU, Cholesky) | Complete |
| 8 | Optimization (Golden Section, Gradient Descent) | Complete |
| 9 | Ordinary Differential Equations (Euler, RK4) | Complete |
| 10 | Performance Analysis / Numerical Laboratory | Complete |

---

## Future Improvements

- **Code splitting** — split Plotly.js into a separate chunk to reduce initial bundle size (~5 MB → ~1.5 MB)
- **Dark/light theme toggle** — currently dark-only
- **Mobile optimization** — responsive breakpoints for all Plotly charts
- **Export results** — download iteration tables as CSV and charts as PNG
- **Bring back a per-lesson live playground** — behind a feature flag, reusing the Comparison Center's backend calls, once reliability/error-handling hardening is done
- **User progress tracking** — local-storage-based lesson completion indicators
- **Additional methods** — Müller's method, Brent's method, secant with Illinois modification
- **3D surface visualization** — extend Newton's method to 2D systems
- **i18n** — Turkish and English language toggle (primary user base)

---

## Contributing

This project is in active development. Module implementations follow the spec in `PROJECT_SPEC.md`. Each module must be fully complete before the next begins. The lesson framework (`src/components/lesson/`) is locked — do not modify its architecture without explicit approval.

---

## License

[MIT](./LICENSE) © 2024 Reyhan Koç
