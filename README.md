# Nevia Claims

For my own personal use, i made this web app for viewing hunting spawn reservations on the Nevia server (Tibia).

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Architecture

**Stack**: React Router 7 (SSR) + TanStack Query + Zustand + TailwindCSS/DaisyUI

I opted for a framework because I needed to call the api on the server side, since I do not control the api and was therefore blocked by CORS on a frontend-only application.

**Data Flow**:

1. Server-side loader fetches initial data (areas & reservations) from the Nevia bot API
2. Data is hydrated into TanStack Query cache on the client
3. Client state (selected areas, favorites, filters) managed with Zustand and persisted to localStorage
4. Real-time updates via client-side query refetching every 5s

**Key Components**:

- `/app/routes/home.tsx` - Main page with SSR data loading
- `/app/lib/api/` - API client and type definitions
- `/app/lib/state/` - Zustand store with localStorage persistence
- `/app/components/` - UI components for spawn lists, filters, and reservation management
