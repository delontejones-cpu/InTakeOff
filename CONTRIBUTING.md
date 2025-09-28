# Contributing to InTakeOff

Thank you for your interest in contributing to InTakeOff! This guide will help you get started with contributing to our HIPAA-compliant ABA therapy intake management platform.

## 🚀 Getting Started

### Prerequisites
1. Read our [Code of Conduct](CODE_OF_CONDUCT.md)
2. Review the [Developer Setup Guide](docs/dev-setup.md)
3. Understand our [System Architecture](docs/system-architecture.md)
4. Familiarize yourself with HIPAA compliance requirements

### Development Environment
```bash
# Clone the repository
git clone https://github.com/your-org/intakeoff.git
cd intakeoff

# Install dependencies
pnpm install

# Start development environment
docker-compose up -d postgres redis
pnpm dev
```

## 📋 How to Contribute

### Reporting Issues
- Use our [Issue Template](.github/ISSUE_TEMPLATE.md)
- Search existing issues before creating new ones
- **Never include PHI or real patient data in issues**
- For security vulnerabilities, contact us privately

### Suggesting Features
- Open an issue with the "Feature Request" label
- Provide clear use cases and business value
- Consider HIPAA compliance implications
- Reference relevant documentation

### Code Contributions

#### 1. Fork and Branch
```bash
# Fork the repository and clone your fork
git clone https://github.com/YOUR-USERNAME/intakeoff.git
cd intakeoff

# Create a feature branch
git checkout -b feature/your-feature-name
```

#### 2. Development Guidelines

**Code Style:**
- Follow TypeScript strict mode
- Use ESLint and Prettier configurations
- Write meaningful commit messages (Conventional Commits)
- Include comprehensive tests

**HIPAA Compliance:**
- Never log PHI in console.log or application logs
- Use proper encryption for sensitive data
- Implement proper access controls
- Add audit logging for PHI access

**Testing Requirements:**
```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit
pnpm test:integration
pnpm e2e

# Check coverage
pnpm test:coverage
```

#### 3. Commit Guidelines
We use [Conventional Commits](https://conventionalcommits.org/):

```bash
# Feature
git commit -m "feat(intake): add automated document processing"

# Bug fix
git commit -m "fix(auth): resolve session timeout issue"

# Documentation
git commit -m "docs(api): update endpoint documentation"

# Security
git commit -m "security(auth): implement rate limiting"
```

#### 4. Pull Request Process

1. **Create PR** using our [Pull Request Template](.github/pull_request_template.md)
2. **Ensure CI passes** (lint, test, build, security scans)
3. **Request review** from maintainers
4. **Address feedback** promptly
5. **Maintain branch** up to date with main

## 🛡️ Security and Privacy

### HIPAA Compliance Checklist
- [ ] No PHI in logs, error messages, or debug output
- [ ] Proper access controls implemented
- [ ] Audit logging for sensitive operations
- [ ] Encryption for data at rest and in transit
- [ ] Input validation and sanitization
- [ ] Secure session management

### Security Vulnerability Reporting
If you discover a security vulnerability:
1. **DO NOT** create a public issue
2. Email security@intakeoff.com with details
3. Allow time for assessment and patching
4. Credit will be given for responsible disclosure

## 🧪 Testing

### Test Types
- **Unit Tests**: Business logic, utilities, components
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: User workflows, accessibility
- **Security Tests**: Vulnerability scanning, penetration testing

### Writing Tests
```typescript
// Unit test example
describe('IntakeStepper', () => {
  it('should advance to next step when valid', () => {
    // Test logic here
  });
});

// Integration test example
describe('POST /v1/intakes', () => {
  it('should create intake case with valid data', async () => {
    // API test logic here
  });
});
```

## 📖 Documentation

### What to Document
- New features and APIs
- Configuration changes
- Security considerations
- Migration guides
- Troubleshooting steps

### Documentation Standards
- Use clear, concise language
- Include code examples
- Add diagrams for complex workflows
- Update relevant README files

## 🎯 Priority Areas

We welcome contributions in these areas:

### High Priority
- AI/ML features (SAR generation, document OCR)
- Insurance integration improvements
- Mobile responsiveness enhancements
- Performance optimizations

### Medium Priority
- Additional EHR integrations
- Advanced analytics features
- Workflow customization tools
- Multi-language support

### Good First Issues
Look for issues labeled:
- `good first issue`
- `documentation`
- `help wanted`
- `enhancement`

## 🏗️ Architecture Guidelines

### Frontend (Next.js)
- Use App Router pattern
- Implement proper loading states
- Follow accessibility guidelines (WCAG 2.1 AA)
- Use our design system tokens

### Backend (NestJS)
- Follow domain-driven design principles
- Implement proper error handling
- Use DTOs for validation
- Add comprehensive logging

### Database
- Use migrations for schema changes
- Implement proper indexing
- Follow naming conventions
- Consider data retention policies

## 🔄 Review Process

### Code Review Checklist
- [ ] Code quality and style
- [ ] Test coverage (>80%)
- [ ] Security considerations
- [ ] Performance impact
- [ ] Documentation updates
- [ ] HIPAA compliance
- [ ] Accessibility standards

### Review Timeline
- Initial review within 2 business days
- Follow-up reviews within 1 business day
- Security reviews may take longer

## 📞 Getting Help

### Community Support
- GitHub Issues for bugs and features
- GitHub Discussions for questions
- Documentation at [docs/](docs/)

### Direct Contact
- Technical questions: tech@intakeoff.com
- Security issues: security@intakeoff.com
- General inquiries: hello@intakeoff.com

## 🎉 Recognition

Contributors will be recognized through:
- GitHub contributor status
- Credits in release notes
- Annual contributor appreciation
- Potential employment opportunities

## 📄 License

By contributing to InTakeOff, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for helping make healthcare intake processes better for families and providers! 🚀