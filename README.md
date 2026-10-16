# Aether — Premium AI Chat Interface

A modern, polished AI chat web application built with React, TypeScript, and Tailwind CSS.

## Features

- **Full conversation management** — create, rename, delete, search
- **Persistent history** — localStorage restores chats after refresh
- **Streaming demo responses** — realistic typing simulation
- **Responsive design** — desktop sidebar, mobile drawer
- **Accessibility** — keyboard navigation, focus rings, ARIA labels
- **Ready for real AI** — clean service layer for API integration

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide icons
- uuid

## Demo mode

No external AI API is connected. Responses are generated locally by `src/services/aiService.ts`.

To connect a real model, replace `generateDemoResponse` with your preferred provider (OpenAI, Anthropic, etc.).

## Project structure

```
src/
  components/   # UI components
  hooks/        # useChat state management
  services/     # AI service (demo + future API)
  lib/          # storage, utils
  types/        # TypeScript types
```

## License

MIT
