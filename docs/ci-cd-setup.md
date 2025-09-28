# Tooling Choices & CI/CD Implementation Details

## Languages, Runtimes, Package Manager

- **Frontend**: TypeScript + React (Next.js 14, App Router), Node.js 20.x
- **Backend**: TypeScript + NestJS (Node.js 20.x)
- **Infra Scripts**: Bash + YAML (Helm/Terraform not shown here)
- **Package Manager**: pnpm (Turborepo workspace)

## Testing & Quality

- **Unit/Component**: Vitest + @testing-library/react
- **API/Integration**: Vitest + supertest (NestJS)
- **E2E UI**: Playwright (Chromium; optional Firefox/WebKit)
- **Accessibility**: @axe-core/playwright (in Playwright tests) + manual checks
- **Static Analysis**: ESLint (React/TS rules) + TypeScript strict
- **Formatter**: Biome (formatter + simple lint) or Prettier (choose one). Below uses Biome.
- **Commit Hooks**: Husky + lint-staged
- **Coverage**: c8 (built into Vitest) → upload as artifact

## Linting/Formatting Config

### /biome.json
```json
{
  "$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
  "formatter": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "javascript": { "formatter": { "semicolons": "asNeeded" } }
}
```

### /.eslintrc.cjs
```javascript
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  settings: { react: { version: "detect" } },
  ignorePatterns: ["dist", "build", "node_modules", "generated"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/react-in-jsx-scope": "off"
  }
};
```

### /.editorconfig
```ini
root = true
[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
```

### /package.json (workspace scripts excerpt)
```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "biome check . && eslint . --max-warnings=0",
    "format": "biome format --write .",
    "test": "turbo run test",
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "typecheck": "tsc -b",
    "prepare": "husky install"
  }
}
```

### /.husky/pre-commit
```bash
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"
pnpm lint-staged
```

### /lint-staged.config.js
```javascript
export default {
  "**/*.{ts,tsx,js,jsx}": ["biome check --apply ", "eslint --fix"],
  "**/*.{json,md,css}": ["biome format --write"]
};
```

## GitHub Actions — CI/CD Workflows

Save these under `.github/workflows/`. They assume pnpm and a Turborepo.

### 1) ci.yml — Lint, Typecheck, Build
```yaml
name: CI
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Lint & Format
        run: pnpm lint
      - name: Typecheck
        run: pnpm typecheck
      - name: Build
        run: pnpm build
      - name: Upload build artifacts
        if: ${{ failure() }}
        uses: actions/upload-artifact@v4
        with:
          name: build-logs
          path: |
            apps/**/dist
            apps/**/.next
```

### 2) test.yml — Unit & Integration Tests (with coverage)
```yaml
name: Tests
on:
  pull_request:
  workflow_dispatch:
jobs:
  vitest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Run unit/integration tests
        run: pnpm test:unit -- --coverage
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage
```

### 3) e2e.yml — Playwright E2E + Axe a11y
```yaml
name: E2E
on:
  pull_request:
  workflow_dispatch:
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps chromium
      - name: Start web app
        run: |
          pnpm -C apps/web build
          pnpm -C apps/web start &
          npx wait-on http://localhost:3000
      - name: Run E2E
        env:
          BASE_URL: http://localhost:3000
        run: pnpm e2e
```

### 4) security.yml — Code Scanning (CodeQL)
```yaml
name: CodeQL
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '30 1 * * 2'
jobs:
  analyze:
    permissions:
      actions: read
      contents: read
      security-events: write
    uses: github/codeql-action/.github/workflows/codeql.yml@v3
    with:
      languages: javascript-typescript
```

### 5) container-release.yml — Docker Build, SBOM, Sign, Push
```yaml
name: Release Containers
on:
  push:
    tags:
      - 'v*.*.*'
jobs:
  build-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build API image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/api/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}/api:${{ github.ref_name }}
      - name: Build Web image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/web/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}/web:${{ github.ref_name }}
      - name: Generate SBOM
        uses: anchore/sbom-action@v0
        with:
          artifact-name: sbom-${{ github.ref_name }}.spdx.json
      - name: Sign images (cosign)
        uses: sigstore/cosign-installer@v3
      - run: cosign sign ghcr.io/${{ github.repository }}/api:${{ github.ref_name }} --yes
      - run: cosign sign ghcr.io/${{ github.repository }}/web:${{ github.ref_name }} --yes
```

### 6) sdk-publish.yml — Publish TypeScript SDK to npm
```yaml
name: Publish SDK
on:
  workflow_dispatch:
  push:
    tags:
      - 'sdk-v*.*.*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm -C packages/sdk build
      - run: pnpm -C packages/sdk publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Dockerfiles (examples)

### apps/api/Dockerfile
```dockerfile
FROM node:20-alpine as base
WORKDIR /app
COPY . .
RUN corepack enable && pnpm i -w --frozen-lockfile && pnpm -C apps/api build
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/package.json ./
RUN corepack enable && pnpm i --prod
CMD ["node", "dist/main.js"]
```

### apps/web/Dockerfile
```dockerfile
FROM node:20-alpine as deps
WORKDIR /app
COPY . .
RUN corepack enable && pnpm i -w --frozen-lockfile

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app .
RUN pnpm -C apps/web build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next ./.next
COPY apps/web/package.json ./
RUN corepack enable && pnpm i --prod
EXPOSE 3000
CMD ["pnpm", "start", "-C", "apps/web"]
```

## Playwright Config Snippet

### /playwright.config.ts
```typescript
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3000' },
  reporter: [['list'], ['html', { open: 'never' }]],
});
```

## How to use this:

1. Commit these configs, set secrets (NPM_TOKEN, AWS/S3, etc.)
2. Open a PR—CI will lint, typecheck, build, test, and run E2E
3. Tag releases to auto-publish containers and (optionally) the SDK
