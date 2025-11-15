# DevOps Implementation Guide
## Automated Testing & Code Quality untuk themeprojblograw Repository

### 📋 Daftar Isi
1. [Overview](#overview)
2. [Struktur Repository](#struktur-repository)
3. [Setup Initial](#setup-initial)
4. [Code Quality Tools](#code-quality-tools)
5. [Testing Framework](#testing-framework)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Environment Configuration](#environment-configuration)
8. [Deployment Strategy](#deployment-strategy)
9. [Monitoring & Observability](#monitoring--observability)
10. [Maintenance & Best Practices](#maintenance--best-practices)

## Overview

Repository: https://github.com/amatechx/themeprojblograw

### Objetivos
- **Automated Testing**: Implementasi comprehensive testing strategy
- **Code Quality**: Static analysis dan code standards enforcement
- **CI/CD Pipeline**: Automated build, test, dan deployment
- **Security**: Security scanning dan vulnerability management
- **Performance**: Performance monitoring dan optimization

### Technology Stack
- **Frontend**: React/Next.js dengan TypeScript
- **Testing**: Jest (unit), Cypress (E2E), React Testing Library
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, Husky
- **Security**: CodeQL, Dependabot, npm audit
- **Deployment**: Docker, Vercel/AWS/GCP

## Struktur Repository

```
themeprojblograw/
├── .github/
│   └── workflows/
│       └── ci-cd-pipeline.yml      # GitHub Actions workflow
├── src/
│   ├── components/                 # React components
│   ├── pages/                      # Next.js pages
│   ├── utils/                      # Utility functions
│   ├── hooks/                      # Custom hooks
│   └── context/                    # React context
├── tests/
│   ├── unit/                       # Unit tests
│   ├── integration/                # Integration tests
│   └── e2e/                        # E2E tests (Cypress)
├── cypress/
│   ├── e2e/                        # E2E test specs
│   ├── fixtures/                   # Test fixtures
│   └── support/                    # Cypress support files
├── docs/                          # Documentation
├── scripts/                       # Build & deployment scripts
├── .eslintrc.js                   # ESLint configuration
├── .prettierrc.js                 # Prettier configuration
├── jest.config.js                 # Jest configuration
├── cypress.config.js              # Cypress configuration
└── package.json                   # Dependencies & scripts
```

## Setup Initial

### 1. Clone dan Install Dependencies
```bash
git clone https://github.com/amatechx/themeprojblograw.git
cd themeprojblograw
npm install
```

### 2. Setup Git Hooks
```bash
npm run prepare
npx husky install
```

### 3. Setup Pre-commit Hooks
```bash
npx husky add .husky/pre-commit "npm run precommit"
```

### 4. Environment Variables
Buat file `.env.local`:
```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/themeprojblograw

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# External APIs
STRIPE_SECRET_KEY=sk_test_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Monitoring
SENTRY_DSN=...
LOG_LEVEL=info
```

## Code Quality Tools

### ESLint Configuration
File: `.eslintrc.js`
- **TypeScript support**: Full TypeScript integration
- **React hooks rules**: React 18 best practices
- **Accessibility**: jsx-a11y plugin
- **Import organization**: Sorted imports
- **Security rules**: No eval, no dangerous HTML

### Prettier Configuration
File: `.prettierrc.js`
- **Consistent formatting**: 100 character line width
- **Quote style**: Single quotes untuk JS/TS
- **File-specific rules**: JSON, YAML, CSS optimization
- **Automatic formatting**: Integrated dengan ESLint

### Git Hooks (Husky)
- **Pre-commit**: Linting dan formatting
- **Pre-push**: Running tests sebelum push
- **Commit message**: Conventional commits

### Scripts Commands
```bash
# Code Quality
npm run lint              # Run ESLint
npm run lint:fix          # Auto-fix ESLint issues
npm run format            # Format with Prettier
npm run format:check      # Check Prettier compliance
npm run type-check        # TypeScript type checking

# Security
npm run security:audit    # Check for vulnerabilities
npm run security:check    # Comprehensive security check
```

## Testing Framework

### Unit Testing (Jest)
**Configuration**: `jest.config.js`

**Test Structure**:
```
tests/
├── unit/
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── Header.test.tsx
│   ├── hooks/
│   │   └── useAuth.test.ts
│   └── utils/
│       └── helpers.test.ts
├── integration/
│   ├── api/
│   └── components/
└── e2e/
    └── cypress/  # Separate Cypress folder
```

**Test Scripts**:
```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
```

### E2E Testing (Cypress)
**Configuration**: `cypress.config.js`

**Test Structure**:
```
cypress/
├── e2e/
│   ├── smoke/
│   │   └── basic-navigation.cy.ts
│   ├── user-flows/
│   │   ├── login.cy.ts
│   │   └── registration.cy.ts
│   ├── accessibility/
│   │   └── keyboard-navigation.cy.ts
│   └── performance/
│       └── page-load.cy.ts
├── fixtures/
└── support/
    ├── e2e.js
    └── commands.js
```

**E2E Test Scripts**:
```bash
npm run test:e2e          # Run E2E tests headless
npm run test:e2e:open     # Open Cypress GUI
npm run test:smoke        # Smoke tests
npm run test:accessibility # Accessibility tests
```

### Component Testing (React Testing Library)
```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## CI/CD Pipeline

### GitHub Actions Workflow
**File**: `.github/workflows/ci-cd-pipeline.yml`

**Pipeline Stages**:

1. **Quality Checks**
   - ESLint linting
   - Prettier formatting
   - TypeScript type checking
   - Security audit
   - CodeQL security analysis

2. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress)
   - Coverage reporting

3. **Build & Package**
   - Next.js production build
   - Docker image creation
   - Artifact upload

4. **Deployment**
   - Staging deployment (develop branch)
   - Production deployment (main branch)
   - Smoke tests after deployment

### Pipeline Triggers
- **Pull Request**: Quality checks + tests
- **Push to develop**: Full pipeline + staging deployment
- **Push to main**: Full pipeline + production deployment

### Required GitHub Secrets
```env
CODECOV_TOKEN           # For coverage reporting
LHCI_GITHUB_APP_TOKEN   # For Lighthouse CI
STAGING_URL            # Staging environment URL
PRODUCTION_URL         # Production environment URL
SLACK_WEBHOOK          # Deployment notifications
DEPLOY_TOKEN           # Deployment authentication
```

## Environment Configuration

### Environment Strategy
- **Development**: Local development dengan hot reload
- **Staging**: Pre-production testing environment
- **Production**: Live environment dengan optimizations

### Environment Variables Management
```javascript
// next.config.js
module.exports = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
};
```

### Docker Configuration
```dockerfile
# Multi-stage build untuk optimization
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## Deployment Strategy

### Staging Deployment
- **Trigger**: Push ke `develop` branch
- **URL**: https://staging.themeprojblograw.com
- **Purpose**: Pre-production testing
- **Auto-tests**: Smoke tests setelah deployment

### Production Deployment
- **Trigger**: Push ke `main` branch atau tagged release
- **URL**: https://themeprojblograw.com
- **Features**: 
  - Blue-green deployment
  - Automatic rollback on failure
  - Health checks
  - Performance monitoring

### Deployment Scripts
```bash
# Manual deployment (if needed)
npm run deploy:staging    # Deploy to staging
npm run deploy:production # Deploy to production

# Rollback
npm run rollback:staging
npm run rollback:production
```

## Monitoring & Observability

### Performance Monitoring
- **Lighthouse CI**: Automated performance audits
- **Core Web Vitals**: Real user monitoring
- **Bundle Analysis**: Webpack bundle size tracking
- **Error Tracking**: Sentry integration

### Health Checks
```javascript
// pages/api/health.js
export default function handler(req, res) {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).json(healthcheck);
  }
}
```

### Monitoring Dashboard
- **GitHub Actions**: Pipeline status monitoring
- **Vercel/Cloud Platform**: Application performance
- **Sentry**: Error tracking dan performance
- **Google Analytics**: User behavior tracking

## Maintenance & Best Practices

### Regular Maintenance Tasks
1. **Weekly**: Dependency updates (`npm update`)
2. **Monthly**: Security audit (`npm audit`)
3. **Quarterly**: Performance review dan optimization
4. **As needed**: Dependency security updates via Dependabot

### Best Practices

#### Code Quality
- **Conventional Commits**: Consistent commit messages
- **Code Reviews**: Required untuk all PRs
- **Test Coverage**: Maintain >80% coverage
- **Documentation**: Keep README dan docs updated

#### Security
- **Dependency Scanning**: Automated vulnerability detection
- **Secrets Management**: Never commit secrets
- **Security Headers**: CSP, HSTS, etc.
- **Regular Updates**: Keep dependencies current

#### Performance
- **Bundle Optimization**: Regular bundle analysis
- **Image Optimization**: Next.js automatic optimization
- **Caching Strategy**: Proper HTTP caching headers
- **Performance Budget**: Lighthouse CI thresholds

### Troubleshooting

#### Common Issues
1. **Test Failures**
   ```bash
   npm run test:watch  # Debug failing tests
   npm run test:coverage  # Check coverage gaps
   ```

2. **Build Failures**
   ```bash
   npm run type-check  # TypeScript errors
   npm run lint  # ESLint issues
   npm run analyze  # Bundle analysis
   ```

3. **CI/CD Issues**
   - Check GitHub Actions logs
   - Verify environment variables
   - Test locally dengan `npm run validate:ci`

### Support & Documentation
- **Repository Issues**: GitHub Issues untuk bug reports
- **Documentation**: `/docs` folder untuk detailed docs
- **Wiki**: GitHub Wiki untuk comprehensive guides
- **Discussions**: GitHub Discussions untuk Q&A

---

**📞 Contact**: DevOps Team  
**📧 Email**: devops@themeprojblograw.com  
**🔗 Repository**: https://github.com/amatechx/themeprojblograw

*Last Updated: 2025-11-15*