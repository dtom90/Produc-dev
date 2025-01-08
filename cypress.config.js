const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'tests/cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'tests/cypress/support/e2e.js',
    setupNodeEvents (on, config) {
      // implement node event listeners here
      on('task', {
        log (message) {
          // eslint-disable-next-line no-console
          console.log(message)
          return null
        }
      })
    }
  },
  env: {
    browserPermissions: {
      notifications: 'allow'
    }
  }
})
