#!/bin/bash

# Pipeline Validation Script
# Memvalidasi konfigurasi DevOps pipeline untuk themeprojblograw
# Tanggal: 2025-11-15

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${BLUE}🔍 VALIDATION:${NC} $1"; }
log_success() { echo -e "${GREEN}✅ PASSED:${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠️  WARNING:${NC} $1"; }
log_error() { echo -e "${RED}❌ FAILED:${NC} $1"; }

# Validation counters
passed_tests=0
failed_tests=0
warning_count=0

# Test results tracking
declare -A test_results

# Run validation test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="${3:-0}"
    
    log_info "Testing: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [ $? -eq $expected_result ]; then
            log_success "$test_name"
            ((passed_tests++))
            test_results["$test_name"]="PASS"
            return 0
        fi
    fi
    
    log_error "$test_name"
    ((failed_tests++))
    test_results["$test_name"]="FAIL"
    return 1
}

# Check file existence and syntax
validate_config_files() {
    log_info "Validating configuration files..."
    
    local required_files=(
        ".github/workflows/ci-cd-pipeline.yml"
        ".eslintrc.js"
        ".prettierrc.js"
        "jest.config.js"
        "cypress.config.js"
        "package.json"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            # Check if file is valid JSON/JavaScript/ YAML
            case "$file" in
                *.json)
                    if jq empty "$file" 2>/dev/null; then
                        log_success "JSON valid: $file"
                        ((passed_tests++))
                    else
                        log_error "Invalid JSON: $file"
                        ((failed_tests++))
                    fi
                    ;;
                *.yml|*.yaml)
                    if python -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
                        log_success "YAML valid: $file"
                        ((passed_tests++))
                    else
                        log_error "Invalid YAML: $file"
                        ((failed_tests++))
                    fi
                    ;;
                *.js)
                    if node -c "$file" 2>/dev/null; then
                        log_success "JavaScript valid: $file"
                        ((passed_tests++))
                    else
                        log_error "Invalid JavaScript: $file"
                        ((failed_tests++))
                    fi
                    ;;
                *)
                    log_success "File exists: $file"
                    ((passed_tests++))
                    ;;
            esac
        else
            log_error "Missing required file: $file"
            ((failed_tests++))
        fi
    done
}

# Validate GitHub Actions workflow
validate_github_actions() {
    log_info "Validating GitHub Actions workflow..."
    
    local workflow_file=".github/workflows/ci-cd-pipeline.yml"
    
    if [ ! -f "$workflow_file" ]; then
        log_error "GitHub Actions workflow file missing"
        ((failed_tests++))
        return
    fi
    
    # Check for required workflow elements
    local required_elements=(
        "on:"
        "jobs:"
        "steps:"
        "uses:"
        "run:"
    )
    
    for element in "${required_elements[@]}"; do
        if grep -q "$element" "$workflow_file"; then
            log_success "Found required element: $element"
            ((passed_tests++))
        else
            log_warning "Missing workflow element: $element"
            ((warning_count++))
        fi
    done
    
    # Check for Node.js versions
    if grep -q "node-version" "$workflow_file"; then
        log_success "Node.js version matrix configured"
        ((passed_tests++))
    else
        log_warning "No Node.js version matrix found"
        ((warning_count++))
    fi
    
    # Check for testing stages
    local test_stages=("quality-checks" "test" "build" "e2e-tests")
    for stage in "${test_stages[@]}"; do
        if grep -q "$stage:" "$workflow_file"; then
            log_success "Test stage found: $stage"
            ((passed_tests++))
        else
            log_warning "Missing test stage: $stage"
            ((warning_count++))
        fi
    done
}

# Validate package.json scripts
validate_package_scripts() {
    log_info "Validating package.json scripts..."
    
    if [ ! -f "package.json" ]; then
        log_error "package.json not found"
        ((failed_tests++))
        return
    fi
    
    local required_scripts=(
        "lint"
        "lint:fix"
        "format:check"
        "type-check"
        "test"
        "test:coverage"
        "test:unit"
        "test:e2e"
        "build"
        "dev"
        "validate"
    )
    
    for script in "${required_scripts[@]}"; do
        if npm run-script "$script" --if-present > /dev/null 2>&1; then
            log_success "Script found: $script"
            ((passed_tests++))
        else
            log_warning "Script missing: $script"
            ((warning_count++))
        fi
    done
}

