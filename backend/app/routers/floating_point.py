from fastapi import APIRouter, HTTPException
from app.models.floating_point_models import FloatingPointRequest, FloatingPointResult, CancellationDemo
from app.numerical.error_analysis.floating_point import (
    float64_to_binary, machine_epsilon, catastrophic_cancellation,
)

router = APIRouter()


@router.post("/analyze", response_model=FloatingPointResult)
def analyze(req: FloatingPointRequest):
    try:
        bits = float64_to_binary(req.value)
        eps = machine_epsilon(req.precision.value)
        return FloatingPointResult(
            binary_representation=bits["binary_representation"],
            sign=bits["sign"],
            exponent=bits["exponent"],
            mantissa=bits["mantissa"],
            machine_epsilon=eps,
        )
    except Exception as e:
        raise HTTPException(400, str(e))


@router.get("/machine-epsilon")
def get_machine_epsilon():
    return {
        "float32": machine_epsilon("float32"),
        "float64": machine_epsilon("float64"),
    }


@router.post("/cancellation")
def demo_cancellation(body: dict):
    a = body.get("a")
    b = body.get("b")
    if a is None or b is None:
        raise HTTPException(422, "Provide 'a' and 'b'.")
    result = catastrophic_cancellation(float(a), float(b))
    return CancellationDemo(**result)
