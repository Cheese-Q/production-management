/**
 * 基础模块的请求
 */
import fetch from '../axios/'
import { retail } from '../port_uri/index'

//1.会员信息页面
//1.1会员信息-初始化
export function hyxx_list(data) {
  var params = Object.assign({data:data},retail.hyxx.pageHyb)
  return fetch(params);
}
//1.2会员信息-保存修改
export function hyxx_save(data) {
  var params = Object.assign({data:data},retail.hyxx.saveHyb)
  return fetch(params);
}
//1.3会员信息-手机号唯一性校验
export function hyxx_exist(data) {
  var params = Object.assign({data:data},retail.hyxx.checkHysjhm)
  return fetch(params);
}
//1.4会员信息-更新状态
export function user_status(data) {
  var params = Object.assign({data:data},retail.hyxx.updateHybztById)
  return fetch(params);
}
//1.5零售信息-零售单
export function getLsd(data) {
  var params = Object.assign({data:data},retail.lsdxx.pageLsd)
  return fetch(params);
}
