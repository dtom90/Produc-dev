const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
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
  }
})
