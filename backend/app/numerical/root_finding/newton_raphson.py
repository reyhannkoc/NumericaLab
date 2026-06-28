"""
Newton–Raphson method.
Requires the function and its derivative (computed symbolically via SymPy).
"""

from typing import Callable
from app.models.root_finding_models import RootFindingIteration


def newton_raphson(
    f: Callable[[float], float],
    df: Callable[[float], float],
    x0: float,
    tolerance: float = 1e-8,
    max_iterations: int = 100,
) -> tuple[float, list[RootFindingIteration], bool]:
    """
    Run Newton–Raphson starting from x0.
    Returns (root, iterations, converged).
    """
    x = x0
    iterations: list[RootFindingIteration] = []
    converged = False

    for n in range(1, max_iterations + 1):
        fx = f(x)
        dfx = df(x)

        if abs(dfx) < 1e-14:
            break  # derivative too small — would divide by zero

        x_new = x - fx / dfx
        error = abs(x_new - x)

        iterations.append(
            RootFindingIteration(
                iteration=n,
                x=x,
                x_new=x_new,
                fx=fx,
                fx_new=f(x_new),
                error=error,
            )
        )

        if error < tolerance or abs(f(x_new)) < tolerance:
            converged = True
            x = x_new
            break

        x = x_new

    return x, iterations, converged
