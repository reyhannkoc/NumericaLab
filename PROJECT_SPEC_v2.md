# PROJECT_SPEC.md

# NumericaLab

## Interactive Web-Based Numerical Methods Learning Platform

**Version:** 2.0

**Status:** Active Development

**Document Type:** Single Source of Truth (SSOT)

---

# 1. Project Vision

## Project Name

**NumericaLab**

Interactive Web-Based Numerical Methods Learning Platform

---

## Mission

NumericaLab is an educational platform designed to teach Numerical Methods through interaction, visualization, experimentation and engineering applications.

The goal is not simply to compute numerical answers.

The goal is to enable students to **understand why numerical algorithms work**, how they behave under different conditions, and when each algorithm should be selected.

Students should be able to complete an entire undergraduate Numerical Methods course using this platform without requiring external learning material.

---

# Educational Philosophy

NumericaLab follows a **Learning by Doing** philosophy.

Every concept must be explored through interaction.

Students should never become passive readers.

Instead they should:

- manipulate parameters
- observe algorithm behavior
- compare numerical methods
- analyze errors
- perform experiments
- visualize convergence
- solve engineering problems

Every lesson should answer four questions:

1. What is this method?

2. Why does it work?

3. When should I use it?

4. When should I NOT use it?

---

# Learning Objectives

After completing the platform students should understand:

- Floating Point Arithmetic
- Numerical Errors
- Root Finding
- Interpolation
- Numerical Differentiation
- Numerical Integration
- Linear Systems
- LU Decomposition
- Optimization
- Ordinary Differential Equations
- Numerical Stability
- Performance Analysis

---

# Target Audience

Primary users include:

- Computer Engineering students
- Software Engineering students
- Electrical Engineering students
- Mechanical Engineering students
- Civil Engineering students
- Mathematics students
- Physics students
- Anyone studying Numerical Methods

Assume every student starts with **zero prior knowledge**.

Lessons must gradually increase in difficulty.

---

# Core Principles

The platform is NOT:

- a calculator
- a homework solver
- a collection of formulas

The platform IS:

- an interactive laboratory
- a virtual classroom
- a visualization environment
- a numerical experimentation platform
- a complete educational system

---

# Success Criteria

The project is considered successful when a student can:

- learn every topic from the platform
- understand every algorithm visually
- compare multiple numerical methods
- perform interactive experiments
- identify numerical errors
- understand engineering applications
- complete quizzes and practice exercises
- confidently solve numerical problems independently

---

# 2. Educational Flow

Every lesson MUST follow exactly the same learning sequence.

Theory

↓

Motivation

↓

Mathematical Background

↓

Interactive Visualization

↓

Animation

↓

Interactive Playground

↓

Algorithm Execution

↓

Error Analysis

↓

Performance Analysis

↓

Method Comparison

↓

Engineering Applications

↓

Practice Exercises

↓

Interactive Challenges

↓

Summary

No lesson may skip any of these sections.

---

# 3. Technology Stack

## Frontend

- React
- TypeScript (Strict Mode)
- Vite
- TailwindCSS
- React Router
- Framer Motion
- Plotly.js
- MathJax
- Axios

---

## Backend

- Python
- FastAPI

---

## Scientific Libraries

- NumPy
- SciPy
- SymPy
- Pandas
- Matplotlib

---

# 4. Data Persistence

The project does NOT use a traditional database.

No SQL database.

No MongoDB.

No Firebase.

No Supabase.

Instead, lightweight client-side persistence is provided using LocalStorage.

Stored locally:

- learning progress
- completed lessons
- completed quizzes
- earned achievements
- learning preferences

The backend remains completely stateless.

Every numerical computation is performed in memory and returned through the REST API.

No user authentication is required.

No user accounts are required.

---

# 5. High-Level Architecture

Student

↓

React Frontend

↓

REST API

↓

FastAPI Backend

↓

NumPy / SciPy / SymPy

↓

JSON Response

↓

Interactive Visualization

↓

Animations

↓

Charts

↓

Learning Experience

---

# 6. Approved Architecture (Locked)

The following systems are production-ready.

These systems are considered finalized.

Claude must NOT redesign or replace them.

Future development should extend them instead.

Locked Systems:

- Lesson Framework
- Numerical Laboratory
- Dashboard
- Learning Path
- Progress Tracking
- Quiz System
- Achievement System
- Navigation System
- API Architecture
- Folder Structure

