from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class RootFindingMethod(str, Enum):
    bisection = "bisection"
    newton_raphson = "newton_raphson"
    secant = "secant"
    fixed_point = "fixed_point"


class RootFindingRequest(BaseModel):
    expression: str = Field(..., description="Python math expression in x, e.g. 'x**3 - x - 2'")
    method: RootFindingMethod
    x0: Optional[float] = Field(None, description="Initial guess (Newton, Secant, Fixed-Point)")
    x1: Optional[float] = Field(None, description="Second initial guess (Secant)")
    a: Optional[float] = Field(None, description="Interval lower bound (Bisection)")
    b: Optional[float] = Field(None, description="Interval upper bound (Bisection)")
    tolerance: float = Field(1e-8, gt=0)
    max_iterations: int = Field(100, gt=0, le=10000)


class RootFindingIteration(BaseModel):
    iteration: int
    a: Optional[float] = None
    b: Optional[float] = None
    x: Optional[float] = None
    x_new: Optional[float] = None
    fx: float
    fx_new: Optional[float] = None
    error: float


class RootFindingResult(BaseModel):
    root: float
    iterations: list[RootFindingIteration]
    converged: bool
    final_error: float
    total_iterations: int
    method: RootFindingMethod
    execution_time_ms: float


class ComparisonRequest(BaseModel):
    expression: str
    methods: list[str]
    common_params: dict = Field(default_factory=dict)


class ComparisonEntry(BaseModel):
    method: str
    result: float
    iterations: int
    execution_time_ms: float
    error: Optional[float] = None
    converged: bool


class ComparisonResponse(BaseModel):
    entries: list[ComparisonEntry]
    best_accuracy: str
    fastest: str
    fewest_iterations: str
