"""Euler's method and Heun's method for dy/dx = f(x, y)."""

from typing import Callable


def euler_method(
    f: Callable[[float, float], float],
    x0: float, y0: float, x_end: float, h: float,
) -> tuple[list[float], list[float]]:
    x, y = x0, y0
    xs, ys = [x], [y]
    while x < x_end - 1e-12:
        h_actual = min(h, x_end - x)
        y = y + h_actual * f(x, y)
        x = x + h_actual
        xs.append(x)
        ys.append(y)
    return xs, ys


def heun_method(
    f: Callable[[float, float], float],
    x0: float, y0: float, x_end: float, h: float,
) -> tuple[list[float], list[float]]:
    x, y = x0, y0
    xs, ys = [x], [y]
    while x < x_end - 1e-12:
        h_actual = min(h, x_end - x)
        k1 = f(x, y)
        y_pred = y + h_actual * k1
        k2 = f(x + h_actual, y_pred)
        y = y + h_actual * (k1 + k2) / 2
        x = x + h_actual
        xs.append(x)
        ys.append(y)
    return xs, ys
