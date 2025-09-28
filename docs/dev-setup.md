# Developer Setup Guide

This guide outlines the development environment prerequisites and setup instructions for InTakeOff - the ABA therapy intake management platform.

## Prerequisites

### Required Software

#### 1. Node.js 20.x
- **Version**: Node.js 20.x (LTS recommended)
- **Download**: https://nodejs.org/
- **Installation**: Download and install the LTS version
- **Verification**: 
  ```bash
  node --version  # Should show v20.x.x
  ```

#### 2. pnpm ≥9 (via corepack)
- **Version**: pnpm 9.0.0 or higher
- **Installation via corepack**:
  ```bash
  # Enable corepack (comes with Node.js 16.10+)
  corepack enable
  
  # Install/update pnpm
  corepack prepare pnpm@latest --activate
  ```
- **Verification**:
  ```bash
  pnpm --version  # Should show 9.x.x or higher
  ```

#### 3. Git
- **Version**: Latest stable version
- **Download**: https://git-scm.com/download/windows
- **Installation**: Download and install Git for Windows
- **Configuration**:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```
- **Verification**:
  ```bash
  git --version
  ```

#### 4. Docker
- **Version**: Docker Desktop for Windows
- **Download**: https://www.docker.com/products/docker-desktop/
- **Installation**: Download and install Docker Desktop
- **Requirements**: 
  - Windows 10/11 64-bit
  - WSL 2 backend (recommended)
  - Hyper-V enabled
- **Verification**:
  ```bash
  docker --version
  docker-compose --version
  ```

#### 5. Visual Studio Code
- **Version**: Latest stable version
- **Download**: https://code.visualstudio.com/
- **Installation**: Download and install VS Code

### Required VS Code Extensions

Install these extensions for optimal development experience:

#### 1. ESLint
- **Extension ID**: `dbaeumer.vscode-eslint`
- **Purpose**: JavaScript/TypeScript linting and code quality
- **Installation**:
  ```bash
  code --install-extension dbaeumer.vscode-eslint
  ```

#### 2. Tailwind CSS IntelliSense
- **Extension ID**: `bradlc.vscode-tailwindcss`
- **Purpose**: Intelligent Tailwind CSS class suggestions and syntax highlighting
- **Installation**:
  ```bash
  code --install-extension bradlc.vscode-tailwindcss
  ```

#### 3. Playwright Test for VS Code
- **Extension ID**: `ms-playwright.playwright`
- **Purpose**: Run and debug Playwright tests directly in VS Code
- **Installation**:
  ```bash
  code --install-extension ms-playwright.playwright
  ```

#### 4. EditorConfig for VS Code
- **Extension ID**: `editorconfig.editorconfig`
- **Purpose**: Maintain consistent coding styles across different editors
- **Installation**:
  ```bash
  code --install-extension editorconfig.editorconfig
  ```

### Recommended Additional Extensions

These extensions are not required but highly recommended:

```bash
# TypeScript support
code --install-extension ms-vscode.vscode-typescript-next

# Prettier code formatter
code --install-extension esbenp.prettier-vscode

# GitLens for enhanced Git capabilities
code --install-extension eamodio.gitlens

# Auto Rename Tag
code --install-extension formulahendry.auto-rename-tag

# Bracket Pair Colorizer
code --install-extension coenraads.bracket-pair-colorizer

# Thunder Client for API testing
code --install-extension rangav.vscode-thunder-client

# REST Client for API testing
code --install-extension humao.rest-client
```

## InTakeOff Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd intakeoff
```

### 2. Install Dependencies
```bash
# Install all dependencies using pnpm
pnpm install

# Build shared packages first
pnpm build:packages
```

### 3. Environment Configuration

#### Parent Portal (.env.local)
```bash
# Copy environment template
cp apps/parent-portal/.env.example apps/parent-portal/.env.local

# Edit with your values
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

#### Staff Dashboard (.env.local)
```bash
# Copy environment template
cp apps/staff-dashboard/.env.example apps/staff-dashboard/.env.local

# Edit with your values
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
```

#### API Server (.env)
```bash
# Copy environment template
cp apps/api/.env.example apps/api/.env

# Edit with your values
DATABASE_URL=postgresql://intakeoff:password@localhost:5432/intakeoff_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
S3_BUCKET=intakeoff-dev-documents
S3_REGION=us-east-1
```

### 4. Database Setup
```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Run database migrations
pnpm --filter api db:migrate