New features must integrate with these systems instead of replacing them.

# 7. Learning System

The platform is designed as a complete learning environment rather than a collection of independent pages.

Students should always know:

- where they are
- what they have completed
- what remains
- what they should study next

---

## Dashboard

The Dashboard serves as the student's home page.

It provides an overview of the entire learning journey.

It should display:

- Overall learning progress
- Completed lessons
- Completed modules
- Current lesson
- Recommended next lesson
- Recent activity
- Quiz statistics
- Earned achievements

---

## Learning Path

The Learning Path defines the official order in which lessons should be studied.

The recommended order is:

1. Floating Point Error Analysis

2. Root Finding

3. Interpolation

4. Numerical Differentiation

5. Numerical Integration

6. Linear Systems

7. LU Decomposition

8. Optimization

9. Ordinary Differential Equations

10. Performance Analysis & Comparative Analysis

Students may access any lesson at any time, but the platform should always recommend following this sequence.

---

## Progress Tracking

The application stores lightweight educational progress using LocalStorage.

Tracked information includes:

- Visited lessons
- Completed lessons
- Completed modules
- Quiz scores
- Achievement status
- Last visited lesson

No cloud synchronization is required.

No user authentication is required.

---

## Achievement System

Achievements encourage exploration rather than competition.

Example achievements include:

- First Lesson Completed
- First Playground Used
- Root Finding Master
- Interpolation Explorer
- Numerical Differentiation Explorer
- Numerical Integration Specialist
- Numerical Methods Beginner
- Halfway Through the Course
- Course Completed

Achievements are stored locally.

---

## Quiz System

Every lesson should end with a short assessment.

Each quiz should include:

- Multiple choice questions
- Immediate feedback
- Correct answers
- Explanations
- Retry option

Quiz results should contribute to local learning progress.

---

# 8. Numerical Laboratory

The Numerical Laboratory is a dedicated experimentation environment.

Unlike lesson pages, laboratory pages encourage free exploration.

Students should be able to investigate numerical behavior without following a structured lesson.

---

## Laboratory Objectives

Students should:

- Compare algorithms
- Observe convergence
- Investigate numerical stability
- Analyze floating-point behavior
- Measure execution time
- Compare engineering scenarios

---

## Laboratory Modules

The laboratory contains the following sections:

### Comparison Center

Run multiple algorithms simultaneously.

Compare:

- Accuracy
- Error
- Iterations
- Execution Time
- Stability
- Convergence

---

### Error Analysis Lab

Interactive experiments involving:

- Floating-point precision
- Cancellation error
- Error propagation
- Overflow
- Underflow

---

### Benchmark Center

Compare numerical algorithms using:

- Runtime
- Iteration count
- Computational complexity
- Numerical stability

---

### Engineering Explorer

Present realistic engineering problems where numerical methods are required.

Each application should explain:

- The engineering problem
- Why numerical methods are needed
- Which algorithm is appropriate
- Advantages and limitations

---

### Formula Explorer

Allow students to manipulate mathematical formulas interactively.

Support:

- Parameter sliders
- Live graphs
- Mathematical notation
- Real-time updates

---

# 9. Universal Lesson Framework

Every lesson in the project MUST use the same reusable Lesson Framework.

No lesson should create its own custom educational layout.

---

## Mandatory Lesson Sections

Each lesson must include the following sections in this exact order:

1. Lesson Header

2. Motivation

3. Theory

4. Mathematical Foundation

5. Interactive Visualization

6. Step-by-Step Animation

7. Interactive Playground

8. Algorithm Execution

9. Error Analysis

10. Performance Analysis

11. Method Comparison

12. Engineering Applications

13. Common Mistakes

14. Practice Problems

15. Interactive Challenges

16. Lesson Summary

---

## Lesson Header

Display:

- Lesson title
- Module
- Estimated study time
- Difficulty level
- Learning objectives
- Prerequisites

---

## Interactive Playground

Every lesson must provide a playground where students can modify parameters.

Changing a parameter should immediately update:

- Graphs
- Tables
- Animations
- Error calculations
- Performance metrics

No manual refresh should be required.

---

## Mathematical Foundation

All mathematical notation must use MathJax.

Include:

- Definitions
- Derivations
- Symbols
- Assumptions
- Convergence conditions

