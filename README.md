# Parent Portal & Staff Dashboard Monorepo

This is a TypeScript monorepo containing:
- Next.js React frontend applications (Parent Portal & Staff Dashboard)  
- NestJS backend API server
- Shared packages for design tokens, SDK, and configuration

## Architecture
- **apps/parent-portal**: Next.js app for parent interface (port 3000)
- **apps/staff-dashboard**: Next.js app for staff interface (port 3001)  
- **apps/api**: NestJS backend server (port 3002)
- **packages/design-tokens**: Shared design system tokens
- **packages/sdk**: TypeScript client SDK
- **packages/config**: Shared configuration and prompts

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 10+
- Git (for version control)

### Installation
```bash
# Install dependencies
npm install

# Build shared packages
npm run build:packages

# Start all applications in development
npm run dev
```

### Development
- **Parent Portal**: http://localhost:3000
- **Staff Dashboard**: http://localhost:3001  
- **API Server**: http://localhost:3002

### Scripts
- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all packages and applications
- `npm run test` - Run tests across the monorepo
- `npm run lint` - Run ESLint across all packages
- `npm run type-check` - Run TypeScript type checking

## Git Setup
See [GIT_SETUP.md](GIT_SETUP.md) for complete Git repository setup instructions including branch protection rules.

## CI/CD
This project includes GitHub Actions workflows for:
- Continuous Integration (lint, test, build)
- Automated deployment
- Dependency updates

## Project Structure
```
├── apps/
│   ├── parent-portal/     # Next.js parent interface
│   ├── staff-dashboard/   # Next.js staff interface  
│   └── api/              # NestJS backend API
├── packages/
│   ├── design-tokens/    # Shared design tokens
│   ├── sdk/             # TypeScript API client
│   └── config/          # Shared configuration
├── .github/
│   └── workflows/       # CI/CD workflows
└── docs/               # Documentation
```

## Features

### Parent Portal
- Child dashboard and progress tracking
- Schedule management
- Communication with staff  
- Progress reports and updates

### Staff Dashboard
- Child management and profiles
- Activity planning and tracking
- Parent communication
- Report generation

### API Features
- RESTful API endpoints
- Authentication and authorization
- Data validation and error handling
- Real-time notifications

## Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, Express
- **Tooling**: Turbo (monorepo), ESLint, Prettier
- **CI/CD**: GitHub Actions
- **Package Manager**: npm workspaces