# Validate testing configuration
validate_testing_setup() {
    log_info "Validating testing setup..."
    
    # Check Jest configuration
    if [ -f "jest.config.js" ]; then
        if grep -q "collectCoverage" "jest.config.js"; then
            log_success "Jest coverage configuration found"
            ((passed_tests++))
        else
            log_warning "Jest coverage configuration missing"
            ((warning_count++))
        fi
        
        if grep -q "testEnvironment.*jsdom" "jest.config.js"; then
            log_success "Jest jsdom environment configured"
            ((passed_tests++))
        else
            log_warning "Jest jsdom environment not configured"
            ((warning_count++))
        fi
    else
        log_error "jest.config.js not found"
        ((failed_tests++))
    fi
    
    # Check Cypress configuration
    if [ -f "cypress.config.js" ]; then
        if grep -q "baseUrl" "cypress.config.js"; then
            log_success "Cypress baseUrl configured"
            ((passed_tests++))
        else
            log_warning "Cypress baseUrl not configured"
            ((warning_count++))
        fi
    else
        log_error "cypress.config.js not found"
        ((failed_tests++))
    fi
    
    # Check test directories
    local test_dirs=("tests/unit" "tests/integration" "cypress/e2e")
    for dir in "${test_dirs[@]}"; do
        if [ -d "$dir" ]; then
            log_success "Test directory exists: $dir"
            ((passed_tests++))
        else
            log_warning "Test directory missing: $dir"
            ((warning_count++))
        fi
    done
}

# Validate environment configuration
validate_environment_setup() {
    log_info "Validating environment setup..."
    
    # Check environment files
    local env_files=(".env.example" ".env.local")
    for env_file in "${env_files[@]}"; do
        if [ -f "$env_file" ]; then
            log_success "Environment file exists: $env_file"
            ((passed_tests++))
            
            # Check for required variables in .env.example
            if [ "$env_file" = ".env.example" ]; then
                local required_vars=(
                    "NEXT_PUBLIC_APP_URL"
                    "DATABASE_URL"
                    "NEXTAUTH_SECRET"
                    "SENTRY_DSN"
                )
                
                for var in "${required_vars[@]}"; do
                    if grep -q "$var=" "$env_file"; then
                        log_success "Required env var documented: $var"
                        ((passed_tests++))
                    else
                        log_warning "Required env var missing: $var"
                        ((warning_count++))
                    fi
                done
            fi
        else
            log_warning "Environment file missing: $env_file"
            ((warning_count++))
        fi
    done
}

# Validate security configuration
validate_security_setup() {
    log_info "Validating security setup..."
    
    # Check .gitignore
    if [ -f ".gitignore" ]; then
        local gitignore_patterns=(
            "node_modules"
            ".env"
            ".DS_Store"
            "coverage"
        )
        
        for pattern in "${gitignore_patterns[@]}"; do
            if grep -q "$pattern" ".gitignore"; then
                log_success ".gitignore pattern found: $pattern"
                ((passed_tests++))
            else
                log_warning ".gitignore pattern missing: $pattern"
                ((warning_count++))
            fi
        done
    else
        log_error ".gitignore file missing"
        ((failed_tests++))
    fi
    
    # Check for security dependencies in package.json
    if [ -f "package.json" ]; then
        if grep -q "audit" "package.json"; then
            log_success "npm audit script found"
            ((passed_tests++))
        else
            log_warning "npm audit script missing"
            ((warning_count++))
        fi
    fi
    
    # Check Husky setup
    if [ -d ".husky" ]; then
        log_success "Husky directory exists"
        ((passed_tests++))
        
        if [ -f ".husky/pre-commit" ]; then
            log_success "Pre-commit hook configured"
            ((passed_tests++))
        else
            log_warning "Pre-commit hook missing"
            ((warning_count++))
        fi
    else
        log_warning "Husky not configured"
        ((warning_count++))
    fi
}

# Validate Docker setup
validate_docker_setup() {
    log_info "Validating Docker setup..."
    
    if [ -f "Dockerfile" ]; then
        log_success "Dockerfile exists"
        ((passed_tests++))
        
        # Check for multi-stage build
        if grep -q "FROM.*AS" "Dockerfile"; then
            log_success "Multi-stage Docker build configured"
            ((passed_tests++))
        else
            log_warning "Single-stage Docker build (consider optimization)"
            ((warning_count++))
        fi
        
        # Check for security best practices
        if grep -q "USER.*node" "Dockerfile"; then
            log_success "Non-root user configured in Docker"
            ((passed_tests++))
        else
            log_warning "Docker running as root (security concern)"
            ((warning_count++))
        fi
    else
        log_warning "Dockerfile missing"
        ((warning_count++))
    fi
    
    if [ -f "docker-compose.yml" ]; then
        log_success "Docker Compose file exists"
        ((passed_tests++))
    else
        log_warning "Docker Compose file missing"
        ((warning_count++))
    fi
}

