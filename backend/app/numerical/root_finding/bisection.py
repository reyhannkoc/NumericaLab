"""
Bisection method for finding roots of f(x) = 0 on [a, b].
Guaranteed to converge when f(a)·f(b) < 0.
"""

from typing import Callable
from app.models.root_finding_models import RootFindingIteration


def bisection(
    f: Callable[[float], float],
    a: float,
    b: float,
    tolerance: float = 1e-8,
    max_iterations: int = 100,
) -> tuple[float, list[RootFindingIteration], bool]:
    """
    Run the bisection method on [a, b].
    Returns (root, iterations, converged).
    Raises ValueError if f(a)·f(b) >= 0.
    """
    if f(a) * f(b) >= 0:
        raise ValueError(
            f"f(a) and f(b) must have opposite signs. "
            f"f({a}) = {f(a):.4g}, f({b}) = {f(b):.4g}"
        )

    iterations: list[RootFindingIteration] = []
    converged = False

    for n in range(1, max_iterations + 1):
        c = (a + b) / 2.0
        fc = f(c)
        error = (b - a) / 2.0

        iterations.append(
            RootFindingIteration(
                iteration=n,
                a=a,
                b=b,
                x=c,
                fx=fc,
                error=abs(error),
            )
        )

        if abs(error) < tolerance or abs(fc) < tolerance:
            converged = True
            break

        if f(a) * fc < 0:
            b = c
        else:
            a = c

    root = (a + b) / 2.0
    return root, iterations, converged
