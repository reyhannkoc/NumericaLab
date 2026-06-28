"""
Finite difference formulas for numerical differentiation.
All return (derivative, error_estimate).
"""

from typing import Callable


def forward_difference(f: Callable, x: float, h: float) -> tuple[float, None]:
    """O(h) forward difference: f'(x) ≈ [f(x+h) - f(x)] / h"""
    return (f(x + h) - f(x)) / h, None


def backward_difference(f: Callable, x: float, h: float) -> tuple[float, None]:
    """O(h) backward difference: f'(x) ≈ [f(x) - f(x-h)] / h"""
    return (f(x) - f(x - h)) / h, None


def central_difference(f: Callable, x: float, h: float) -> tuple[float, None]:
    """O(h²) central difference: f'(x) ≈ [f(x+h) - f(x-h)] / 2h"""
    return (f(x + h) - f(x - h)) / (2 * h), None


def second_derivative_central(f: Callable, x: float, h: float) -> float:
    """O(h²) second derivative: f''(x) ≈ [f(x+h) - 2f(x) + f(x-h)] / h²"""
    return (f(x + h) - 2 * f(x) + f(x - h)) / (h ** 2)
