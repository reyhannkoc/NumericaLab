# PROJECT_SPEC.md

# Part 1 — Project Vision & System Architecture

# Project Name

NumericaLab – Interactive Web-Based Numerical Methods Learning Platform

---

# Project Overview

Develop a modern educational web platform that teaches Numerical Methods interactively.

This is NOT a calculator.

This is NOT only a visualization website.

The website should teach Numerical Methods from scratch as if the student has never taken the course before.

Every topic must contain:

- Theory
- Mathematical explanation
- Interactive simulations
- Live calculations
- Animations
- Step-by-step algorithm execution
- Graphs
- Error analysis
- Performance analysis
- Method comparison
- Engineering applications
- Practice examples

The student should be able to learn the entire Numerical Methods course only by using this website.

---

# Educational Philosophy

Every learning module must follow this sequence.

Theory

↓

Mathematical Background

↓

Visualization

↓

Animation

↓

Interactive Playground

↓

Algorithm Execution

↓

Performance Analysis

↓

Comparison

↓

Real World Applications

↓

Practice

↓

Summary

The user should always interact with the algorithms instead of only reading theory.

---

# Project Goals

The platform must teach:

- Floating Point Arithmetic
- Error Analysis
- Root Finding
- Numerical Differentiation
- Numerical Integration
- Interpolation
- Linear Systems
- LU Decomposition
- Optimization
- Ordinary Differential Equations
- Numerical Stability
- Performance Analysis

---

# Target Users

Primary users are:

- Computer Engineering students
- Software Engineering students
- Electrical Engineering students
- Mechanical Engineering students
- Mathematics students
- Anyone learning Numerical Methods

The website should assume that the user has zero previous knowledge.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Framer Motion
- Plotly.js
- MathJax
- Axios

## Backend

- Python
- FastAPI

## Scientific Libraries

- NumPy
- SciPy
- SymPy
- Pandas
- Matplotlib

---

# Database

# Data Persistence

This project does NOT use a traditional database.

Instead, it uses browser LocalStorage for lightweight client-side persistence.

Stored locally:

- Learning progress
- Lesson completion
- Quiz scores
- Achievement status
- User preferences

No user authentication is required.

No cloud database is required.

## All numerical calculations remain stateless and are performed in memory by the FastAPI backend.

# High-Level Architecture

Student

↓

React Frontend

↓

REST API

↓

FastAPI Backend

↓

NumPy

SciPy

SymPy

↓

JSON Response

↓

Interactive Graphs

↓

Animations

↓

Tables

---

# Frontend Responsibilities

The frontend should only handle:

- UI
- User interactions
- Graphs
- Animations
- Charts
- Forms
- Tables
- Sliders
- Lesson pages
- Comparison pages

Do NOT perform heavy numerical computations in React.

---

# Backend Responsibilities

The backend is responsible for:

- Numerical calculations
- Root finding
- Interpolation
- Differentiation
- Integration
- Matrix operations
- LU decomposition
- Optimization
- ODE solving
- Error analysis
- Floating point experiments
- Performance benchmarking

All computations should be implemented using Python scientific libraries.

---

# Project Folder Structure

NumericaLab/

frontend/

src/

pages/

components/

layouts/

hooks/

services/

animations/

charts/

styles/

assets/

backend/

app/

routers/

services/

numerical/

error_analysis/

root_finding/

interpolation/

differentiation/

integration/

linear_systems/

lu/

optimization/

ode/

performance/

utils/

models/

main.py

docs/

PROJECT_SPEC.md

REPORT.md

README.md

---

# Design Principles

## 1. Learn by Doing

Every lesson must contain:

Explanation

↓

Interactive Experiment

↓

Visualization

↓

Comparison

---

## 2. Instant Feedback

Whenever the student changes a parameter:

Immediately update

- Graph
- Error
- Iteration Table
- Convergence
- Animation

---

## 3. Visualization First

Every numerical algorithm must have an animation or visualization.

Students should understand WHY the algorithm works.

---

## 4. Engineering Focus

Every module must contain at least three real-world engineering applications.

Examples:

- Robotics
- Finance
- Electronics
- Machine Learning
- Aerospace
- Mechanical Engineering
- Civil Engineering

---

## 5. Comparison-Based Learning

Whenever possible solve the same problem using multiple algorithms.

Compare:

