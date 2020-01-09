const webpackConfig = {
  publicPath: process.env.BASE_URL ? process.env.BASE_URL : '/',
  configureWebpack: {
    plugins: [],
    resolve: {
      alias: {
        vuedraggable: 'vuedraggable/src/vuedraggable'
      }
    },
    externals: {
      moment: 'moment'
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
        appId: 'app.devtrack',
        productName: 'DevTrack',
        mac: {
          category: 'public.app-category.productivity'
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
