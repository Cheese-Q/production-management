/**
 * 基础模块的请求
 */
import fetch from '../axios/'
import { finance } from '../port_uri/index'

//1.应收应付款页面
export function cwxx_list(data) {
  var params = Object.assign({data:data},finance.cwxx.pageCwhzb)
  return fetch(params);
}
