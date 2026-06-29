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
    # Comma-separated list of allowed CORS origins.
    # In production, include your Render frontend URL, e.g.:
    #   ALLOWED_ORIGINS=https://numericalab.onrender.com
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
