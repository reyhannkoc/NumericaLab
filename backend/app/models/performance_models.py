from pydantic import BaseModel, Field
from typing import Optional


class BenchmarkRequest(BaseModel):
    problem_type: str = Field(..., description="root_finding | integration | linear_systems | ode")
    methods: list[str] = Field(default_factory=list)
    problem_size: Optional[int] = None
    expression: Optional[str] = None
    runs: int = Field(10, ge=1, le=100)


class BenchmarkResult(BaseModel):
    method: str
    mean_time_ms: float
    std_time_ms: float
    accuracy: Optional[float] = None
    iterations: Optional[int] = None
    convergence_rate: Optional[float] = None


class BenchmarkResponse(BaseModel):
    results: list[BenchmarkResult]
    winner: str
    best_accuracy: str
    fastest: str
    fewest_iterations: str
    summary: str
