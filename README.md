# 🚀 Career Command Center

An elite, full-stack career strategic coach dashboard. Automatically analyzes resume ATS mapping, detects skill/experience gaps, generates customized interview response scripts, objections prep sheets, and provides high-leverage compensation negotiation frameworks.

## Key Features

- **ATS Mapping & Score Analyzer**: Scans resumes against job descriptions to extract missing keyword badges and metrics.
- **Competency Diagnostic**: Generates tailored questions targeting discovered experience gaps.
- **Objection Response Strategies**: Prepares candidates for tough recruiter pushbacks.
- **Compensation Negotiator**: High-leverage scripts, typical HR interview queries, and redirect frameworks.
- **Supabase Cloud Sync**: Saves and loads previous preparation kits across logins.
- **Google Auth Integration**: Fast, secure access with session persistence.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide icons, Motion
- **Backend**: Express, Multer, Node.js, Google GenAI SDK (Gemini)
- **Database & Auth**: Supabase DB, Firebase Authentication

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation & Run

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Create a `.env` file in the root directory based on `.env.example`:
   ```env
   # API Keys
   GEMINI_API_KEY="your-gemini-api-key"
   
   # Firebase Auth
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"

   # Supabase DB
   VITE_SUPABASE_URL="your-supabase-url"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

3. Launch the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
