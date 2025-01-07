const webpackConfig = {
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    }
  },
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
  chainWebpack: (config) => {
    config.module
      .rule('babel')
      .test(/\.js$/)
      .include.add(/node_modules\/chart\.js/) // Add Chart.js to transpile
      .add(/node_modules\/vue-chartjs/) // Add vue-chartjs to transpile
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .tap((options) => {
        // Merge with existing options
        return {
          ...options,
          presets: ['@babel/preset-env']
        }
      })
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js'
    }
  }
}

if (process.env.ANALYZE_WEBPACK) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.configureWebpack.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
