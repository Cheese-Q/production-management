/**
 * 基础模块的请求
 */
import fetch from '../axios/'
import { goods } from '../port_uri/index'

//1商品信息
//1.1商品信息-初始化
export function spwh_list(data) {
  var params = Object.assign({ data: data }, goods.spwh.pageBizAgriLib)
  return fetch(params);
}
//1.2商品信息-提取保存
export function spwh_save(data) {
  var params = Object.assign({ data: data }, goods.spwh.saveBizAgriLib)
  return fetch(params);
}
//1.3商品信息-数据字典
export function get_sjzd(data) {
  var params = Object.assign({ data: data }, goods.spwh.getDataByCy)
  return fetch(params);
}
// 获取商品分类
export function get_spfl(data) {
  var params = Object.assign({ data: data }, goods.spwh.get_spfl)
  return fetch(params);
}

//1.4商品信息-更新商品状态
export function spwh_updatestatus(data) {
  var params = Object.assign({ data: data }, goods.spwh.updateBizAgriLibDelFlag)
  return fetch(params);
}
//1.5商品信息-更新提取商品信息
export function updateBizAgriLib(data) {
  var params = Object.assign({ data: data }, goods.spwh.updateBizAgriLib)
  return fetch(params);
}
//1.6商品信息-获取商品信息
export function getBizAgriLib(data) {
  var params = Object.assign({ data: data }, goods.spwh.getBizAgriLibById)
  return fetch(params);
}
//2.1商品申请-初始化
export function spsq_list(data) {
  var params = Object.assign({ data: data }, goods.spwh.pageNzsqb)
  return fetch(params);
}
//2.1商品申请-保存
export function spsq_save(data) {
  var params = Object.assign({ data: data }, goods.spwh.saveNzsqb)
  return fetch(params);
}

// 多单位保存
export function dw_save(data) {
  var params = Object.assign({ data: data }, goods.spwh.saveDw)
  return fetch(params);
}
