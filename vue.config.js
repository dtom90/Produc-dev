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
        productName: 'Produc-dev',
        mac: {
          category: 'public.app-category.productivity',
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: 'build/entitlements.mac.plist',
          entitlementsInherit: 'build/entitlements.mac.plist'
        },
        afterSign: 'scripts/notarize.js'
      }
    }
  }
}
