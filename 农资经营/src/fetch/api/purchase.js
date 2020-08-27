/**
 * 基础模块的请求
 */
import fetch from '../axios/'
import {purchase} from '../port_uri/index'

//1进货信息
//1.1往来单位信息-初始化
export function wldw_list(data) {
  var params = Object.assign({data:data},purchase.wldw.pageBizSupplier)
  return fetch(params);
}
//1.2往来单位-提取保存
export function wldw_save(data) {
  var params = Object.assign({data:data},purchase.wldw.saveBizSupplier)
  return fetch(params);
}
//1.4往来单位-更新商品状态
export function wldw_updatestatus(data) {
  var params = Object.assign({data:data},purchase.wldw.updateBizSupplier)
  return fetch(params);
}
//1.6往来单位-获取单位信息
export function wldw_getBizAgriLib(data) {
  var params = Object.assign({data:data},purchase.wldw.getBizSupplierById)
  return fetch(params);
}
//1.6往来单位-根据区域代码和长度查询区域信息列表
export function wldw_slistQybNew(data) {
  var params = Object.assign({data:data},purchase.wldw.listQybNew)
  return fetch(params);
}

//1.6采购入库
export function cgrk_list(data) {
  var params = Object.assign({data:data},purchase.cgrk.pagePurch)
  return fetch(params);
}
//1.6采购入库-获取最新单号
export function cgrk_getPch(data) {
  var params = Object.assign({data:data},purchase.cgrk.getPch)
  return fetch(params);
}
