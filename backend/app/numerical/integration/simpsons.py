"""Composite Simpson's 1/3 and 3/8 rules."""

from typing import Callable
import numpy as np


def simpsons(f: Callable, a: float, b: float, n: int) -> tuple[float, list[dict]]:
    """Simpson's 1/3 rule — n must be even."""
    if n % 2 != 0:
        n += 1
    h = (b - a) / n
    x = np.linspace(a, b, n + 1)
    y = np.array([f(xi) for xi in x])

    integral = h / 3 * (y[0] + 4 * y[1:-1:2].sum() + 2 * y[2:-2:2].sum() + y[-1])

    intervals = [
        {"x_start": float(x[i]), "x_end": float(x[i + 2]),
         "area": h / 3 * (y[i] + 4 * y[i + 1] + y[i + 2])}
        for i in range(0, n, 2)
    ]
    return float(integral), intervals


def simpsons_3_8(f: Callable, a: float, b: float, n: int) -> tuple[float, list[dict]]:
    """Simpson's 3/8 rule — n must be divisible by 3."""
    while n % 3 != 0:
        n += 1
    h = (b - a) / n
    x = np.linspace(a, b, n + 1)
    y = np.array([f(xi) for xi in x])

    integral = 3 * h / 8 * (
        y[0]
        + 3 * sum(y[i] for i in range(1, n) if i % 3 != 0)
        + 2 * sum(y[i] for i in range(3, n, 3))
        + y[-1]
    )
    return float(integral), []
