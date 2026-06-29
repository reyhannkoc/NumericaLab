from fastapi import APIRouter, HTTPException
from app.models.linear_systems_models import (
    LinearSystemRequest, LinearSystemResult, LinearSolverMethod,
)
from app.numerical.linear_systems.gaussian_elimination import gaussian_elimination
from app.numerical.linear_systems.gauss_seidel import gauss_seidel, jacobi
from app.utils.response_helpers import timer_ms
import numpy as np

router = APIRouter()


@router.post("/solve", response_model=LinearSystemResult)
def solve_system(req: LinearSystemRequest):
    A, b = req.matrix_a, req.vector_b
    if len(A) != len(b) or any(len(row) != len(b) for row in A):
        raise HTTPException(422, "Matrix A must be square and consistent with vector b.")

    sol = res = ops = iters = None
    with timer_ms() as t:
        try:
            if req.method == LinearSolverMethod.gaussian_elimination:
                sol, res, ops = gaussian_elimination(A, b)
            elif req.method == LinearSolverMethod.gauss_seidel:
                sol, iters, converged = gauss_seidel(A, b, req.x0, req.tolerance, req.max_iterations)
                res = float(np.linalg.norm(np.array(A) @ np.array(sol) - np.array(b)))
            elif req.method == LinearSolverMethod.jacobi:
                sol, iters, converged = jacobi(A, b, req.x0, req.tolerance, req.max_iterations)
                res = float(np.linalg.norm(np.array(A) @ np.array(sol) - np.array(b)))
            else:
                raise HTTPException(422, f"Unknown method: {req.method}")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(400, str(e))

    if req.method == LinearSolverMethod.gaussian_elimination:
        return LinearSystemResult(
            solution=sol, residual=res, row_operations=ops,
            method=req.method, execution_time_ms=t["execution_time_ms"],
        )
    return LinearSystemResult(
        solution=sol, residual=res, iterations=iters,
        method=req.method, execution_time_ms=t["execution_time_ms"],
    )
