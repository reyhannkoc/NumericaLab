"""Natural cubic spline interpolation."""

import numpy as np
from scipy.interpolate import CubicSpline


def cubic_spline_interp(
    x_points: list[float],
    y_points: list[float],
    query_points: list[float],
):
    x = np.array(x_points)
    y = np.array(y_points)
    cs = CubicSpline(x, y, bc_type="natural")

    interp = cs(query_points).tolist()
    cx = np.linspace(x.min() - 0.05, x.max() + 0.05, 400)
    cy = cs(cx).tolist()

    # Extract spline coefficients per segment
    segments = []
    for i in range(len(x) - 1):
        c = cs.c[:, i]  # [d, c, b, a] from scipy
        segments.append({
            "a": float(c[3]),
            "b": float(c[2]),
            "c": float(c[1]),
            "d": float(c[0]),
            "x_start": float(x[i]),
            "x_end": float(x[i + 1]),
        })

    return interp, cx.tolist(), cy, segments
