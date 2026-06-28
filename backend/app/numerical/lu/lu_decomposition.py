"""LU decomposition with partial pivoting."""

import numpy as np
from app.models.lu_models import LUStep


def lu_decompose(
    matrix: list[list[float]],
) -> tuple[list[list[float]], list[list[float]], list[list[float]], float, list[LUStep]]:
    """
    LU decomposition with partial pivoting: PA = LU.
    Returns (L, U, P, determinant, steps).
    """
    A = np.array(matrix, dtype=float)
    n = A.shape[0]
    P = np.eye(n)
    L = np.eye(n)
    U = A.copy()
    steps: list[LUStep] = []
    sign = 1

    for k in range(n - 1):
        # Partial pivot
        max_row = k + int(np.argmax(np.abs(U[k:, k])))
        if max_row != k:
            U[[k, max_row]] = U[[max_row, k]]
            P[[k, max_row]] = P[[max_row, k]]
            if k > 0:
                L[[k, max_row], :k] = L[[max_row, k], :k]
            sign *= -1

        for i in range(k + 1, n):
            if abs(U[k, k]) < 1e-14:
                continue
            factor = U[i, k] / U[k, k]
            L[i, k] = factor
            U[i, k:] -= factor * U[k, k:]

        steps.append(LUStep(
            step=k + 1,
            description=f"Eliminate column {k+1}",
            L_state=L.tolist(),
            U_state=U.tolist(),
        ))

    det = sign * float(np.prod(np.diag(U)))
    return L.tolist(), U.tolist(), P.tolist(), det, steps
