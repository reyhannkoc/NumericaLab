"""Gaussian–Legendre quadrature."""

from typing import Callable
import numpy as np


def gaussian_quadrature(
    f: Callable, a: float, b: float, n: int = 5
) -> tuple[float, list[float], list[float]]:
    """
    n-point Gaussian–Legendre quadrature on [a, b].
    Returns (integral, nodes, weights).
    """
    xi, wi = np.polynomial.legendre.leggauss(n)
    # Change of variables from [-1, 1] to [a, b]
    t = 0.5 * (b - a) * xi + 0.5 * (b + a)
    w = 0.5 * (b - a) * wi
    integral = float(np.dot(w, [f(ti) for ti in t]))
    return integral, t.tolist(), w.tolist()
