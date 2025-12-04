(**Deployment Guide: Vercel for `frontend` & `admin`, Render for `backend`) 

**Overview**
- **Goal:** Deploy the React `frontend` and `admin` apps to Vercel, and the Express `backend` to Render so the whole system (API, admin UI, front UI, image serving, and Stripe checkout) works in production.
- **Important constraints:** You asked NOT to modify main files in this repo. This guide therefore explains (A) the recommended minimal source changes you should make locally before deploy for robustness, and (B) build-time replacement alternatives you can use so you don't have to commit source edits. Pick ONE approach for each service.

**Quick summary of what I found in the codebase**
- **Backend:** `backend/server.js` binds to port `4000` (constant); `backend/config/db.js` uses a hard-coded MongoDB connection string; `backend/controllers/orderController.js` hardcodes `frontend_url = "http://localhost:5174"`; JWT and Stripe usage expect `process.env.JWT_SECRET` and `process.env.STRIPE_SECRET_KEY`; images are stored to `uploads/` via multer and served by `app.use('/images', express.static('uploads'))` (local disk storage).
- **Frontend:** `frontend/src/context/StoreContext.jsx` uses `const url = "http://localhost:4000"` as the API base URL.
- **Admin:** `admin/src/App.jsx` uses `const url = "http://localhost:4000"` and passes it to pages.

Notes & implications:
- Because both frontends include a hard-coded backend URL, you must replace these references with the production backend URL during build time (or change source to use environment variables).
- The backend currently uses local disk for uploads: this is ephemeral on most hosts (including Render) and is not safe for production; use Cloudinary / S3 or a persistent storage option.
- Server should listen on `process.env.PORT || 4000` to work reliably on Render.

---------------------------
**A. Recommended minimal code changes (safer, long-term)**
Make the following small edits in the `backend` and optionally the frontends. These are minimal, recommended, and make the apps production-ready. If you do these, follow the Render/Vercel steps below normally.

1) `backend/server.js` — use environment PORT:

Replace the line:
```
const port = 4000;
```
with:
```
const port = process.env.PORT || 4000;
```

2) `backend/config/db.js` — stop hardcoding credentials and use `MONGO_URI`:

Replace the hard-coded connect call with:
```
await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/foodie");
```

3) `backend/controllers/orderController.js` — use `FRONTEND_URL` env var:

Replace:
```
const frontend_url = "http://localhost:5174";
```
with:
```
const frontend_url = process.env.FRONTEND_URL || "http://localhost:5174";
```

4) Frontend & Admin (recommended): switch source to use env var instead of hard-coded `url`. Example (frontend):

In `frontend/src/context/StoreContext.jsx` change:
```
const url = "http://localhost:4000";
```
to:
```
const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
```
and set a Vite env var `VITE_API_URL` in Vercel to your backend URL (Vite requires env names starting with `VITE_`). Repeat similarly in `admin` (or use `process.env` equivalent for CRA/Vite used by admin).

Notes: these recommended edits require committing changed files. If you do not want to change repository files, follow the build-time replacement steps in Section B.

---------------------------
**B. No-source-change alternative (build-time replacements) — use if you cannot/shouldn't commit changes**
You can instruct Vercel and Render to replace hard-coded strings during build/start. This is done in the project's build/start commands (the change is performed on the build server only). Example replacement commands assume bash is available (Vercel build environment uses Linux bash). Replace `<RENDER_URL>` and `<FRONTEND_URL>` with your real deployed URLs.

- For `frontend` (Vercel project settings -> Root: `frontend`)
	- Root Directory: `frontend`
	- Build Command (set in Vercel):
		```bash
		bash -lc "sed -i 's|http://localhost:4000|https://<RENDER_BACKEND_URL>|g' src/context/StoreContext.jsx && npm install && npm run build"
		```
	- Output Directory: `dist`
	- Environment variables (if you prefer): you can set `VITE_API_URL` in Vercel's Environment Variables and instead replace `src/context/StoreContext.jsx` to read it (preferred as longer-term fix).

