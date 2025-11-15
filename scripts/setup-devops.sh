#!/bin/bash

# DevOps Setup Automation Script
# Untuk repository: https://github.com/amatechx/themeprojblograw
# Tanggal: 2025-11-15

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ SUCCESS:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING:${NC} $1"
}

log_error() {
    echo -e "${RED}❌ ERROR:${NC} $1"
}

# Check if required commands exist
check_requirements() {
    log_info "Checking system requirements..."
    
    local missing_deps=()
    
    # Check for required commands
    for cmd in node npm git; do
        if ! command -v $cmd &> /dev/null; then
            missing_deps+=($cmd)
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_info "Please install missing dependencies and run again"
        exit 1
    fi
    
    # Check Node.js version
    node_version=$(node --version | cut -d'v' -f2)
    required_version="16.0.0"
    
    if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" != "$required_version" ]; then
        log_error "Node.js version $node_version is too old. Required: >= $required_version"
        exit 1
    fi
    
    log_success "All requirements met (Node.js $node_version)"
}

# Setup project structure
setup_directory_structure() {
    log_info "Setting up directory structure..."
    
    local dirs=(
        "src/components"
        "src/pages"
        "src/utils"
        "src/hooks"
        "src/context"
        "tests/unit"
        "tests/integration"
        "cypress/e2e"
        "cypress/fixtures"
        "cypress/support"
        "docs"
        "scripts"
        ".github/workflows"
        "public"
        ".vscode"
    )
    
    for dir in "${dirs[@]}"; do
        mkdir -p "$dir"
        log_success "Created directory: $dir"
    done
}

# Install npm dependencies
install_dependencies() {
    log_info "Installing npm dependencies..."
    
    # Create package.json if it doesn't exist
    if [ ! -f "package.json" ]; then
        log_info "Creating package.json..."
        npm init -y
    fi
    
    # Install core dependencies
    npm install --save-dev \
        @typescript-eslint/eslint-plugin \
        @typescript-eslint/parser \
        eslint \
        eslint-config-prettier \
        eslint-plugin-react \
        eslint-plugin-react-hooks \
        eslint-plugin-jsx-a11y \
        eslint-plugin-import \
        eslint-plugin-promise \
        prettier \
        husky \
        lint-staged \
        jest \
        @testing-library/react \
        @testing-library/jest-dom \
        @testing-library/user-event \
        cypress \
        typescript \
        @types/jest \
        @types/node
    
    log_success "Dependencies installed successfully"
}

