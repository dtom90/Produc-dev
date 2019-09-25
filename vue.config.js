module.exports = {
  publicPath: process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.BUILD_ENV === 'electron'
      ? `${process.cwd()}/dist_electron/build/`
      : '/'
}
