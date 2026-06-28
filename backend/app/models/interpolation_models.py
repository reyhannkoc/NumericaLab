from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class InterpolationMethod(str, Enum):
    lagrange = "lagrange"
    newton_divided_diff = "newton_divided_diff"
    cubic_spline = "cubic_spline"


class InterpolationRequest(BaseModel):
    x_points: list[float] = Field(..., min_length=2)
    y_points: list[float] = Field(..., min_length=2)
    query_points: list[float]
    method: InterpolationMethod


class SplineSegment(BaseModel):
    a: float; b: float; c: float; d: float
    x_start: float; x_end: float


class InterpolationResult(BaseModel):
    query_points: list[float]
    interpolated_values: list[float]
    curve_x: list[float]
    curve_y: list[float]
    coefficients: Optional[list[float]] = None
    divided_differences: Optional[list[list[float]]] = None
    spline_segments: Optional[list[SplineSegment]] = None
    method: InterpolationMethod
