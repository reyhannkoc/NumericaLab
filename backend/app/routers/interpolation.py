from fastapi import APIRouter, HTTPException
from app.models.interpolation_models import (
    InterpolationRequest, InterpolationResult, InterpolationMethod, SplineSegment,
)
from app.numerical.interpolation.lagrange import lagrange_interpolate
from app.numerical.interpolation.newton_divided_diff import newton_interp
from app.numerical.interpolation.cubic_spline import cubic_spline_interp

router = APIRouter()


@router.post("/compute", response_model=InterpolationResult)
def compute_interpolation(req: InterpolationRequest):
    if len(req.x_points) != len(req.y_points):
        raise HTTPException(422, "x_points and y_points must have the same length.")

    try:
        if req.method == InterpolationMethod.lagrange:
            interp, cx, cy = lagrange_interpolate(req.x_points, req.y_points, req.query_points)
            return InterpolationResult(
                query_points=req.query_points,
                interpolated_values=interp,
                curve_x=cx,
                curve_y=cy,
                method=req.method,
            )

        elif req.method == InterpolationMethod.newton_divided_diff:
            interp, cx, cy, table = newton_interp(req.x_points, req.y_points, req.query_points)
            return InterpolationResult(
                query_points=req.query_points,
                interpolated_values=interp,
                curve_x=cx,
                curve_y=cy,
                divided_differences=table,
                method=req.method,
            )

        elif req.method == InterpolationMethod.cubic_spline:
            interp, cx, cy, segs = cubic_spline_interp(req.x_points, req.y_points, req.query_points)
            return InterpolationResult(
                query_points=req.query_points,
                interpolated_values=interp,
                curve_x=cx,
                curve_y=cy,
                spline_segments=[SplineSegment(**s) for s in segs],
                method=req.method,
            )

    except Exception as e:
        raise HTTPException(400, str(e))

    raise HTTPException(422, f"Unknown method: {req.method}")


@router.post("/compare")
def compare_methods(req: dict):
    # TODO: run all methods and return side-by-side results
    raise HTTPException(501, "Comparison not yet implemented.")
