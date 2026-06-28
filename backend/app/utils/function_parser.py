"""
Safe mathematical function parser.

Accepts Python-style math expressions (using NumPy/SymPy names)
and compiles them into callable functions.

Allowed names are restricted to a safe whitelist — no builtins,
no imports, no arbitrary code execution.
"""

import math
import numpy as np
import sympy as sp
from typing import Callable


# Safe namespace for eval
_SAFE_NAMESPACE = {
    "__builtins__": {},
    "sin":   np.sin,
    "cos":   np.cos,
    "tan":   np.tan,
    "asin":  np.arcsin,
    "acos":  np.arccos,
    "atan":  np.arctan,
    "atan2": np.arctan2,
    "sinh":  np.sinh,
    "cosh":  np.cosh,
    "tanh":  np.tanh,
    "exp":   np.exp,
    "log":   np.log,
    "log2":  np.log2,
    "log10": np.log10,
    "sqrt":  np.sqrt,
    "abs":   np.abs,
    "sign":  np.sign,
    "pi":    math.pi,
    "e":     math.e,
    "inf":   math.inf,
}


def parse_function(expression: str) -> Callable[[float], float]:
    """
    Parse a string expression of x into a Python callable.
    Raises ValueError on invalid or unsafe expressions.
    """
    # Basic safety checks
    forbidden = ["import", "exec", "eval", "open", "os", "__", "subprocess"]
    expr_lower = expression.lower()
    for token in forbidden:
        if token in expr_lower:
            raise ValueError(f"Expression contains forbidden token: '{token}'")

    try:
        code = compile(expression, "<expression>", "eval")
    except SyntaxError as exc:
        raise ValueError(f"Syntax error in expression: {exc}") from exc

    def f(x: float) -> float:
        ns = {**_SAFE_NAMESPACE, "x": x}
        return float(eval(code, ns))  # noqa: S307

    # Quick validation
    try:
        f(1.0)
    except Exception as exc:
        raise ValueError(f"Expression evaluation failed: {exc}") from exc

    return f


def parse_function_xy(expression: str) -> Callable[[float, float], float]:
    """Parse a two-variable expression f(x, y) for ODE right-hand sides."""
    forbidden = ["import", "exec", "eval", "open", "os", "__", "subprocess"]
    expr_lower = expression.lower()
    for token in forbidden:
        if token in expr_lower:
            raise ValueError(f"Expression contains forbidden token: '{token}'")

    try:
        code = compile(expression, "<expression>", "eval")
    except SyntaxError as exc:
        raise ValueError(f"Syntax error in expression: {exc}") from exc

    def f(x: float, y: float) -> float:
        ns = {**_SAFE_NAMESPACE, "x": x, "y": y}
        return float(eval(code, ns))  # noqa: S307

    try:
        f(0.0, 0.0)
    except Exception as exc:
        raise ValueError(f"Expression evaluation failed: {exc}") from exc

    return f


def symbolic_derivative(expression: str, order: int = 1) -> Callable[[float], float]:
    """
    Compute the nth symbolic derivative of the expression using SymPy,
    then return it as a numeric callable.
    """
    x = sp.Symbol("x")
    try:
        expr = sp.sympify(expression)
        deriv = sp.diff(expr, x, order)
        f_num = sp.lambdify(x, deriv, modules=["numpy"])
    except Exception as exc:
        raise ValueError(f"Failed to compute symbolic derivative: {exc}") from exc

    def fd(xv: float) -> float:
        return float(f_num(xv))

    return fd
