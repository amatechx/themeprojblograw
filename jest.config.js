module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  
  // Module file extensions
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
  ],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
  },
  
  // Test coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/index.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
  ],
  
  // Coverage output directory
  coverageDirectory: 'coverage',
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/dist/',
    '/build/',
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(@?react-aria|@react-aria)/)',
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setupTests.js',
  ],
  
  // Global test globals
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  
  // Snapshot serializers
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Reset mocks between tests
  resetMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Error on deprecated features
  errorOnDeprecated: false,
  
  // Run tests serially
  runInBand: process.env.CI === 'true',
  
  // Maximum workers
  maxWorkers: process.env.CI ? 2 : '50%',
  
  // Test timeout
  testTimeout: 10000,
  
  // Report test results
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
        ancestorSeparator: ' › ',
        uniqueOutputName: 'false',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: 'test-results',
        filename: 'report.html',
        expand: true,
        inlineAssets: true,
      },
    ],
  ],
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  
  // Custom resolvers
  resolver: null,
  
  // Additional module paths
  modulePaths: ['<rootDir>'],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  
  // Projects (for monorepo support)
  projects: null,
  
  // Run tests by path patterns
  testPathPattern: '',
  
  // Find related tests for changed files
  findRelatedTests: false,
  
  // Notify
  notify: false,
  
  // Notify mode
  notifyMode: 'failure-change',
  
  // Bail
  bail: false,
  
  // Changed files with sinit
  changedSince: null,
  
  // Detect pending tests
  detectPendingTests: false,
  
  // Detect open handles
  detectOpenHandles: false,
  
  // Force exit
  forceExit: false,
  
  // Update snapshots
  updateSnapshot: false,
  
  // Watch all
  watchAll: false,
  
  // Debug tests
  debugTests: false,
  
  // Test runner
  runner: 'jest-runner',
  
  // Run tests with coverage
  collectCoverageOnlyFrom: null,
  
  // Coverage path ignore patterns
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/test-results/',
  ],
  
  // Global setup
  globalSetup: null,
  
  // Global teardown
  globalTeardown: null,
  
  // Test runner jest-runner-eslint
  runner: 'jest-runner',
};