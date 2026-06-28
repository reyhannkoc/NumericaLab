from fastapi import APIRouter, HTTPException
from app.models.integration_models import (
    IntegrationRequest, IntegrationResult, IntegrationMethod, IntegrationInterval,
)
from app.utils.function_parser import parse_function
from app.numerical.integration.trapezoidal import trapezoidal
from app.numerical.integration.simpsons import simpsons, simpsons_3_8
from app.numerical.integration.gaussian_quadrature import gaussian_quadrature
import sympy as sp

router = APIRouter()


def _try_exact(expression: str, a: float, b: float):
    try:
        x = sp.Symbol("x")
        expr = sp.sympify(expression)
        return float(sp.integrate(expr, (x, a, b)))
    except Exception:
        return None


@router.post("/compute", response_model=IntegrationResult)
def compute_integration(req: IntegrationRequest):
    try:
        f = parse_function(req.expression)
    except ValueError as e:
        raise HTTPException(422, str(e))

    exact = _try_exact(req.expression, req.a, req.b)

    try:
        if req.method == IntegrationMethod.trapezoidal:
            integral, intervals = trapezoidal(f, req.a, req.b, req.n)
            ivs = [IntegrationInterval(**iv) for iv in intervals]

        elif req.method == IntegrationMethod.simpsons:
            integral, intervals = simpsons(f, req.a, req.b, req.n)
            ivs = [IntegrationInterval(**iv) for iv in intervals]

        elif req.method == IntegrationMethod.simpsons_3_8:
            integral, _ = simpsons_3_8(f, req.a, req.b, req.n)
            ivs = None

        elif req.method == IntegrationMethod.gaussian_quadrature:
            integral, nodes, weights = gaussian_quadrature(f, req.a, req.b, req.n)
            return IntegrationResult(
                integral=integral,
                exact_integral=exact,
                absolute_error=abs(integral - exact) if exact is not None else None,
                method=req.method,
                nodes=nodes,
                weights=weights,
            )

        else:
            raise HTTPException(422, f"Unsupported method: {req.method}")

    except Exception as e:
        raise HTTPException(400, str(e))

    abs_err = abs(integral - exact) if exact is not None else None
    return IntegrationResult(
        integral=integral,
        exact_integral=exact,
        absolute_error=abs_err,
        relative_error=abs(abs_err / (exact + 1e-300)) if abs_err is not None and exact else None,
        method=req.method,
        intervals=ivs,
    )