- Speed
- Accuracy
- Number of Iterations
- Error
- Stability
- Convergence
- Computational Cost

---

# Core Learning Modules

The website will contain ten major educational modules.

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

Each module must include:

- Introduction
- Theory
- Mathematical Background
- Interactive Controls
- Live Simulation
- Graphs
- Step-by-step Algorithm Visualization
- Error Analysis
- Performance Analysis
- Engineering Applications
- Practice Exercises
- Summary

---

# Development Objective

The goal is to build a professional educational platform comparable to platforms like GeoGebra, Wolfram Demonstrations, MATLAB Live Scripts, and PhET Simulations, specifically focused on Numerical Methods.

The website should prioritize education, interactivity, visualization, experimentation, and engineering applications rather than simply computing numerical answers.

# Claude AI Development Rules

These rules apply to the entire project.

## General Rules

- Follow this PROJECT_SPEC.md as the single source of truth.
- Never make architectural decisions without checking this specification.
- Never remove existing features unless explicitly requested.
- Keep the code modular, reusable and maintainable.
- Do not duplicate code.
- Use reusable components whenever possible.
- Follow SOLID principles.
- Follow clean architecture.
- Use meaningful variable names.
- Use TypeScript strict mode.
- Add clear comments for complex numerical algorithms.
- Keep UI responsive on desktop, tablet and mobile.

---

## Development Strategy

Never implement the whole project at once.

Develop incrementally.

For every feature:

1. Design
2. Backend API
3. Frontend UI
4. Visualization
5. Animation
6. Error Handling
7. Testing
8. Documentation

Only continue after the current feature is complete.

---

## Numerical Methods Rules

Every numerical algorithm MUST include:

- Mathematical explanation
- Theory
- Interactive playground
- Live visualization
- Step-by-step execution
- Iteration table
- Error analysis
- Performance analysis
- Comparison with other methods
- Engineering applications
- Practice exercises

---

## UI Rules

The website should feel like an interactive virtual laboratory.

Do NOT build simple forms.

Every page should include:

- animations
- charts
- interactive controls
- explanations
- mathematical formulas
- educational notes

---

## Code Quality

Every component must have a single responsibility.

Avoid files longer than 300-400 lines whenever possible.

Split large pages into reusable subcomponents.

Never hardcode values.

Use constants and configuration files.

---

## Documentation

Every exported function must include documentation.

Every numerical algorithm should explain:

- Inputs
- Outputs
- Mathematical idea
- Complexity
- Limitations
- Numerical stability

---

## Stop Rule

After finishing a major feature:

Stop.

Summarize what was implemented.

List remaining tasks.

Wait for approval before continuing.

# Learning System

The platform should function as a complete educational environment.

Features include:

- Learning Dashboard
- Learning Path
- Lesson Progress Tracking
- Interactive Quizzes
- Achievement System
- Recommended Next Lesson
- Local Progress Storage

The learning system exists only on the client side using LocalStorage.

# Numerical Laboratory

The platform contains a dedicated Numerical Laboratory.

Students can:

- Compare algorithms
- Run experiments
- Benchmark performance
- Explore floating-point precision
- Compare convergence
- Investigate engineering scenarios

The laboratory complements the lesson pages and encourages experimentation.

# Deployment

Frontend

- React
- Vite
- Vercel

Backend

- FastAPI
- Render

Version Control

- Git
- GitHub

Deployment must be fully automated through GitHub integration.

# Environment Variables

Frontend

VITE_API_URL

Backend

CORS_ORIGINS

No secrets should be hardcoded.

Production and development environments must be configurable.

# API Design

RESTful architecture

Each numerical module exposes its own endpoint.

Example:

/api/root-finding

/api/interpolation

/api/differentiation

/api/integration

/api/optimization

All responses must be JSON.

Errors must use consistent response models.

# Performance Rules

Every numerical algorithm should include:

- Execution time
- Iteration count
- Memory considerations (when applicable)
- Numerical stability discussion
- Error estimation

Whenever multiple algorithms solve the same problem, a comparison page should be provided.

# Development Roadmap

Completed

✓ Floating Point Error Analysis

✓ Root Finding

✓ Interpolation

Remaining

4. Numerical Differentiation

5. Numerical Integration

6. Linear Systems

7. LU Decomposition

8. Optimization

9. Ordinary Differential Equations

10. Performance Analysis & Comparative Analysis

Development must strictly follow this order.
