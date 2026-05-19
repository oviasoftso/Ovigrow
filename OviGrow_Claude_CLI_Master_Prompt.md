# ═══════════════════════════════════════════════════════════════
# OviGrow — CLAUDE CODE CLI MASTER BUILD PROMPT
# AI Agricultural Intelligence Platform for Zimbabwe
# Part of the Ovi/Ovia Family
# ═══════════════════════════════════════════════════════════════
#
# HOW TO USE THIS PROMPT:
# 1. Open your terminal
# 2. Run: claude
# 3. Paste this ENTIRE file as your first message
# 4. Claude will ask for your GitHub details, then build everything
#
# ═══════════════════════════════════════════════════════════════

You are Claude, operating in Claude Code CLI (agentic mode). You have full access to bash, file creation, git, and the terminal. You will build OviGrow — a complete, production-ready AI agricultural intelligence platform for Zimbabwe — from scratch, push it to GitHub, and prepare it for one-click Vercel deployment.

Before writing a single line of code, ask me the following questions ONE BY ONE and wait for each answer:

---

**STEP 0 — SETUP INTERVIEW (ask these before doing anything else)**

Ask me:

1. "What is your GitHub username?" (e.g. johndoe)
2. "What would you like the GitHub repository name to be?" (suggest: `ovigrow`)
3. "Do you have a GitHub Personal Access Token with repo permissions? If yes, paste it now. If no, I'll guide you to create one." 
4. "What is your Anthropic API key? (starts with sk-ant-)" — tell me you'll add it to .env.local and never commit it
5. "Do you have a Supabase project ready? If yes, paste your Supabase URL and anon key. If no, I'll set up the schema so you can paste them later."
6. "What is your preferred app domain/name? (e.g. ovigrow.app or ovigrow.co.zw)" — used for SEO meta tags

Once I answer all 6 questions, confirm the plan back to me like this:
"✓ Got it. Here's what I'm about to build:
- Repo: github.com/[USERNAME]/[REPO]
- Stack: React + TypeScript + Vite + Tailwind + Supabase + Anthropic
- I'll create all files, init git, and push to your GitHub automatically.
Ready? Reply 'build' to start."

When I say 'build', execute every step below in order without stopping to ask further questions unless you hit a blocker.

---

## ═══════════════════════════════════════════════════════════════
## WHAT YOU ARE BUILDING
## ═══════════════════════════════════════════════════════════════

**OviGrow** is Zimbabwe's first comprehensive AI agricultural intelligence platform. It serves:
- **Smallholder farmers** (communal, A1, A2 resettlement)
- **Commercial farmers** (large-scale, tobacco, horticulture)
- **AGRITEX extension officers** (the government field agents)
- **MLAFWRD government officials** (Ministry of Lands, Agriculture, Fisheries, Water and Rural Development)
- **Agribusinesses** (input suppliers, buyers, processors, export)

It aligns with Zimbabwe's AgriTech Strategy 2021–2025, the FAO Digital Villages Initiative (FDiVi), and the MLAFWRD IDEA (Integrated Digital Extension and Advisory) farmer registry program.

**Brand:** Part of the Ovi/Ovia family. Name: **OviGrow**. Tagline: *"Growing Zimbabwe, one data point at a time."*

---

## ═══════════════════════════════════════════════════════════════
## STEP 1 — PROJECT SCAFFOLD
## ═══════════════════════════════════════════════════════════════

Run these commands in order:

```bash
# Create project
npm create vite@latest ovigrow -- --template react-ts
cd ovigrow

# Install all dependencies
npm install \
  react-router-dom \
  @supabase/supabase-js \
  zustand \
  @tanstack/react-query \
  react-markdown \
  remark-gfm \
  lucide-react \
  recharts \
  react-leaflet \
  leaflet \
  @types/leaflet \
  papaparse \
  @types/papaparse \
  react-hot-toast \
  date-fns \
  clsx \
  tailwind-merge \
  class-variance-authority \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-select \
  @radix-ui/react-tabs \
  @radix-ui/react-progress \
  @radix-ui/react-avatar \
  @radix-ui/react-badge \
  @radix-ui/react-tooltip \
  @radix-ui/react-accordion \
  framer-motion \
  react-intersection-observer

npm install -D \
  tailwindcss \
  postcss \
  autoprefixer \
  @types/node \
  tailwindcss-animate

# Init Tailwind
npx tailwindcss init -p
```

---

## ═══════════════════════════════════════════════════════════════
## STEP 2 — CREATE ALL FILES
## ═══════════════════════════════════════════════════════════════

Create every file below. Write the complete content for each. Do not use placeholder comments like "// add logic here" — write the actual working code.

---

### FILE: `vercel.json` (ROOT — CRITICAL, prevents 404 on refresh)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

---

### FILE: `.env.example`

```env
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_URL=https://ovigrow.app
VITE_OPEN_WEATHER_KEY=optional-for-weather-widget
```

---

### FILE: `.env.local` (populate with user's actual keys from the interview)

```env
VITE_ANTHROPIC_API_KEY=[USER_ANTHROPIC_KEY]
VITE_SUPABASE_URL=[USER_SUPABASE_URL]
VITE_SUPABASE_ANON_KEY=[USER_SUPABASE_ANON_KEY]
VITE_APP_URL=https://ovigrow.app
```

---

### FILE: `.gitignore`

```
node_modules
dist
.env.local
.env
*.local
.DS_Store
*.log
```

---

### FILE: `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          map: ['react-leaflet', 'leaflet'],
          supabase: ['@supabase/supabase-js'],
        }
      }
    }
  }
})
```

---

### FILE: `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        surface:     'hsl(var(--surface))',
        'surface-raised': 'hsl(var(--surface-raised))',
        border:      'hsl(var(--border))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          dark:       'hsl(var(--primary-dark))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          earth:      'hsl(var(--accent-earth))',
          sky:        'hsl(var(--accent-sky))',
          harvest:    'hsl(var(--accent-harvest))',
          danger:     'hsl(var(--accent-danger))',
          water:      'hsl(var(--accent-water))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card:     'var(--shadow-card)',
        glow:     'var(--shadow-glow)',
        elevated: 'var(--shadow-elevated)',
        'glow-green': '0 0 24px hsl(var(--primary) / 0.25)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        fadeIn:    { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulse:     { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
        grow:      { '0%': { transform: 'scaleY(0)' }, '100%': { transform: 'scaleY(1)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fadeIn 0.35s ease',
        shimmer:          'shimmer 1.8s infinite',
        'pulse-slow':     'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        grow:             'grow 0.5s ease',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
```

---

### FILE: `src/index.css`

```css
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=dm-sans@400,500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
@import 'leaflet/dist/leaflet.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ── OviGrow Color System ── */
    /* Deep forest green base — earth, growth, life */
    --background:        145 20% 6%;     /* #0a0f09 */
    --surface:           145 18% 10%;    /* #111a10 */
    --surface-raised:    145 16% 14%;    /* #182016 */
    --border:            145 14% 20%;    /* #222e1f */

    --foreground:        120 15% 94%;    /* #eff5ed */
    --muted-foreground:  130 10% 58%;    /* #87978a */
    --placeholder:       130 8%  38%;    /* #555e54 */

    /* Primary: vibrant agri-green */
    --primary:           142 71% 45%;    /* #22c55e */
    --primary-foreground: 145 20% 6%;
    --primary-dark:      142 71% 35%;

    /* Accent palette: Zimbabwe land & sky */
    --accent:            142 71% 45%;    /* same as primary */
    --accent-earth:       28 60% 45%;    /* warm ochre soil */
    --accent-sky:        204 80% 52%;    /* clear sky blue */
    --accent-harvest:     45 95% 55%;    /* maize gold */
    --accent-danger:       0 72% 55%;    /* drought/pest red */
    --accent-water:      200 75% 48%;    /* irrigation blue */

    --secondary:         145 16% 14%;
    --secondary-foreground: 130 10% 58%;
    --muted:             145 16% 14%;
    --card:              145 18% 10%;
    --card-foreground:   120 15% 94%;
    --popover:           145 18% 10%;
    --popover-foreground: 120 15% 94%;
    --destructive:         0 72% 55%;
    --destructive-foreground: 120 15% 94%;
    --input:             145 16% 14%;
    --ring:              142 71% 45%;
    --radius:            0.75rem;

    /* Gradients */
    --gradient-hero: linear-gradient(135deg, hsl(145 20% 6%) 0%, hsl(145 18% 12%) 100%);
    --gradient-brand: linear-gradient(135deg, hsl(142 71% 45%), hsl(45 95% 55%));
    --gradient-earth: linear-gradient(135deg, hsl(28 60% 45%), hsl(142 71% 35%));
    --gradient-glow: radial-gradient(ellipse at 60% 0%, hsl(142 71% 45% / 0.08) 0%, transparent 65%);

    /* Shadows */
    --shadow-card:     0 0 0 1px hsl(var(--border)), 0 4px 24px hsl(145 20% 3% / 0.7);
    --shadow-glow:     0 0 0 3px hsl(142 71% 45% / 0.18);
    --shadow-elevated: 0 8px 40px hsl(145 20% 3% / 0.85);
  }
}

