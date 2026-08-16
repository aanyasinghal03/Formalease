# FormalEase

"Understand your taxes. Discover your benefits. Grow with confidence."

A hackathon MVP frontend for **PS-12 — Informal Economy Tax-Simplicity Advisor**. Users describe
their business in plain language and get a friendly, jargon-free breakdown of registrations,
tax obligations, and government benefits that may apply.

## Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS
- Firebase Authentication (email/password)
- Framer Motion (animations)

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Firebase (Authentication)

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Once created, click the **Web** icon (`</>`) to register a new web app. Give it any nickname.
3. Firebase will show you a config object like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123",
   };
   ```
4. In the left sidebar, go to **Build → Authentication → Get started**.
5. Under the **Sign-in method** tab, enable **Email/Password**.
6. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
7. Paste the values from step 3 into `.env`:
   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

`.env` is already git-ignored — it will never be committed. The Firebase **web API key** is not a
secret in the traditional sense (it identifies your project, it doesn't authorize access on its
own), but keep the hygiene anyway: never commit real values, never share your `.env` file.

## 3. Run locally

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## 4. Build for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

## What's implemented

- **Landing page** — hero, trust section, "how it works," final CTA
- **Auth** — Firebase email/password signup, login, logout, persistent session, protected routes,
  friendly error messages for wrong password / existing email / etc.
- **Dashboard** — personalized greeting, empty state, entry point to analysis
- **Business input** — free-text description, example chips, optional expandable detail fields
- **Information completeness system** — 5-field detection (business type, category, location,
  revenue, employees), a reusable completeness ring, and a "before we calculate anything" check
  screen that never blocks the user
- **Missing-details flow** — asks only for what's missing, never re-asks for known fields
- **Animated loading sequence** — 5-step progress, no plain spinner
- **Results page** — business profile card, formalization path timeline, compliance cards, an
  illustrative tax estimate with count-up animation, a "what this means for you" section, benefit
  cards with a detail modal, and a 3-step action plan
- **Trust/legal UX** — a visible disclaimer on the landing page and results page, "check official
  eligibility" language on every benefit, "illustrative estimate" language on the tax summary

## What's mocked (by design, for the hackathon)

The `/api/analyze` backend doesn't exist yet. `src/services/analysisService.js` currently uses a
small keyword-matching heuristic (`src/data/mockAnalysis.js`) to "understand" the free-text
description and generate a full mock result — business category, compliance guidance, an
illustrative tax figure, benefit matches, and an action plan.

**To swap in a real backend later:**
1. `npm install axios`
2. In `src/services/analysisService.js`, uncomment the axios import and the `POST /api/analyze`
   branch, and set `USE_MOCK = false`.
3. No component needs to change — they all consume `analyzeBusiness()`'s return value, whatever
   its source.

## Project structure

```
src/
├── components/       Navbar, Disclaimer, Illustrations, CompletenessRing,
│                     BusinessInput, InformationCheck, MissingDetails, LoadingAnalysis,
│                     BusinessProfile, FormalizationPath, ComplianceCard, TaxSummary,
│                     BenefitCard, BenefitModal, ActionPlan
├── pages/            Home, Login, Signup, Dashboard, BusinessAnalysis, Results
├── auth/             AuthContext, ProtectedRoute, RedirectIfAuthed, authErrors
├── firebase/         config.js (reads Firebase config from env vars)
├── services/         analysisService.js (mock now, swappable for a real API)
└── data/             mockAnalysis.js (heuristic + mock result builder)
```

## Not built (explicitly out of scope per the hackathon brief)

Google/phone auth, roles/admin, payments, real government API integration, Aadhaar/PAN
verification, GST filing, loan applications.

## Known limitations

- The "business understanding" is a simple keyword heuristic, not real NLP — good enough to demo
  the UX flow, not a production classifier.
- Tax figures are illustrative placeholders (`revenue × 5%`), clearly labeled as such everywhere
  they appear.
- Results are stored in `sessionStorage` for the results page hand-off; there's no persistence of
  past analyses across sessions yet (Dashboard's "My Analysis" card is a placeholder for that).
