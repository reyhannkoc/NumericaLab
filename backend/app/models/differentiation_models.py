from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class DifferentiationMethod(str, Enum):
    forward = "forward"
    backward = "backward"
    central = "central"
    richardson = "richardson"


class DifferentiationRequest(BaseModel):
    expression: str
    x_point: float
    h: float = Field(0.01, gt=0)
    method: DifferentiationMethod
    order: int = Field(1, ge=1, le=4)


class RichardsonTable(BaseModel):
    table: list[list[float]]
    h_values: list[float]


class DifferentiationResult(BaseModel):
    derivative: float
    exact_derivative: Optional[float] = None
    absolute_error: Optional[float] = None
    relative_error: Optional[float] = None
    method: DifferentiationMethod
    steps: Optional[RichardsonTable] = None
