# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack LLM chat application ("komorebi") with a forest-themed UI. Next.js frontend in `frontend/`, FastAPI backend in `api/`, deployed on Vercel.

## Commands

### Frontend (run from `frontend/`)
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Jest + React Testing Library
npm run test:watch   # Jest watch mode
npx jest path/to/test.ts  # Run a single test file
```

### Backend (run from project root)
```bash
uv sync                                    # Install Python deps (fetches Python 3.12 automatically)
uv run uvicorn api.index:app --reload      # Start dev server (localhost:8000)
```

## Architecture

- **Frontend → Backend proxy**: In dev, `next.config.ts` rewrites `/api/*` to `http://localhost:8000`. In production, set `NEXT_PUBLIC_API_URL` to the deployed API URL.
- **Chat flow**: `ChatPanel` → `sendChatMessage()` (in `lib/chat/api.ts`) → `POST /api/chat` with full message history → FastAPI processes via Azure OpenAI → response rendered as assistant bubble.
- **Styling**: Tailwind CSS v4 with `@theme` block in `globals.css` for design tokens. Glass-morphism via CSS custom properties (`--glass-bg`, `--glass-border`). Forest palette colors prefixed `forest-*`.
- **Fonts**: Cormorant Garamond loaded via `next/font/google`, injected as `--font-cormorant` CSS variable.
- **Testing**: Jest 30 + jsdom + React Testing Library. Tests live in `frontend/__tests__/`. Path alias `@/*` maps to frontend root.

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `AZURE_API_KEY` | Backend | Azure OpenAI API key |
| `AZURE_API_BASE` | Backend | Azure OpenAI endpoint |
| `AZURE_API_VERSION` | Backend | Azure API version |
| `NEXT_PUBLIC_API_URL` | Frontend `.env.local` | Backend URL (defaults to proxy in dev) |

## Deployment

Vercel hosts the frontend with **Root Directory** set to `frontend`. The backend is deployed separately. `vercel.json` at project root configures rewrites for the API.

## Conventions

When configuring MCP servers or other settings, always ask whether the user wants project-level or user-level configuration before proceeding.
