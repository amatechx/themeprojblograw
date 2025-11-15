# Deployment Setup Guide
## Tahapan Implementasi Praktis

### 📋 Tahap 1: Repository Setup

#### 1.1 Upload Konfigurasi Files
```bash
# Clone repository
git clone https://github.com/amatechx/themeprojblograw.git
cd themeprojblograw

# Create directories
mkdir -p .github/workflows tests/{unit,integration} cypress/{e2e,fixtures,support} scripts docs

# Copy konfigurasi files
cp .github/workflows/ci-cd-pipeline.yml .github/workflows/
cp .eslintrc.js .prettierrc.js jest.config.js cypress.config.js .
cp package-scripts.json package.json
cp devops-analysis-report.md DEVOPS-IMPLEMENTATION-GUIDE.md docs/
```

#### 1.2 Initial Commit
```bash
git add .
git commit -m "feat: setup DevOps pipeline with automated testing and code quality"
git push origin main
```

### 🔐 Tahap 2: GitHub Secrets Setup

#### 2.1 Navigate to Repository Settings
1. Go to your repository: `https://github.com/amatechx/themeprojblograw`
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** → **Actions**

#### 2.2 Required Secrets ( Klik "New repository secret" )

**Environment Variables:**
```env
# Coverage Reporting
CODECOV_TOKEN=your_codecov_token

# Performance Testing
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token

# Staging Environment
STAGING_URL=https://staging.themeprojblograw.vercel.app
STAGING_TOKEN=your_staging_deploy_token

# Production Environment  
PRODUCTION_URL=https://themeprojblograw.vercel.app
PRODUCTION_TOKEN=your_production_deploy_token

# Notifications
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
DISCORD_WEBHOOK=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK

# Deployment
VERCEL_TOKEN=your_vercel_token
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
LOGDNA_KEY=your_logdna_key
```

#### 2.3 Getting Required Tokens

**Codecov Token:**
1. Sign up at https://codecov.io
2. Connect your GitHub repository
3. Copy the token from dashboard

**Lighthouse CI Token:**
1. Visit https://github.com/apps/lighthouse-ci
2. Install on your repository
3. Get token from GitHub App settings

**Slack Webhook:**
1. In Slack, go to your workspace settings
2. Click **Incoming Webhooks**
3. Create new webhook for your channel

**Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Copy token value

### 🌐 Tahap 3: Environment Configuration

#### 3.1 Vercel Deployment Setup

**Install Vercel CLI:**
```bash
npm install -g vercel
vercel login
```

**Create `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "@app-url",
      "DATABASE_URL": "@database-url",
      "NEXTAUTH_SECRET": "@nextauth-secret",
      "NEXTAUTH_URL": "@nextauth-url"
    }
  }
}
```

**Setup Vercel Environments:**
```bash
# Staging environment
vercel --prod=false --alias=staging-themeprojblograw

# Production environment
vercel --prod=true --alias=themeprojblograw
```

#### 3.2 Database Setup (if needed)

**PostgreSQL dengan Supabase:**
1. Create account at https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Update `DATABASE_URL` secret

**Alternative dengan PlanetScale:**
1. Create account at https://planetscale.com
2. Create database
3. Get connection string from dashboard

#### 3.3 Domain Configuration

**Vercel Domains:**
```bash
# Add custom domain to Vercel
vercel domains add themeprojblograw.com
vercel domains add staging.themeprojblograw.com

# Setup DNS (point to Vercel)
CNAME themeprojblograw.com → cname.vercel-dns.com
CNAME staging.themeprojblograw.com → cname.vercel-dns.com
```

### 👥 Tahap 4: Team Onboarding

#### 4.1 Create Team Documentation

**Repository README.md:**
```markdown
# Themeprojblograw DevOps Setup

## Quick Start
```bash
npm install
npm run setup
```

## Development Workflow
1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and write tests
3. Run quality checks: `npm run validate`
4. Commit with conventional commits: `npm run commit`
5. Push and create Pull Request

## Scripts
- `npm run dev` - Start development server
- `npm run test` - Run all tests
- `npm run lint` - Run code quality checks
- `npm run validate` - Run complete validation

## CI/CD Pipeline
- **Pull Requests**: Quality checks + tests
- **Develop Branch**: Full pipeline + staging deployment
- **Main Branch**: Full pipeline + production deployment

## Getting Help
- Read [Implementation Guide](docs/DEVOPS-IMPLEMENTATION-GUIDE.md)
- Check [GitHub Actions](https://github.com/amatechx/themeprojblograw/actions)
- Open [Issues](https://github.com/amatechx/themeprojblograw/issues)
```

#### 4.2 Team Permissions Setup

