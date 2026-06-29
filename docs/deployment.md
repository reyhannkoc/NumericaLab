# Deployment Guide — Render

NumericaLab is deployed as two separate Render services:

| Service | Type | Directory |
|---|---|---|
| `numericalab-api` | Web Service (Python) | `backend/` |
| `numericalab` | Static Site | `frontend/` |

The backend must be deployed **first** so you have a URL to give the frontend.

---

## Prerequisites

1. A [Render](https://render.com) account (free tier works for both services)
2. The repository pushed to GitHub or GitLab
3. Render connected to your Git provider (Settings → Connected Accounts)

---

## Step 1 — Deploy the Backend (Web Service)

1. In the Render dashboard click **New → Web Service**
2. Connect your repository and select it
3. Configure:

   | Field | Value |
   |---|---|
   | **Name** | `numericalab-api` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | **Plan** | Free |

4. Under **Environment → Environment Variables** add:

   | Key | Value |
   |---|---|
   | `ALLOWED_ORIGINS` | *(leave blank for now — update after frontend deploy)* |
   | `MAX_ITERATIONS` | `1000` |
   | `DEFAULT_TOLERANCE` | `1e-8` |
   | `FUNCTION_EVAL_TIMEOUT` | `5` |

5. Click **Create Web Service** and wait for the build to finish
6. Note the URL Render assigns, e.g. `https://numericalab-api.onrender.com`

### Verify backend is live

```
https://numericalab-api.onrender.com/
# → {"status": "ok", "service": "NumericaLab API"}

https://numericalab-api.onrender.com/docs
# → Swagger UI with all 10 API routers
```

---

## Step 2 — Deploy the Frontend (Static Site)

1. In the Render dashboard click **New → Static Site**
2. Connect the same repository
3. Configure:

   | Field | Value |
   |---|---|
   | **Name** | `numericalab` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

4. Under **Environment → Environment Variables** add:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://numericalab-api.onrender.com` *(from Step 1)* |

   > `VITE_` prefix is required — Vite only exposes variables with this prefix to the browser bundle.
   > Do **not** include `/api` at the end — the suffix is added automatically in `src/services/api.ts`.

5. Under **Redirects/Rewrites** add:

   | Source | Destination | Action |
   |---|---|---|
   | `/*` | `/index.html` | Rewrite |

   This is required for React Router (client-side routing). Alternatively, the `frontend/public/_redirects` file handles this automatically.

6. Click **Create Static Site** and wait for the build
7. Note the URL, e.g. `https://numericalab.onrender.com`

---

## Step 3 — Update Backend CORS

Now that you have the frontend URL, go back to the backend service:

1. Render dashboard → `numericalab-api` → **Environment**
2. Set `ALLOWED_ORIGINS` = `https://numericalab.onrender.com`
3. Click **Save Changes** — Render redeploys automatically

### Verify CORS is correct

Open your browser DevTools → Network. After clicking **Run** on any lesson playground, the API request to `https://numericalab-api.onrender.com/api/root-finding/solve` should return 200 with no CORS errors.

---

## Using render.yaml (optional — Blueprint deploy)

The `render.yaml` at the project root defines both services as a Render Blueprint. This lets you deploy everything in one click:

1. Render dashboard → **New → Blueprint**
2. Connect the repository — Render reads `render.yaml` automatically
3. Review the services, update the placeholder URLs, and click **Apply**

> **Important:** The `render.yaml` contains placeholder values for `VITE_API_BASE_URL` and `ALLOWED_ORIGINS`. After the first deploy, update them with the real Render URLs and redeploy.

---

## Environment Variable Reference

### Backend (`backend/.env.example`)

| Variable | Default | Description |
|---|---|---|
| `ALLOWED_ORIGINS` | `http://localhost:5173,...` | Comma-separated CORS origins. In production: your Render frontend URL. |
| `MAX_ITERATIONS` | `1000` | Hard cap on iterations for any algorithm |
| `DEFAULT_TOLERANCE` | `1e-8` | Fallback tolerance when none is provided |
| `FUNCTION_EVAL_TIMEOUT` | `5` | Seconds before a function evaluation is aborted |

### Frontend (`frontend/.env.example`)

| Variable | Default (dev) | Description |
|---|---|---|
| `VITE_API_BASE_URL` | *(empty)* | Backend origin. Empty = Vite proxy at `/api` (dev only). In production: `https://numericalab-api.onrender.com` |

---

## Free Tier Considerations

Render's free Web Services **spin down after 15 minutes of inactivity**. The first request after a cold start can take 30–60 seconds while the Python process restarts.

To avoid this:
- Upgrade to a paid Render plan ($7/month for the API service), or
- Set up an external uptime monitor (e.g., UptimeRobot, BetterStack) to ping `https://numericalab-api.onrender.com/` every 10 minutes

The frontend Static Site is always-on and is not affected by spin-down.

---

## Continuous Deployment

Once connected, Render automatically redeploys both services on every push to your default branch (`main` or `master`). No additional CI/CD setup is required.

To deploy only the backend or only the frontend after a change, use **Manual Deploy** in the Render dashboard for the specific service.

---

## Local Development (unchanged)

```bash
# Terminal 1 — Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The Vite dev server proxy (`/api` → `http://localhost:8000`) handles API routing locally. No `VITE_API_BASE_URL` is needed during development.
