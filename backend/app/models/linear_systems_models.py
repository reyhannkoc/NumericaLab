from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class LinearSolverMethod(str, Enum):
    gaussian_elimination = "gaussian_elimination"
    gauss_seidel = "gauss_seidel"
    jacobi = "jacobi"
    cramer = "cramer"


class LinearSystemRequest(BaseModel):
    matrix_a: list[list[float]]
    vector_b: list[float]
    method: LinearSolverMethod
    tolerance: float = Field(1e-8, gt=0)
    max_iterations: int = Field(100, gt=0)
    x0: Optional[list[float]] = None


class LinearIteration(BaseModel):
    iteration: int
    x: list[float]
    error: float


class RowOperation(BaseModel):
    type: str
    description: str
    matrix_state: list[list[float]]


class LinearSystemResult(BaseModel):
    solution: list[float]
    residual: float
    iterations: Optional[list[LinearIteration]] = None
    row_operations: Optional[list[RowOperation]] = None
    augmented_matrix_steps: Optional[list[list[list[float]]]] = None
    method: LinearSolverMethod
    execution_time_ms: float
