var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 3001,
    //是否自动打开浏览器
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    //本地请求设置代理 默认 http://localhost:3000 ===  'http://118.178.94.186:8088' 
    proxyTable: {
      // '/hnyktService': 'http://192.168.0.33:8081'//开发
      '/httpService3.0.6': 'http://192.168.31.158:8081'//开发
      // '/httpService3.0': 'http://nycs.zjligeng.com'//测试
    },
    cssSourceMap: false
  }
}
