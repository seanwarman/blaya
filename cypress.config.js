import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '95xgfq',
  video: false,
  experimentalInteractiveRunEvents: false,
  numTestsKeptInMemory: 1,
  screenshotOnRunFailure: false,
  waitForAnimations: true,
  animationDistanceThreshold: 100,
  viewportWidth: 1920,
  viewportHeight: 1720,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*',
  },
});
