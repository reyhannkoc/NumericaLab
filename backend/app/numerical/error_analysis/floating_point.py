"""
Floating-point error analysis utilities.
Demonstrates IEEE 754 representation, machine epsilon, and
catastrophic cancellation.
"""

import struct
import numpy as np


def float64_to_binary(value: float) -> dict:
    """
    Decompose a 64-bit float into sign, biased exponent, and mantissa bits.
    """
    raw = struct.pack(">d", value)
    bits = int.from_bytes(raw, "big")
    sign = (bits >> 63) & 1
    exponent = (bits >> 52) & 0x7FF
    mantissa_bits = bits & ((1 << 52) - 1)
    binary_repr = f"{bits:064b}"
    mantissa_str = f"{mantissa_bits:052b}"
    return {
        "binary_representation": binary_repr,
        "sign": sign,
        "exponent": exponent - 1023,  # unbiased
        "mantissa": mantissa_str,
    }


def machine_epsilon(precision: str = "float64") -> float:
    """Return machine epsilon for the given floating-point precision."""
    if precision == "float32":
        return float(np.finfo(np.float32).eps)
    return float(np.finfo(np.float64).eps)


def catastrophic_cancellation(a: float, b: float) -> dict:
    """
    Demonstrate catastrophic cancellation: compute a - b naively
    vs. the algebraically-exact result using higher precision.
    """
    naive = a - b
    # "Exact" via Python's arbitrary-precision decimal
    from decimal import Decimal, getcontext
    getcontext().prec = 50
    exact = float(Decimal(str(a)) - Decimal(str(b)))
    rel_err = abs(naive - exact) / (abs(exact) + 1e-300)
    return {
        "a": a,
        "b": b,
        "naive_result": naive,
        "exact_result": exact,
        "relative_error": rel_err,
    }
