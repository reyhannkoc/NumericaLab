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

    import math

    for n in range(1, max_iterations + 1):
        try:
            x_new = g(x)
        except (OverflowError, ZeroDivisionError, ValueError):
            raise ValueError(
                f"g(x) diverged or is undefined at iteration {n} (x={x:.6g}). "
                "For fixed-point iteration, provide g(x) such that x = g(x) at the solution "
                "(e.g. g(x) = (x+2)**(1/3) to find roots of x³-x-2=0)."
            )

        if not math.isfinite(x_new):
            raise ValueError(
                f"g(x) diverged to {x_new} at iteration {n}. "
                "For fixed-point iteration, provide g(x) such that x = g(x) at the solution "
                "(e.g. g(x) = (x+2)**(1/3) to find roots of x³-x-2=0)."
            )

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
