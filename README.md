# Count By

React single-page app: skip-counting practice UI, built with Vite and deployed to GitHub Pages.

**Live:** https://content-interactives.github.io/count_by/

**Curriculum and standards:** [Standards.md](Standards.md)

## Stack

- React 19, Vite 7, JavaScript (JSX)
- Tailwind CSS 3, PostCSS, ESLint
- `canvas-confetti` for feedback animations

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run deploy` | `predeploy` build + `gh-pages -d dist` |

## Configuration

`vite.config.js` sets `base: '/count_by/'` so asset URLs resolve correctly on GitHub Pages under the repository path.

## Layout

Entry: `src/main.jsx` → `App.jsx` and feature components under `src/`. Shared UI may live under `src/components/`.
