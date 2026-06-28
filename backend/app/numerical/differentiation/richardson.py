"""Richardson extrapolation for high-accuracy differentiation."""

from typing import Callable
import numpy as np


def richardson_extrapolation(
    f: Callable, x: float, h0: float = 0.1, levels: int = 4
) -> tuple[float, list[list[float]], list[float]]:
    """
    Build a Richardson extrapolation table for f'(x).
    Returns (best_estimate, table, h_values).
    """
    h_values = [h0 / (2 ** i) for i in range(levels)]
    n = levels
    D = [[0.0] * n for _ in range(n)]

    for i in range(n):
        h = h_values[i]
        D[i][0] = (f(x + h) - f(x - h)) / (2 * h)

    for j in range(1, n):
        for i in range(j, n):
            D[i][j] = D[i][j - 1] + (D[i][j - 1] - D[i - 1][j - 1]) / (4 ** j - 1)

    return D[n - 1][n - 1], D, h_values
