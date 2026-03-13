# Navvy

AI-powered personal concierge for travel and itinerary planning. Describe what you want to do in natural language and get a complete itinerary in seconds.

## Lo-Fi Prototype

This is the Lo-Fi Prototype (LFP) for EECS 497. It demonstrates:

- **Login / sign up flow** — cookie-based session (no external auth service needed)
- **AI itinerary generation** — type a prompt, get a structured plan from an LLM, displayed on a Google Map with numbered pins
- **3-tab structure** — Plan, Feed, Community (Feed and Community are placeholder UI for now)
- **Profile page** — shows logged-in user info and where preferences will live

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd Navvy
npm install
```

### 2. Get API keys

- **Gemini** (free): Go to [aistudio.google.com](https://aistudio.google.com), sign in, and create an API key — no credit card required
- **Google Maps** (optional): Enable the Maps JavaScript API at [console.cloud.google.com](https://console.cloud.google.com) and create a key

### 3. Configure environment variables

Fill in your keys in `.env.local`:

```
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Google Maps** (`@vis.gl/react-google-maps`)
- **Google Gemini** (gemini-2.0-flash, free tier)

## Team

Aryaman Goenka, Krish Kapoor, Aaron Li — EECS 497, Winter 2026
