const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL for the application
    baseUrl: 'http://localhost:3000',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test files pattern
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    
    // Support file
    supportFile: 'cypress/support/e2e.js',
    
    // Fixtures folder
    fixturesFolder: 'cypress/fixtures',
    
    // Screenshots and videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    screenshotOnRunFailure: true,
    
    // Test settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 30000,
    chromeWebSecurity: false,
    
    // Environment variables
    env: {
      apiUrl: 'http://localhost:3000/api',
      username: 'testuser',
      password: 'testpassword123',
      adminUsername: 'admin',
      adminPassword: 'admin123',
    },
    
    // Retry settings
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Reporter configuration
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter-config.json',
    },
    
    // Test settings
    defaultBrowser: 'electron',
    experimentalStudio: false,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
      // Task for seeding database
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        seedDatabase() {
          // Database seeding logic
          return null;
        },
        
        clearDatabase() {
          // Database cleanup logic
          return null;
        },
      });
      
      // Plugin for handling file downloads
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          // Configure download directory
          launchOptions.preferences.default_content_setting_values = {
            notifications: 2,
          };
        }
        return launchOptions;
      });
      
      // Plugin for handling file uploads
      on('before:spec', (spec) => {
        // Setup before each spec
      });
      
      // Task for handling database operations
      on('task', {
        resetDatabase() {
          // Reset database to initial state
          return null;
        },
        
        loginUser(userType = 'user') {
          // Login user and return auth token
          return null;
        },
        
        logoutUser() {
          // Logout user
          return null;
        },
      });
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
  },
});