from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    floating_point,
    root_finding,
    interpolation,
    differentiation,
    integration,
    linear_systems,
    lu,
    optimization,
    ode,
    performance,
)

app = FastAPI(
    title="NumericaLab API",
    description="Backend for the NumericaLab interactive numerical methods platform.",
    version="0.1.0",
)

# ── CORS ────────────────────────────────────────────────────────────────────
# Public read-only computation API — allow all origins so the frontend works
# regardless of which Render subdomain is assigned or any future domain changes.
# allow_credentials must be False when allow_origins=["*"] (Starlette requirement).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ─────────────────────────────────────────────────────────────────
app.include_router(floating_point.router,  prefix="/api/floating-point",  tags=["Floating Point"])
app.include_router(root_finding.router,    prefix="/api/root-finding",    tags=["Root Finding"])
app.include_router(interpolation.router,   prefix="/api/interpolation",   tags=["Interpolation"])
app.include_router(differentiation.router, prefix="/api/differentiation", tags=["Differentiation"])
app.include_router(integration.router,     prefix="/api/integration",     tags=["Integration"])
app.include_router(linear_systems.router,  prefix="/api/linear-systems",  tags=["Linear Systems"])
app.include_router(lu.router,              prefix="/api/lu",              tags=["LU Decomposition"])
app.include_router(optimization.router,    prefix="/api/optimization",    tags=["Optimization"])
app.include_router(ode.router,             prefix="/api/ode",             tags=["ODE"])
app.include_router(performance.router,     prefix="/api/performance",     tags=["Performance"])


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "NumericaLab API"}