**GitHub Repository Settings:**
1. **Settings** → **Manage access**
2. **Manage Teams** or **Invite Teams**
3. Set permissions:
   - **Admin**: Core DevOps team
   - **Write**: Development team
   - **Read**: QA and product team

**Branch Protection Rules:**
1. **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Restrict pushes that create files

### 📊 Tahap 5: Monitoring & Optimization

#### 5.1 GitHub Actions Monitoring

**Workflow Status Badges:**
Add to README.md:
```markdown
[![CI/CD Pipeline](https://github.com/amatechx/themeprojblograw/actions/workflows/ci-cd-pipeline.yml/badge.svg)](https://github.com/amatechx/themeprojblograw/actions/workflows/ci-cd-pipeline.yml)
[![Code Coverage](https://codecov.io/gh/amatechx/themeprojblograw/branch/main/graph/badge.svg)](https://codecov.io/gh/amatechx/themeprojblograw)
[![Security](https://github.com/amatechx/themeprojblograw/security/code-scanning/badge.svg)](https://github.com/amatechx/themeprojblograw/security/code-scanning)
```

**Metrics Dashboard:**
Create GitHub Issue template for tracking:
```markdown
---
name: Performance Regression
about: Report performance degradation
labels: 'performance'
---

## Environment
- Browser: [e.g. Chrome 91]
- OS: [e.g. macOS Big Sur]

## Performance Issue
- **Before**: [Previous performance]
- **Current**: [Current performance]
- **Expected**: [Expected performance]

## Screenshots/Logs
[Attach screenshots, Lighthouse reports, or console logs]

## Additional Context
[Any additional context that might help]
```

#### 5.2 Performance Monitoring

**Lighthouse CI Configuration:**
Create `.lighthouserc.js`:
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm start',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'lhci',
    },
  },
};
```

**Sentry Integration:**
```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### 5.3 Automated Optimization

**Dependabot Configuration:**
Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    reviewers:
      - "team-leads"
    assignees:
      - "devops-team"
```

**Renovate Configuration:**
Create `renovate.json`:
```json
{
  "extends": ["config:base"],
  "schedule": ["before 5am on monday"],
  "automerge": true,
  "major": {
    "automerge": false
  },
  "minor": {
    "automerge": true
  },
  "patch": {
    "automerge": true
  }
}
```

### 🔧 Automation Scripts

#### Quick Setup Script
Create `scripts/setup-devops.sh`:
```bash
#!/bin/bash
set -e

echo "🚀 Setting up DevOps environment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup Husky
echo "🔗 Setting up Git hooks..."
npx husky install
npx husky add .husky/pre-commit "npm run precommit"
npx husky add .husky/pre-push "npm run validate"

# Create required directories
echo "📁 Creating directory structure..."
mkdir -p tests/{unit,integration}
mkdir -p cypress/{e2e,fixtures,support}
mkdir -p scripts docs

# Make scripts executable
chmod +x scripts/*.sh

echo "✅ DevOps setup completed!"
echo "📋 Next steps:"
echo "1. Configure GitHub secrets"
echo "2. Setup staging environment"
echo "3. Configure team permissions"
echo "4. Run first pipeline test"
```

#### Pipeline Validation Script
Create `scripts/validate-pipeline.sh`:
```bash
#!/bin/bash
set -e

echo "🔍 Validating pipeline configuration..."

# Check required files
required_files=(
  ".github/workflows/ci-cd-pipeline.yml"
  ".eslintrc.js"
  ".prettierrc.js"
  "jest.config.js"
  "cypress.config.js"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
done

# Test local commands
echo "🧪 Testing local commands..."
npm run lint
npm run format:check
npm run type-check
npm run test:unit

# Validate environment
if [ -z "$CODECOV_TOKEN" ]; then
  echo "⚠️  Warning: CODECOV_TOKEN not set"
fi

echo "✅ Pipeline validation completed!"
```

### 🎯 Success Metrics

**Track these KPIs:**
- **Build Success Rate**: >99%
- **Test Coverage**: >80%
- **Deployment Frequency**: Daily
- **Lead Time**: <1 day
- **Mean Time to Recovery**: <1 hour
- **Security Vulnerabilities**: 0 critical

**Tools untuk Tracking:**
- GitHub Actions insights
- Codecov dashboard  
- Sentry performance
- Lighthouse CI reports

---

**📞 Next Steps:**
1. Execute each tahap secara berurutan
2. Test pipeline dengan membuat test PR
3. Monitor initial deployments
4. Adjust konfigurasi sesuai kebutuhan
5. Train team dengan documentation

**🆘 Troubleshooting:**
- Check GitHub Actions logs
- Verify environment variables
- Test local pipeline dengan `npm run validate:ci`
- Refer to [Implementation Guide](docs/DEVOPS-IMPLEMENTATION-GUIDE.md)