from fastapi import APIRouter, HTTPException
from app.models.optimization_models import (
    OptimizationRequest, OptimizationResult, OptimizationMethod,
)
from app.utils.function_parser import parse_function, symbolic_derivative
from app.utils.response_helpers import timer_ms
from app.numerical.optimization.golden_section import golden_section_search
from app.numerical.optimization.gradient_descent import gradient_descent

router = APIRouter()


@router.post("/optimize", response_model=OptimizationResult)
def optimize(req: OptimizationRequest):
    try:
        f = parse_function(req.expression)
    except ValueError as e:
        raise HTTPException(422, str(e))

    with timer_ms() as t:
        try:
            if req.method == OptimizationMethod.golden_section:
                if req.a is None or req.b is None:
                    raise HTTPException(422, "Golden section requires 'a' and 'b'.")
                opt, val, iters, conv = golden_section_search(
                    f, req.a, req.b, req.tolerance, req.max_iterations, req.minimize,
                )

            elif req.method == OptimizationMethod.gradient_descent:
                if req.x0 is None:
                    raise HTTPException(422, "Gradient descent requires 'x0'.")
                df = symbolic_derivative(req.expression)
                opt, val, iters, conv = gradient_descent(
                    f, df, req.x0, req.learning_rate, req.tolerance, req.max_iterations, req.minimize,
                )

            else:
                raise HTTPException(422, f"Method {req.method} not yet implemented.")

        except Exception as e:
            raise HTTPException(400, str(e))

    return OptimizationResult(
        optimum=opt,
        optimum_value=val,
        iterations=iters,
        converged=conv,
        method=req.method,
        execution_time_ms=t["execution_time_ms"],
    )
