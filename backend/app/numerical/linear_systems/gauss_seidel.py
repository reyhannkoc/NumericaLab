"""Gauss–Seidel iterative method for Ax = b."""

import numpy as np
from app.models.linear_systems_models import LinearIteration


def gauss_seidel(
    A: list[list[float]], b: list[float],
    x0: list[float] | None = None,
    tolerance: float = 1e-8,
    max_iterations: int = 100,
) -> tuple[list[float], list[LinearIteration], bool]:
    A = np.array(A, dtype=float)
    b = np.array(b, dtype=float)
    n = len(b)
    x = np.zeros(n) if x0 is None else np.array(x0, dtype=float)
    iterations: list[LinearIteration] = []

    for k in range(1, max_iterations + 1):
        x_new = x.copy()
        for i in range(n):
            s = sum(A[i, j] * x_new[j] for j in range(n) if j != i)
            x_new[i] = (b[i] - s) / A[i, i]

        error = float(np.linalg.norm(x_new - x))
        iterations.append(LinearIteration(iteration=k, x=x_new.tolist(), error=error))

        if error < tolerance:
            return x_new.tolist(), iterations, True

        x = x_new

    return x.tolist(), iterations, False


def jacobi(
    A: list[list[float]], b: list[float],
    x0: list[float] | None = None,
    tolerance: float = 1e-8,
    max_iterations: int = 100,
) -> tuple[list[float], list[LinearIteration], bool]:
    A = np.array(A, dtype=float)
    b = np.array(b, dtype=float)
    n = len(b)
    x = np.zeros(n) if x0 is None else np.array(x0, dtype=float)
    iterations: list[LinearIteration] = []

    D = np.diag(A)
    R = A - np.diag(D)

    for k in range(1, max_iterations + 1):
        x_new = (b - R @ x) / D
        error = float(np.linalg.norm(x_new - x))
        iterations.append(LinearIteration(iteration=k, x=x_new.tolist(), error=error))

        if error < tolerance:
            return x_new.tolist(), iterations, True

        x = x_new

    return x.tolist(), iterations, False