@layer base {
  * { @apply border-border box-border; }
  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'DM Sans', sans-serif;
    background-image: var(--gradient-glow);
    background-attachment: fixed;
    min-height: 100vh;
  }
  h1, h2, h3, h4, h5 {
    font-family: 'Clash Display', sans-serif;
    letter-spacing: -0.025em;
  }
  code, pre, .mono { font-family: 'JetBrains Mono', monospace; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: hsl(var(--surface)); }
  ::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: hsl(var(--muted-foreground)); }
}

/* ── Shared OviGrow Component Classes ── */
@layer components {

  /* AI output block — used across all tools */
  .ovi-ai-block {
    @apply rounded-lg p-5 animate-fade-in;
    border-left: 3px solid hsl(var(--primary));
    background: hsl(var(--surface));
    box-shadow: var(--shadow-card);
  }

  /* Streaming cursor */
  .ovi-cursor::after {
    content: '▋';
    color: hsl(var(--primary));
    animation: pulse 1s infinite;
    display: inline-block;
    margin-left: 2px;
  }

  /* Skeleton shimmer loader */
  .ovi-skeleton {
    background: linear-gradient(90deg,
      hsl(var(--surface)) 25%,
      hsl(var(--surface-raised)) 50%,
      hsl(var(--surface)) 75%
    );
    background-size: 200% 100%;
    @apply animate-shimmer rounded;
  }

  /* Sidebar nav item */
  .nav-item {
    @apply flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground
           hover:bg-surface-raised hover:text-foreground transition-all duration-150 cursor-pointer;
  }
  .nav-item.active {
    border-left: 2px solid hsl(var(--primary));
    background: hsl(var(--primary) / 0.08);
    @apply text-primary font-medium;
  }

  /* Module badge */
  .ovi-badge {
    @apply text-[10px] font-mono px-1.5 py-0.5 rounded;
    background: hsl(var(--primary) / 0.12);
    color: hsl(var(--primary));
    border: 1px solid hsl(var(--primary) / 0.25);
  }

  /* Status indicator dot */
  .status-dot {
    @apply w-2 h-2 rounded-full;
  }
  .status-dot.good    { background: hsl(var(--primary)); }
  .status-dot.warn    { background: hsl(var(--accent-harvest)); }
  .status-dot.danger  { background: hsl(var(--accent-danger)); }
  .status-dot.info    { background: hsl(var(--accent-sky)); }

  /* Card styles */
  .ovi-card {
    @apply rounded-lg p-5 transition-all duration-200;
    background: hsl(var(--surface));
    box-shadow: var(--shadow-card);
    border: 1px solid hsl(var(--border));
  }
  .ovi-card:hover {
    border-color: hsl(var(--primary) / 0.35);
  }

  /* Risk level rows */
  .risk-low    { @apply text-sm; color: hsl(var(--primary)); }
  .risk-medium { @apply text-sm; color: hsl(var(--accent-harvest)); }
  .risk-high   { @apply text-sm; color: hsl(var(--accent-danger)); }

  /* Map container */
  .ovi-map { @apply rounded-lg overflow-hidden; height: 420px; }
  .leaflet-container { background: hsl(var(--surface)) !important; }
}
```

---

### FILE: `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="OviGrow — Zimbabwe's AI agricultural intelligence platform. Farmer registry, crop monitoring, disease detection, weather advisory and market data." />
    <meta name="theme-color" content="#0a0f09" />
    <meta property="og:title" content="OviGrow — AI Agricultural Intelligence for Zimbabwe" />
    <meta property="og:description" content="Digitising every aspect of Zimbabwe's agricultural sector. Farmer registry, AI crop advisory, disease detection, market prices and government reporting." />
    <meta property="og:type" content="website" />
    <link rel="canonical" href="https://ovigrow.app" />
    <title>OviGrow — AI Agricultural Intelligence for Zimbabwe</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### FILE: `public/favicon.svg`

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="16" fill="#0a0f09"/>
  <path d="M16 6 C16 6 8 12 8 19 C8 23.4 11.6 27 16 27 C20.4 27 24 23.4 24 19 C24 12 16 6 16 6Z" fill="#22c55e"/>
  <path d="M16 10 L16 24" stroke="#0a0f09" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M16 16 C16 16 12 13 10 15" stroke="#0a0f09" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M16 19 C16 19 20 16 22 18" stroke="#0a0f09" stroke-width="1.2" stroke-linecap="round"/>
</svg>
```

---

### FILE: `src/main.tsx`

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

### FILE: `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useStore } from '@/store/useStore'
import AppShell from '@/components/layout/AppShell'
import GlobalLoader from '@/components/shared/GlobalLoader'

// Lazy load all pages
const Landing         = lazy(() => import('@/pages/Landing'))
const Auth            = lazy(() => import('@/pages/Auth'))
const Dashboard       = lazy(() => import('@/pages/Dashboard'))
const FarmerRegistry  = lazy(() => import('@/pages/modules/FarmerRegistry'))
const CropAdvisory    = lazy(() => import('@/pages/modules/CropAdvisory'))
const DiseaseDetector = lazy(() => import('@/pages/modules/DiseaseDetector'))
const WeatherStation  = lazy(() => import('@/pages/modules/WeatherStation'))
const MarketPrices    = lazy(() => import('@/pages/modules/MarketPrices'))
const SoilAnalysis    = lazy(() => import('@/pages/modules/SoilAnalysis'))
const YieldPredictor  = lazy(() => import('@/pages/modules/YieldPredictor'))
const InputManager    = lazy(() => import('@/pages/modules/InputManager'))
const LivestockTracker= lazy(() => import('@/pages/modules/LivestockTracker'))
const GovReports      = lazy(() => import('@/pages/modules/GovReports'))
const LandMap         = lazy(() => import('@/pages/modules/LandMap'))
const WaterManager    = lazy(() => import('@/pages/modules/WaterManager'))
const ExtensionHub    = lazy(() => import('@/pages/modules/ExtensionHub'))
const SupplyChain     = lazy(() => import('@/pages/modules/SupplyChain'))
const History         = lazy(() => import('@/pages/History'))
const Settings        = lazy(() => import('@/pages/Settings'))
const NotFound        = lazy(() => import('@/pages/NotFound'))

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } } })

function ProtectedRoute() {
  const user = useStore(s => s.user)
  return user ? <Outlet /> : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route path="/"     element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/app"                    element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/app/dashboard"          element={<Dashboard />} />
                <Route path="/app/farmers"            element={<FarmerRegistry />} />
                <Route path="/app/crop-advisory"      element={<CropAdvisory />} />
                <Route path="/app/disease"            element={<DiseaseDetector />} />
                <Route path="/app/weather"            element={<WeatherStation />} />
                <Route path="/app/market"             element={<MarketPrices />} />
                <Route path="/app/soil"               element={<SoilAnalysis />} />
                <Route path="/app/yield"              element={<YieldPredictor />} />
                <Route path="/app/inputs"             element={<InputManager />} />
                <Route path="/app/livestock"          element={<LivestockTracker />} />
                <Route path="/app/reports"            element={<GovReports />} />
                <Route path="/app/land-map"           element={<LandMap />} />
                <Route path="/app/water"              element={<WaterManager />} />
                <Route path="/app/extension"          element={<ExtensionHub />} />
                <Route path="/app/supply-chain"       element={<SupplyChain />} />
                <Route path="/app/history"            element={<History />} />
                <Route path="/app/settings"           element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: 'hsl(145 18% 10%)', color: 'hsl(120 15% 94%)', border: '1px solid hsl(145 14% 20%)' }
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

---

### FILE: `src/store/useStore.ts`

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'farmer' | 'extension_officer' | 'government' | 'agribusiness' | 'admin'

interface OviGrowUser {
  id: string
  email: string
  name: string
  role: UserRole
  province?: string
  district?: string
  ward?: string
  farmerId?: string
}

interface HistoryItem {
  id: string
  module: string
  title: string
  output: string
  createdAt: string
}

interface OviGrowStore {
  user: OviGrowUser | null
  setUser: (u: OviGrowUser | null) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  history: HistoryItem[]
  addHistory: (item: Omit<HistoryItem, 'id' | 'createdAt'>) => void
  clearHistory: () => void
  selectedProvince: string
  setSelectedProvince: (p: string) => void
}

export const useStore = create<OviGrowStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      sidebarCollapsed: false,
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      history: [],
      addHistory: (item) => set(s => ({
        history: [
          { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ...s.history
        ].slice(0, 100)
      })),
      clearHistory: () => set({ history: [] }),
      selectedProvince: 'all',
      setSelectedProvince: (p) => set({ selectedProvince: p }),
    }),
    { name: 'ovigrow-store', partialize: (s) => ({ user: s.user, sidebarCollapsed: s.sidebarCollapsed, history: s.history }) }
  )
)
```

---

### FILE: `src/lib/ai.ts`

```ts
const API = 'https://api.anthropic.com/v1/messages'

export async function streamOviAI(
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string) => void,
  maxTokens = 2500
): Promise<string> {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key) throw new Error('Anthropic API key not configured. Check your .env.local file.')

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      stream: true,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `AI service error: ${res.status}`)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    for (const line of decoder.decode(value).split('\n')) {
      if (!line.startsWith('data: ')) continue
      try {
        const d = JSON.parse(line.slice(6))
        if (d.type === 'content_block_delta') {
          const t = d.delta?.text ?? ''
          full += t
          onChunk(t)
        }
      } catch {}
    }
  }
  return full
}

export async function callOviAI(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 2000
): Promise<string> {
  let out = ''
  await streamOviAI(systemPrompt, userMessage, (c) => { out += c }, maxTokens)
  return out
}
```

---

### FILE: `src/lib/supabase.ts`

```ts
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn('OviGrow: Supabase credentials not configured. Some features will be limited.')
}

export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder')
```

---

### FILE: `src/lib/constants.ts`

```ts
// Zimbabwe Provinces (10 provinces + 2 cities)
export const ZW_PROVINCES = [
  'Harare', 'Bulawayo', 'Mashonaland Central', 'Mashonaland East',
  'Mashonaland West', 'Manicaland', 'Midlands', 'Masvingo',
  'Matabeleland North', 'Matabeleland South', 'Bulawayo Metro'
]

// Agro-Ecological Zones (Natural Regions)
export const ZW_NATURAL_REGIONS = [
  { code: 'NR1',  name: 'Natural Region I',   rainfall: '> 1000mm', notes: 'Specialized/diversified farming, tea, coffee, forestry' },
  { code: 'NR2A', name: 'Natural Region IIa',  rainfall: '750-1000mm', notes: 'Intensive crop & livestock — maize, tobacco, cotton' },
  { code: 'NR2B', name: 'Natural Region IIb',  rainfall: '750-1000mm', notes: 'Crop & livestock — maize, cotton, groundnuts' },
  { code: 'NR3',  name: 'Natural Region III',  rainfall: '500-750mm', notes: 'Semi-intensive farming, sorghum, millet, cattle' },
  { code: 'NR4',  name: 'Natural Region IV',   rainfall: '450-600mm', notes: 'Semi-extensive cattle/goat ranching, drought crops' },
  { code: 'NR5',  name: 'Natural Region V',    rainfall: '< 450mm',  notes: 'Extensive cattle & wildlife ranching' },
]

// Main Zimbabwe crops
export const ZW_CROPS = [
  'Maize', 'Tobacco', 'Cotton', 'Soybean', 'Groundnuts', 'Sunflower',
  'Wheat', 'Sorghum', 'Pearl Millet', 'Finger Millet', 'Barley',
  'Sugar Cane', 'Tea', 'Coffee', 'Macadamia', 'Citrus',
  'Tomato', 'Potato', 'Sweet Potato', 'Onion', 'Cabbage',
  'Beans', 'Cowpeas', 'Bambara Nuts', 'Sesame', 'Paprika'
]

// Farming sectors
export const ZW_FARMING_SECTORS = [
  'A1 Smallholder Resettlement',
  'A2 Commercial Resettlement',
  'Communal',
  'Old Resettlement',
  'Large Scale Commercial',
  'Small Scale Commercial',
  'State/ARDA',
  'Urban/Peri-urban',
]

// Livestock types
export const ZW_LIVESTOCK = [
  'Cattle', 'Goats', 'Sheep', 'Pigs', 'Chickens (Layer)',
  'Chickens (Broiler)', 'Ducks', 'Rabbits', 'Donkeys', 'Horses', 'Fish (Aquaculture)'
]

// Common Zimbabwe crop diseases
export const ZW_DISEASES = [
  'Fall Armyworm (FAW)', 'Maize Streak Virus', 'Grey Leaf Spot', 'Northern Leaf Blight',
  'Common Rust', 'Stalk Borer', 'Quelea Birds', 'Aphids', 'Thrips',
  'Tobacco Mosaic Virus', 'Blue Mould', 'Alternaria', 'Frogeye Leaf Spot',
  'Cotton Bollworm', 'Whitefly', 'Red Spider Mite', 'Nematodes',
  'Banana Fusarium Wilt', 'Citrus Greening', 'Armyworm'
]

export const ZW_MARKET_PRICES_DEFAULT = [
  { crop: 'Maize', unit: 'tonne', price: 380, currency: 'USD', market: 'GMB', date: new Date().toISOString().split('T')[0] },
  { crop: 'Tobacco', unit: 'kg', price: 3.20, currency: 'USD', market: 'Auction Floor', date: new Date().toISOString().split('T')[0] },
  { crop: 'Soybean', unit: 'tonne', price: 580, currency: 'USD', market: 'Private', date: new Date().toISOString().split('T')[0] },
  { crop: 'Cotton', unit: 'kg', price: 0.55, currency: 'USD', market: 'Cottco', date: new Date().toISOString().split('T')[0] },
  { crop: 'Groundnuts', unit: 'tonne', price: 850, currency: 'USD', market: 'Private', date: new Date().toISOString().split('T')[0] },
  { crop: 'Wheat', unit: 'tonne', price: 420, currency: 'USD', market: 'GMB', date: new Date().toISOString().split('T')[0] },
  { crop: 'Sorghum', unit: 'tonne', price: 280, currency: 'USD', market: 'GMB', date: new Date().toISOString().split('T')[0] },
]
```

---

### FILE: `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-ZW', { style: 'currency', currency }).format(amount)
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${filename}.md`; a.click()
  URL.revokeObjectURL(url)
}

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${filename}.json`; a.click()
  URL.revokeObjectURL(url)
}

