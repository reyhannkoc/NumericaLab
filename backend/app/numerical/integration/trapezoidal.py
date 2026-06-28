"""Composite trapezoidal rule."""

from typing import Callable
import numpy as np


def trapezoidal(
    f: Callable, a: float, b: float, n: int
) -> tuple[float, list[dict]]:
    h = (b - a) / n
    x = np.linspace(a, b, n + 1)
    y = np.array([f(xi) for xi in x])

    integral = h * (y[0] / 2 + y[1:-1].sum() + y[-1] / 2)

    intervals = [
        {"x_start": float(x[i]), "x_end": float(x[i + 1]),
         "area": h * (y[i] + y[i + 1]) / 2}
        for i in range(n)
    ]
    return float(integral), intervals
