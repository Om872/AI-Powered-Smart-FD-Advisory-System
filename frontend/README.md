# Frontend — FD Intelligence AI Advisory Platform

React-based dashboard interface for the AI-Based FD Advisory System.

## Tech Stack

- **React 19** — UI library
- **Vite 8** — Build tool with HMR
- **Tailwind CSS 4** — Utility-first styling
- **Recharts** — Charts and data visualization
- **React Router v7** — Client-side routing

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Landing page with hero, FD plans, features, and live stats |
| `/customer-input` | `CustomerInputPage` | Customer data entry form with validation |
| `/analysis` | `AnalysisPage` | AI dashboard with prediction results, charts, and What-If simulator |
| `/customers` | `CustomersPage` | Paginated customer history table |
| `/admin` | `AdminPage` | Admin analytics with ML status, distributions, and auto-insights |

## Components

- **Navbar** — Responsive navigation with mobile hamburger menu and active route highlighting
- **Hero** — Animated stats with live data from backend API
- **CustomerForm** — Validated form with concurrent API calls (save + predict + recommend)
- **ChatbotWidget** — Floating AI chatbot with quick prompts and GPT integration
- **DashboardShell** — Layout wrapper with sidebar navigation for dashboard pages

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173` by default.

## Environment

Create `.env` for custom backend URL:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Build

```bash
npm run build
```

Output in `dist/` — deploy to any static host (Vercel, Netlify, etc.).
