# InTakeOff System Architecture & Technical Specifications

## System Overview

InTakeOff is a HIPAA-compliant SaaS platform designed to streamline the intake process for ABA therapy clinics, with expansion potential across multiple therapeutic disciplines. The system reduces intake delays from 4-6 weeks to under 2 weeks while improving insurance claim accuracy and reducing denials.

## Architecture Principles

- **Security First**: HIPAA compliance, PHI protection, audit logging
- **Multi-Tenant**: Organization-based data isolation
- **API-First**: Decoupled frontend/backend for flexibility
- **Event-Driven**: Async processing for file uploads, notifications, AI processing
- **Feature Flag Driven**: Safe deployment and gradual rollout

## Technology Stack

### Frontend Applications
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Testing**: Vitest + Testing Library + Playwright

### Backend API
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Cache**: Redis
- **Queue**: Bull/BullMQ
- **File Storage**: AWS S3
- **Testing**: Vitest + Supertest

### Infrastructure
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **CI/CD**: GitHub Actions
- **Containers**: Docker
- **Cloud**: AWS (or cloud-agnostic)

## Core Modules

### 1. Authentication & Authorization
- **Multi-tenant RBAC** (Organization → Users → Roles → Permissions)
- **SSO Integration** (OIDC/SAML for enterprise clients)
- **Audit Logging** (all PHI access tracked)

### 2. Intake Management
- **Configurable Workflow Engine** (steps, statuses, SLA timers)
- **Document Collection** (Parent Handbook, IEP/504, Prescriptions, IDs)
- **Progress Tracking** (visual stepper, notifications)

### 3. Parent Portal
- **Mobile-First Design**
- **Real-Time Updates** (WebSocket notifications)
- **Secure Messaging** (two-way communication with staff)
- **Document Upload** (drag-drop, mobile camera)

### 4. Staff Dashboard
- **Task Management** (priority queues, SLA monitoring)
- **Case Overview** (intake progress, bottlenecks)
- **Communication Hub** (messages, alerts, notifications)
- **Analytics Widgets** (funnel metrics, waitlist insights)

### 5. Insurance Integration
- **Eligibility Verification** (real-time API calls)
- **PDF Document Processing** (OCR → structured data)
- **Prior Authorization Tracking**
- **Denial Risk Assessment** (AI-powered)

### 6. AI & Automation
- **SAR Scaffold Generation** (LLM-powered treatment plans)
- **Document Entity Extraction** (OCR + NLP)
- **Predictive Analytics** (waitlist conversion, denial risk)
- **Automated Notifications** (SLA alerts, status updates)

## Data Models

### Core Entities

```typescript
// Organization (Tenant)
interface Organization {
  id: string;
  name: string;
  settings: OrgSettings;
  createdAt: Date;
  updatedAt: Date;
}

// User Management
interface User {
  id: string;
  orgId: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  lastLoginAt?: Date;
}

// Intake Case
interface IntakeCase {
  id: string;
  orgId: string;
  clientName: string;
  parentContactId: string;
  currentStepId: string;
  status: IntakeStatus;
  priority: Priority;
  createdAt: Date;
  targetCompletionDate: Date;
  steps: IntakeStep[];
  documents: Document[];
  messages: Message[];
}

// Configurable Steps
interface IntakeStep {
  id: string;
  caseId: string;
  stepDefinitionId: string;
  status: StepStatus;
  assignedToId?: string;
  startedAt?: Date;
  completedAt?: Date;
  blockedReason?: string;
  slaHours: number;
}

// Document Management
interface Document {
  id: string;
  caseId: string;
  type: DocumentType;
  filename: string;
  s3Key: string;
  uploadedById: string;
  uploadedAt: Date;
  extractedData?: any;
  verificationStatus: VerificationStatus;
}

// Insurance Data
interface InsurancePolicy {
  id: string;
  caseId: string;
  payerName: string;
  memberId: string;
  groupNumber?: string;
  effectiveDate: Date;
  eligibilityVerifiedAt?: Date;
  priorAuthRequired: boolean;
  priorAuthNumber?: string;
}
```

