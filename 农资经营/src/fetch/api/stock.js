/**
 * 基础模块的请求
 */
import fetch from '../axios/'
import {stock} from '../port_uri/index'

//1仓库管理
//1.1库存信息-初始化
export function ckgl_kclist(data) {
  var params = Object.assign({data:data},stock.ckgl.pageKcb)
  return fetch(params);
}
//1.2库存信息-初始化
export function ckgl_kc(data) {
  var params = Object.assign({data:data},stock.ckgl.pagePckc)
  return fetch(params);
}
//2.1库存预警信息-初始化
export function ckgl_kcyjlist(data) {
  var params = Object.assign({data:data},stock.ckgl.pagePckcb)
  return fetch(params);
}
//2.1库存预警信息-预警处理
export function ckgl_yjkc(data) {
  var params = Object.assign({data:data},stock.ckgl.getPckcbById)
  return fetch(params);
}
//2.1库存预警信息-预警处理
export function ckgl_saveyj(data) {
  var params = Object.assign({data:data},stock.ckgl.clPckcb)
  return fetch(params);
}
