/**
 * 基础模块的请求
 */
import fetch from '../axios/'
import { statistics } from '../port_uri/index'

//1.销售统计页面
export function xsptj(data) {
  var params = Object.assign({data:data},statistics.xstj.pageXstj)
  return fetch(params);
}
export function xsxx(data) {
  var params = Object.assign({data:data},statistics.xstj.getSaleInfo)
  return fetch(params);
}
//2.进货统计页面
export function jhtj(data) {
  var params = Object.assign({data:data},statistics.jhtj.pageJhtj)
  return fetch(params);
}
//3.活跃客户统计页面
export function hykhtj(data) {
  var params = Object.assign({data:data},statistics.hykhtj.pageHykhtj)
  return fetch(params);
}
