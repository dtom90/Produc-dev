// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  publicPath: process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.BUILD_ENV === 'electron'
      ? `${process.cwd()}/dist_electron/build/`
      : '/',
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()],
    resolve: {
      alias: {
        jquery: 'jquery/src/jquery',
        moment: 'moment/src/moment',
        moment$: 'moment/moment.js',
        vuedraggable: 'vuedraggable/src/vuedraggable'
      }
    },
    optimization: {
      splitChunks: {
        // include all types of chunks
        maxSize: 750000
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
