const webpack = require('webpack')

const webpackConfig = {
  publicPath: process.env.BASE_URL ? process.env.BASE_URL : '/',
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) // Ignore all locale files of moment.js
    ],
    resolve: {
      alias: {
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
