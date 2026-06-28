from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class OptimizationMethod(str, Enum):
    golden_section = "golden_section"
    gradient_descent = "gradient_descent"
    newton = "newton"
    brent = "brent"


class OptimizationRequest(BaseModel):
    expression: str
    method: OptimizationMethod
    a: Optional[float] = None
    b: Optional[float] = None
    x0: Optional[float] = None
    learning_rate: float = Field(0.01, gt=0)
    tolerance: float = Field(1e-8, gt=0)
    max_iterations: int = Field(500, gt=0)
    minimize: bool = True


class OptimizationIteration(BaseModel):
    iteration: int
    x: float
    fx: float
    interval: Optional[list[float]] = None
    gradient: Optional[float] = None


class OptimizationResult(BaseModel):
    optimum: float
    optimum_value: float
    iterations: list[OptimizationIteration]
    converged: bool
    method: OptimizationMethod
    execution_time_ms: float
