from fastapi import APIRouter, HTTPException, Query
from app.models.differentiation_models import (
    DifferentiationRequest, DifferentiationResult, DifferentiationMethod, RichardsonTable,
)
from app.utils.function_parser import parse_function, symbolic_derivative
from app.numerical.differentiation.finite_differences import (
    forward_difference, backward_difference, central_difference,
)
from app.numerical.differentiation.richardson import richardson_extrapolation
import numpy as np

router = APIRouter()


@router.post("/compute", response_model=DifferentiationResult)
def compute_derivative(req: DifferentiationRequest):
    try:
        f = parse_function(req.expression)
        df_exact = symbolic_derivative(req.expression, req.order)
        exact = df_exact(req.x_point)
    except ValueError as e:
        raise HTTPException(422, str(e))

    try:
        if req.method == DifferentiationMethod.forward:
            deriv, _ = forward_difference(f, req.x_point, req.h)
        elif req.method == DifferentiationMethod.backward:
            deriv, _ = backward_difference(f, req.x_point, req.h)
        elif req.method == DifferentiationMethod.central:
            deriv, _ = central_difference(f, req.x_point, req.h)
        elif req.method == DifferentiationMethod.richardson:
            deriv, table, h_vals = richardson_extrapolation(f, req.x_point)
            return DifferentiationResult(
                derivative=deriv,
                exact_derivative=exact,
                absolute_error=abs(deriv - exact),
                relative_error=abs((deriv - exact) / (exact + 1e-300)),
                method=req.method,
                steps=RichardsonTable(table=table, h_values=h_vals),
            )
        else:
            raise HTTPException(422, f"Unknown method: {req.method}")
    except Exception as e:
        raise HTTPException(400, str(e))

    abs_err = abs(deriv - exact)
    return DifferentiationResult(
        derivative=deriv,
        exact_derivative=exact,
        absolute_error=abs_err,
        relative_error=abs(abs_err / (exact + 1e-300)),
        method=req.method,
    )


@router.get("/error-vs-h")
def error_vs_h(expression: str = Query(...), x_point: float = Query(...)):
    try:
        f = parse_function(expression)
        df_exact = symbolic_derivative(expression)
        exact = df_exact(x_point)
    except ValueError as e:
        raise HTTPException(422, str(e))

    h_values = [10 ** (-i) for i in range(1, 14)]
    errors: dict[str, list[float]] = {
        "forward": [], "backward": [], "central": [],
    }
    for h in h_values:
        fwd, _ = forward_difference(f, x_point, h)
        bwd, _ = backward_difference(f, x_point, h)
        cnt, _ = central_difference(f, x_point, h)
        errors["forward"].append(abs(fwd - exact))
        errors["backward"].append(abs(bwd - exact))
        errors["central"].append(abs(cnt - exact))

    return {"h_values": h_values, "errors": errors}
