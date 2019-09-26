module.exports = {
  publicPath: process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.BUILD_ENV === 'electron'
      ? `${process.cwd()}/dist_electron/build/`
      : '/',
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'produc.dev',
        mac: {
          category: 'your.app.category.type'
        }
      }
    }
  }
}
