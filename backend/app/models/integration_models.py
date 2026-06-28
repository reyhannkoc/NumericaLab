from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class IntegrationMethod(str, Enum):
    trapezoidal = "trapezoidal"
    simpsons = "simpsons"
    simpsons_3_8 = "simpsons_3_8"
    gaussian_quadrature = "gaussian_quadrature"
    romberg = "romberg"


class IntegrationRequest(BaseModel):
    expression: str
    a: float
    b: float
    n: int = Field(10, ge=1, le=10000)
    method: IntegrationMethod


class IntegrationInterval(BaseModel):
    x_start: float
    x_end: float
    area: float


class IntegrationResult(BaseModel):
    integral: float
    exact_integral: Optional[float] = None
    absolute_error: Optional[float] = None
    relative_error: Optional[float] = None
    method: IntegrationMethod
    intervals: Optional[list[IntegrationInterval]] = None
    nodes: Optional[list[float]] = None
    weights: Optional[list[float]] = None
    romberg_table: Optional[list[list[float]]] = None
