#!/bin/bash

# Automated Push Script untuk DevOps Setup ke GitHub Repository
# Repository: https://github.com/amatechx/themeprojblograw
# Tanggal: 2025-11-15

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  INFO:${NC} $1"; }
log_success() { echo -e "${GREEN}✅ SUCCESS:${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠️  WARNING:${NC} $1"; }
log_error() { echo -e "${RED}❌ ERROR:${NC} $1"; }
log_step() { echo -e "${PURPLE}📋 STEP:${NC} $1"; }

# Repository configuration
REPO_URL="https://github.com/amatechx/themeprojblograw.git"
REPO_NAME="themeprojblograw"
OWNER="amatechx"

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="$SCRIPT_DIR"

# Arrays of files to push
declare -a CONFIG_FILES=(
    ".github/workflows/ci-cd-pipeline.yml"
    ".eslintrc.js"
    ".prettierrc.js"
    "jest.config.js"
    "cypress.config.js"
    "Dockerfile"
    "docker-compose.yml"
    ".env.example"
)

declare -a SCRIPT_FILES=(
    "scripts/setup-devops.sh"
    "scripts/validate-pipeline.sh"
)

declare -a DOC_FILES=(
    "README.md"
    "DEVOPS-IMPLEMENTATION-GUIDE.md"
    "setup-deployment-guide.md"
    "devops-analysis-report.md"
    "PUSH-TO-GITHUB.md"
)

declare -a APP_FILES=(
    "src/pages/api/health.ts"
)

# Check if running from correct directory
check_workspace() {
    log_step "Checking workspace directory..."
    
    if [ ! -f ".eslintrc.js" ]; then
        log_warning "Not in the main workspace directory"
        log_info "Current directory: $(pwd)"
        log_info "Files found:"
        ls -la | head -10
        log_info "Please run this script from the main DevOps workspace directory"
        exit 1
    fi
    
    log_success "Workspace directory confirmed"
}

# Create necessary directories
create_directories() {
    log_step "Creating necessary directories..."
    
    local dirs=(
        ".github/workflows"
        "scripts"
        "src/pages/api"
        "tests/unit"
        "tests/integration"
        "cypress/e2e"
        "cypress/fixtures"
        "cypress/support"
        "docs"
    )
    
    for dir in "${dirs[@]}"; do
        mkdir -p "$dir"
        log_success "Created directory: $dir"
    done
}

# Copy or create configuration files
setup_config_files() {
    log_step "Setting up configuration files..."
    
    # Create .github/workflows directory if not exists
    mkdir -p .github/workflows
    
    # CI/CD Pipeline
    if [ -f ".github/workflows/ci-cd-pipeline.yml" ]; then
        log_success "CI/CD pipeline file exists"
    else
        log_warning "CI/CD pipeline file not found, please ensure .github/workflows/ci-cd-pipeline.yml exists"
    fi
    
    # Essential config files
    local essential_configs=(
        ".eslintrc.js"
        ".prettierrc.js"
        "jest.config.js"
        "cypress.config.js"
        "Dockerfile"
        "docker-compose.yml"
        ".env.example"
    )
    
    for config in "${essential_configs[@]}"; do
        if [ ! -f "$config" ]; then
            log_warning "Missing config file: $config"
            log_info "Please ensure this file exists in the current directory"
        else
            log_success "Config file exists: $config"
        fi
    done
}

# Setup application structure
setup_app_structure() {
    log_step "Setting up application structure..."
    
    # Create basic Next.js application files if they don't exist
    local app_files=(
        "src/pages/index.tsx"
        "src/pages/_app.tsx"
        "src/pages/_document.tsx"
        "src/components/Layout.tsx"
        "src/utils/helpers.ts"
        "src/hooks/useAuth.ts"
    )
    
    for app_file in "${app_files[@]}"; do
        if [ ! -f "$app_file" ]; then
            log_warning "Missing application file: $app_file"
            log_info "Please ensure this file exists or create it manually"
        else
            log_success "Application file exists: $app_file"
        fi
    done
}

# Setup package.json if needed
setup_package_json() {
    log_step "Setting up package.json..."
    
    if [ ! -f "package.json" ]; then
        log_warning "package.json not found"
        log_info "Please ensure package.json exists with required scripts"
        return
    fi
    
    log_success "package.json found"
    
    # Check for essential scripts
    local required_scripts=("lint" "test" "build" "dev")
    
    for script in "${required_scripts[@]}"; do
        if grep -q "\"$script\"" package.json; then
            log_success "Script found: $script"
        else
            log_warning "Missing script: $script"
        fi
    done
}

# Create .gitignore if not exists
setup_gitignore() {
    log_step "Setting up .gitignore..."
    
    if [ ! -f ".gitignore" ]; then
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
        log_success "Created .gitignore file"
    else
        log_success ".gitignore file exists"
    fi
}

