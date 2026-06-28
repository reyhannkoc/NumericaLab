# NumericaLab

**An interactive, browser-based platform for learning Numerical Methods through visualizations, step-by-step animations, and engineering case studies.**

NumericaLab presents each numerical algorithm as a complete educational chapter: motivation → theory → mathematics → interactive visualization → animated step-by-step → playground → engineering applications → practice problems. No database. No login. Just open it and learn.

---

## Features

- **10 complete learning modules** — Floating Point, Root Finding, Interpolation, Differentiation, Integration, Linear Systems, LU Decomposition, Optimization, ODEs, Performance Analysis
- **Universal Lesson Framework** — every lesson follows a consistent 16-section structure with a sticky progress sidebar, MathJax-rendered LaTeX, and live error/performance indicators
- **Interactive Playground** — enter any mathematical expression, adjust parameters, and see the algorithm execute with a full iteration table
- **Step Animation** — play, pause, step forward/backward through each iteration; method-specific visuals (bisection bracket, Newton tangent line, secant line)
- **Educational Visualization** — static concept walkthrough computed locally in the browser with 5 preset functions and step-by-step controls
- **Root Finding Comparison Center** — race Bisection, Newton–Raphson, and Secant on the same equation with live convergence graphs, performance bar charts, and winner badges
- **5 Engineering Case Studies per module** — IRR/NPV, diode circuits, Kepler's equation, implied volatility, power flow, chemical equilibrium, structural deflection
- **Numerical Laboratory** — 5 standalone labs: Algorithm Comparison, Error Analysis, Benchmark Center, Engineering Explorer, Formula Explorer
- **Dark theme** — glass-card UI with Tailwind CSS, Framer Motion animations, Plotly.js charts
- **No database** — all computation is performed on-demand by the FastAPI backend using NumPy, SciPy, and SymPy

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
│   │   │   ├── lesson/        # Universal Lesson Framework (16 sections, LOCKED)
│   │   │   │   ├── LessonPage.tsx          # Orchestrator — wraps every lesson
│   │   │   │   ├── sections/               # Header, Theory, MathFoundation, …
│   │   │   │   └── shared/                 # SectionWrapper, SectionHeader, sidebar
│   │   │   ├── root-finding/  # Root Finding shared render-prop components
│   │   │   ├── floating-point/# Floating Point visualizations
│   │   │   ├── laboratory/    # Lab-specific components
│   │   │   └── ui/            # Button, Card, …
│   │   ├── config/
│   │   │   ├── lessons/       # LessonConfig objects (bisection.ts, …)
│   │   │   ├── lessonSections.ts           # 16-section registry (FIXED ORDER)
│   │   │   └── laboratory.ts
│   │   ├── pages/
│   │   │   ├── root-finding/  # BisectionPage, NewtonRaphsonPage, SecantPage, RootComparisonPage
│   │   │   ├── floating-point/
│   │   │   ├── laboratory/
│   │   │   └── …              # One folder per module
│   │   ├── hooks/
│   │   │   └── useAnimation.ts# Frame-based animation controller
│   │   ├── services/
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
| 2 | Root Finding (Bisection, Newton–Raphson, Secant) | Complete |
| 3 | Interpolation | Planned |
| 4 | Numerical Differentiation | Planned |
| 5 | Numerical Integration | Planned |
| 6 | Linear Systems | Planned |
| 7 | LU Decomposition | Planned |
| 8 | Optimization | Planned |
| 9 | Ordinary Differential Equations | Planned |
| 10 | Performance Analysis | Planned |

---

## Future Improvements

- **Code splitting** — split Plotly.js into a separate chunk to reduce initial bundle size (~5 MB → ~1.5 MB)
- **Dark/light theme toggle** — currently dark-only
- **Mobile optimization** — responsive breakpoints for all Plotly charts
- **Export results** — download iteration tables as CSV and charts as PNG
- **Python notebook integration** — export playground sessions as Jupyter notebooks
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
