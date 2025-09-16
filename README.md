# React + TypeScript Boilerplate

This project provides a ready-to-use React application scaffolded with Vite and TypeScript. It includes linting, formatting, and testing tooling so you can focus on building features immediately.

## Scripts

- `npm run dev` – start the Vite dev server.
- `npm run build` – type-check and create a production build in `dist/`.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint on TypeScript and TSX files.
- `npm run test` – run the Vitest test suite once.
- `npm run test:watch` – run tests in watch mode.
- `npm run format` – check formatting with Prettier.
- `npm run format:write` – format files with Prettier.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Run tests when needed:

   ```bash
   npm run test
   ```

Adjust configuration in `vite.config.ts`, `tsconfig.json`, or `.eslintrc.cjs` as required for your project.

## Deployment

- Run `npm run build` and deploy the generated `dist/` folder to a static host such as Vercel, Netlify, or GitHub Pages.
- Preview locally with `npm run preview` to ensure environment variables and routing behave as expected before pushing to production.
- Automate deployment by wiring your provider to build on `main` using `npm ci && npm run build`.

## Environment Variables

- Define runtime configuration in `.env`, `.env.local`, or environment-specific files; Vite only exposes variables prefixed with `VITE_`.
- Example: `VITE_API_URL=https://api.example.com` becomes `import.meta.env.VITE_API_URL` inside TypeScript modules.
- Never commit secrets—add `.env*` to your ignore rules and provide samples via `.env.example` if needed.

## Continuous Integration

- Every commit and PR should, at minimum, run `npm run lint`, `npm run test`, and `npm run build` to guard against regressions.
- GitHub Actions starter: use `actions/setup-node` with Node 20, cache npm, then execute `npm ci` followed by the commands above; upload `dist/` if you want preview artifacts.
- Block merges until the pipeline passes and reviewers have confirmed screenshots or coverage updates for UI-heavy changes.

## Security Notice

- **esbuild advisory GHSA-67mh-4wv8-2f99** – The current toolchain uses Vite 5, which depends on `esbuild@0.21.x`. That version allows any website opened in a local browser to coerce the Vite dev server into proxying arbitrary requests while the server is running. This affects development environments only.
- **Mitigation plan** – Upgrading to Vite 7 (which pulls in a patched esbuild) resolves the issue but is a breaking change. We will revisit the upgrade once it is less disruptive. In the meantime, avoid exposing the dev server to untrusted networks or browsing untrusted sites while it is running.