---

## Visualization

Every algorithm must include at least one visualization.

Students should be able to visually understand how the algorithm operates.

---

## Animation

Animations should explain algorithm execution step-by-step.

Users should be able to:

- Play
- Pause
- Reset
- Step Forward
- Change playback speed

---

## Engineering Applications

Every lesson must include at least five realistic engineering applications.

Applications should span multiple engineering disciplines whenever possible.

---

## Practice

Practice exercises should include:

- Easy
- Medium
- Hard

Each exercise should provide:

- Hint
- Solution
- Explanation

---

## Interactive Challenges

Challenges should encourage experimentation.

Examples:

- Find parameters that maximize accuracy.
- Force the algorithm to fail.
- Compare two methods on the same problem.
- Investigate numerical instability.

---

## Lesson Summary

Every lesson must end with:

- Key takeaways
- Formula cheat sheet
- Best practices
- Recommended next lesson
- Related topics

# 10. Core Learning Modules

The platform consists of ten primary educational modules.

Development MUST strictly follow this order.

Completed modules must not be redesigned unless explicitly requested.

Remaining modules should extend the existing architecture.

Official development order:

1. Floating Point Error Analysis

2. Root Finding

3. Interpolation

4. Numerical Differentiation

5. Numerical Integration

6. Linear Systems

7. LU Decomposition

8. Optimization

9. Ordinary Differential Equations

10. Performance Analysis & Comparative Analysis

---

# Standard Requirements For Every Module

Every module MUST include:

- Module Overview
- Multiple Lessons
- Interactive Playground
- Live Visualization
- Step-by-Step Animation
- Error Analysis
- Performance Analysis
- Method Comparison
- Engineering Applications
- Practice Problems
- Interactive Challenges
- Summary

Every module should reuse the Universal Lesson Framework.

---

# Module 1 — Floating Point Error Analysis

## Learning Objectives

Students should understand:

- Binary number representation
- IEEE 754 format
- Machine precision
- Floating point limitations
- Rounding errors
- Cancellation
- Overflow
- Underflow
- Error propagation

---

## Lessons

- Binary Representation
- IEEE 754
- Floating Point Errors
- Numerical Stability

---

## Interactive Features

Students should be able to:

- View bit representations
- Compare float16, float32 and float64
- Observe rounding behavior
- Simulate cancellation errors
- Analyze accumulated errors

---

## Engineering Applications

Examples include:

- Scientific Computing
- Graphics Programming
- Robotics
- Embedded Systems
- Aerospace

---

# Module 2 — Root Finding

## Learning Objectives

Students should understand:

- Existence of roots
- Convergence
- Initial guesses
- Error estimation

---

## Lessons

- Bisection Method
- Newton-Raphson Method
- Secant Method

---

## Comparison Center

Compare:

- Accuracy
- Iterations
- Speed
- Stability
- Convergence

---

## Playground

Allow students to:

- Enter any function
- Adjust interval
- Adjust tolerance
- Select maximum iterations
- Compare algorithms simultaneously

---

## Engineering Applications

Examples:

- Circuit Analysis
- Chemical Equilibrium
- Financial Models
- Structural Engineering
- Population Models

---

# Module 3 — Interpolation

## Learning Objectives

Students should understand:

- Approximation
- Curve fitting
- Missing data estimation
- Polynomial interpolation

---

## Lessons

- Lagrange Interpolation
- Cubic Spline Interpolation

---

## Interactive Features

Students should:

- Move data points
- Add points
- Remove points
- Compare interpolation methods
- Observe Runge's Phenomenon

---

## Engineering Applications

Examples:

- GPS
- Image Processing
- Signal Processing
- CAD
- Sensor Calibration

---

# Module 4 — Numerical Differentiation

## Learning Objectives

Students should understand:

- Numerical derivative approximation
- Finite Difference methods
- Truncation Error
- Step-size selection

---

## Lessons

- Forward Difference
- Backward Difference
- Central Difference

---

## Playground

Allow students to:

- Enter any function
- Select x value
- Adjust h
- Compare with analytical derivative

---

## Comparison Center

Compare:

- Absolute Error
- Relative Error
- Execution Time
- Stability
- Accuracy

---

## Engineering Applications

Examples:

- Velocity Estimation
- Robotics
- Computer Vision
- Control Systems
- Sensor Analysis

