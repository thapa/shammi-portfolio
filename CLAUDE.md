# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build to /dist
npm run preview   # Preview production build locally
npm run lint      # ESLint check
```

There are no tests in this project.

## Architecture

**Stack:** React 18 SPA + Vite, Tailwind CSS, GSAP animations, Supabase (database + storage), Vercel serverless functions.

**Two main route areas:**
- `/` — Public portfolio (Header, Hero2, About, Services, Process, TechPartners, Projects, Contact, Footer, ChatWidget)
- `/admin/*` — Password-protected CMS panel (client-side password gate via `VITE_ADMIN_PASSWORD`, stored in sessionStorage)

### Data Flow

`ContentContext` (`src/context/ContentContext.jsx`) fetches all portfolio content from Supabase on mount and provides it to every section component via context. Tables: `projects`, `services`, `experience`, `skills`, `process_steps`, `stats`.

### Serverless API (`/api/`)

| File | Purpose |
|---|---|
| `screenshot.js` | Captures project screenshots via ScreenshotBase API, uploads to Supabase Storage (`project-screenshots` bucket) |
| `chat.js` | AI chat endpoint using Groq |
| `chat-summary.js` | Summarizes chat conversation and emails it to site owner via Resend |
| `generate-description.js` | AI-generates project descriptions |
| `send-email.js` | Handles contact form submissions via Resend |

**Rule:** Whenever a new API is implemented, add a reference entry to the **External API References** section below.

### External API References

| API | Used In | Purpose | Docs |
|---|---|---|---|
| **Groq** (`llama-3.3-70b-versatile`) | `chat.js`, `chat-summary.js`, `generate-description.js` | AI chat responses, conversation summaries, project description generation | https://console.groq.com/docs/openai |
| **OpenAI** (fallback) | `chat.js`, `chat-summary.js` | Drop-in fallback if `OPENAI_API_KEY` is set instead of `GROQ_API_KEY` | https://platform.openai.com/docs/api-reference/chat |
| **Resend** | `send-email.js`, `chat-summary.js` | Transactional email — contact form submissions and chat lead summaries | https://resend.com/docs/api-reference/emails/send-email |
| **ScreenshotBase** | `screenshot.js` | Captures desktop & mobile WebP screenshots of project URLs | https://screenshotbase.com/docs |
| **Supabase JS SDK** | `src/lib/supabase.js`, `screenshot.js` | Database (all content tables + `leads`), Storage (`project-screenshots` bucket) | https://supabase.com/docs/reference/javascript/introduction |

### Chat Widget

`src/components/global/ChatWidget.jsx` — pre-chat form collects visitor info (name, email, phone) → saves to Supabase `leads` table → AI chat via `/api/chat`. After 4+ user turns or on close, triggers `/api/chat-summary` which emails a summary to the owner.

AI assistant behavior is configured in `config/agentRules.js`.

### Admin Panel

`src/admin/AdminApp.jsx` — login gate shell. Two panels:
- `ProjectsPanel.jsx` — CRUD for projects, triggers screenshot generation
- `TablePanel.jsx` — Generic CRUD for all other tables

### Styling

- Primary color: `#5c51fe` (Tailwind alias: `primary`)
- Dark mode via `class` strategy (toggled by Header, persisted to localStorage)
- Fonts: Inter (sans), Playfair Display (display)
- Custom Tailwind animations: `marquee`, `scroll-up`, `scroll-down`

## Environment Variables

`VITE_*` variables are client-accessible. The others are used only in Vercel serverless functions.

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SCREENSHOTBASE_API_KEY
VITE_ADMIN_PASSWORD
RESEND_API_KEY
GROQ_API_KEY
```

## Supabase

- Client: `src/lib/supabase.js`
- RLS: Public READ on all tables; anon key has INSERT/UPDATE/DELETE for the admin panel
- Storage bucket: `project-screenshots` (stores `.webp` screenshots)
- Schema reference: `supabase-admin-policies.sql`

**Database changes:** Whenever new tables or seed data are needed, create a new `.sql` file (e.g., `add-table-name.sql`) rather than running queries directly. The user will execute it manually in the Supabase SQL editor.

## Deployment

Deployed on Vercel. The `vercel.json` rewrites all non-`/api` routes to `index.html` for SPA behavior. Screenshot function has a 60-second max duration.
