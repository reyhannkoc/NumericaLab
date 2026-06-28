from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    max_iterations: int = 1000
    default_tolerance: float = 1e-8
    function_eval_timeout: int = 5
    allowed_functions: list[str] = [
        "sin", "cos", "tan", "asin", "acos", "atan",
        "sinh", "cosh", "tanh",
        "exp", "log", "log2", "log10",
        "sqrt", "cbrt", "abs",
        "pi", "e",
    ]


settings = Settings()
