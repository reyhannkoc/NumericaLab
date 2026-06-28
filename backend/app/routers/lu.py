from fastapi import APIRouter, HTTPException
from app.models.lu_models import LURequest, LUResult, LUSolveRequest, LUSolveResult
from app.numerical.lu.lu_decomposition import lu_decompose
from app.numerical.lu.cholesky import cholesky_decompose
import numpy as np

router = APIRouter()


@router.post("/decompose", response_model=LUResult)
def decompose(req: LURequest):
    try:
        if req.method.value == "cholesky":
            L, det, steps = cholesky_decompose(req.matrix)
            return LUResult(
                L=L,
                U=[[L[j][i] for j in range(len(L))] for i in range(len(L))],
                determinant=det,
                steps=steps,
                method=req.method,
            )
        else:
            L, U, P, det, steps = lu_decompose(req.matrix)
            return LUResult(L=L, U=U, P=P, determinant=det, steps=steps, method=req.method)
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/solve", response_model=LUSolveResult)
def lu_solve(req: LUSolveRequest):
    try:
        L, U, P, _, steps = lu_decompose(req.matrix)
        Lm = np.array(L)
        Um = np.array(U)
        Pm = np.array(P)
        b  = np.array(req.b)
        pb = Pm @ b
        # Forward substitution
        n = len(b)
        y = np.zeros(n)
        for i in range(n):
            y[i] = (pb[i] - Lm[i, :i] @ y[:i]) / Lm[i, i]
        # Backward substitution
        x = np.zeros(n)
        for i in range(n - 1, -1, -1):
            x[i] = (y[i] - Um[i, i+1:] @ x[i+1:]) / Um[i, i]
        return LUSolveResult(solution=x.tolist(), steps=steps)
    except Exception as e:
        raise HTTPException(400, str(e))
