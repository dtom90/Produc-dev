
const webpackConfig = {
  publicPath: process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.BUILD_ENV === 'electron'
      ? `${process.cwd()}/dist_electron/build/`
      : '/',
  configureWebpack: {
    plugins: [],
    resolve: {
      alias: {
        moment: 'moment/src/moment',
        vuedraggable: 'vuedraggable/src/vuedraggable'
      }
    },
    optimization: {
      splitChunks: {
        minSize: 20000,
        maxSize: 700000
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'produc.dev',
        productName: 'Produc-dev',
        mac: {
          category: 'your.app.category.type'
        }
      }
    }
  }
}

if (process.env.ANALYZE_WEBPACK) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.configureWebpack.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