---

# Module 5 — Numerical Integration

## Learning Objectives

Students should understand:

- Area approximation
- Numerical integration
- Error estimation

---

## Lessons

- Trapezoidal Rule
- Simpson's Rule
- Adaptive Quadrature

---

## Playground

Students should:

- Draw integration intervals
- Change number of segments
- Observe convergence

---

## Comparison Center

Compare:

- Accuracy
- Runtime
- Number of intervals
- Error

---

## Engineering Applications

Examples:

- Distance from Velocity
- Sensor Integration
- Energy Consumption
- Probability
- Physics Simulation

# Module 6 — Linear Systems

## Learning Objectives

Students should understand:

- Matrix representation
- Gaussian Elimination
- Pivoting
- Numerical conditioning
- Direct vs Iterative methods

---

## Lessons

- Gaussian Elimination
- Gauss-Jordan Elimination
- Jacobi Method
- Gauss-Seidel Method

---

## Playground

Students should be able to:

- Enter matrices manually
- Generate random matrices
- Change matrix size
- Compare direct and iterative methods
- Observe convergence step-by-step

---

## Comparison Center

Compare:

- Execution Time
- Number of Iterations
- Accuracy
- Stability
- Memory Usage

---

## Engineering Applications

Examples:

- Electrical circuit analysis
- Structural engineering
- Finite element methods
- Computer graphics
- Economic models

---

# Module 7 — LU Decomposition

## Learning Objectives

Students should understand:

- Matrix factorization
- Forward substitution
- Backward substitution
- Computational efficiency

---

## Lessons

- LU Decomposition
- Forward Substitution
- Backward Substitution

---

## Playground

Students should:

- Factor matrices
- Solve multiple systems using the same decomposition
- Compare repeated solving with and without LU decomposition

---

## Comparison Center

Compare:

- Runtime
- Number of Operations
- Memory Usage
- Reusability

---

## Engineering Applications

Examples:

- Power systems
- Mechanical simulations
- Structural analysis
- Machine learning
- Scientific computing

---

# Module 8 — Optimization

## Learning Objectives

Students should understand:

- Objective functions
- Local vs global minima
- Gradient-based optimization
- One-dimensional optimization

---

## Lessons

- Golden Section Search
- Gradient Descent
- Scipy Optimization

---

## Playground

Students should:

- Select optimization method
- Adjust learning rate
- Modify initial guess
- Compare optimization paths

---

## Comparison Center

Compare:

- Number of Iterations
- Final Error
- Runtime
- Convergence Rate

---

## Engineering Applications

Examples:

- Machine learning
- Cost minimization
- Robotics
- Resource allocation
- Manufacturing optimization

---

# Module 9 — Ordinary Differential Equations (ODE)

## Learning Objectives

Students should understand:

- Initial Value Problems
- Numerical ODE Solvers
- Stability
- Accuracy

---

## Lessons

- Euler Method
- Heun Method
- Runge-Kutta 4
- SciPy ODE Solvers

---

## Playground

Students should:

- Enter differential equations
- Change initial conditions
- Change step size
- Compare multiple solvers

---

## Comparison Center

Compare:

- Accuracy
- Runtime
- Stability
- Error Growth

---

## Engineering Applications

Examples:

- Population models
- Mechanical systems
- Electrical circuits
- Chemical reactions
- Control systems

---

# Module 10 — Performance Analysis & Comparative Analysis

## Learning Objectives

Students should understand:

- Computational complexity
- Numerical stability
- Algorithm benchmarking
- Error accumulation
- Performance trade-offs

---

## Lessons

- Runtime Analysis
- Error Analysis
- Stability Analysis
- Algorithm Benchmarking

---

## Interactive Features

Students should:

- Benchmark algorithms
- Compare convergence
- Analyze memory usage
- Investigate floating-point effects

---

## Comparison Center

Every numerical method implemented in the project should be benchmarked.

Metrics include:

- Runtime
- Memory Usage
- Iterations
- Accuracy
- Stability
- Error
- Convergence Rate

---

## Engineering Applications

Examples:

- High-performance computing
- Scientific simulations
- Artificial intelligence
- Aerospace engineering
- Financial computing

---

# Module Completion Requirements

Every module is considered complete only if it contains:

✓ Theory

✓ Mathematical Background

✓ Interactive Visualization

