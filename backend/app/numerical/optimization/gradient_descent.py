"""Gradient descent for single-variable optimization."""

from typing import Callable
from app.models.optimization_models import OptimizationIteration


def gradient_descent(
    f: Callable[[float], float],
    df: Callable[[float], float],
    x0: float,
    learning_rate: float = 0.01,
    tolerance: float = 1e-8,
    max_iterations: int = 500,
    minimize: bool = True,
) -> tuple[float, float, list[OptimizationIteration], bool]:
    sign = 1 if minimize else -1
    x = x0
    iterations: list[OptimizationIteration] = []

    for n in range(1, max_iterations + 1):
        grad = sign * df(x)
        x_new = x - learning_rate * grad
        error = abs(x_new - x)

        iterations.append(OptimizationIteration(
            iteration=n,
            x=x,
            fx=f(x),
            gradient=grad,
        ))

        if error < tolerance:
            return x_new, f(x_new), iterations, True

        x = x_new

    return x, f(x), iterations, False