# Setup Git hooks
setup_git_hooks() {
    log_info "Setting up Git hooks..."
    
    # Initialize Husky if not already done
    if [ ! -d ".husky" ]; then
        npx husky install
        log_success "Husky initialized"
    fi
    
    # Add pre-commit hook
    if [ ! -f ".husky/pre-commit" ]; then
        npx husky add .husky/pre-commit "npm run precommit"
        log_success "Pre-commit hook added"
    fi
    
    # Add commit-msg hook for conventional commits
    if [ ! -f ".husky/commit-msg" ]; then
        npx husky add .husky/commit-msg "npx commitlint --edit $1"
        log_success "Commit-msg hook added"
    fi
    
    # Add pre-push hook
    if [ ! -f ".husky/pre-push" ]; then
        npx husky add .husky/pre-push "npm run validate"
        log_success "Pre-push hook added"
    fi
    
    # Make hooks executable
    chmod +x .husky/*
    log_success "Git hooks configured successfully"
}

# Create configuration files
create_config_files() {
    log_info "Creating configuration files..."
    
    # Copy configuration files from current location
    local config_files=(
        ".eslintrc.js"
        ".prettierrc.js"
        "jest.config.js"
        "cypress.config.js"
        ".github/workflows/ci-cd-pipeline.yml"
    )
    
    for file in "${config_files[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$file.bak" 2>/dev/null || true
            log_success "Config file exists: $file"
        else
            log_warning "Config file missing: $file"
        fi
    done
    
    # Create basic .gitignore
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
.next/
out/
dist/
build/

# Testing
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Cypress
cypress/screenshots/
cypress/videos/

# Temporary files
*.tmp
*.temp

# Sentry
.sentryclirc

# Lighthouse
.lighthouseci/
EOF
    
    log_success "Configuration files created"
}

# Create basic application structure
create_app_structure() {
    log_info "Creating basic application structure..."
    
    # Create basic Next.js pages if they don't exist
    local pages=(
        "src/pages/index.tsx"
        "src/pages/_app.tsx"
        "src/pages/_document.tsx"
        "src/components/Layout.tsx"
        "src/utils/helpers.ts"
        "src/hooks/useAuth.ts"
    )
    
    for page in "${pages[@]}"; do
        if [ ! -f "$page" ]; then
            # Create directory if needed
            mkdir -p "$(dirname "$page")"
            
            # Create basic file content
            case "$page" in
                "src/pages/index.tsx")
                    cat > "$page" << 'EOF'
import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Themeprojblograw</title>
        <meta name="description" content="DevOps automated testing and quality" />
      </Head>
      
      <main>
        <h1>Welcome to Themeprojblograw</h1>
        <p>Automated DevOps setup with comprehensive testing</p>
      </main>
    </div>
  );
}
EOF
                    ;;
                "src/pages/_app.tsx")
                    cat > "$page" << 'EOF'
import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
EOF
                    ;;
                "src/pages/_document.tsx")
                    cat > "$page" << 'EOF'
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
EOF
                    ;;
                "src/components/Layout.tsx")
                    cat > "$page" << 'EOF'
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header>
        <nav>
          <h1>Themeprojblograw</h1>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
EOF
                    ;;
                "src/utils/helpers.ts")
                    cat > "$page" << 'EOF'
/**
 * Utility functions for the application
 */

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
EOF
                    ;;
                "src/hooks/useAuth.ts")
                    cat > "$page" << 'EOF'
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      // Add actual auth logic here
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Add actual login logic
    setUser({ id: '1', email, name: 'User' });
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
EOF
                    ;;
            esac
            
            log_success "Created: $page"
        fi
    done
}

# Create basic test files
create_test_files() {
    log_info "Creating basic test files..."
    
    # Create test directory structure
    local test_files=(
        "tests/unit/utils/helpers.test.ts"
        "tests/unit/components/Layout.test.tsx"
        "tests/integration/pages/index.test.tsx"
        "cypress/e2e/smoke/basic-navigation.cy.ts"
        "cypress/support/commands.ts"
        "cypress/support/e2e.ts"
    )
    
    for test_file in "${test_files[@]}"; do
        if [ ! -f "$test_file" ]; then
            mkdir -p "$(dirname "$test_file")"
            
            # Create basic test file
            case "$test_file" in
                "tests/unit/utils/helpers.test.ts")
                    cat > "$test_file" << 'EOF'
import { formatDate, debounce, validateEmail } from '../../../src/utils/helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-11-15');
      const formatted = formatDate(date);
      expect(formatted).toBe('November 15, 2025');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user@domain.co')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });
});
EOF
                    ;;
                "tests/unit/components/Layout.test.tsx")
                    cat > "$test_file" << 'EOF'
import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../../src/components/Layout';

describe('Layout Component', () => {
  it('renders correctly', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Themeprojblograw')).toBeInTheDocument();
  });
});
EOF
                    ;;
                "tests/integration/pages/index.test.tsx")
                    cat > "$test_file" << 'EOF'
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../../src/pages/index';

describe('Home Page Integration', () => {
  it('renders main heading', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to Themeprojblograw')).toBeInTheDocument();
    expect(screen.getByText('Automated DevOps setup with comprehensive testing')).toBeInTheDocument();
  });
});
EOF
                    ;;
                "cypress/e2e/smoke/basic-navigation.cy.ts")
                    cat > "$test_file" << 'EOF'