✓ Animation

✓ Interactive Playground

✓ Algorithm Execution

✓ Error Analysis

✓ Performance Analysis

✓ Comparison Center

✓ Engineering Applications

✓ Practice Problems

✓ Interactive Challenges

✓ Lesson Summary

A module missing any of these sections is considered incomplete.

# 11. Frontend Standards

The frontend must prioritize education, clarity and interactivity over visual complexity.

---

## UI Principles

Every page should feel like an interactive virtual laboratory.

Avoid static pages whenever possible.

Students should continuously interact with the content.

---

## Responsive Design

The application must work correctly on:

- Desktop
- Laptop
- Tablet
- Mobile

No horizontal scrolling should occur.

---

## Component Reusability

Every reusable UI element should exist as a shared component.

Examples:

- Cards
- Buttons
- Tables
- Charts
- Sliders
- Inputs
- Badges
- Tooltips
- Tabs
- Modals

Do not duplicate UI code.

---

## Animations

Animations should improve learning rather than decoration.

Every animation must:

- Explain an algorithm
- Be controllable
- Support play/pause/reset
- Support adjustable speed

---

## Charts

All numerical charts should use Plotly.js.

Charts should support:

- Zoom
- Pan
- Reset
- Hover tooltips
- Dynamic updates

---

## Mathematical Formulas

All mathematical notation must use MathJax.

Never use screenshots of formulas.

---

# 12. Backend Standards

The backend is responsible for all numerical computation.

React should never implement heavy numerical algorithms.

---

## Backend Responsibilities

The backend performs:

- Numerical calculations
- Matrix operations
- ODE solving
- Optimization
- Root finding
- Integration
- Interpolation
- Differentiation
- Error analysis
- Benchmarking

---

## API Rules

Each module owns its own REST endpoint.

Example:

/api/root-finding

/api/interpolation

/api/differentiation

/api/integration

/api/linear-systems

/api/lu

/api/optimization

/api/ode

/api/performance

Responses must always use JSON.

---

## Error Responses

Every endpoint should return consistent errors.

Example:

- Invalid function
- Invalid interval
- Singular matrix
- No convergence
- Numerical overflow

Errors should include a helpful explanation whenever possible.

---

# 13. Performance Standards

Every numerical algorithm should display:

- Execution Time
- Number of Iterations
- Numerical Error
- Convergence Status
- Stability

Whenever possible also include:

- Memory Usage
- Computational Complexity

---

## Complexity

Every lesson should explain:

Best Case

Average Case

Worst Case

Big-O notation where applicable.

---

## Benchmarking

Whenever multiple algorithms solve the same problem:

Provide a comparison.

Compare:

- Runtime
- Accuracy
- Error
- Stability
- Iterations

---

# 14. Coding Standards

Follow Clean Code principles.

Follow SOLID principles.

Follow reusable architecture.

---

## TypeScript

Use Strict Mode.

Avoid "any".

Prefer explicit types.

---

## React

Use:

- Functional Components
- Hooks
- Reusable Components

Avoid duplicated logic.

---

## File Size

Files should generally remain under:

300–400 lines.

Split larger files into reusable subcomponents.

---

## Naming

Use meaningful names.

Avoid abbreviations.

Good:

RootFindingComparison

Bad:

RFCmp

---

## Constants

Never hardcode values.

Use:

- Config files
- Constants
- Enums

---

## Comments

Complex numerical algorithms must include documentation explaining:

- Inputs
- Outputs
- Mathematical idea
- Complexity
- Limitations
- Numerical stability

---

# 15. Testing Standards

Every completed module should pass:

- TypeScript build
- Production build
- API validation
- Error handling checks

Every new feature should compile successfully before continuing.

Never leave the project in a broken state.

# 16. Deployment Standards

The application must always be deployable.

Deployment should never require manual code changes.

---

## Frontend

Technology:

- React
- Vite

Deployment Platform:

- Render Static Site

---

## Backend

Technology:

- FastAPI

Deployment Platform:

- Render Web Service

---

## Environment Variables

Frontend

```env
VITE_API_URL=https://your-backend.onrender.com
```

Backend

```env
CORS_ORIGINS=https://your-frontend.onrender.com
```

Never hardcode URLs.

Always use environment variables.

---

## Production Build

Every completed feature must successfully pass:

Frontend

