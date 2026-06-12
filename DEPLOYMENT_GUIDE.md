# General Deployment Guide

This guide covers the necessary steps to deploy the TravelGo application to production. Since TravelGo relies on a Node.js backend and a React/Vite frontend, there are multiple strategies for deployment.

## Strategy A: Monorepo Deployment (Vercel)
**Recommended for scalability and zero-config CI/CD.**
Vercel handles both the static frontend (Vite) and converts your Node.js Express backend into highly scalable Serverless Functions automatically.
👉 See **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for detailed instructions.

## Strategy B: Dedicated Server Deployment (Render / Heroku / DigitalOcean)
If you prefer to host your backend on a persistent server rather than serverless functions.

### 1. Backend Setup
- Navigate to the `backend` directory.
- Ensure the start script in `backend/package.json` is set to `node Server.js`.
- Set Environment Variables on your hosting provider:
  - `MONGODB_URI`: Your MongoDB Atlas connection string.
  - `JWT_SECRET`: A secure, random string for tokens.
  - `NODE_ENV`: `production`

### 2. Frontend Setup
- Open `frontend/.env` (create if missing) and set:
  ```env
  VITE_API_URL=https://your-backend-url.onrender.com
  ```
- Run the build command:
  ```bash
  npm run build
  ```
- Deploy the resulting `frontend/dist` directory to a static host (Netlify, Vercel, or AWS S3).

## MongoDB Atlas Configuration
Regardless of where you deploy, your MongoDB cluster needs to accept connections from your production servers.
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Navigate to **Network Access** under Security.
3. Add a new IP Address: `0.0.0.0/0` (Allow access from anywhere). 
   *Note: In production, it's safer to whitelist specific IP addresses of your deployment servers if they provide static IPs.*

## Security Checklist
- [ ] Ensure `JWT_SECRET` is strong and securely injected via Environment Variables.
- [ ] Check that `MONGODB_URI` is never committed to GitHub.
- [ ] Ensure CORS is configured properly. In Serverless architectures (like Vercel), relative API paths handle CORS natively.
- [ ] Verify that rate limiting is implemented if expected traffic is high.
