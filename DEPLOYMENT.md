# Career Command Center — Deployment Guide

This guide outlines how to deploy the **Career Command Center** web application to production. Since the application is structured with a high-fidelity React frontend coupled with a secure Express backend (supporting server-side Gemini AI generation), it is best deployed as a full-stack container on **Google Cloud Run** or separated into a static site (frontend) and serverless functions (backend).

---

## Option 1: Full-Stack Cloud Run (Recommended & Native)

Because the development environment is already optimized for a unified Docker container, deploying to Cloud Run keeps the entire application together.

### Prerequisites:
- A Google Cloud Platform (GCP) account.
- Google Cloud CLI installed locally.

### Steps:

1. **Build the container using Google Cloud Build**:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/career-command-center
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy career-command-center \
     --image gcr.io/[PROJECT_ID]/career-command-center \
     --platform managed \
     --port 3000 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY="your-gemini-api-key"
   ```

*Note: Replace `[PROJECT_ID]` with your real Google Cloud Project ID.*

---

## Option 2: Frontend on Firebase Hosting & Backend on Cloud Run / Functions

If you prefer to serve the static assets from Firebase's global CDN:

### A. Deploy Frontend to Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Log in and initialize**:
   ```bash
   firebase login
   firebase init hosting
   ```
   *Choose your target project and select `dist` as your public directory (as configured by Vite in our build stage).*

3. **Configure Environment Variables**:
   Create a `.env.production` file for client-side Firebase configurations:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_API_URL="https://your-cloud-run-backend-url.run.app"
   ```

4. **Build the SPA Assets**:
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**:
   ```bash
   firebase deploy --only hosting
   ```

### B. Deploy Backend to Cloud Run or Cloud Functions
Deploy the server portion of `/server.ts` to Cloud Run (or Google Cloud Functions mapping `/api/*` paths) with the `GEMINI_API_KEY` defined securely in GCP Secret Manager.

---

## Option 3: Unified Deployment on Vercel

Vercel natively supports Next.js and standard Vite configurations with serverless function routing.

1. **Configure Vercel Routes**:
   Add a `vercel.json` in the root folder to route api calls to the serverless function:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api/generate-prep-kit" }
     ]
   }
   ```

2. **Deploy via CLI**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Configure Environment Variables in Vercel Dashboard**:
   - `GEMINI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
