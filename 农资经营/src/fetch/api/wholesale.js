/**
 * 基础模块的请求
 */
import fetch from '../axios/'
import {wholesale} from '../port_uri/index'

//1.6往来单位-根据区域代码和长度查询区域信息列表
export function xsck_list(data) {
  var params = Object.assign({data:data},wholesale.xsck.pageSaleInfo)
  return fetch(params);
}