# Check Git repository
check_git_repository() {
    log_step "Checking Git repository..."
    
    if [ ! -d ".git" ]; then
        log_warning "Not a Git repository"
        log_info "Initializing Git repository..."
        
        git init
        
        # Set default branch
        git branch -M main
        
        # Add remote origin
        log_info "Adding remote origin: $REPO_URL"
        git remote add origin "$REPO_URL"
        
        log_success "Git repository initialized and remote added"
    else
        log_success "Git repository exists"
        
        # Check current remote
        local current_remote=$(git remote get-url origin 2>/dev/null || echo "")
        if [ "$current_remote" != "$REPO_URL" ]; then
            log_info "Current remote: $current_remote"
            log_info "Expected remote: $REPO_URL"
            log_warning "Remote URLs don't match"
            log_info "Updating remote URL..."
            git remote set-url origin "$REPO_URL"
        fi
    fi
}

# Check GitHub CLI
check_github_cli() {
    log_step "Checking GitHub CLI..."
    
    if command -v gh &> /dev/null; then
        local gh_version=$(gh --version | head -1)
        log_success "GitHub CLI found: $gh_version"
        
        # Check if authenticated
        if gh auth status &> /dev/null; then
            log_success "GitHub CLI authenticated"
        else
            log_warning "GitHub CLI not authenticated"
            log_info "Please run: gh auth login"
            return 1
        fi
    else
        log_warning "GitHub CLI not found"
        log_info "Please install GitHub CLI: https://cli.github.com/"
        return 1
    fi
    
    return 0
}

# Check repository access
check_repository_access() {
    log_step "Checking repository access..."
    
    # Check if repository exists and is accessible
    if gh repo view "$OWNER/$REPO_NAME" &> /dev/null; then
        log_success "Repository accessible: $OWNER/$REPO_NAME"
        
        # Get repository info
        local repo_info=$(gh repo view "$OWNER/$REPO_NAME" --json name,url,defaultBranch)
        log_info "Repository info: $repo_info"
        
        return 0
    else
        log_error "Repository not accessible: $OWNER/$REPO_NAME"
        log_info "Possible reasons:"
        log_info "1. Repository doesn't exist"
        log_info "2. No access permissions"
        log_info "3. Repository is private and you don't have access"
        
        log_info "Please ensure:"
        log_info "1. Repository exists: $REPO_URL"
        log_info "2. You have push permissions"
        log_info "3. GitHub CLI is authenticated"
        
        return 1
    fi
}

# Stage all changes
stage_changes() {
    log_step "Staging all changes..."
    
    # Add all files
    git add .
    
    local staged_files=$(git diff --staged --name-only)
    if [ -z "$staged_files" ]; then
        log_warning "No changes to stage"
        return 1
    fi
    
    log_success "Staged files:"
    echo "$staged_files" | head -10
    if [ $(echo "$staged_files" | wc -l) -gt 10 ]; then
        log_info "... and $(($(echo "$staged_files" | wc -l) - 10) more files"
    fi
    
    return 0
}

# Create commit
create_commit() {
    log_step "Creating commit..."
    
    local commit_message="feat: comprehensive DevOps setup with automated testing and code quality

🚀 CI/CD Pipeline:
- GitHub Actions workflow dengan multi-stage testing
- Automated code quality checks (ESLint, Prettier, TypeScript)
- Security scanning dengan CodeQL dan npm audit
- Performance testing dengan Lighthouse CI
- Containerized deployment dengan Docker

🧪 Testing Framework:
- Jest untuk unit & integration testing
- Cypress untuk end-to-end testing  
- React Testing Library untuk component testing
- Code coverage reporting dengan Codecov

⚙️ Code Quality:
- ESLint dengan TypeScript, React, accessibility rules
- Prettier untuk consistent code formatting
- Husky git hooks untuk pre-commit validation
- Comprehensive npm scripts suite

🐳 Containerization:
- Multi-stage Docker build untuk production optimization
- Docker Compose untuk full stack development
- Health checks dan monitoring integration
- Security best practices (non-root user)

📊 Monitoring & Documentation:
- Health check API endpoint
- Comprehensive documentation setup
- Pipeline validation scripts
- Deployment automation guides

Ready for production deployment dengan enterprise-grade DevOps practices."

    # Check if there are changes to commit
    if git diff --staged --quiet; then
        log_warning "No changes to commit"
        return 1
    fi
    
    git commit -m "$commit_message"
    log_success "Commit created successfully"
    
    # Show commit info
    log_info "Commit hash: $(git rev-parse HEAD)"
    log_info "Commit message: $(git log -1 --pretty=format:%s)"
    
    return 0
}

