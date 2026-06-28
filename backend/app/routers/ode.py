from fastapi import APIRouter, HTTPException
from app.models.ode_models import ODERequest, ODEResult, ODEMethod
from app.utils.function_parser import parse_function_xy, parse_function
from app.numerical.ode.euler import euler_method, heun_method
from app.numerical.ode.runge_kutta import runge_kutta_4
import numpy as np

router = APIRouter()


@router.post("/solve", response_model=ODEResult)
def solve_ode(req: ODERequest):
    try:
        f = parse_function_xy(req.expression)
    except ValueError as e:
        raise HTTPException(422, str(e))

    exact_fn = None
    if req.exact_expression:
        try:
            exact_fn = parse_function(req.exact_expression)
        except ValueError:
            pass

    try:
        if req.method == ODEMethod.euler:
            xs, ys = euler_method(f, req.x0, req.y0, req.x_end, req.h)
        elif req.method == ODEMethod.heun:
            xs, ys = heun_method(f, req.x0, req.y0, req.x_end, req.h)
        elif req.method == ODEMethod.runge_kutta_4:
            xs, ys = runge_kutta_4(f, req.x0, req.y0, req.x_end, req.h)
        else:
            raise HTTPException(422, f"Method {req.method} not yet implemented.")
    except Exception as e:
        raise HTTPException(400, str(e))

    exact_vals = None
    global_err = None
    if exact_fn:
        exact_vals = [exact_fn(xi) for xi in xs]
        global_err = [abs(yi - ye) for yi, ye in zip(ys, exact_vals)]

    return ODEResult(
        x_values=xs,
        y_values=ys,
        exact_values=exact_vals,
        global_error=global_err,
        method=req.method,
        steps=len(xs) - 1,
    )


@router.post("/compare")
def compare_methods(req: dict):
    raise HTTPException(501, "ODE comparison not yet implemented.")
