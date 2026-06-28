"""Golden section search for single-variable minimization."""

from typing import Callable
from app.models.optimization_models import OptimizationIteration

GOLDEN_RATIO = (3 - 5 ** 0.5) / 2  # ≈ 0.3820


def golden_section_search(
    f: Callable[[float], float],
    a: float,
    b: float,
    tolerance: float = 1e-8,
    max_iterations: int = 500,
    minimize: bool = True,
) -> tuple[float, float, list[OptimizationIteration], bool]:
    sign = 1 if minimize else -1
    iterations: list[OptimizationIteration] = []

    x1 = a + GOLDEN_RATIO * (b - a)
    x2 = b - GOLDEN_RATIO * (b - a)
    f1, f2 = sign * f(x1), sign * f(x2)

    for n in range(1, max_iterations + 1):
        x_mid = (a + b) / 2
        iterations.append(OptimizationIteration(
            iteration=n,
            x=x_mid,
            fx=f(x_mid),
            interval=[a, b],
        ))

        if abs(b - a) < tolerance:
            return x_mid, f(x_mid), iterations, True

        if f1 < f2:
            b = x2
            x2, f2 = x1, f1
            x1 = a + GOLDEN_RATIO * (b - a)
            f1 = sign * f(x1)
        else:
            a = x1
            x1, f1 = x2, f2
            x2 = b - GOLDEN_RATIO * (b - a)
            f2 = sign * f(x2)

    x_mid = (a + b) / 2
    return x_mid, f(x_mid), iterations, False
