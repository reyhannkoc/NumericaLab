"""Cholesky decomposition for symmetric positive-definite matrices."""

import numpy as np
from app.models.lu_models import LUStep


def cholesky_decompose(
    matrix: list[list[float]],
) -> tuple[list[list[float]], float, list[LUStep]]:
    """
    Cholesky decomposition A = L·Lᵀ.
    Returns (L, determinant, steps).
    Raises ValueError if matrix is not SPD.
    """
    A = np.array(matrix, dtype=float)
    n = A.shape[0]

    if not np.allclose(A, A.T):
        raise ValueError("Matrix must be symmetric for Cholesky decomposition.")

    L = np.zeros_like(A)
    steps: list[LUStep] = []

    for i in range(n):
        for j in range(i + 1):
            s = sum(L[i, k] * L[j, k] for k in range(j))
            if i == j:
                val = A[i, i] - s
                if val <= 0:
                    raise ValueError("Matrix is not positive definite.")
                L[i, j] = np.sqrt(val)
            else:
                L[i, j] = (A[i, j] - s) / L[j, j]

        steps.append(LUStep(
            step=i + 1,
            description=f"Compute row {i+1} of L",
            L_state=L.tolist(),
            U_state=L.T.tolist(),
        ))

    det = float(np.prod(np.diag(L)) ** 2)
    return L.tolist(), det, steps
