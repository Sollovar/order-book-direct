# AsterDex

A perpetuals (perps) DEX landing page built with TanStack Start, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui components. Originally created in Lovable.

## How to run

```sh
bun install
bun run dev
```

The dev server starts on port 5000. On Replit, the **Start application** workflow handles this automatically.

## Stack

- **TanStack Start** — SSR-capable React meta-framework
- **TanStack Router** — file-based routing (`src/routes/`)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **shadcn/ui** (Radix UI primitives) in `src/components/ui/`
- **Vite** for bundling (`vite.config.ts` via `@lovable.dev/vite-tanstack-config`)
- **Bun** as the runtime/package manager on Replit

## Project structure

```
src/
  routes/         # File-based TanStack Router pages
    __root.tsx    # Root layout
    index.tsx     # Landing page (/)
    trade.tsx     # Trade page (/trade)
  components/     # Shared components (ui/, feature components)
  lib/            # Utilities
  styles.css      # Global styles (Tailwind)
  router.tsx      # Router setup
  server.ts       # SSR server entry
  start.ts        # App entry point
```

## User preferences

- Keep existing file structure and stack unless asked to change it.
