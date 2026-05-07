# Nura Bahar — Frontend (Render)

React + Vite + TailwindCSS. Deployed as a Static Site on Render.

---

## Deploy to Render

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial frontend setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nurabahar-frontend.git
git push -u origin main
```

### Step 2 — Create Render Static Site
1. Go to https://render.com
2. Click **New → Static Site**
3. Connect your GitHub repo → select `nurabahar-frontend`
4. Render auto-detects `render.yaml`

### Step 3 — Set environment variables (CRITICAL)
In Render dashboard → your service → **Environment** → add:

| Key | Value |
|-----|-------|
| `VITE_PB_URL` | `https://nurabahar-backend.onrender.com` |
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_live_xxxxxxxxxxxxxxxxxxxx` |

### Step 4 — Deploy
Click **Deploy** — Render runs `npm install && npm run build` and serves `dist/`

Your store will be live at:
```
https://nurabahar-frontend.onrender.com
```

---

## Local Development

```bash
npm install
npm run dev   # → http://localhost:5173
```

Make sure PocketBase is running locally first:
```bash
./pocketbase serve   # → http://127.0.0.1:8090
```

Create `frontend/.env.local`:
```
VITE_PB_URL=http://127.0.0.1:8090
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
```

---

## Admin Dashboard
- URL: https://nurabahar-frontend.onrender.com/admin
- Email: admin@nurabahar.ng
- Password: NuraBahar2025!