# Push to repository
push_to_repository() {
    log_step "Pushing to repository..."
    
    # Get current branch
    local current_branch=$(git branch --show-current)
    log_info "Current branch: $current_branch"
    
    # Push with upstream tracking
    if git push -u origin "$current_branch" --follow-tags; then
        log_success "Successfully pushed to $OWNER/$REPO_NAME"
        
        # Get repository URL
        local repo_url=$(gh repo view "$OWNER/$REPO_NAME" --json url --jq .url)
        log_info "Repository URL: $repo_url"
        
        # Show relevant links
        echo ""
        log_success "🎉 Push completed successfully!"
        echo ""
        echo -e "${BLUE}📋 Repository Links:${NC}"
        echo "🌐 Repository: $repo_url"
        echo "🔄 Actions: $repo_url/actions"
        echo "🔒 Security: $repo_url/security"
        echo "📊 Insights: $repo_url/pulse"
        echo "⚙️ Settings: $repo_url/settings"
        echo ""
        
        # Show next steps
        echo -e "${YELLOW}📋 Next Steps:${NC}"
        echo "1. Setup GitHub Secrets: $repo_url/settings/secrets/actions"
        echo "2. Configure Branch Protection: $repo_url/settings/branches"
        echo "3. Enable GitHub Actions: $repo_url/actions"
        echo "4. Review CI/CD Pipeline: $repo_url/actions"
        echo "5. Test Pipeline dengan membuat test PR"
        echo ""
        
        return 0
    else
        log_error "Failed to push to repository"
        return 1
    fi
}

# Create Pull Request (optional)
create_pull_request() {
    log_step "Creating Pull Request..."
    
    # Check if we should create a PR
    local current_branch=$(git branch --show-current)
    if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
        log_info "Currently on $current_branch branch, skipping PR creation"
        return 0
    fi
    
    local pr_body="## 🚀 DevOps Setup Implementation

This PR implements comprehensive DevOps infrastructure untuk themeprojblograw repository:

### ✅ Implemented Features:
- **CI/CD Pipeline**: GitHub Actions dengan multi-stage testing
- **Code Quality**: ESLint, Prettier, TypeScript integration
- **Testing Framework**: Jest + Cypress dengan comprehensive coverage
- **Containerization**: Docker multi-stage builds
- **Security**: CodeQL scanning, dependency audit
- **Monitoring**: Health checks, performance tracking
- **Documentation**: Setup guides, implementation documentation

### 🔧 Required Setup:
1. Configure GitHub Secrets (see PUSH-TO-GITHUB.md)
2. Enable GitHub Actions di repository settings
3. Setup environment variables
4. Configure branch protection rules

### 📊 Expected Results:
- Automated testing pada setiap PR
- Code quality enforcement
- Security vulnerability detection  
- Performance monitoring
- Production-ready deployment

### 🎯 Testing:
Please test the setup by:
1. Creating a test branch
2. Making changes dan commit
3. Verifying CI/CD pipeline runs
4. Checking all quality gates pass

Ready untuk team review dan merge!"

    if gh pr create \
        --title "feat: comprehensive DevOps infrastructure setup" \
        --body "$pr_body" \
        --head "$current_branch" \
        --base main \
        --label "devops,testing,ci-cd,documentation"; then
        log_success "Pull Request created successfully"
        
        # Get PR URL
        local pr_url=$(gh pr view --json url --jq .url)
        log_info "PR URL: $pr_url"
        
        return 0
    else
        log_warning "Failed to create Pull Request"
        log_info "You can create PR manually di: $REPO_URL/pulls"
        return 1
    fi
}

# Main execution function
main() {
    echo "🚀 Automated DevOps Push Script"
    echo "Repository: $REPO_URL"
    echo "Date: $(date)"
    echo ""
    
    # Run all setup steps
    check_workspace
    create_directories
    setup_config_files
    setup_app_structure
    setup_package_json
    setup_gitignore
    check_git_repository
    
    # Git operations
    if stage_changes; then
        if create_commit; then
            if push_to_repository; then
                # Ask if user wants to create PR
                echo -e "${YELLOW}🤔 Create Pull Request? (y/N)${NC}"
                read -r create_pr
                
                if [[ "$create_pr" =~ ^[Yy]$ ]]; then
                    if check_github_cli && check_repository_access; then
                        create_pull_request
                    fi
                else
                    log_info "Skipping Pull Request creation"
                    log_info "You can create PR manually di: $REPO_URL/pulls/new"
                fi
            else
                log_error "Failed to push to repository"
                log_info "Please check:"
                log_info "1. GitHub CLI authentication: gh auth status"
                log_info "2. Repository access permissions"
                log_info "3. Network connectivity"
                exit 1
            fi
        else
            log_warning "No changes to commit or commit failed"
            log_info "Please check if there are files to commit"
        fi
    else
        log_warning "No changes to stage"
        log_info "All files are already up to date"
    fi
    
    echo ""
    log_success "🎉 Script execution completed!"
}

# Run main function
main "$@"