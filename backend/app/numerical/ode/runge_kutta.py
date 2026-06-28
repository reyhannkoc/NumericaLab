"""Classic 4th-order Runge–Kutta solver."""

from typing import Callable


def runge_kutta_4(
    f: Callable[[float, float], float],
    x0: float, y0: float, x_end: float, h: float,
) -> tuple[list[float], list[float]]:
    x, y = x0, y0
    xs, ys = [x], [y]
    while x < x_end - 1e-12:
        h_actual = min(h, x_end - x)
        k1 = f(x,              y)
        k2 = f(x + h_actual/2, y + h_actual * k1 / 2)
        k3 = f(x + h_actual/2, y + h_actual * k2 / 2)
        k4 = f(x + h_actual,   y + h_actual * k3)
        y = y + h_actual * (k1 + 2*k2 + 2*k3 + k4) / 6
        x = x + h_actual
        xs.append(x)
        ys.append(y)
    return xs, ys