# Seed development data
pnpm --filter api db:seed
```

### 5. Start Development Servers
```bash
# Start all applications in development mode
pnpm dev

# Applications will be available at:
# - Parent Portal: http://localhost:3000
# - Staff Dashboard: http://localhost:3001  
# - API Server: http://localhost:3002
```

### 6. Verify Setup
```bash
# Run health checks
curl http://localhost:3002/health

# Run tests
pnpm test

# Check linting
pnpm lint
```

## Development Workflow

### Code Quality Checks
```bash
# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Run tests
pnpm test

# Run all checks
pnpm ci
```

### Working with Features
```bash
# Create feature branch
git checkout -b feature/intake-automation

# Start development
pnpm dev

# Test changes
pnpm test

# Commit with conventional commits
git commit -m "feat(intake): add automated document processing"
```

### Docker Development Environment
```bash
# Start complete environment with Docker
docker-compose up -d

# View logs
docker-compose logs -f api

# Access database
docker-compose exec postgres psql -U intakeoff -d intakeoff_dev

# Stop services
docker-compose down
```

## InTakeOff-Specific Development Notes

### HIPAA Compliance Considerations
- **Never log PHI** in console.log or application logs
- **Use proper encryption** for all sensitive data
- **Test data anonymization** before committing test fixtures
- **Follow access control patterns** in all new features

### Module Structure
The application follows a modular architecture:

```
apps/
├── parent-portal/     # Next.js app for parents
├── staff-dashboard/   # Next.js app for clinic staff
└── api/              # NestJS backend API

packages/
├── design-tokens/    # Shared UI design system
├── sdk/             # TypeScript client for API
└── config/          # Shared configuration
```

### Key Development Patterns

#### 1. Feature Flags
```typescript
// Use feature flags for new functionality
const isAIExtractionEnabled = featureFlags.isEnabled('ai-document-extraction');
```

#### 2. Audit Logging
```typescript
// Log all PHI access
await auditLog.log({
  action: 'VIEW_INTAKE_DOCUMENT',
  userId: currentUser.id,
  resourceId: document.id,
  ipAddress: req.ip
});
```

#### 3. Error Handling
```typescript
// Proper error handling with PHI redaction
try {
  await processDocument(document);
} catch (error) {
  logger.error('Document processing failed', {
    documentId: document.id,
    error: redactPHI(error.message)
  });
}
```

## VS Code Workspace Configuration

The project includes a VS Code workspace configuration with:

- **Consistent formatting settings** for TypeScript/React
- **ESLint and Prettier integration** for code quality  
- **Tailwind CSS class sorting** and IntelliSense
- **Debugger configuration** for Next.js and NestJS
- **Test runner integration** for Vitest and Playwright

## Troubleshooting

### Common Issues

#### Node.js Version Mismatch
```bash
# Check current version
node --version

# Use nvm to switch versions (if installed)
nvm use 20
```

#### pnpm Not Found
```bash
# Enable corepack
corepack enable

# Install pnpm
corepack prepare pnpm@latest --activate
```

#### Database Connection Issues
```bash
# Check Docker services
docker-compose ps

# Restart database
docker-compose restart postgres

# Check connection
psql postgresql://intakeoff:password@localhost:5432/intakeoff_dev
```

#### VS Code Extension Issues
```bash
# Reload VS Code window
Ctrl+Shift+P -> "Developer: Reload Window"

# Clear TypeScript cache
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

## System Requirements

### Minimum Requirements
- **OS**: Windows 10 64-bit (version 1903 or higher)
- **RAM**: 8 GB (16 GB recommended)
- **Storage**: 10 GB free space
- **CPU**: 4 cores (8 cores recommended for full development stack)

### Recommended Requirements
- **OS**: Windows 11 64-bit
- **RAM**: 16 GB or higher
- **Storage**: 20 GB free space (SSD recommended)
- **CPU**: 8 cores or higher
- **Network**: High-speed internet for Docker image downloads

## Additional Resources

- [InTakeOff Business Plan](./business-plan.md)
- [System Architecture](./system-architecture.md)
- [Build Plan & Timeline](./build-plan.md)
- [CI/CD Setup](./ci-cd-setup.md)
- [Gemini Prompts](./gemini-prompts.md)
- [Git Setup Guide](../GIT_SETUP.md)
- [Project README](../README.md)