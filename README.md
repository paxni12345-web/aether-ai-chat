# Aether — Premium AI Chat Interface

Modern AI chat UI built with React, TypeScript, and Tailwind CSS.

## Live demo

**https://paxni12345-web.github.io/aether-ai-chat/**

(After GitHub Pages is enabled and the deploy workflow finishes.)

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build static site

```bash
npm install
npm run build
```

Output is in `dist/` — ready for any static host (GitHub Pages, Netlify, Vercel, etc.).

## Tech stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide icons
- localStorage persistence
- Demo streaming responses (no external AI API)

## Deploy (GitHub Pages)

This repo includes `.github/workflows/deploy.yml`.

1. Repo → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Push to `main` (or run the workflow manually)

Site URL: `https://paxni12345-web.github.io/aether-ai-chat/`

## License

MIT
