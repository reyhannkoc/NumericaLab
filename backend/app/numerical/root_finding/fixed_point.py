"""Fixed-point iteration: solve x = g(x)."""

from typing import Callable
from app.models.root_finding_models import RootFindingIteration


def fixed_point(
    g: Callable[[float], float],
    x0: float,
    tolerance: float = 1e-8,
    max_iterations: int = 100,
) -> tuple[float, list[RootFindingIteration], bool]:
    x = x0
    iterations: list[RootFindingIteration] = []
    converged = False

    for n in range(1, max_iterations + 1):
        x_new = g(x)
        error = abs(x_new - x)

        iterations.append(
            RootFindingIteration(iteration=n, x=x, x_new=x_new, fx=x_new - x, error=error)
        )

        if error < tolerance:
            converged = True
            x = x_new
            break

        x = x_new

    return x, iterations, converged