- For `admin` (Vercel project settings -> Root: `admin`)
	- Root Directory: `admin`
	- Build Command:
		```bash
		bash -lc "sed -i 's|http://localhost:4000|https://<RENDER_BACKEND_URL>|g' src/App.jsx && npm install && npm run build"
		```
	- Output Directory: `dist`

Notes about these `sed` commands:
- They modify the source on the CI container only (not your local repository) before running `npm run build` and then the built `dist` will contain the production backend URL.
- Use proper quoting for the URL if it contains slashes; the example above uses `|` as sed delimiter to avoid escaping `/`.

---------------------------
**C. Backend (Render) detailed steps**
Two approaches: (1) edit backend source per Section A (recommended), or (2) use start-time `sed` replacement (less ideal). I document both.

1) Create a new **Web Service** in Render (GitHub/GitLab linked to this repo).
	 - Connect the repo and choose the branch you want to deploy (e.g., `upgrade/tailwind-v4`).
	 - Set the **Root** / **Working Directory** to `backend`.

2) Build and Start commands
	 - Build Command: `npm install`
	 - Start Command: `node server.js`
		 - Alternatively, in Render's Start Command you can add a tiny replacement step before starting (if you cannot edit source):
			 ```bash
			 bash -lc "sed -i 's|const port = 4000;|const port = process.env.PORT || 4000;|g' server.js && sed -i 's|const frontend_url = \"http://localhost:5174\";|const frontend_url = process.env.FRONTEND_URL || \"http://localhost:5174\";|g' controllers/orderController.js && sed -i 's|mongoose.connect(\"mongodb+srv://.*\")|mongoose.connect(process.env.MONGO_URI || \"mongodb://localhost:27017/foodie\")|g' config/db.js && node server.js"
			 ```
			 - This runs `sed` to patch the files on the Render instance only, then starts the server. Again, this does not modify your git repository — it modifies files in the build container.

3) Environment variables to set in Render (go to Service -> Environment -> Add):
	 - `MONGO_URI` : Your MongoDB connection string (use Atlas). Example: `mongodb+srv://<user>:<pass>@cluster0.../foodie?retryWrites=true&w=majority`
	 - `JWT_SECRET` : strong random secret for signing JWTs
	 - `STRIPE_SECRET_KEY` : your Stripe secret key
	 - `FRONTEND_URL` : the public URL of your Vercel frontend (e.g., `https://your-frontend.vercel.app`)
	 - (Optional) `CLOUDINARY_URL` or S3 credentials if you migrate uploads to cloud storage

4) Ports / Networking
	 - The app should bind to `process.env.PORT` — see recommended change above. If you used the `sed` replacement start command, it will modify server.js to do that at runtime.

5) Static file uploads
	 - Current multer storage writes to `uploads/` and the server serves them at `https://<backend>/images/<file>`.
	 - On Render the disk is ephemeral. For production you must move to a persistent/public file store (Cloudinary or S3). Recommended: Cloudinary because it's easy to add and has free tier.
		 - Steps to use Cloudinary: create account, get `CLOUDINARY_URL` and update the `foodRoutes.js`/`foodController.js` to upload to Cloudinary instead of `multer.diskStorage` (I can provide code snippets on request).

6) Verify backend is up
	 - After Render deploys, visit `https://<your-backend>.onrender.com/` (or Render-assigned URL). It should return `API Working` from `server.js`.
	 - Test the list endpoint:`curl https://<your-backend>/api/food/list`

---------------------------
**D. Frontend & Admin (Vercel) detailed steps**
You will create two Vercel projects (one for `frontend` and one for `admin`) using the same Git repository but setting the correct root for each.