export function generateFarmerId(province: string, district: string) {
  const p = province.substring(0, 3).toUpperCase()
  const d = district.substring(0, 3).toUpperCase()
  const n = Math.floor(10000 + Math.random() * 90000)
  return `ZW-${p}-${d}-${n}`
}
```

---

### FILE: `src/hooks/useAI.ts`

```ts
import { useState, useCallback } from 'react'
import { streamOviAI } from '@/lib/ai'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'

export function useAI(module: string) {
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const addHistory = useStore(s => s.addHistory)

  const run = useCallback(async (
    systemPrompt: string,
    userMessage: string,
    title: string,
    maxTokens = 2500
  ) => {
    setIsLoading(true)
    setOutput('')
    try {
      const full = await streamOviAI(systemPrompt, userMessage, (c) => setOutput(p => p + c), maxTokens)
      addHistory({ module, title, output: full })
      return full
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'AI service unavailable'
      toast.error(msg)
      setOutput(`**Error:** ${msg}`)
      return ''
    } finally {
      setIsLoading(false)
    }
  }, [module, addHistory])

  const reset = useCallback(() => { setOutput(''); setIsLoading(false) }, [])

  return { output, isLoading, run, reset }
}
```

---

### FILE: `src/components/layout/AppShell.tsx`

```tsx
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function AppShell() {
  const collapsed = useStore(s => s.sidebarCollapsed)
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className={cn(
        'flex flex-col flex-1 min-w-0 transition-all duration-300',
        collapsed ? 'ml-14' : 'ml-56'
      )}>
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

---

### FILE: `src/components/layout/Sidebar.tsx`

```tsx
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Leaf, Bug, CloudSun, TrendingUp, FlaskConical,
  BarChart3, Package, Heart, FileBarChart, Map, Droplets, BookOpen,
  Truck, History, Settings, ChevronLeft, ChevronRight, LogOut, Sprout
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const NAV = [
  { section: 'WORKSPACE', items: [
    { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { section: 'FARMER TOOLS', items: [
    { to: '/app/farmers',       icon: Users,        label: 'Farmer Registry',   badge: 'REGISTRY' },
    { to: '/app/crop-advisory', icon: Leaf,         label: 'Crop Advisory',     badge: 'AI' },
    { to: '/app/disease',       icon: Bug,          label: 'Disease Detector',  badge: 'AI' },
    { to: '/app/weather',       icon: CloudSun,     label: 'Weather Station',   badge: 'LIVE' },
    { to: '/app/market',        icon: TrendingUp,   label: 'Market Prices',     badge: 'LIVE' },
    { to: '/app/soil',          icon: FlaskConical, label: 'Soil Analysis',     badge: 'AI' },
    { to: '/app/yield',         icon: BarChart3,    label: 'Yield Predictor',   badge: 'AI' },
  ]},
  { section: 'MANAGEMENT', items: [
    { to: '/app/inputs',        icon: Package,      label: 'Input Manager',     badge: 'AI' },
    { to: '/app/livestock',     icon: Heart,        label: 'Livestock Tracker', badge: 'AI' },
    { to: '/app/water',         icon: Droplets,     label: 'Water Manager',     badge: 'AI' },
    { to: '/app/land-map',      icon: Map,          label: 'Land Map',          badge: 'GIS' },
    { to: '/app/supply-chain',  icon: Truck,        label: 'Supply Chain',      badge: 'AI' },
  ]},
  { section: 'GOVERNMENT', items: [
    { to: '/app/reports',       icon: FileBarChart, label: 'Gov Reports',       badge: 'MLAFWRD' },
    { to: '/app/extension',     icon: BookOpen,     label: 'Extension Hub',     badge: 'AGRITEX' },
  ]},
  { section: 'ACCOUNT', items: [
    { to: '/app/history',   icon: History,  label: 'AI History' },
    { to: '/app/settings',  icon: Settings, label: 'Settings' },
  ]},
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, user, setUser } = useStore()
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/auth')
    toast.success('Signed out')
  }

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 border-r',
      'bg-surface border-border',
      sidebarCollapsed ? 'w-14' : 'w-56'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <Sprout className="w-4 h-4 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-display font-semibold text-foreground text-sm tracking-tight">OviGrow</span>
          )}
        </div>
        <button onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2">
        {NAV.map(group => (
          <div key={group.section}>
            {!sidebarCollapsed && (
              <p className="text-[9px] font-mono text-muted-foreground/60 tracking-widest uppercase px-2 mb-1">{group.section}</p>
            )}
            {group.items.map(item => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) =>
                cn('nav-item', isActive && 'active', sidebarCollapsed && 'justify-center px-0')
              } title={sidebarCollapsed ? item.label : undefined}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-xs truncate">{item.label}</span>
                    {item.badge && <span className="ovi-badge">{item.badge}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-border p-2">
        {!sidebarCollapsed && user && (
          <div className="px-2 py-1 mb-1">
            <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user.role.replace('_', ' ')}</p>
          </div>
        )}
        <button onClick={handleSignOut}
          className={cn('nav-item w-full text-accent-danger hover:text-accent-danger', sidebarCollapsed && 'justify-center px-0')}
          title={sidebarCollapsed ? 'Sign Out' : undefined}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-xs">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
```

---

### FILE: `src/components/layout/Topbar.tsx`

```tsx
import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { useStore } from '@/store/useStore'

const PAGE_NAMES: Record<string, string> = {
  '/app/dashboard':    'Dashboard',
  '/app/farmers':      'Farmer Registry',
  '/app/crop-advisory':'Crop Advisory',
  '/app/disease':      'Disease Detector',
  '/app/weather':      'Weather Station',
  '/app/market':       'Market Prices',
  '/app/soil':         'Soil Analysis',
  '/app/yield':        'Yield Predictor',
  '/app/inputs':       'Input Manager',
  '/app/livestock':    'Livestock Tracker',
  '/app/reports':      'Government Reports',
  '/app/land-map':     'Land Map',
  '/app/water':        'Water Manager',
  '/app/extension':    'Extension Hub',
  '/app/supply-chain': 'Supply Chain',
  '/app/history':      'AI History',
  '/app/settings':     'Settings',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const user = useStore(s => s.user)
  const title = PAGE_NAMES[pathname] ?? 'OviGrow'

  return (
    <header className="h-14 border-b border-border bg-surface/80 backdrop-blur flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="font-display font-semibold text-foreground text-base">{title}</h1>
        <p className="text-[10px] text-muted-foreground font-mono">OviGrow · Zimbabwe AgriTech Platform</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-danger" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold font-display">
          {user?.name?.charAt(0).toUpperCase() ?? 'G'}
        </div>
      </div>
    </header>
  )
}
```

---

### FILE: `src/components/shared/AIOutputBlock.tsx`

```tsx
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Download, Check } from 'lucide-react'
import { downloadMarkdown } from '@/lib/utils'
import LoadingDots from './LoadingDots'
import toast from 'react-hot-toast'

interface Props {
  content: string
  isLoading: boolean
  filename?: string
  className?: string
}

export default function AIOutputBlock({ content, isLoading, filename = 'ovigrow-output', className }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!content && !isLoading) return null

  return (
    <div className={`ovi-ai-block ${className ?? ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">OviGrow AI</span>
        {content && (
          <div className="flex gap-2">
            <button onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border hover:border-primary/30">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={() => downloadMarkdown(content, filename)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border hover:border-primary/30">
              <Download className="w-3 h-3" /> Download
            </button>
          </div>
        )}
      </div>

      {isLoading && !content && <LoadingDots />}

      {content && (
        <div className={`prose prose-invert prose-sm max-w-none ${isLoading ? 'ovi-cursor' : ''}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-3">
                  <table className="w-full text-xs border-collapse">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="text-left p-2 text-muted-foreground border-b border-border font-medium">{children}</th>
              ),
              td: ({ children }) => (
                <td className="p-2 border-b border-border/50 text-foreground">{children}</td>
              ),
              code: ({ children }) => (
                <code className="bg-surface-raised px-1.5 py-0.5 rounded text-primary font-mono text-xs">{children}</code>
              ),
              h2: ({ children }) => <h2 className="font-display font-semibold text-foreground mt-4 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="font-display font-medium text-foreground mt-3 mb-1">{children}</h3>,
              li: ({ children }) => <li className="text-foreground/90 my-0.5">{children}</li>,
              p: ({ children }) => <p className="text-foreground/90 leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
```

---

### FILE: `src/components/shared/LoadingDots.tsx`

```tsx
export default function LoadingDots({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <span key={i}
            className="w-2 h-2 rounded-full bg-primary animate-pulse-slow"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      {label && <span className="text-xs text-muted-foreground font-mono">{label}</span>}
    </div>
  )
}
```

---

### FILE: `src/components/shared/GlobalLoader.tsx`

```tsx
import { Sprout } from 'lucide-react'

export default function GlobalLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background flex-col gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center animate-pulse-slow">
        <Sprout className="w-7 h-7 text-primary-foreground" />
      </div>
      <p className="text-xs font-mono text-muted-foreground">Loading OviGrow...</p>
    </div>
  )
}
```

---

### FILE: `src/components/shared/ToolHeader.tsx`

```tsx
import { type LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  name: string
  tagline: string
  badge?: string
  badgeColor?: 'green' | 'blue' | 'amber' | 'red'
}

export default function ToolHeader({ icon: Icon, name, tagline, badge, badgeColor = 'green' }: Props) {
  const badgeColors = {
    green: 'bg-primary/10 text-primary border-primary/25',
    blue: 'border-accent-sky/25 text-accent-sky',
    amber: 'border-accent-harvest/25 text-accent-harvest',
    red: 'border-accent-danger/25 text-accent-danger',
  }

  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-foreground text-lg">{name}</h2>
            {badge && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${badgeColors[badgeColor]}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{tagline}</p>
        </div>
      </div>
    </div>
  )
}
```

---

### FILE: `src/components/shared/EmptyState.tsx`

```tsx
import { type LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button onClick={action.onClick}
          className="mt-5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          {action.label}
        </button>
      )}
    </div>
  )
}
```

---

### FILE: `src/pages/Landing.tsx`

Write a full, beautiful landing page with:
- Hero: Large Clash Display headline "Growing Zimbabwe, One Data Point at a Time." + subhead + two CTAs (Get Started → /auth, Learn More → scrolls to features)
- Stats bar: 1.6M+ Farmers · 10 Provinces · 15 AI Modules · FAO-Aligned
- Feature grid: all 15 modules as cards with icons, name, one-line description
- "Built for Zimbabwe" section: FAO alignment, MLAFWRD support, AGRITEX integration, AgriTech Strategy 2021–2025 alignment callouts
- Government trust section: logos/badges for Ministry of Agriculture, FAO Zimbabwe, ZIMSTAT alignment
- CTA banner: dark green gradient with "Register Your Farm Today" button
- Footer: OviGrow · Ovi/Ovia Family · Privacy · Terms · Contact · © 2025

---

### FILE: `src/pages/Auth.tsx`

Full auth page:
- Toggle Sign Up / Log In
- Sign Up fields: Full Name, Email, Password, Role selector (Farmer / Extension Officer / Government / Agribusiness), Province, District
- Log In fields: Email, Password
- Supabase auth integration
- On success: populate Zustand user store, redirect to /app/dashboard
- Error handling with field-level error messages
- "Powered by OviGrow · Part of the Ovi/Ovia Family" footer

---

### FILE: `src/pages/Dashboard.tsx`

Dashboard with:
- Welcome card: "Good [morning/afternoon], [Name]" + role badge + province
- 4 stat cards: Registered Farmers (from Supabase count), Active Alerts, AI Runs Today, Districts Covered
- Quick access grid (3×5): all 15 modules with icon + name + tagline
- Recent AI activity: last 6 items from Zustand history
- Zimbabwe season calendar widget: current season status (Main: Nov-Apr / Winter: May-Sep), current month highlighted
- Alert banner if in drought season (May-Oct in NR4/5)

---

### FILE: `src/pages/modules/FarmerRegistry.tsx`

**This is the most critical module — government-grade farmer registration system.**

Features:
1. **Register New Farmer** form with fields:
   - Full Name (required)
   - National ID Number (required, format: 00-000000A00)
   - Date of Birth
   - Gender
   - Phone Number (+263...)
   - Province (dropdown from ZW_PROVINCES)
   - District (text input)
   - Ward (text input / number)
   - Village/Farm Name
   - Farming Sector (dropdown from ZW_FARMING_SECTORS)
   - Natural Region (dropdown from ZW_NATURAL_REGIONS)
   - Farm Size (hectares)
   - Primary Crops (multi-select from ZW_CROPS)
   - Livestock (multi-select from ZW_LIVESTOCK)
   - GPS Coordinates (lat/long, with "Use my location" button)
   - Irrigation access (Yes/No)
   - Market access (Local/District/National/Export)
   - Auto-generate Farmer ID using generateFarmerId()

2. **Farmer Database Table**: search, filter by province/sector, paginate
3. **Export** to CSV/JSON (for MLAFWRD reporting)
4. **AI Farmer Profile Summary**: one click generates an AI advisory brief for each farmer
5. **Supabase**: save all farmer records to `farmers` table

**AI System Prompt for Farmer Advisory:**
```
You are OviGrow's agricultural advisory AI for Zimbabwe. 
Given this farmer profile, generate a personalized advisory brief:
{farmerProfile}

Produce in markdown:
# Agricultural Advisory Brief — [Farmer Name]
## Farmer ID: [ID]
## Farm Overview
## Recommended Crops for [Natural Region] — [Current Season]
## Key Risks & Mitigation (climate, pests, market)
## Input Recommendations (seed varieties, fertilizer)
## Market Opportunities
## Extension Support Needed
## 6-Month Action Plan

Be specific to Zimbabwe's context. Reference AGRITEX recommendations where relevant.
Align with NR[X] agro-ecological zone best practices.
```

---

### FILE: `src/pages/modules/CropAdvisory.tsx`

AI crop planning and advisory:
- Inputs: Province, District, Natural Region, Crop selection, Season (Main/Winter), Farming method, Irrigation (Y/N), Farm size, Budget range
- Generate: Full seasonal crop management plan
- Sections: Planting calendar, Variety recommendations (certified seed varieties sold in Zimbabwe), Fertilizer schedule (using ZFC/Windmill brands), Irrigation schedule, Pest/disease monitoring calendar, Expected yield range, Market timing

**System Prompt:**
```
You are OviGrow's crop advisory AI specialising in Zimbabwe agriculture.
Context: {province}, {district}, Natural Region {naturalRegion}
Crop: {crop} | Season: {season} | Farm size: {hectares}ha
Irrigation: {irrigation} | Budget: USD {budget}

Generate a complete Seasonal Crop Management Plan in markdown.
Include:
## Recommended Varieties (varieties available in Zimbabwe from Seed Co, Pannar, Pioneer, Agricura)
## Planting Window (specific dates for this NR)
## Land Preparation
## Planting & Spacing
## Fertilizer Program (Basal + Top Dress — use ZFC/Windmill/Omnia brands & rates)
## Irrigation Schedule (if applicable)
## Pest & Disease Watch Calendar (reference AGRITEX spray guides)
## Weed Management
## Harvest & Post-Harvest
## Estimated Budget (USD per hectare)
## Expected Yield Range
## Market & Pricing Guidance

Reference Zimbabwe-specific conditions, input brands available locally, and AGRITEX guidelines.
```

---

### FILE: `src/pages/modules/DiseaseDetector.tsx`

AI disease and pest identification:
- Photo upload (base64 encode, send to AI with vision)
- Manual description fallback: describe symptoms (leaf color, texture, pattern, crop, affected area %)
- Additional context: Province, crop type, recent weather, growth stage
- Output: Disease/pest ID, severity score (1-10), confidence %, treatment plan, prevention

**System Prompt:**
```
You are OviGrow's plant disease and pest detection AI for Zimbabwe.
Crop: {crop} | Province: {province} | Growth Stage: {stage}
Recent weather: {weather}
Symptoms described: {description}
[If image provided: Analyze the uploaded image for disease/pest signs]

Produce:
## Diagnosis
**Identified Condition:** [name]
**Confidence:** [%]
**Severity:** [1-10 scale] — [Low/Medium/High/Critical]

## Description
(What this disease/pest is, how it spreads in Zimbabwe's climate)

## Immediate Actions (within 24-48 hours)
## Treatment Protocol
(Specific agro-chemicals available in Zimbabwe — Agricura, Syngenta ZW, Bayer ZW — with dosage rates)

## Prevention & Future Management
## Economic Impact Estimate
## When to Call AGRITEX Extension Officer

⚠️ Flag if this is a notifiable pest/disease under Zimbabwe Plant Protection Act.
```

---

### FILE: `src/pages/modules/WeatherStation.tsx`

Weather intelligence for Zimbabwe farming:
- Province/District selector → fetch current weather via Open-Meteo API (free, no key needed)
- Coordinates mapped per province: Harare (-17.8, 31.0), Bulawayo (-20.15, 28.58), etc.
- Display: Temperature, Humidity, Rainfall last 7 days, Wind, UV Index
- 7-day forecast with farming icons (🌱 plant / ⚠️ delay / 💧 irrigate)
- AI Seasonal Advisory based on current conditions
- El Niño/La Niña alert banner (from hardcoded seasonal outlook updated annually)

Use Open-Meteo API: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&forecast_days=7&timezone=Africa%2FHarare`

**System Prompt:**
```
You are OviGrow's agricultural meteorologist for Zimbabwe.
Location: {province}, {district}
Current weather: {weatherData}
7-day forecast: {forecast}
Current season: {season}

Generate:
## Weather Summary for Farmers
## Farming Implications This Week
## Irrigation Advice
## Planting/Harvesting Window Assessment
## Pest & Disease Risk (warm/humid conditions increase fungal risk)
## Recommendations by Crop
Speak directly to farmers in practical language.
```

---

### FILE: `src/pages/modules/MarketPrices.tsx`

Agricultural market intelligence:
- Default prices table (ZW_MARKET_PRICES_DEFAULT) displayed as styled table
- AI Market Analysis button: generates price outlook and selling strategy
- Filter by crop, market (GMB, Auction, Private, Cottco, TSF)
- "Best time to sell" AI advice per crop
- Import/export price comparison

**System Prompt:**
```
You are OviGrow's agricultural market analyst for Zimbabwe.
Current market data: {marketData}
Crop focus: {crop}
Farmer location: {province}

Provide:
## Current Price Analysis — {crop}
## Price Outlook (2-4 weeks)
## Best Selling Strategy
## Buyer Options in Zimbabwe (GMB, private traders, processors, exporters)
## Post-Harvest Storage Advice (to wait for better prices)
## Value Addition Opportunities
## Export Potential
Reference Zimbabwe's agricultural market structure: GMB, Grain Millers Association, tobacco auction floors, cotton merchants.
```

---

### FILE: `src/pages/modules/SoilAnalysis.tsx`

AI soil health advisor:
- Input form: Province, District, Natural Region, Soil type description, crop history, pH (if known), observed issues
- Photo upload of soil
- Output: Soil health assessment, amendment recommendations, crop suitability

**System Prompt:**
```
You are OviGrow's soil science advisor specializing in Zimbabwean soils.
Location: {province}, NR{naturalRegion}
Soil description: {description}
Crop history: {cropHistory}
Known pH: {pH}
Observed issues: {issues}

Generate:
## Soil Type Assessment
## Estimated Soil Properties (pH, texture, organic matter, key nutrients)
## Deficiency Indicators
## Lime Requirement (if pH too low — very common in Zimbabwe's sandy soils)
## Fertilizer Recommendations (NPK ratios, organic amendments)
## Crop Suitability for This Soil
## Soil Conservation Practices
## Priority Actions Before Planting
Reference Zimbabwe soil types: Kalahari sands, granite sands, red clays, alluvial. Recommend locally available lime and fertilizers.
```

---

### FILE: `src/pages/modules/YieldPredictor.tsx`

AI yield forecasting:
- Inputs: Crop, Province, NR, Farm size (ha), Variety, Planting date, Rainfall received (mm), Fertilizer applied (Y/N level), Irrigation (Y/N), Pest pressure (none/low/medium/high)
- Output: Yield prediction range, revenue estimate, risk factors, improvement recommendations

**System Prompt:**
```
You are OviGrow's crop yield prediction specialist for Zimbabwe.
Crop: {crop} | Province: {province} | NR: {naturalRegion}
Farm size: {hectares}ha | Variety: {variety}
Season rainfall: {rainfall}mm | Fertilizer: {fertilizer}
Irrigation: {irrigation} | Pest pressure: {pestPressure}
Current growth stage: {growthStage}

Predict:
## Yield Forecast
**Optimistic:** [X] t/ha
**Likely:** [X] t/ha  
**Conservative:** [X] t/ha
**Total expected harvest:** [X] tonnes

## Revenue Estimate (at current GMB/market price)

## Key Yield-Limiting Factors
## What Could Improve Yield Before Harvest
## Post-Harvest Loss Risk
## Comparison to Zimbabwe National Average
## Recommendations for Next Season
Calibrate predictions against Zimbabwe national yield averages (maize avg ~0.8-1.2t/ha communal, 3-5t/ha commercial).
```

---

### FILE: `src/pages/modules/InputManager.tsx`

Agricultural input management:
- Input inventory tracker: seed, fertilizer, chemicals, equipment
- AI Procurement Advisor: based on farm plan, recommend inputs, quantities, costs
- Supplier directory (hardcoded Zimbabwe suppliers: Seed Co, Quton, Agricura, ZFC, Windmill, Omnia, Syngenta)
- E-voucher eligibility checker (government input subsidy programs)

**System Prompt:**
```
You are OviGrow's agricultural input procurement advisor for Zimbabwe.
Farm profile: {farmProfile}
Planned crops: {crops}
Farm size: {hectares}ha
Budget: USD {budget}
Season: {season}

Generate:
## Input Requirements List
| Input | Type | Quantity | Estimated Cost (USD) | Local Supplier |
## Prioritized Procurement Plan (what to buy first)
## Government Subsidy Programs Available (FISP, Command Agriculture, Presidential Input Scheme)
## Where to Buy in {province}
## Money-Saving Alternatives
## Storage Requirements for Purchased Inputs
Reference current Zimbabwean input suppliers: Seed Co Zim, Agricura, ZFC, Windmill Fertilizers, Omnia, Syngenta Zimbabwe.
```

---

### FILE: `src/pages/modules/LivestockTracker.tsx`

Livestock herd management and AI health advisor:
- Herd registration: species, breed, number, age breakdown, health status
- Health log: vaccination records, treatments, deaths
- AI Vet Advisor: describe symptoms, get diagnosis and treatment
- Feed/nutrition advisor
- Market value estimator

**System Prompt:**
```
You are OviGrow's veterinary and livestock management advisor for Zimbabwe.
Livestock type: {species} | Breed: {breed}
Herd size: {count} | Location: {province}
Health concern: {concern}
Symptoms: {symptoms}

Provide:
## Preliminary Assessment
## Likely Condition
## Immediate Actions
## Treatment Protocol (medicines available from Veterinary suppliers in Zimbabwe: ZVL, Aldes)
## Isolation/Quarantine Protocol
## Herd-wide prevention measures
## When to Contact DVO (District Veterinary Officer)
## Reporting requirements (notifiable diseases under Zimbabwe Veterinary Act)
⚠️ Flag foot-and-mouth, anthrax, East Coast Fever, Newcastle Disease as reportable.
```

---

### FILE: `src/pages/modules/GovReports.tsx`

Government reporting and analytics — MLAFWRD/AGRITEX dashboard:
- Only fully accessible to `government` and `extension_officer` roles
- Auto-generate reports: Farmer counts by Province/District, Crop coverage stats, Disease outbreak summary, Input distribution tracking
- Export to PDF/CSV format
- AI Report Writer: generate formal government agricultural report

**System Prompt:**
```
You are OviGrow's government reporting AI, aligned with Zimbabwe's MLAFWRD reporting standards.
Report type: {reportType}
Period: {period}
Data: {data}
Province/District: {location}

Generate a formal government agricultural report in the style of MLAFWRD/AGRITEX reporting:
## MINISTRY OF LANDS, AGRICULTURE, FISHERIES, WATER AND RURAL DEVELOPMENT
## [Report Title]
## Period: [Period]
## Prepared by: OviGrow Digital Platform

Include: Executive Summary, Key Statistics, Analysis, Challenges, Recommendations, Conclusion
Use formal Zimbabwean government reporting language.
Reference alignment with Zimbabwe AgriTech Strategy 2021-2025 and National Food and Nutrition Security Policy.
```

---

### FILE: `src/pages/modules/LandMap.tsx`

Interactive Zimbabwe land mapping using React Leaflet:
- Map centered on Zimbabwe (-19.0, 29.15), zoom 7
- Province boundary overlays (simplified GeoJSON polygons)
- Farmer location markers (from Supabase farmers table with GPS coordinates)
- Layer toggles: Farmers, Natural Regions, Districts
- Click marker to see farmer profile card
- Heat map overlay showing farmer density by district

```tsx
// Zimbabwe center coordinates
const ZW_CENTER: [number, number] = [-19.015438, 29.154857]
const ZW_ZOOM = 7

// Province approximate center coordinates for markers
const ZW_PROVINCE_CENTERS: Record<string, [number, number]> = {
  'Harare': [-17.8292, 31.0522],
  'Bulawayo': [-20.1325, 28.6261],
  'Mashonaland Central': [-17.0, 31.2],
  'Mashonaland East': [-18.0, 31.5],
  'Mashonaland West': [-17.5, 30.0],
  'Manicaland': [-19.0, 32.5],
  'Midlands': [-19.5, 29.5],
  'Masvingo': [-20.5, 30.8],
  'Matabeleland North': [-19.0, 27.5],
  'Matabeleland South': [-21.5, 29.0],
}
```

---

### FILE: `src/pages/modules/WaterManager.tsx`

Water and irrigation management AI:
- Water source registration: dam, borehole, river, piped, rainwater
- Irrigation system type: drip, flood, sprinkler, centre pivot
- AI water use calculator: crop + hectares + method → water requirement
- Rainfall deficit tracker
- Water conservation recommendations

---

### FILE: `src/pages/modules/ExtensionHub.tsx`

AGRITEX Extension Officer digital support hub:
- Extension officer profile and area assignment (Province/District/Ward)
- Farmer visit log: date, farmer ID, advice given, follow-up needed
- AI Advisory Note Generator: based on farm visit, generate formal extension report
- Training materials library (hardcoded: AGRITEX guides, CIMMYT resources, FAO manuals links)
- Mass SMS/notification composer (AI writes the message, user sends via their system)

---

### FILE: `src/pages/modules/SupplyChain.tsx`

Agricultural supply chain and market linkage:
- Buyer directory: GMB, Cottco, TSF, processors, exporters, supermarkets
- Produce listing: farmer can list available produce for sale
- AI price negotiation advisor
- Transport cost estimator (province to market)
- Post-harvest loss calculator

---

### FILE: `src/pages/History.tsx`

Full AI interaction history:
- Table view of all Zustand history items
- Filter by module
- Expandable output preview
- Clear history button

---

### FILE: `src/pages/Settings.tsx`

User settings:
- Profile: Name, Role, Province, District, Phone
- API status indicator (shows if Anthropic key is configured)
- Supabase connection status
- Language preference (English / Shona / Ndebele — UI labels only, future)
- About: OviGrow version, Ovi/Ovia family, MLAFWRD alignment badge

---

### FILE: `src/pages/NotFound.tsx`

```tsx
import { Link } from 'react-router-dom'
import { Sprout, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto">
          <Sprout className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground">404</h1>
          <p className="text-muted-foreground mt-2">This field hasn't been planted yet.</p>
        </div>
        <Link to="/app/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
```

---

## ═══════════════════════════════════════════════════════════════
## STEP 3 — SUPABASE SCHEMA SQL
## ═══════════════════════════════════════════════════════════════

Create file `supabase/schema.sql`:

```sql
-- ══════════════════════════════════════════
-- OviGrow Database Schema
-- Ministry of Lands, Agriculture, Fisheries,
-- Water and Rural Development — Zimbabwe
-- ══════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- for GPS coordinates

-- User profiles
CREATE TABLE profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'farmer'
                CHECK (role IN ('farmer','extension_officer','government','agribusiness','admin')),
  province      TEXT,
  district      TEXT,
  ward          TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Farmer registry (core government-grade table)
CREATE TABLE farmers (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id           TEXT UNIQUE NOT NULL,              -- e.g. ZW-HAR-CHI-12345
  registered_by       UUID REFERENCES profiles(id),
  full_name           TEXT NOT NULL,
  national_id         TEXT UNIQUE,                       -- Zimbabwe NID
  date_of_birth       DATE,
  gender              TEXT CHECK (gender IN ('Male','Female','Other')),
  phone               TEXT,
  province            TEXT NOT NULL,
  district            TEXT NOT NULL,
  ward                TEXT,
  village_farm        TEXT,
  farming_sector      TEXT,
  natural_region      TEXT,
  farm_size_ha        DECIMAL(10,2),
  gps_lat             DECIMAL(10,7),
  gps_lon             DECIMAL(10,7),
  primary_crops       TEXT[],
  livestock           TEXT[],
  irrigation_access   BOOLEAN DEFAULT FALSE,
  market_access       TEXT CHECK (market_access IN ('Local','District','National','Export')),
  active              BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- AI interactions log
CREATE TABLE ai_outputs (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module        TEXT NOT NULL,
  title         TEXT,
  input_data    JSONB,
  output        TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Crop reports
CREATE TABLE crop_reports (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id     UUID REFERENCES farmers(id),
  user_id       UUID REFERENCES profiles(id),
  crop          TEXT NOT NULL,
  season        TEXT NOT NULL,
  area_ha       DECIMAL(10,2),
  yield_actual  DECIMAL(10,2),
  province      TEXT,
  district      TEXT,
  report_date   DATE DEFAULT CURRENT_DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Disease alerts
CREATE TABLE disease_alerts (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reported_by   UUID REFERENCES profiles(id),
  farmer_id     UUID REFERENCES farmers(id),
  crop          TEXT,
  disease_name  TEXT NOT NULL,
  severity      INTEGER CHECK (severity BETWEEN 1 AND 10),
  province      TEXT NOT NULL,
  district      TEXT NOT NULL,
  gps_lat       DECIMAL(10,7),
  gps_lon       DECIMAL(10,7),
  resolved      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Extension visits
CREATE TABLE extension_visits (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  officer_id    UUID REFERENCES profiles(id),
  farmer_id     UUID REFERENCES farmers(id) NOT NULL,
  visit_date    DATE NOT NULL,
  purpose       TEXT,
  advice_given  TEXT,
  follow_up     BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Input inventory
CREATE TABLE farm_inputs (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES profiles(id),
  farmer_id     UUID REFERENCES farmers(id),
  input_type    TEXT NOT NULL,  -- 'seed','fertilizer','chemical','equipment'
  product_name  TEXT NOT NULL,
  quantity      DECIMAL(10,2),
  unit          TEXT,
  purchase_date DATE,
  cost_usd      DECIMAL(10,2),
  supplier      TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_outputs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_alerts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE extension_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_inputs     ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);

-- Farmers: registered users can read all (extension officers need cross-province access)
-- Government/admin can see all; farmers see their own record
CREATE POLICY "farmers_read" ON farmers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "farmers_insert" ON farmers FOR INSERT WITH CHECK (auth.uid() = registered_by);
CREATE POLICY "farmers_update" ON farmers FOR UPDATE USING (auth.uid() = registered_by);

-- AI outputs: users see own
CREATE POLICY "own_ai_outputs" ON ai_outputs FOR ALL USING (auth.uid() = user_id);

-- Crop reports: users see own + public read for government dashboards
CREATE POLICY "crop_reports_read" ON crop_reports FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "crop_reports_write" ON crop_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Disease alerts: all authenticated users can read (for early warning)
CREATE POLICY "disease_alerts_read" ON disease_alerts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "disease_alerts_write" ON disease_alerts FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Extension visits: officers see own records
CREATE POLICY "extension_own" ON extension_visits FOR ALL USING (auth.uid() = officer_id);

-- Farm inputs: users see own
CREATE POLICY "inputs_own" ON farm_inputs FOR ALL USING (auth.uid() = user_id);

-- ══════════════════════════════════════════
-- INDEXES for performance
-- ══════════════════════════════════════════
CREATE INDEX idx_farmers_province  ON farmers(province);
CREATE INDEX idx_farmers_district  ON farmers(district);
CREATE INDEX idx_farmers_sector    ON farmers(farming_sector);
CREATE INDEX idx_disease_province  ON disease_alerts(province, created_at);
CREATE INDEX idx_ai_outputs_user   ON ai_outputs(user_id, created_at DESC);
```

---

## ═══════════════════════════════════════════════════════════════
## STEP 4 — PACKAGE.JSON & TSCONFIG
## ═══════════════════════════════════════════════════════════════

Ensure `package.json` has:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives"
  }
}
```

Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## ═══════════════════════════════════════════════════════════════
## STEP 5 — GIT INIT & GITHUB PUSH
## ═══════════════════════════════════════════════════════════════

Run these commands after all files are created and `npm run build` succeeds:

```bash
# Verify build works before pushing
npm run build

# If build succeeds:
git init
git add .
git commit -m "feat: OviGrow v1.0 — AI Agricultural Intelligence Platform for Zimbabwe

- 15 AI-powered modules for Zimbabwe's agricultural sector
- Farmer registry aligned with MLAFWRD/FAO IDEA system
- Crop advisory, disease detection, weather, market prices
- Soil analysis, yield prediction, livestock tracking
- Government reporting tools (AGRITEX/MLAFWRD)
- Land mapping with React Leaflet
- Supply chain and input management
- Extension officer digital hub
- Supabase backend with RLS
- Production-ready: vercel.json SPA routing configured

Aligned with Zimbabwe AgriTech Strategy 2021-2025
Part of the Ovi/Ovia product family"

git branch -M main
git remote add origin https://[GITHUB_TOKEN]@github.com/[USERNAME]/[REPO].git
git push -u origin main
```

Then output to the user:
```
✅ OviGrow has been pushed to GitHub!

📁 Repository: https://github.com/[USERNAME]/[REPO]

═══════════════════════════════════════════
NEXT STEPS — DEPLOY TO VERCEL
═══════════════════════════════════════════

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select: [USERNAME]/[REPO]
4. Framework: Vite (auto-detected)
5. Add these Environment Variables:
   VITE_ANTHROPIC_API_KEY = [their key]
   VITE_SUPABASE_URL      = [their supabase url]
   VITE_SUPABASE_ANON_KEY = [their supabase anon key]
6. Click "Deploy"

Your app will be live at: https://[REPO].vercel.app

═══════════════════════════════════════════
SUPABASE SETUP
═══════════════════════════════════════════

1. Go to your Supabase project → SQL Editor
2. Copy and run the contents of: supabase/schema.sql
3. This creates all tables with Row Level Security

═══════════════════════════════════════════
OviGrow is ready. Growing Zimbabwe. 🌱
═══════════════════════════════════════════
```

---

## ═══════════════════════════════════════════════════════════════
## QUALITY RULES — ENFORCE THROUGHOUT
## ═══════════════════════════════════════════════════════════════

- **Zero inline styles** — all styling via CSS variables and Tailwind design tokens
- **Zero `text-white` or `bg-black`** — use semantic tokens only  
- **Every component typed** — no `any`, full TypeScript
- **All imports resolved** — no missing dependencies at build time
- **All routes handled** — including the `*` 404 catch-all
- **vercel.json exists at root** — non-negotiable
- **`.env.local` in .gitignore** — API keys never committed
- **All 15 module pages exist** — no missing route targets
- **`npm run build` must succeed** with zero errors before git push
- **Supabase errors handled gracefully** — app works in read-only mode if Supabase not configured
- **Mobile responsive** — all layouts work on tablet (extension officers use tablets in the field)
- **Zimbabwe-specific throughout** — crop names, regions, suppliers, regulatory references all accurate

---

## ═══════════════════════════════════════════════════════════════
## COMPETITIVE EDGE — WHAT MAKES OVIGROW DIFFERENT
## ═══════════════════════════════════════════════════════════════

| Competitor | Gap | OviGrow Edge |
|---|---|---|
| Eco-farmer (Zimbabwe) | Basic SMS alerts | Full AI advisory + disease detection |
| Kurima Mari | Finance-only | End-to-end agri intelligence |
| Farmonaut | No Zimbabwe focus | Zimbabwe-native: NRs, AGRITEX, local crop varieties |
| e-Hurudza | Government-only | Farmer + Gov + Extension in one platform |
| FAO IDEA | Data collection only | Data collection + AI advisory + market linkage |
| Plantix | Generic global | Zimbabwe-specific diseases, local treatments |
| WiseYield | European focus | Zimbabwe NR zones, local inputs, ZW market prices |

**OviGrow is the only platform that is:**
1. Zimbabwe-native (Natural Regions, AGRITEX alignment, local input brands)
2. Government-grade (MLAFWRD, FAO IDEA compatible farmer registry)
3. Full-stack AI (advisory, disease, soil, weather, market, livestock — all AI-powered)
4. Free-to-start for smallholder farmers
5. Part of a broader Ovi/Ovia technology ecosystem

---

*OviGrow · Part of the Ovi/Ovia Family*  
*Aligned with Zimbabwe AgriTech Strategy 2021–2025*  
*Supporting MLAFWRD · FAO Zimbabwe · AGRITEX · ZIMSTAT*  
*Growing Zimbabwe, one data point at a time. 🌱*
