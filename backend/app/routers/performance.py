from fastapi import APIRouter, HTTPException, Query
from app.models.performance_models import BenchmarkRequest, BenchmarkResponse, BenchmarkResult
from app.utils.function_parser import parse_function
from app.numerical.performance.benchmarks import benchmark
from app.numerical.root_finding.bisection import bisection
from app.numerical.root_finding.newton_raphson import newton_raphson
from app.numerical.root_finding.secant import secant
from app.utils.function_parser import symbolic_derivative

router = APIRouter()

# Default test functions per problem type
_DEFAULT_EXPRESSIONS = {
    "root_finding": "x**3 - x - 2",
    "integration":  "sin(x)",
    "ode":          "y",
}

_ROOT_FINDING_METHODS = {
    "Bisection": lambda f, expr: bisection(f, 1.0, 2.0, 1e-10, 200)[0],
    "Newton–Raphson": lambda f, expr: newton_raphson(f, symbolic_derivative(expr), 1.5, 1e-10, 100)[0],
    "Secant": lambda f, expr: secant(f, 1.0, 2.0, 1e-10, 100)[0],
}


@router.post("/benchmark", response_model=BenchmarkResponse)
def run_benchmark(req: BenchmarkRequest):
    expression = req.expression or _DEFAULT_EXPRESSIONS.get(req.problem_type, "x**2 - 2")

    try:
        f = parse_function(expression)
    except ValueError as e:
        raise HTTPException(422, str(e))

    results: list[BenchmarkResult] = []

    if req.problem_type == "root_finding":
        methods = req.methods or list(_ROOT_FINDING_METHODS.keys())
        for name in methods:
            fn = _ROOT_FINDING_METHODS.get(name)
            if fn is None:
                continue
            try:
                stats = benchmark(fn, f, expression, runs=req.runs)
                _, iters, _ = bisection(f, 1.0, 2.0, 1e-10, 200)
                results.append(BenchmarkResult(
                    method=name,
                    mean_time_ms=stats["mean_time_ms"],
                    std_time_ms=stats["std_time_ms"],
                    iterations=len(iters) if name == "Bisection" else None,
                ))
            except Exception:
                continue
    else:
        raise HTTPException(501, f"Benchmarking for '{req.problem_type}' not yet implemented.")

    if not results:
        raise HTTPException(400, "No benchmark results produced.")

    fastest = min(results, key=lambda r: r.mean_time_ms).method
    return BenchmarkResponse(
        results=results,
        winner=fastest,
        best_accuracy=results[0].method,
        fastest=fastest,
        fewest_iterations=results[0].method,
        summary=f"Benchmarked {len(results)} methods on '{expression}' with {req.runs} runs each.",
    )


@router.get("/complexity")
def complexity_data(problem_type: str = Query(...)):
    # TODO: run methods across increasing problem sizes
    raise HTTPException(501, "Complexity analysis not yet implemented.")
