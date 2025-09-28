# Build Plan & Timeline — Coding Order, Files, and Testing Closeout

**Goal**: Ship a HIPAA-ready MVP in ~10–12 weeks with a clear order of implementation, explicit file scaffolding, and a safe "code freeze → pilot" testing plan.

## Development Principles

- Security & data model first, UI second
- Small vertical slices (DB→API→UI) per feature
- Everything behind feature flags; ship hidden, enable in staging
- Gemini-assisted design/code generation with human review

## Timeline Overview

- **Week 0 (Prep)**: Repo, environments, CI/CD, design tokens
- **Weeks 1–2**: Auth, Org/Tenant model, Documents upload
- **Weeks 3–4**: Intake steps engine + Parent Portal (Referrals → Docs)
- **Weeks 5–6**: Messaging/Notifications + Scheduling availability map
- **Weeks 7–8**: Insurance verification stubs + AI extraction (PDF OCR) + SAR scaffold
- **Week 9**: Accessibility polish, analytics widgets, exports
- **Weeks 10–11**: Code freeze, staging hardening, beta pilot enablement
- **Week 12**: Bugfix release, pilot retrospective, go/no-go

## Coding Order (What to Build First)

### Foundations
- Multi-tenant RBAC, Org/Users, Audit log, Settings
- File storage (S3) with signed URLs & AV scan
- Email/SMS provider wiring (SES/Twilio) with templating

### Intake Core
- Referral Questionnaire (public link) → case create
- Stepper engine (configurable steps, statuses, SLA timers)
- Document capture (Parent Handbook ack, IEP/504, Rx, IDs)

### Parent & Staff UX
- Parent Portal (mobile-first) with progress tracker
- Staff Dashboard: Task List, Notification Center, Charts

### Communications
- Two-way secure messaging threads + templated emails
- Waitlist management + automated outreach cadence

### Scheduling & Ops
- Staff availability model; client ↔ staff matching suggestions

### Insurance & AI (MVP)
- Payer profile schema; manual verify workflow
- PDF OCR → entity extraction (member ID, dates) → human review
- SAR scaffold generator (prompt-based) with checklist

### Analytics & Exports
- Funnel, waitlist, SLA; CSV/XLSX/PDF exports respecting filters

### A11y & Hardening
- WCAG AA checks, keyboard nav, high-contrast audit

## Frontend File Scaffolding (Next.js + TypeScript)

```
/apps/web/
  app/
    layout.tsx
    page.tsx
    (auth)/signin/page.tsx
    (parent)/intake/[caseId]/page.tsx
    (staff)/dashboard/page.tsx
    api/route-handlers.md            # docs only (no code)
  components/
    ui/*                             # shadcn components
    widgets/TaskList.tsx
    widgets/NotificationCenter.tsx
    widgets/Charts.tsx
    IntakeStepper.tsx
    FileUpload.tsx
    MessageThread.tsx
  features/
    intake/
      hooks.ts
      api.ts                         # SDK calls
      types.ts
    insurance/
      PdfDropzone.tsx
      SarScaffold.tsx
    messaging/
      templates.ts
  lib/
    api/client.ts                    # fetch wrapper (React Query)
    auth.ts                          # OIDC helpers
    featureFlags.ts
    analytics.ts
  stores/
    filters.ts
    widgets.ts
  styles/
    globals.css
  env.d.ts
```

## Backend File Scaffolding (NestJS example)

```
/apps/api/
  src/
    main.ts
    app.module.ts
    modules/
      auth/
        auth.module.ts
        auth.controller.ts
        auth.service.ts
      org/
        org.module.ts
        org.controller.ts
        org.service.ts
        entities/org.entity.ts
      users/
        users.module.ts
        users.controller.ts
        users.service.ts
      intake/
        intake.module.ts
        intake.controller.ts
        intake.service.ts
        entities/{case,step,task}.entity.ts
      documents/
        documents.module.ts
        documents.controller.ts
        documents.service.ts
      insurance/
        insurance.module.ts
        insurance.controller.ts
        insurance.service.ts
        entities/{payer,policy,sar}.entity.ts
      messaging/
        messaging.module.ts
        messaging.controller.ts
        messaging.service.ts
      scheduling/
        scheduling.module.ts
        scheduling.controller.ts
        scheduling.service.ts
      analytics/
        analytics.module.ts
        analytics.controller.ts
        analytics.service.ts
    common/
      guards/roles.guard.ts
      interceptors/audit.interceptor.ts
      dto/*.ts
    config/
      env.ts
      ormconfig.ts
```

## API Endpoints (MVP)

- `POST /v1/referrals` → create case from questionnaire
- `GET /v1/intakes/:id` `PATCH /v1/intakes/:id` `GET /v1/intakes?status=`
- `POST /v1/steps/:id/complete` `POST /v1/tasks`
- `POST /v1/documents` (signed URL) → `POST /v1/documents/:id/extract`
- `POST /v1/messages` (send) `GET /v1/messages?caseId=`
- `POST /v1/availability` `POST /v1/schedule/match`
- `POST /v1/insurance/verify` (stub) `POST /v1/sar/scaffold`
- `GET /v1/analytics/funnel` `GET /v1/analytics/waitlist`

## Environment & Secrets

```bash
# web
NEXT_PUBLIC_API_URL=
NEXTAUTH_URL=
OIDC_CLIENT_ID=
OIDC_CLIENT_SECRET=

# api
DATABASE_URL=postgres://
REDIS_URL=redis://
S3_BUCKET=
S3_REGION=
S3_KEY=
S3_SECRET=
EMAIL_PROVIDER=SES
SMS_PROVIDER=TWILIO
OCR_PROVIDER=GOOGLE_VISION|AWS_TEXTRACT
LLM_PROVIDER=GOOGLE_GEMINI|OPENAI|ANTHROPIC
```

## Testing Strategy & "Close the App" for Pilot

### Test Pyramid
- **Unit**: business logic, utils, prompt formatters
- **Integration**: API ⇄ DB, file uploads, OCR webhook
- **E2E**: Playwright flows (Referral→First Day), a11y checks (axe)

### Week 10–11: Code Freeze & Staging
- Freeze to bugfix-only; tag release/pilot
- Deploy to staging with production-like data; run security scans (SAST/DAST), dependency audit, SBOM
- Seed scripts: create demo org, staff, 10 mock cases with varied states
- Data validation: PHI masking, least-privilege roles, audit log review
- UAT scripts: checklists for HR, BCBA, Parent personas
- Incident runbooks: on-call escalation, breach protocol, RTO/RPO drill

### Week 12: Pilot Start
- Enable features via flags for pilot org(s)
- Daily triage; crash/error dashboards; log PHI scrubbing verified
- Collect metrics: cycle time, denial pre-checks, parent CSAT

## Exit Criteria for MVP

- 3+ clinics complete full intake flows in staging
- ≥90% task success rate in UAT; no Sev-1 issues
- Accessibility audit: WCAG AA pass
- Data exports & audit logs verified by compliance
- Insurance PDF → SAR scaffold works with human review
