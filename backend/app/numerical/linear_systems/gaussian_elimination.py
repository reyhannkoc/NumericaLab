"""Gaussian elimination with partial pivoting."""

import numpy as np
from app.models.linear_systems_models import RowOperation


def gaussian_elimination(
    A: list[list[float]], b: list[float]
) -> tuple[list[float], float, list[RowOperation]]:
    """
    Solve Ax = b via Gaussian elimination with partial pivoting.
    Returns (solution, residual, row_operations).
    """
    A = np.array(A, dtype=float)
    b = np.array(b, dtype=float)
    n = len(b)
    ops: list[RowOperation] = []
    aug = np.hstack([A, b.reshape(-1, 1)])

    for col in range(n):
        # Partial pivoting
        max_row = col + int(np.argmax(np.abs(aug[col:, col])))
        if max_row != col:
            aug[[col, max_row]] = aug[[max_row, col]]
            ops.append(RowOperation(
                type="swap",
                description=f"Swap row {col+1} ↔ row {max_row+1}",
                matrix_state=aug.tolist(),
            ))

        # Elimination
        for row in range(col + 1, n):
            if abs(aug[col, col]) < 1e-14:
                continue
            factor = aug[row, col] / aug[col, col]
            aug[row] -= factor * aug[col]
            ops.append(RowOperation(
                type="add",
                description=f"R{row+1} ← R{row+1} - ({factor:.4g})·R{col+1}",
                matrix_state=aug.tolist(),
            ))

    # Back substitution
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        if abs(aug[i, i]) < 1e-14:
            x[i] = 0.0
        else:
            x[i] = (aug[i, n] - np.dot(aug[i, i+1:n], x[i+1:n])) / aug[i, i]

    residual = float(np.linalg.norm(A @ x - b))
    return x.tolist(), residual, ops
