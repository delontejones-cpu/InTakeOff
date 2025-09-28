# Gemini-Assisted Design & Code — Detailed Prompts & First Coding Steps

Use the following copy-paste prompts with Gemini. Replace `{…}` placeholders before running. After each generation, run the Acceptance Checklist.

## (A) Design Tokens & Components

### Prompt to Gemini
```
You are a senior design engineer. Create Tailwind design tokens and a shadcn/ui theme for an ABA intake app named "InTakeOff".

Constraints:
- High-contrast, WCAG 2.2 AA
- Brand adjectives: {friendly, professional, vivid}
- Primary color: {#0057FF}; Secondary: {#00B894}; Danger: {#E53935}

Generate: tokens.json (colors, spacing, radius, shadows, typography scale), Tailwind config snippet, and shadcn theme overrides for Button, Input, Card, Tooltip.

Provide code blocks and short notes on accessible color pairs.
Output accessible focus states and motion-reduced variants.
```

### Acceptance Checklist
- Color contrast ≥ 4.5:1 for body text, 3:1 for UI components
- Focus states visible on all interactive elements
- Tokens exported as JSON; tailwind config references them

## (B) Wireframes → React (Parent Portal & Staff Dashboard)

### Prompt to Gemini
```
Generate minimal, accessible React (Next.js) pages:

Parent Portal: /app/(parent)/intake/[caseId]/page.tsx
- Landmarks: header, main, footer. Include skip-link
- Components: Progress bar, Step list, FileUpload, MessageThread (stubs)

Staff Dashboard: /app/(staff)/dashboard/page.tsx
- Widgets: TaskList, NotificationCenter, Charts (stubs). Global filter bar

Use TypeScript, shadcn/ui, ARIA roles, and Tailwind. Include placeholders for data fetching with React Query. Provide file contents and any helper hooks.
```

### Acceptance Checklist
- Pages compile
- ARIA landmarks & skip links present
- Components imported from stubs with typed props

## (C) Widget Stubs (TaskList, NotificationCenter, Charts)

### Prompt to Gemini
```
Create three React components using TypeScript:

1. components/widgets/TaskList.tsx with inline edits (status/priority/notes), accepts tasks: Task[], emits onChange
2. components/widgets/NotificationCenter.tsx listing alerts: {New Intake, Stuck > X days} with dismiss and settings props
3. components/widgets/Charts.tsx using Recharts (Bar + Pie) with smart tooltips (count, %, example value). Click → onSliceClick(event)

Provide minimal dummy data and stories/examples.
```

### Acceptance Checklist
- Strictly typed props
- No external styles beyond Tailwind
- Recharts tooltips show count & percentage

## (D) Intake Stepper (Reusable)

### Prompt to Gemini
```
Build components/IntakeStepper.tsx + features/intake/types.ts:

Types: IntakeStepId, IntakeStatus = 'pending'|'in_progress'|'blocked'|'done', SLA = {days:number}

Props: steps: {id:IntakeStepId; title:string; sla:SLA}[], state: Record<IntakeStepId, IntakeStatus>, onAdvance(id)

Visuals: numbered steps, status badges, SLA timer (soft red when overdue)

Include __tests__/IntakeStepper.test.tsx (vitest + @testing-library/react)
```

### Acceptance Checklist
- Timer logic unit-tested
- Keyboard navigation: left/right through steps, Enter to advance
- High-contrast badges

## (E) PDF/OCR Pipeline (Server)

### Prompt to Gemini
```
In NestJS, create a documents module to process insurance PDFs stored in S3.

Endpoint: POST /v1/documents/:id/extract with body {s3Key:string}

Service flow: download from S3 → OCR (adapter interface) → map to JSON schema → return {entities, confidence, warnings[]}

Provide: TypeScript interfaces, Zod schema for output, error handling (timeouts, unreadable), and unit tests with mocked OCR.

Do not log PHI; show a log-redaction helper.
```

### Acceptance Checklist
- Zod schema validates output with confidence scores
- OCR adapter mocked in tests
- No PHI in logs

## (F) SAR Scaffold Prompt Pack

### Prompt to Gemini
```
Design an LLM prompt pack to generate a SAR scaffold.

Inputs: baseline behaviors, skills, insurance entities (memberId, plan, effective dates, prior auth requirements), and clinical notes.

Outputs: JSON matching SarDraftV1 with sections: PresentLevels, Goals[], Interventions[], SupervisionPlan, Citations[]

Requirements:
- Include payer-specific checklist mapping
- Return needsHumanReview: boolean with reasons[]
- Provide JSON Schema + Zod validators
- Provide example prompts and 2 sample outputs (commercial vs Medicaid)
- Add strict system prompt: no PHI in logs; cite policies when making requirements
```

### Acceptance Checklist
- JSON validates against Zod + JSON Schema
- needsHumanReview toggles when inputs are incomplete
- Policy citations included in sample outputs

## (G) Review & Harden

Manual checklist (run after each generation):
- Add/verify TypeScript types; enable `"strict": true`
- Wrap external calls with timeouts/retries; sanitize/log-redact
- a11y: tab order, ARIA labels, logical heading structure
- Unit tests updated; coverage threshold ≥80% for new modules
- Zod validators at all API boundaries

## First Detailed Coding Steps (Day 0–3)

### Day 0 — Repo & Tooling
```bash
mkdir intakeoff && cd intakeoff
pnpm dlx create-turbo@latest      # monorepo
# apps: web (Next.js), api (NestJS), packages: design-system, sdk
pnpm i -w typescript eslint prettier biome vitest @testing-library/react
pnpm i -w -D @types/node tsx
```
Set up CI (GitHub Actions) with workflows: lint, test, build, a11y.

### Day 1 — Web App Skeleton
```bash
cd apps/web
pnpm dlx create-next-app@latest . --ts --eslint --tailwind --no-src-dir
pnpm i @tanstack/react-query zustand recharts framer-motion zod
pnpm i -D @testing-library/jest-dom @testing-library/react vitest jsdom axe-core
# shadcn
pnpm dlx shadcn-ui@latest init -d
pnpm dlx shadcn-ui@latest add button input card tooltip dialog toast
```
Create packages/design-system/tokens.json (from Gemini) and wire Tailwind theme.

### Day 2 — API Skeleton
```bash
cd apps/api
pnpm dlx @nestjs/cli new api
pnpm i @nestjs/config @nestjs/typeorm typeorm pg zod @aws-sdk/client-s3
pnpm i -D vitest ts-node ts-jest
# generate modules
nest g module org && nest g module users && nest g module intake && nest g module documents && nest g module insurance
```
Implement base entities: Org, User, Case, Step, Document, Policy.

### Day 3 — Intake Core & Uploads
- Build `POST /v1/referrals`, `GET/PATCH /v1/intakes/:id`
- Implement S3 signed upload route and file AV scan webhook (stub)
- Create `components/IntakeStepper.tsx` (from Gemini) and Parent Portal page
- Write vitest tests for stepper timer and docs upload flow

**Milestone**: end of Day 3 → parent flow renders with stubbed data; cases create via API; file upload UI present.
