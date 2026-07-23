# AsterDex

A mobile-styled crypto perpetual futures trading UI — BTCUSDT order book, limit order form, dark/light theme toggle.

## Stack

- **TanStack Start** (SSR-ready React framework)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Bun** (package manager & runtime)
- Originally generated with [Lovable](https://lovable.dev)

## Running on Replit

The "Start application" workflow runs `bun run dev` and serves the app on port 5000.

```sh
bun install   # install dependencies
bun run dev   # start dev server at http://localhost:5000
```

## Project structure

```
src/
  routes/
    index.tsx       # Main trading UI (order book + order form)
    __root.tsx      # Root layout, QueryClient, error/404 pages
  start.ts          # TanStack Start entry + SSR error middleware
  server.ts         # SSR server entry
  styles.css        # Global Tailwind styles
  lib/              # Utilities
  components/ui/    # shadcn/ui component library
  hooks/            # use-mobile hook
vite.config.ts      # Vite config (via @lovable.dev/vite-tanstack-config)
```

## Notes

- All order book data is currently static/mock — no live WebSocket feed connected.
- No backend or external secrets required to run.
- The `vite.config.ts` sets `server.port = 5000` and `allowedHosts: true` so the Replit preview proxy works correctly.

## User preferences

<!-- Add any remembered preferences here -->
