"""Lagrange polynomial interpolation."""

import numpy as np


def lagrange_basis(x_points: list[float], j: int, x: float) -> float:
    """Compute the j-th Lagrange basis polynomial at x."""
    n = len(x_points)
    result = 1.0
    for m in range(n):
        if m != j:
            result *= (x - x_points[m]) / (x_points[j] - x_points[m])
    return result


def lagrange_interpolate(
    x_points: list[float],
    y_points: list[float],
    query_points: list[float],
) -> tuple[list[float], list[float], list[float]]:
    """
    Evaluate the Lagrange interpolating polynomial at query_points.
    Returns (interpolated_values, curve_x, curve_y).
    """
    x = np.array(x_points)
    y = np.array(y_points)
    n = len(x)

    def L(xq: float) -> float:
        return sum(y[j] * lagrange_basis(x_points, j, xq) for j in range(n))

    interp = [L(xq) for xq in query_points]

    # Dense curve for plotting
    cx = np.linspace(min(x) - 0.1 * (max(x) - min(x)), max(x) + 0.1 * (max(x) - min(x)), 300)
    cy = [L(xi) for xi in cx]

    return interp, cx.tolist(), cy