## Security & Compliance

### HIPAA Compliance
- **PHI Encryption**: At rest (AES-256) and in transit (TLS 1.3)
- **Access Controls**: Role-based permissions, principle of least privilege
- **Audit Logging**: All PHI access logged with user, timestamp, action
- **Data Retention**: Configurable retention policies per organization
- **Breach Detection**: Automated alerts for unusual access patterns

### Authentication Security
- **Password Policy**: Minimum complexity requirements
- **MFA Support**: TOTP, SMS, hardware keys
- **Session Management**: Secure tokens, automatic timeout
- **SSO Integration**: Enterprise OIDC/SAML providers

### Data Protection
- **Database Encryption**: Transparent data encryption (TDE)
- **Backup Encryption**: Encrypted backups with separate key management
- **Log Sanitization**: PHI automatically redacted from application logs
- **Network Security**: VPC isolation, WAF protection

## Integration Capabilities

### EHR/Practice Management
- **Motivity Integration** (primary target)
- **Generic API Connectors** (REST/SOAP adapters)
- **Data Sync** (bidirectional patient data flow)

### Insurance Systems
- **Eligibility APIs** (Change Healthcare, Availity)
- **Prior Auth Systems** (payer-specific integrations)
- **Claims Submission** (X12 EDI integration)

### Communication Platforms
- **Email**: AWS SES, SendGrid
- **SMS**: Twilio, AWS SNS
- **Push Notifications**: FCM, APNs
- **Video Conferencing**: Zoom, Teams integration

## Scalability & Performance

### Database Design
- **Partitioning**: Time-based partitioning for large tables
- **Indexing**: Optimized indexes for common queries
- **Connection Pooling**: PgBouncer for connection management
- **Read Replicas**: Separate read/write workloads

### Caching Strategy
- **Application Cache**: Redis for session, configuration data
- **Query Cache**: Database query result caching
- **CDN**: Static asset delivery via CloudFront
- **API Cache**: Response caching for expensive operations

### Monitoring & Observability
- **APM**: Application Performance Monitoring
- **Logging**: Structured logging with correlation IDs
- **Metrics**: Custom business metrics and SLA tracking
- **Alerting**: PagerDuty integration for critical issues

## Deployment Architecture

### Development Environment
- **Local Development**: Docker Compose stack
- **Feature Branches**: Automatic preview deployments
- **Testing**: Automated test suite on every PR

### Staging Environment
- **Production-like**: Mirrors production configuration
- **Data Seeding**: Synthetic test data for UAT
- **Security Scanning**: SAST/DAST before production

### Production Environment
- **High Availability**: Multi-AZ deployment
- **Auto Scaling**: Container orchestration (ECS/EKS)
- **Disaster Recovery**: Cross-region backup and failover
- **Zero-Downtime Deployments**: Blue/green deployment strategy

## Business Intelligence & Analytics

### Operational Metrics
- **Intake Funnel**: Conversion rates at each step
- **SLA Performance**: On-time completion rates
- **Staff Productivity**: Cases processed per staff member
- **Client Satisfaction**: NPS and CSAT scores

### Business Intelligence
- **Revenue Analytics**: ARR, churn, expansion revenue
- **Market Intelligence**: Geographic usage patterns
- **Compliance Reporting**: HIPAA audit trails
- **Predictive Analytics**: Churn prediction, capacity planning

## Future Roadmap

### Phase 1 (MVP - Months 1-3)
- Core intake workflow
- Parent portal and staff dashboard
- Basic document management
- Insurance verification (manual)

### Phase 2 (Growth - Months 4-6)
- AI-powered SAR generation
- Advanced analytics and reporting
- Mobile app (React Native)
- API marketplace integrations

### Phase 3 (Scale - Months 7-12)
- Multi-discipline expansion (OT, Speech, PT)
- Advanced AI features (denial prediction)
- White-label solutions
- Enterprise SSO and advanced security

### Phase 4 (Platform - Year 2+)
- Community marketplace
- Research collaboration tools
- Value-based care analytics
- International expansion
