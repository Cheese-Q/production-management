/**
 * 基础模块的请求
 */
import fetch from '../axios/'
import { base } from '../port_uri/index'

//1.用户信息页面
//1.1用户信息-初始化
export function yhxx_list(data) {
  var params = Object.assign({data:data},base.yhxx.pageBizUser)
  return fetch(params);
}
//1.2用户信息-保存修改
export function yhxx_save(data) {
  var params = Object.assign({data:data},base.yhxx.saveBizUser)
  return fetch(params);
}
//1.3用户信息-唯一性校验
export function yhxx_exist(data) {
  var params = Object.assign({data:data},base.yhxx.checkDataIsExist)
  return fetch(params);
}
//1.4用户信息-更新状态
export function user_status(data) {
  var params = Object.assign({data:data},base.yhxx.updateBizUserZt)
  return fetch(params);
}
//用户登录
export function user_login(data) {
  var params = Object.assign({data: data}, base.yhxx.userLogin)
  return fetch(params);
}
//用户登录
export function update_pwd(data) {
    var params = Object.assign({data:data},base.yhxx.updatePwd)
    return fetch(params);
}

//2.主体信息页面
//2.1主体信息-基本信息初始化
export function ztxx_get(data) {
  var params = Object.assign({data:data},base.ztxx.getManagementById)
  return fetch(params);
}
//2.1主体信息-保存修改
export function ztxx_save(data) {
  var params = Object.assign({data:data},base.ztxx.saveManagement)
  return fetch(params);
}

//3.参数设置页面
//3.1参数设置-初始化
export function cssz_get(data) {
  var params = Object.assign({data:data},base.cssz.getNzsyParamByBizId)
  return fetch(params);
}
//3.2参数设置-保存
export function cssz_save(data) {
  var params = Object.assign({data:data},base.cssz.saveNzsyParam)
  return fetch(params);
}
//4.许可证信息
//4.1许可证信息-初始化
export function xkz_list(data) {
  var params = Object.assign({data:data},base.xkz.pageQyzsb)
  return fetch(params);
}
//4.2许可证信息-保存修改
export function xkz_save(data) {
  var params = Object.assign({data:data},base.xkz.saveQyzsb)
  return fetch(params);
}
//4.3许可证信息-保存修改
export function xkz_get(data) {
  var params = Object.assign({data:data},base.xkz.getQyzsb)
  return fetch(params);
}

//5打印机信息
//5.1打印机列表
export function dyj_list(data) {
  var params = Object.assign({data:data},base.dyjxx.pageZtdyj)
  return fetch(params);
}
//5.2打印机信息-保存修改
export function dyjx_save(data) {
  var params = Object.assign({data:data},base.dyjxx.saveZtdyj)
  return fetch(params);
}
//5.3打印机信息-设置默认打印机
export function dyj_status(data) {
  var params = Object.assign({data:data},base.dyjxx.updateMrZtdyj)
  return fetch(params);
}
