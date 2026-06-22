# Aria — AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate everyday workplace tasks using AI. Built with [TanStack Start](https://tanstack.com/start), [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com), and the [Lovable AI Gateway](https://docs.lovable.dev/ai/ai-gateway).

## Features

- **Smart Email Generator** — Draft professional emails from tone, context, and key points. Edit the AI output inline before copying or sending.
- **Meeting Notes Summarizer** — Paste raw meeting notes and get structured summaries with action items, decisions, and owners.
- **AI Task Planner** — Turn goals or project descriptions into prioritized, time-boxed task plans.
- **AI Research Assistant** — Generate concise research briefs with sources, pros/cons, and follow-up questions on any topic.
- **AI Chatbot Interface** — Persistent general-purpose AI chat with streaming responses and local conversation history.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start v1 (full-stack React 19) |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 + shadcn/ui components |
| State / Data | TanStack Query |
| AI SDK | `ai` + `@ai-sdk/openai-compatible` |
| Backend | Lovable AI Gateway (`google/gemini-3-flash-preview`) |
| Storage | `localStorage` for chat history |
| Language | TypeScript 5.8 (strict mode) |

## Project Structure

```text
src/
├── components/
│   ├── AiOutput.tsx              # Reusable AI output card with preview / edit toggle
│   ├── AppShell.tsx               # Page layout wrapper with sidebar and disclaimer footer
│   ├── AppSidebar.tsx             # Navigation sidebar
│   ├── ai-elements/               # Chat UI primitives
│   │   ├── conversation.tsx
│   │   ├── message.tsx
│   │   ├── prompt-input.tsx
│   │   └── shimmer.tsx
│   └── ui/                        # shadcn/ui component library
├── lib/
│   ├── ai-gateway.server.ts       # Lovable AI Gateway client configuration
│   ├── ai.functions.ts            # Server functions for email, meetings, tasks, research
│   └── utils.ts                   # Tailwind / clsx helpers
├── routes/
│   ├── __root.tsx                 # Root layout (head, providers, shell)
│   ├── index.tsx                  # Dashboard
│   ├── chat.tsx                   # Persistent AI chat
│   ├── email.tsx                  # Smart Email Generator
│   ├── meetings.tsx               # Meeting Notes Summarizer
│   ├── tasks.tsx                  # AI Task Planner
│   ├── research.tsx               # AI Research Assistant
│   └── api/chat.ts                # Streaming chat endpoint
├── router.tsx                     # TanStack Router setup
├── server.ts                      # Server entry
├── start.ts                       # App config / middleware
└── styles.css                     # Tailwind v4 theme tokens
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+

### Install Dependencies

```bash
bun install
```

### Run the Development Server

```bash
bun dev
```

Open [http://localhost:8080](http://localhost:8080) to view the app.

### Build for Production

```bash
bun run build
```

Preview the production build:

```bash
bun run preview
```

## Environment Variables

The Lovable AI Gateway and app run out of the box in Lovable Cloud. If you run the project outside of Lovable, you may need to configure:

```text
LOVABLE_API_KEY=your-lovable-ai-gateway-key
```

See the [Lovable AI Gateway docs](https://docs.lovable.dev/ai/ai-gateway) for details.

## Available Scripts

| Script | Description |
| --- | --- |
| `bun dev` | Start the Vite development server |
| `bun run build` | Build for production |
| `bun run build:dev` | Build for development / preview |
| `bun run preview` | Preview the production build |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |

## Key Design Decisions

- **File-based routing** — Every route under `src/routes/` becomes a URL automatically via TanStack Router.
- **Server functions** — AI generation lives in `createServerFn` handlers (`src/lib/ai.functions.ts`) so prompts and API keys never reach the browser.
- **Streaming chat** — The chat UI streams tokens from a dedicated API route (`src/routes/api/chat.ts`) for a fast, responsive feel.
- **Editable AI outputs** — Every AI result can be toggled between Markdown preview and raw edit mode, so users stay in control.
- **Responsible AI disclaimer** — A footer notice appears on every page reminding users to review AI-generated content.
- **Responsive design** — The sidebar collapses on mobile and the layout adapts to small viewports.

## Customization

### Changing the AI Model

Edit `src/lib/ai-gateway.server.ts`:

```ts
export const model = customProvider("google/gemini-3-flash-preview");
```

Replace the model string with any model supported by the Lovable AI Gateway.

### Adding a New Tool

1. Add a server function in `src/lib/ai.functions.ts`.
2. Create a route file in `src/routes/` (e.g., `my-tool.tsx`).
3. Add the tool card to the dashboard in `src/routes/index.tsx`.
4. Add a navigation item in `src/components/AppSidebar.tsx`.

## Responsible AI

AI-generated content is a starting point, not a final deliverable. Always review, edit, and verify outputs for accuracy, tone, and appropriateness before using them in professional contexts.

## License

MIT — built with Lovable.
