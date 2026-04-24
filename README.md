# BlogSpace — Hivon Automations Assignment

A full-stack blogging platform built with Next.js and Supabase, featuring role-based access control and AI-generated post summaries via Google Gemini.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js 16 (App Router, Server Actions) |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |
| AI Integration | Google Gemini 1.5 Flash |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Version Control | Git + GitHub |

---

## Features

- **3 User Roles** — Viewer (read + comment), Author (create + edit own posts), Admin (full access)
- **Blog Posts** — Title, featured image, rich body content, comments section
- **AI Summaries** — Auto-generated ~200-word summary on every new post (stored once, never re-called)
- **Search** — Full-text search across post titles and body
- **Pagination** — 6 posts per page
- **Role-Based Editing** — Authors edit their own posts; Admins edit any post
- **Admin Dashboard** — View all posts, recent comments, and all users

---

## Project Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone and install

```bash
git clone <your-repo-url>
cd kanishk-assignment-hivon-automations
npm install
```

### 2. Set environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_or_publishable_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

Find your Supabase values at: **Supabase Dashboard → Project → Settings → API**

### 3. Set up the database

Open your Supabase project → **SQL Editor** → paste and run the entire contents of `supabase/schema.sql`.

This creates:
- `users`, `posts`, `comments` tables
- Row Level Security policies for all 3 roles
- A `post-images` storage bucket
- A trigger that auto-creates a user profile on signup

### 4. Create an Admin user

1. Register a normal account through the app
2. In Supabase Dashboard → **Table Editor** → `users` table
3. Find that user's row and change `role` from `viewer` to `admin`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How to Run the Project

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Lint
npm run lint
```

---

## Deployment Steps (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Under **Environment Variables**, add the three variables from `.env.local`
4. Click **Deploy**

Vercel automatically detects Next.js and configures the build command.

### Deployment Steps (Netlify)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → import from Git
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add environment variables under **Site configuration → Environment variables**
6. Deploy

---

## Project Structure

```
app/
  (auth)/login/          # Login page
  (auth)/register/       # Register page (with role selection)
  auth/callback/         # Supabase OAuth callback
  posts/create/          # Create post (Author + Admin only)
  posts/[id]/            # Post detail with comments
  posts/[id]/edit/       # Edit post (Author for own, Admin for any)
  admin/                 # Admin dashboard
  components/Navbar.tsx  # Global navigation
  page.tsx               # Home — post listing with search & pagination

lib/
  supabase/              # Supabase client helpers (browser, server, proxy)
  actions/               # Server Actions (auth, posts, comments)

supabase/
  schema.sql             # Full DB schema — run once in Supabase SQL Editor

proxy.ts                 # Route protection (Next.js 16 proxy file)
```

---

## AI Tool Usage

This project was built using **Claude Code** (Anthropic's AI coding assistant). It helped by:
- Generating the full project structure from the assignment PDF
- Writing all Server Actions, Supabase RLS policies, and the Gemini API integration
- Catching breaking changes in Next.js 16 (e.g. `middleware.ts` → `proxy.ts`, async `cookies()`/`headers()`, `useActionState` signature changes)
- Fixing TypeScript errors across the entire codebase

---

## AI Summary Flow (Cost Optimization)

1. User submits a new post
2. Server Action calls Google Gemini 1.5 Flash with the post title + body
3. The generated ~200-word summary is stored in `posts.summary` in the database
4. All subsequent page loads read the stored summary — **the AI API is never called again for that post**

This means zero repeated API calls: one post = one API call, ever.
