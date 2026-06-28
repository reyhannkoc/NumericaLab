"""Newton's divided difference interpolation."""

import numpy as np


def divided_differences(x: list[float], y: list[float]) -> list[list[float]]:
    """Build the divided difference table."""
    n = len(x)
    table = [[0.0] * n for _ in range(n)]
    for i in range(n):
        table[i][0] = y[i]
    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (x[i + j] - x[i])
    return table


def newton_interp(x_points: list[float], y_points: list[float], query_points: list[float]):
    table = divided_differences(x_points, y_points)
    coeffs = [table[0][j] for j in range(len(x_points))]

    def evaluate(xq: float) -> float:
        result = coeffs[0]
        term = 1.0
        for i in range(1, len(x_points)):
            term *= (xq - x_points[i - 1])
            result += coeffs[i] * term
        return result

    interp = [evaluate(xq) for xq in query_points]
    cx = np.linspace(min(x_points) - 0.05, max(x_points) + 0.05, 300)
    cy = [evaluate(xi) for xi in cx]
    return interp, cx.tolist(), cy, table