1) Create Vercel project for `frontend`
	 - In Vercel, choose Import Project -> select your repository -> set Root Directory to `frontend`.
	 - Framework Preset: `Vite` (auto-detected).
	 - Build Command: use the replacement command from Section B OR normal build if you changed source (Section A):
		 - No-source-change build example (replace backend URL):
			 ```bash
			 bash -lc "sed -i 's|http://localhost:4000|https://<RENDER_BACKEND_URL>|g' src/context/StoreContext.jsx && npm install && npm run build"
			 ```
		 - If you updated source to use `VITE_API_URL` then simply set `Build Command`: `npm run build` and set env var `VITE_API_URL=https://<RENDER_BACKEND_URL>` in Vercel Environment Variables.
	 - Output Directory: `dist`

2) Create Vercel project for `admin`
	 - Root Directory: `admin`
	 - Build Command:
		 ```bash
		 bash -lc "sed -i 's|http://localhost:4000|https://<RENDER_BACKEND_URL>|g' src/App.jsx && npm install && npm run build"
		 ```
	 - Output Directory: `dist`

3) Environment variables (Vercel)
	 - If using `sed` replacements you do not strictly need env vars for the API URL, but you should still set values for any sensitive keys the frontends need (if any). Typically frontends do not hold `JWT_SECRET` or `STRIPE_SECRET_KEY` — Stripe publishable keys (if used client-side) can be stored in Vercel: `VITE_STRIPE_PUBLISHABLE_KEY`.

4) After deployment check
	 - Visit the deployed frontend and admin URLs from Vercel.
	 - Perform these checks:
		 - The food list loads on the homepage (network request to `https://<backend>/api/food/list` returns 200 and data).
		 - Images load (requests to `https://<backend>/images/<file>` return 200). If using Cloudinary/S3 you'll need to update the image URLs accordingly.
		 - Login / token flows work: upon login the frontend sends token in headers; verify authenticated endpoints succeed.
		 - Place an order that triggers Stripe checkout; verify Stripe session is created (server returns `session_url`).

---------------------------
**E. Example end-to-end checklist (order of operations)**
1. Choose approach: (A) make recommended code changes and commit, OR (B) use build/start-time `sed` replacements.
2. Prepare backend: set `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `FRONTEND_URL` as Render environment variables.
3. Create and deploy Render Web Service with Root: `backend`, Build: `npm install`, Start: `node server.js` (or the `sed` start command shown above if not committing code changes).
4. Wait for Render to assign backend URL (copy it — you need it for Vercel replacement).
5. Set `FRONTEND_URL` env var on Render to the final Vercel frontend URL (you may update after Vercel deploys).
6. Create two Vercel projects: one with Root `frontend` and one with Root `admin`. For each, set the build command as explained above and set Output Directory `dist`.
7. For each Vercel project, set any needed env vars (if you changed source to use `VITE_API_URL`, set it here to the Render URL). Otherwise put the Render URL into the `sed` command in the build settings.
8. Deploy Vercel projects. Once both are deployed, update `FRONTEND_URL` on Render (used by Stripe success/cancel redirects) with the `frontend` Vercel URL.
9. Do the verification steps in Section D.4.

---------------------------
**F. Post-deploy recommendations & hardening**
- Move image uploads to a cloud store (Cloudinary or S3) and serve images from there (prevents lost uploads).
- Rotate secrets and never commit `MONGO_URI` credentials to source. Remove the hard-coded Atlas URI from `backend/config/db.js`.
- Add `start` script to `backend/package.json` (e.g., `"start":"node server.js"`) and expose a `Procfile`-style start command if your host needs it.
- Consider adding HTTPS-only enforcement and rate-limiting on the backend.

---------------------------
**G. Example validation commands**
- Check backend root (replace with your Render URL):
```
curl https://<your-backend>.onrender.com/
```
- Check food list:
```
curl https://<your-backend>.onrender.com/api/food/list
```
- From any deployed frontend: open DevTools -> Network and verify requests go to `https://<your-backend>` and return 200.

---------------------------
If you want, I can:
- Provide the exact minimal patch text you should apply to `backend/server.js` and `backend/config/db.js` (so you can commit those minimal changes).
- Provide a script and example `sed` commands tailored to your exact repo that you can paste into Vercel/Render build/start settings.
- Provide code examples to migrate image upload to Cloudinary.

-- End of deployment guide --

