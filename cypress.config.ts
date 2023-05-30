import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    baseUrl: `http://localhost:${process.env.PORT || 3000}`,
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
  env: {
    REACT_APP_API_HOST: 'http://localhost:3000',
    REACT_APP_ENABLE_MOCK_API: 'true',
    REACT_APP_GRAASP_APP_KEY: 'my-ke',
    REACT_APP_VERSION: process.env.REACT_APP_VERSION,
  },
});
