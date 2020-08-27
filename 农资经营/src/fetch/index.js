/**
 * api请求索引
 *
 */

//导入模块
import * as api_base from './api/base'
import * as api_goods from './api/goods'
import * as api_purchase from './api/purchase'
import * as api_retail from './api/retail'
import * as api_stock from './api/stock'
import * as api_finance from './api/finance'
import * as api_statistics from './api/statistics'
import * as api_wholesale from './api/wholesale'

const apiObj = {
  api_base,
  api_goods,
  api_purchase,
  api_stock,
  api_retail,
  api_finance,
  api_statistics,
  api_wholesale
}

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  //定义属性到Vue原型中
  Object.defineProperties(Vue.prototype, {
    $fetch: {
      get() {
        return apiObj
      }
    }
  })
}

export default {
  install
}