# Run local validation tests
run_local_validation() {
    log_info "Running local validation tests..."
    
    # Test local commands
    local commands_to_test=(
        "node --version"
        "npm --version"
        "npm run lint --if-present"
        "npm run type-check --if-present"
        "git status"
    )
    
    for cmd in "${commands_to_test[@]}"; do
        if eval "$cmd" > /dev/null 2>&1; then
            log_success "Command available: $cmd"
            ((passed_tests++))
        else
            log_warning "Command failed or missing: $cmd"
            ((warning_count++))
        fi
    done
    
    # Test if all config files are syntactically correct
    if [ -f ".eslintrc.js" ] && node -c ".eslintrc.js" > /dev/null 2>&1; then
        log_success "ESLint configuration valid"
        ((passed_tests++))
    else
        log_error "ESLint configuration invalid"
        ((failed_tests++))
    fi
    
    if [ -f "jest.config.js" ] && node -c "jest.config.js" > /dev/null 2>&1; then
        log_success "Jest configuration valid"
        ((passed_tests++))
    else
        log_error "Jest configuration invalid"
        ((failed_tests++))
    fi
}

# Check for GitHub Actions environment
check_github_environment() {
    log_info "Checking GitHub Actions environment..."
    
    # Check if running in GitHub Actions
    if [ "$CI" = "true" ] || [ -n "$GITHUB_ACTIONS" ]; then
        log_success "Running in GitHub Actions environment"
        ((passed_tests++))
        
        # Check for required GitHub variables
        local github_vars=("GITHUB_REPOSITORY" "GITHUB_RUN_ID" "GITHUB_SHA")
        for var in "${github_vars[@]}"; do
            if [ -n "${!var}" ]; then
                log_success "GitHub variable available: $var"
                ((passed_tests++))
            else
                log_warning "GitHub variable missing: $var"
                ((warning_count++))
            fi
        done
    else
        log_info "Not running in GitHub Actions (local environment)"
        ((passed_tests++))
        
        # Check if local setup is complete
        if [ -d ".git" ]; then
            log_success "Git repository initialized"
            ((passed_tests++))
        else
            log_warning "Git repository not initialized"
            ((warning_count++))
        fi
    fi
}

# Generate validation report
generate_report() {
    echo ""
    echo "📊 Validation Report"
    echo "=================="
    echo "Date: $(date)"
    echo "Repository: $(git remote get-url origin 2>/dev/null || echo 'Not configured')"
    echo ""
    echo "Results Summary:"
    echo "✅ Passed: $passed_tests"
    echo "❌ Failed: $failed_tests"
    echo "⚠️  Warnings: $warning_count"
    echo ""
    
    # Overall status
    if [ $failed_tests -eq 0 ]; then
        if [ $warning_count -eq 0 ]; then
            echo "🎉 STATUS: EXCELLENT - All validations passed!"
            return 0
        else
            echo "✅ STATUS: GOOD - All critical validations passed (with warnings)"
            return 0
        fi
    else
        echo "❌ STATUS: FAILED - Critical issues found"
        return 1
    fi
}

# Print detailed results
print_detailed_results() {
    echo ""
    echo "Detailed Results:"
    echo "================"
    
    for test_name in "${!test_results[@]}"; do
        local result="${test_results[$test_name]}"
        case "$result" in
            "PASS")
                echo "✅ $test_name"
                ;;
            "FAIL")
                echo "❌ $test_name"
                ;;
        esac
    done
}

# Main validation function
main() {
    echo "🔍 Pipeline Validation Script"
    echo "Repository: themeprojblograw"
    echo "Date: $(date)"
    echo ""
    
    # Run all validations
    validate_config_files
    validate_github_actions
    validate_package_scripts
    validate_testing_setup
    validate_environment_setup
    validate_security_setup
    validate_docker_setup
    run_local_validation
    check_github_environment
    
    # Generate final report
    if generate_report; then
        print_detailed_results
        echo ""
        echo "🚀 Ready for deployment!"
        echo ""
        echo "Next steps:"
        echo "1. Address any failed validations"
        echo "2. Review warnings and consider improvements"
        echo "3. Run 'npm run validate' for local testing"
        echo "4. Commit and push to trigger CI/CD pipeline"
        exit 0
    else
        print_detailed_results
        echo ""
        echo "🔧 Please fix failed validations before proceeding"
        echo ""
        echo "Common fixes:"
        echo "- Ensure all required files exist"
        echo "- Check configuration syntax"
        echo "- Verify package.json scripts"
        echo "- Setup Git hooks with 'npm run prepare'"
        exit 1
    fi
}

# Run main function
main "$@"