```bash
npm run build
```

Backend

```bash
python -m py_compile .
```

No feature is considered complete until production builds succeed.

---

# 17. Git Workflow

Version control is mandatory.

Use Git throughout development.

---

## Branch Strategy

Main branch:

main

Development branch:

develop (optional)

Feature branches:

feature/root-finding

feature/interpolation

feature/differentiation

feature/integration

feature/optimization

etc.

---

## Commit Messages

Use meaningful commit messages.

Examples:

feat: implement Numerical Differentiation module

feat: add Interactive Playground

fix: correct Newton convergence bug

refactor: split LessonPage into reusable sections

docs: update PROJECT_SPEC

---

## Development Cycle

Every feature follows this workflow:

Design

↓

Implementation

↓

Visualization

↓

Animation

↓

Testing

↓

Production Build

↓

Git Commit

↓

Git Push

↓

Deployment Verification

↓

Continue

Never continue development if the build is broken.

---

# 18. Documentation Standards

Every exported function should include documentation.

Complex algorithms should explain:

- Purpose
- Inputs
- Outputs
- Algorithm
- Mathematical idea
- Time Complexity
- Space Complexity
- Numerical Stability
- Limitations

---

## README

The repository should include:

- Project overview
- Installation
- Running locally
- Deployment
- Technology stack
- Screenshots
- Folder structure

---

## REPORT

A REPORT.md document should summarize:

- Educational objectives
- Numerical methods implemented
- Technologies used
- Engineering applications
- Performance analysis
- Lessons learned

---

# 19. Claude AI Development Rules

PROJECT_SPEC.md is the single source of truth.

Before making any changes:

Read PROJECT_SPEC.md completely.

---

## Never

Never redesign the architecture.

Never replace approved systems.

Never remove working features.

Never duplicate existing components.

Never hardcode configuration values.

Never implement unnecessary features.

Never skip production builds.

Never continue after build errors.

---

## Always

Reuse existing components.

Extend the current architecture.

Keep files modular.

Prefer reusable code.

Write educational content before adding visual polish.

Follow the Universal Lesson Framework.

Integrate with the Dashboard, Learning Path and Laboratory when appropriate.

Run production builds after every major feature.

---

## Development Order

Always follow this order:

1. Read PROJECT_SPEC.md

2. Understand existing architecture

3. Reuse existing components

4. Implement one major feature

5. Test

6. Run production build

7. Fix errors

8. Summarize changes

9. Stop and wait for approval

Never implement multiple major modules in one iteration.

---

## Feature Checklist

Before marking a feature complete verify:

□ Theory completed

□ Mathematical explanation completed

□ Interactive visualization completed

□ Animation completed

□ Playground completed

□ Algorithm execution completed

□ Error analysis completed

□ Performance analysis completed

□ Engineering applications completed

□ Practice problems completed

□ Interactive challenges completed

□ Summary completed

□ Production build successful

---

# 20. Project Roadmap

Completed

✅ Project Architecture

✅ Universal Lesson Framework

✅ Numerical Laboratory

✅ Dashboard

✅ Learning Path

✅ Progress Tracking

✅ Quiz System

✅ Achievement System

✅ Module 1 — Floating Point Error Analysis

✅ Module 2 — Root Finding

✅ Module 3 — Interpolation

---

Remaining

🔲 Module 4 — Numerical Differentiation

🔲 Module 5 — Numerical Integration

🔲 Module 6 — Linear Systems

🔲 Module 7 — LU Decomposition

🔲 Module 8 — Optimization

🔲 Module 9 — Ordinary Differential Equations

🔲 Module 10 — Performance Analysis & Comparative Analysis

---

# 21. Acceptance Criteria

The project is considered complete only if:

- All ten modules are implemented.
- Every lesson follows the Universal Lesson Framework.
- Every algorithm includes interactive visualization.
- Every module includes engineering applications.
- Every module includes practice problems.
- Every module includes performance analysis.
- Every module includes error analysis.
- Every module includes comparison pages.
- The Numerical Laboratory is fully functional.
- Dashboard and Learning Path work correctly.
- All production builds succeed.
- The application is successfully deployed.
- The project satisfies every requirement of the Numerical Methods course specification.

---

# End of Specification

This document is the official and only development specification for NumericaLab.

Any future implementation must follow this specification unless explicitly instructed otherwise.
