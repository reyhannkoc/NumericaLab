# NumericaLab — Project Report

## Overview

NumericaLab is an interactive web-based platform for learning Numerical Methods.

## Architecture

See `PROJECT_SPEC.md` for the full specification.

## Modules Implemented

| # | Module | Methods |
|---|--------|---------|
| 1 | Floating Point Error Analysis | IEEE 754, machine epsilon, catastrophic cancellation |
| 2 | Root Finding | Bisection, Newton–Raphson, Secant, Fixed-Point |
| 3 | Interpolation | Lagrange, Newton Divided Differences, Cubic Spline |
| 4 | Numerical Differentiation | Forward, Backward, Central, Richardson |
| 5 | Numerical Integration | Trapezoidal, Simpson's, Gaussian Quadrature |
| 6 | Linear Systems | Gaussian Elimination, Gauss–Seidel, Jacobi |
| 7 | LU Decomposition | Doolittle LU with pivoting, Cholesky |
| 8 | Optimization | Golden Section Search, Gradient Descent |
| 9 | ODE Solvers | Euler, Heun, Runge–Kutta 4 |
| 10 | Performance Analysis | Benchmarking, Complexity Analysis |

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Plotly.js, MathJax
- **Backend**: Python 3.11+, FastAPI, NumPy, SciPy, SymPy

## Running the Project

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173
