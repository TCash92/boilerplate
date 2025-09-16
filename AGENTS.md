# Repository Guidelines

## Project Structure & Module Organization
The Vite + React + TypeScript app lives in `src/`; the runtime boots from `main.tsx` and renders the root `App.tsx`. Component styles stay alongside logic in `.css` files. Co-locate UI tests such as `App.test.tsx` with the component they cover. Static assets (favicons, manifest, mock data) belong in `public/`. Tooling sits at the root: `vite.config.ts` defines bundler behavior, `tsconfig*.json` capture compiler options, `.eslintrc.cjs` codifies lint rules, `vitest.setup.ts` wires testing utilities, and `mcp/` hosts the TypeScript↔ESLint compatibility helper.

## Build, Test, and Development Commands
Run `npm install` after cloning. Use `npm run dev` for the hot-reloading dev server. `npm run build` performs a TypeScript project build (`tsc -b`) and emits the production bundle to `dist/`. Validate that output with `npm run preview`. Quality checks: `npm run lint` for ESLint, `npm run test` for a single Vitest pass, `npm run test:watch` during feature work, `npm run format` to ensure Prettier compliance, and `npm run format:write` to apply fixes.

## Coding Style & Naming Conventions
Prettier (see `.prettierrc`) enforces two-space indentation, single quotes, and trailing commas; lint and format before pushing. Favor typed React function components, colocated module-scoped CSS, and explicit exports. Name components in PascalCase (`UserMenu.tsx`), hooks in camelCase prefixed with `use`, and test files `<Component>.test.tsx`. Avoid lint warnings—treat them as build blockers.

## Testing Guidelines
Vitest with React Testing Library is the canonical stack. Cover user-facing behavior with describe/it blocks and screen queries. Place tests beside the implementation to keep refactors honest. Run `npm run test` before commits; add coverage snapshots with `npm run test -- --coverage` when proving riskier changes.

## Commit & Pull Request Guidelines
Follow the Conventional Commit style (`feat: add login card`, `chore: bump deps`). Keep messages imperative and scoped to a single logical change. Every PR should summarize behavior changes, link related issues, paste `lint`/`test` results, and include screenshots or GIFs for UI tweaks. Confirm `npm run build` succeeds prior to requesting review.

## Agent & Tooling Notes
When TypeScript or `@typescript-eslint` upgrades are proposed, run the MCP server at `node mcp/ts-eslint-compat-server.mjs` to confirm compatibility. Capture the server’s recommendation in the PR description and rerun `npm run lint` afterward to ensure the warning surface stays clean.
