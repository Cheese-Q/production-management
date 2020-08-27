var path = require('path')
var time = new Date();
var projectName="ncp";
var buildTime = time.getDate() + "_" + (Number(time.getMonth()) + 1) + "_" + time.getHours() + "." + time.getMinutes();
var fileName = projectName + buildTime;

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/'+fileName+'/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/'+fileName),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 3008,
    //是否自动打开浏览器
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    //本地请求设置代理 默认 http://localhost:3000 ===  'http://47.96.250.111:8088' 
    proxyTable: {
      '/httpService3.0.6': 'http://192.168.31.158:8081'
      // '/httpService3.0.6': 'http://192.168.0.33:8081'
      // '/httpService3.0.5': 'http://101.37.33.64:8380'//测试
    },
    cssSourceMap: false
  }
}
