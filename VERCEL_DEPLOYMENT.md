# Deploying TravelGo to Vercel

TravelGo has been configured as a Monorepo containing a Vite React Frontend and a Node.js Express Backend. 
With the provided `vercel.json` and refactored backend, Vercel will natively map the `/api/*` routes to serverless functions and serve the frontend statically.

## Step-by-Step Dashboard Instructions

### 1. Import Project
1. Push this entire repository to GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
3. Import the GitHub repository for TravelGo.

### 2. Configure Build Settings
During the import setup, configure the following settings:
- **Framework Preset**: `Vite` (Vercel should automatically detect this, but if not, leave as Other).
- **Root Directory**: `.` (Leave as the default repository root).
- **Build Command**: `npm run vercel-build` (This command is located in the root `package.json` and builds both frontend and backend deps).
- **Output Directory**: `.` or leave empty (Do **NOT** set this to `frontend/dist`, because `vercel.json` already handles the specific build outputs).

### 3. Configure Environment Variables
Expand the **Environment Variables** section and add the following:

| Name | Value | Note |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas Production Connection String |
| `JWT_SECRET` | `your-secure-random-string` | A highly secure, randomized string for hashing JWTs |

*(Note: You do **NOT** need to configure `VITE_API_URL`. Because Vercel deploys the API and Frontend on the exact same domain, the frontend's `api.js` is automatically configured to use relative routing (`/api`) in production, eliminating CORS entirely!)*

### 4. Deploy!
Click **Deploy**. 

Vercel will:
1. Run `npm run vercel-build`.
2. Map the Express backend code in `backend/Server.js` to Vercel Serverless Functions.
3. Host the compiled Vite React frontend on Vercel's Edge Network.
4. Provide you with a live domain (e.g., `travelgo.vercel.app`).

---

## Verifying Deployment
Once deployed, check the following to verify success:
- ✅ **Frontend Routing**: Navigate to `/packages`, refresh the page. React Router should handle the refresh flawlessly.
- ✅ **API Status**: Navigate to `/api/health`. You should see a JSON response with `"status": "OK"` and `"database": "Connected"`.
- ✅ **MongoDB**: Try logging in or creating a user to test DB writes and JWT Authentication.

## Troubleshooting

- **500 Internal Server Error on API requests**: Check your Vercel Function Logs. It is highly likely an issue with `MONGODB_URI` or MongoDB Network Access. Ensure `0.0.0.0/0` is allowed in MongoDB Atlas.
- **404 Not Found on API**: Ensure `vercel.json` is located in the exact root of your repository and formatted correctly.
