from fastapi import APIRouter, HTTPException, Query
from app.models.root_finding_models import (
    RootFindingRequest, RootFindingResult, RootFindingMethod,
    ComparisonRequest, ComparisonResponse, ComparisonEntry,
)
from app.utils.function_parser import parse_function, symbolic_derivative
from app.utils.response_helpers import timer_ms
from app.numerical.root_finding.bisection import bisection
from app.numerical.root_finding.newton_raphson import newton_raphson
from app.numerical.root_finding.secant import secant
from app.numerical.root_finding.fixed_point import fixed_point
import numpy as np

router = APIRouter()


@router.post("/solve", response_model=RootFindingResult)
def solve_root(req: RootFindingRequest):
    try:
        f = parse_function(req.expression)
    except ValueError as e:
        raise HTTPException(422, str(e))

    with timer_ms() as t:
        try:
            if req.method == RootFindingMethod.bisection:
                if req.a is None or req.b is None:
                    raise HTTPException(422, "Bisection requires 'a' and 'b'.")
                root, iters, converged = bisection(f, req.a, req.b, req.tolerance, req.max_iterations)

            elif req.method == RootFindingMethod.newton_raphson:
                if req.x0 is None:
                    raise HTTPException(422, "Newton–Raphson requires 'x0'.")
                df = symbolic_derivative(req.expression)
                root, iters, converged = newton_raphson(f, df, req.x0, req.tolerance, req.max_iterations)

            elif req.method == RootFindingMethod.secant:
                if req.x0 is None or req.x1 is None:
                    raise HTTPException(422, "Secant method requires 'x0' and 'x1'.")
                root, iters, converged = secant(f, req.x0, req.x1, req.tolerance, req.max_iterations)

            elif req.method == RootFindingMethod.fixed_point:
                if req.x0 is None:
                    raise HTTPException(422, "Fixed-point iteration requires 'x0'.")
                root, iters, converged = fixed_point(f, req.x0, req.tolerance, req.max_iterations)

            else:
                raise HTTPException(422, f"Unknown method: {req.method}")

        except ValueError as e:
            raise HTTPException(400, str(e))

    return RootFindingResult(
        root=root,
        iterations=iters,
        converged=converged,
        final_error=iters[-1].error if iters else 0.0,
        total_iterations=len(iters),
        method=req.method,
        execution_time_ms=t["execution_time_ms"],
    )


@router.get("/plot")
def get_function_plot(
    expression: str = Query(...),
    a: float = Query(...),
    b: float = Query(...),
    n: int = Query(300),
):
    try:
        f = parse_function(expression)
    except ValueError as e:
        raise HTTPException(422, str(e))

    x = np.linspace(a, b, n)
    y = []
    for xi in x:
        try:
            yi = f(float(xi))
            y.append(None if (abs(yi) > 1e6 or np.isnan(yi) or np.isinf(yi)) else yi)
        except Exception:
            y.append(None)

    return {"x": x.tolist(), "y": y}


@router.post("/compare", response_model=ComparisonResponse)
def compare_methods(req: ComparisonRequest):
    # TODO: implement full comparison
    raise HTTPException(501, "Comparison endpoint not yet implemented.")
