# InTakeOff - ABA Therapy Intake Management Platform

A HIPAA-compliant SaaS platform that streamlines the intake process for ABA therapy clinics, reducing delays from 4-6 weeks to under 2 weeks while improving insurance claim accuracy and operational efficiency.

## 🏗️ Architecture

**Monorepo Structure:**
- **Parent Portal** (Next.js) - Mobile-first interface for families
- **Staff Dashboard** (Next.js) - Clinic management and workflow tools
- **API Server** (NestJS) - HIPAA-compliant backend with AI integration
- **Shared Packages** - Design system, SDK, configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+ (via `corepack enable`)
- Docker Desktop
- Git

### Installation
```bash
# Clone and install
git clone <your-repo-url>
cd intakeoff
pnpm install

# Start development environment
docker-compose up -d postgres redis
pnpm dev
```

**Access Points:**
- Parent Portal: http://localhost:3000
- Staff Dashboard: http://localhost:3001
- API Server: http://localhost:3002

## 📚 Documentation

- [📋 Business Plan](docs/business-plan.md) - Market strategy and revenue model
- [🏗️ System Architecture](docs/system-architecture.md) - Technical specifications
- [⚡ Build Plan](docs/build-plan.md) - 12-week development timeline
- [🔧 Developer Setup](docs/dev-setup.md) - Environment configuration
- [🚀 CI/CD Setup](docs/ci-cd-setup.md) - Deployment pipelines

## 💼 Business Value

### Revenue Streams
- **SaaS Subscriptions**: $250-$5,000/month per clinic
- **Professional Services**: Implementation and training
- **AI Premium Features**: Denial prediction, automated SAR generation
- **Partner Marketplace**: Integration revenue sharing

### Market Opportunity
- **$4B+ ABA therapy market** in the U.S.
- **4-6 week intake delays** industry-wide
- **High insurance denial rates** costing thousands per client
- **Expansion potential** across OT, Speech, PT, and daycares

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- React Query + Zustand

**Backend:**
- NestJS (TypeScript)
- PostgreSQL + Redis
- AWS S3 (document storage)
- Bull queues (async processing)

**AI & Integration:**
- OpenAI/Gemini (SAR generation)
- AWS Textract (document OCR)
- Insurance eligibility APIs
- EHR integrations (Motivity)

**DevOps:**
- Turborepo (monorepo)
- GitHub Actions (CI/CD)
- Docker containers
- HIPAA compliance tooling

## 🔒 Security & Compliance

- **HIPAA Compliant**: PHI encryption, audit logging, access controls
- **Multi-tenant Architecture**: Organization-based data isolation
- **SOC 2 Ready**: Security controls and monitoring
- **Penetration Testing**: Regular security assessments

## 📈 Growth Strategy

**Phase 1 (Months 1-3):** Core intake workflow MVP
**Phase 2 (Months 4-6):** AI features and mobile app
**Phase 3 (Months 7-12):** Multi-discipline expansion
**Phase 4 (Year 2+):** Enterprise features and marketplace

### Target Metrics
- **Year 1**: $300K ARR (25 clinics)
- **Year 3**: $5M ARR (250 clinics + expansion)
- **Year 5**: $20M ARR (1,000+ clinics, insurer partnerships)

## 🤝 For Stakeholders

### Clinic Owners
✅ Reduce intake time by 60%
✅ Decrease insurance denials by 40%
✅ Improve staff productivity
✅ Better parent experience

### Insurance Partners
✅ Lower administrative costs
✅ Cleaner claim submissions
✅ Reduced reprocessing overhead
✅ Better provider network insights

### Investors
✅ Sticky SaaS revenue model
✅ Clear expansion path
✅ Large addressable market
✅ Strong competitive moats

## 🏃‍♂️ Getting Started

1. **Developers**: See [Developer Setup Guide](docs/dev-setup.md)
2. **Business Stakeholders**: Review [Business Plan](docs/business-plan.md)
3. **Technical Leaders**: Check [System Architecture](docs/system-architecture.md)
4. **Project Managers**: Follow [Build Plan](docs/build-plan.md)

## 📞 Contact

For questions about partnerships, investment, or technical implementation, please reach out through GitHub Issues or contact the founding team.

---

**InTakeOff** - Transforming healthcare intake, one family at a time. 🚀
