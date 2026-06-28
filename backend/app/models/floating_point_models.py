from enum import Enum
from typing import Optional
from pydantic import BaseModel


class Precision(str, Enum):
    float32 = "float32"
    float64 = "float64"


class FloatingPointRequest(BaseModel):
    value: float
    precision: Precision = Precision.float64
    operation: Optional[str] = None
    operand: Optional[float] = None


class CancellationDemo(BaseModel):
    a: float
    b: float
    naive_result: float
    exact_result: float
    relative_error: float


class FloatingPointResult(BaseModel):
    binary_representation: str
    sign: int
    exponent: int
    mantissa: str
    machine_epsilon: float
    rounding_error: Optional[float] = None
    catastrophic_cancellation_demo: Optional[CancellationDemo] = None
