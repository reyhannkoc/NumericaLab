"""
Performance benchmarking utilities.
Runs numerical methods multiple times and computes timing statistics.
"""

import time
import statistics
from typing import Callable


def benchmark(
    fn: Callable,
    *args,
    runs: int = 10,
    **kwargs,
) -> dict:
    """
    Time fn(*args, **kwargs) over `runs` repetitions.
    Returns mean_time_ms and std_time_ms.
    """
    times = []
    result = None
    for _ in range(runs):
        t0 = time.perf_counter()
        result = fn(*args, **kwargs)
        times.append((time.perf_counter() - t0) * 1000)

    return {
        "mean_time_ms": statistics.mean(times),
        "std_time_ms":  statistics.stdev(times) if len(times) > 1 else 0.0,
        "result": result,
    }
