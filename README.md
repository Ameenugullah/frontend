# Nura Bahar — Frontend (Railway)

React + Vite + TailwindCSS. Served via nginx on Railway.

---

## Deploy to Railway

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial frontend setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nurabahar-frontend.git
git push -u origin main
```

### Step 2 — Create Railway project
1. Go to https://railway.app
2. Click **New Project → Deploy from GitHub repo**
3. Select `nurabahar-frontend`
4. Railway detects the Dockerfile automatically

### Step 3 — Set environment variable (CRITICAL)
Before deploying, you MUST set your backend URL:

1. In Railway, click your frontend service
2. Go to **Variables** tab
3. Add:
   - Key:   `VITE_PB_URL`
   - Value: `https://your-backend-railway-url.up.railway.app`

Or update `railway.toml` directly:
```toml
[build.args]
VITE_PB_URL = "https://your-actual-backend-url.up.railway.app"
```

### Step 4 — Generate a domain
1. Go to **Settings → Networking → Generate Domain**
2. Your store is live at:
   ```
   https://nurabahar-frontend-production.up.railway.app
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

---

## Admin Dashboard
- URL: https://your-frontend-url.up.railway.app/admin
- Email: admin@nurabahar.ng
- Password: NuraBahar2025!

---

## Add Product Images
Place images in `public/images/` before building.
Filenames must match what's referenced in `src/data/products.js`.
