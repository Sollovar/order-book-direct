# AsterDex

An on-chain perpetuals exchange UI built with TanStack Start, React 19, TypeScript, and Tailwind CSS v4.

## Stack

- **Framework**: TanStack Start (SSR) + Vite
- **UI**: React 19, Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS v4
- **Package manager**: Bun

## Running the app

```sh
bun install
bun run dev
```

The dev server starts on port 5000. The configured Replit workflow (`Start application`) handles this automatically.

## Project structure

- `src/routes/` — file-based routes (TanStack Router)
  - `index.tsx` — landing page
  - `trade.tsx` — trade/exchange view
- `src/components/` — app-specific components (chart overlay, pair selector, notifications, settings)
- `src/components/ui/` — shadcn/ui component library
- `vite.config.ts` — Vite config (via `@lovable.dev/vite-tanstack-config`)

## Notes

- This project was originally built with [Lovable](https://lovable.dev). Avoid force-pushing or rebasing published commits — history is synced with Lovable.
- The `@lovable.dev/vite-tanstack-config` package bundles TanStack devtools, TailwindCSS, tsconfig paths, and nitro — do not add these plugins manually.

## User preferences
