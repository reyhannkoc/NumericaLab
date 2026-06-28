"""Secant method — Newton without explicit derivative."""

from typing import Callable
from app.models.root_finding_models import RootFindingIteration


def secant(
    f: Callable[[float], float],
    x0: float,
    x1: float,
    tolerance: float = 1e-8,
    max_iterations: int = 100,
) -> tuple[float, list[RootFindingIteration], bool]:
    iterations: list[RootFindingIteration] = []
    converged = False

    for n in range(1, max_iterations + 1):
        f0, f1 = f(x0), f(x1)
        denom = f1 - f0
        if abs(denom) < 1e-14:
            break

        x2 = x1 - f1 * (x1 - x0) / denom
        error = abs(x2 - x1)

        iterations.append(
            RootFindingIteration(iteration=n, x=x1, x_new=x2, fx=f1, error=error)
        )

        if error < tolerance or abs(f(x2)) < tolerance:
            converged = True
            x1 = x2
            break

        x0, x1 = x1, x2

    return x1, iterations, converged