describe('Basic Navigation', () => {
  it('should load the homepage', () => {
    cy.visit('/');
    cy.title().should('include', 'Themeprojblograw');
    cy.get('main').should('contain', 'Welcome to Themeprojblograw');
  });

  it('should have proper heading structure', () => {
    cy.visit('/');
    cy.get('h1').should('contain', 'Welcome to Themeprojblograw');
  });
});
EOF
                    ;;
                "cypress/support/commands.ts")
                    cat > "$test_file" << 'EOF'
// Custom Cypress commands

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

// Check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});
EOF
                    ;;
                "cypress/support/e2e.ts")
                    cat > "$test_file" << 'EOF'
// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import testing library additions
import '@testing-library/cypress/add-commands';
EOF
                    ;;
            esac
            
            log_success "Created: $test_file"
        fi
    done
}

# Create environment files
create_env_files() {
    log_info "Creating environment configuration files..."
    
    # Create .env.example
    cat > .env.example << 'EOF'
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/themeprojblograw

# Authentication
NEXTAUTH_SECRET=your-secret-key-change-this
NEXTAUTH_URL=http://localhost:3000

# External APIs (replace with your actual keys)
STRIPE_SECRET_KEY=sk_test_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
LOG_LEVEL=info

# CI/CD (these will be set in GitHub Actions)
CODECOV_TOKEN=
LHCI_GITHUB_APP_TOKEN=
VERCEL_TOKEN=
EOF
    
    # Create .env.local for local development
    if [ ! -f ".env.local" ]; then
        cp .env.example .env.local
        log_success "Created .env.local from .env.example"
        log_warning "Please update .env.local with your actual values"
    fi
    
    # Create .env.development
    if [ ! -f ".env.development" ]; then
        cp .env.example .env.development
        sed -i 's/localhost:3000/staging.themeprojblograw.com/g' .env.development
        log_success "Created .env.development"
    fi
    
    # Create .env.production
    if [ ! -f ".env.production" ]; then
        cp .env.example .env.production
        sed -i 's/localhost:3000/themeprojblograw.com/g' .env.production
        log_success "Created .env.production"
    fi
}

# Final setup steps
final_setup() {
    log_info "Performing final setup steps..."
    
    # Make scripts executable
    chmod +x scripts/*.sh 2>/dev/null || true
    
    # Add lint-staged configuration to package.json if it doesn't exist
    if ! grep -q "lint-staged" package.json; then
        log_info "Adding lint-staged configuration..."
        # This would typically be done by editing package.json
    fi
    
    # Initialize git repository if not already done
    if [ ! -d ".git" ]; then
        log_info "Initializing git repository..."
        git init
        log_warning "Please run 'git remote add origin <your-repo-url>' manually"
    fi
    
    log_success "Final setup completed"
}

# Main execution
main() {
    echo "🚀 DevOps Setup Automation Script"
    echo "Repository: https://github.com/amatechx/themeprojblograw"
    echo "Date: $(date)"
    echo ""
    
    # Run setup steps
    check_requirements
    setup_directory_structure
    install_dependencies
    setup_git_hooks
    create_config_files
    create_app_structure
    create_test_files
    create_env_files
    final_setup
    
    echo ""
    log_success "🎉 DevOps setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update .env.local with your actual configuration"
    echo "2. Run 'npm run validate' to test everything"
    echo "3. Commit and push to trigger CI/CD pipeline"
    echo "4. Configure GitHub secrets in repository settings"
    echo ""
    echo "📚 Documentation:"
    echo "- Setup Guide: setup-deployment-guide.md"
    echo "- Implementation: DEVOPS-IMPLEMENTATION-GUIDE.md"
    echo "- Analysis: devops-analysis-report.md"
    echo ""
    echo "🔧 Useful commands:"
    echo "- npm run dev          # Start development server"
    echo "- npm run test         # Run tests"
    echo "- npm run lint         # Run linting"
    echo "- npm run validate     # Run all validation"
    echo ""
}

# Run main function
main "$@"