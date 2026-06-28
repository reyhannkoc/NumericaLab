from enum import Enum
from typing import Optional
from pydantic import BaseModel


class LUMethod(str, Enum):
    lu = "lu"
    cholesky = "cholesky"


class LURequest(BaseModel):
    matrix: list[list[float]]
    method: LUMethod = LUMethod.lu


class LUStep(BaseModel):
    step: int
    description: str
    L_state: list[list[float]]
    U_state: list[list[float]]


class LUResult(BaseModel):
    L: list[list[float]]
    U: list[list[float]]
    P: Optional[list[list[float]]] = None
    determinant: float
    steps: list[LUStep]
    method: LUMethod


class LUSolveRequest(LURequest):
    b: list[float]


class LUSolveResult(BaseModel):
    solution: list[float]
    steps: list[LUStep]
