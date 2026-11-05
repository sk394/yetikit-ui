# YetiKit UI

A personal [shadcn](https://ui.shadcn.com) component registry, built on the **Base UI** primitives and
Tailwind CSS v4, with a docs site that shows every component live at **desktop, tablet and mobile** widths.

- **Registry**: `registry.json` at the repo root makes this a shadcn registry. Any item can be installed with
  `pnpm dlx shadcn@latest add sk394/yetikit-ui/<name>` (public GitHub repos need no build or hosting).
- **Docs**: [Fumadocs](https://fumadocs.dev) with MDX pages, search (`⌘K`), dark mode, `llms.txt`.
- **Demos**: each demo renders in an iframe with desktop / tablet / mobile toggles and a Code tab.
- **Gallery**: the home page lists every component with search and category filters.

## Getting started

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. Docs live at `/docs`, each demo also at `/preview/<demo-name>`.

## Add a component

```bash
pnpm new:component fancy-tabs --title "Fancy Tabs" --description "Tabs with an animated indicator." --category navigation,advanced
```

That creates the component, a demo, a docs page and a `registry.json` entry:

```
registry/ui/fancy-tabs.tsx              ← the component
registry/examples/fancy-tabs-demo.tsx   ← demo (default export), shown in docs + /preview
content/docs/components/fancy-tabs.mdx  ← docs page
registry.json                           ← item added
```

Then build it, run `pnpm dev`, and visit `/docs/components/fancy-tabs`.
Full recipe: `content/docs/adding-components.mdx` (also rendered at `/docs/adding-components`).

## Project layout

```
app/
  (home)/              landing page + searchable component gallery
  docs/                Fumadocs layout and [[...slug]] page
  preview/[name]/      bare page that renders one demo (used by the iframe previewer)
  api/search/          docs search endpoint
components/
  component-preview*.tsx   iframe previewer with viewport toggles + code tab
  component-install.tsx    install commands (GitHub registry + hosted URL + manual)
  component-source.tsx     highlighted source of a registry file
  registry-gallery.tsx     home page search / filter grid
  mdx.tsx                  MDX components available in docs
  ui/                      the site's own shadcn (Base UI) components
registry/
  ui/                  YOUR components (one file each)
  examples/            demos
  __index__.tsx        generated: demo name → lazy component (client module)
  __names__.ts         generated: list of demo names
registry.json          the shadcn registry manifest
content/docs/          MDX documentation
scripts/
  build-registry.mts   validates registry.json, generates the index, runs `shadcn build`
  new-component.mts    scaffolds a new component + demo + docs page
```

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Regenerates the demo index, then starts Next.js. |
| `pnpm build` | `registry:build` then `next build`. |
| `pnpm registry:build` | Validates `registry.json`, regenerates `registry/__index__.tsx`, writes `public/r/*.json`. |
| `pnpm registry:index` | Only regenerates the demo index (fast). |
| `pnpm new:component <name>` | Scaffolds a component, demo, docs page and manifest entry. |
| `pnpm typecheck` / `pnpm lint` | TypeScript and ESLint. |

## Installing components elsewhere

```bash
# from GitHub (works as soon as the file is on main)
pnpm dlx shadcn@latest add sk394/yetikit-ui/data-table

# from the deployed site
pnpm dlx shadcn@latest add https://<your-domain>/r/data-table.json
```

Consumers should have a project initialised with `pnpm dlx shadcn@latest init --base base` (Base UI).

## Deploying

It is a standard Next.js app. On Vercel or similar, set `NEXT_PUBLIC_SITE_URL` to the deployed origin so the
"hosted registry" install commands in the docs point at the right domain.

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · shadcn CLI 4 (Base UI, `base-nova` preset) · Fumadocs 16 (`@fumadocs/base-ui`) · Shiki
