from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class ODEMethod(str, Enum):
    euler = "euler"
    heun = "heun"
    midpoint = "midpoint"
    runge_kutta_4 = "runge_kutta_4"
    adams_bashforth = "adams_bashforth"


class ODERequest(BaseModel):
    expression: str = Field(..., description="f(x, y) — right-hand side of dy/dx = f(x, y)")
    x0: float
    y0: float
    x_end: float
    h: float = Field(0.1, gt=0)
    method: ODEMethod
    exact_expression: Optional[str] = Field(None, description="Optional exact solution y(x) for error comparison")


class ODEResult(BaseModel):
    x_values: list[float]
    y_values: list[float]
    exact_values: Optional[list[float]] = None
    global_error: Optional[list[float]] = None
    method: ODEMethod
    steps: int
