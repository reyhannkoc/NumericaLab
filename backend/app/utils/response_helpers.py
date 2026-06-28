"""
Helpers for formatting API responses consistently.
"""
import time
from contextlib import contextmanager


@contextmanager
def timer_ms():
    """Context manager that yields a dict with execution_time_ms after exit."""
    result = {}
    t0 = time.perf_counter()
    try:
        yield result
    finally:
        result["execution_time_ms"] = (time.perf_counter() - t0) * 1000


def sanitize_float(value: float) -> float:
    """Replace NaN/Inf with 0.0 to ensure JSON-serializable output."""
    import math
    if math.isnan(value) or math.isinf(value):
        return 0.0
    return value
