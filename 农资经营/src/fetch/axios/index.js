/**
 * @intro: 数据请求统一封装.
 */

//导入模块
import axios from 'axios'
import * as responseCode from './responseCode'
import {pjConfig} from './config'
import router from 'src/router'
import {Message} from 'element-ui'
import store from 'store'
import {tools_uri} from 'common/tools'

async function fetchbase(options) {
  //创建一个axios实例
  const instance = axios.create({
    //设置默认根地址
    baseURL: process.env.NODE_ENV === 'development'? pjConfig.serviceName:pjConfig.server_base_url+pjConfig.serviceName,
    //设置请求超时设置
    timeout: 10000,
    withCredentials: true
  })
  //请求处理过程报错
  try{
    var {data} = await instance(options);
  }catch(err){
    console.error('网络中断或者接口错误！');
    return Promise.reject(err);
  }
  //请求响应处理
  if (data.resCode === responseCode.success) {
    return Promise.resolve(data)
  } else if(data.resCode === responseCode.error ){
    Message({type:'error',message:data.errorMess})
    return Promise.reject(data)
  }else if (data.resCode === responseCode.unlogin) {
    //用户未登录的处理
    localStorage.removeItem('userInfo');
    store.dispatch('setUserInfo')
    Message({type:'error',message:'登录失效，请重新登录！'})
    setTimeout(()=>{
      router.replace({name: "login"})
    },1000)
  }else{
    return Promise.reject(data);
  }
}

const fetch = async function(options){
  if(options.method!=='upload'){
    if(options.data &&  typeof options.data ==='object'){
      var params={};
      for(var i in options.data){
        options.data[i]===0 || options.data[i]?  params[i]=String(options.data[i]):'';
      }
      //判断登录是否失效sessionKey
      if(store.getters.getUserInfo){
        params.sessionKey = store.getters.getUserInfo.sessionKey;
      }
      console.log(store.getters.getUserInfo);
      console.log(store.getters.getUserInfo);
      //参数操作终端  1-PC端 2-移动端
      params.xtczzd = "1";
      options.data = params;
    }
    //参数会进行编译，开发环境则打印参数，可删除
    if(process.env.NODE_ENV==='development'){
      console.log(options);
      console.log(options.data);
    }
    if(options.method==='get'){
      options.data = options.data &&  typeof options.data ==='object' ? tools_uri.encode(JSON.stringify(options.data)):'';
      options.url = options.url +  options.data;
      delete options.data
    }
    options.headers={
      'Content-Type':"text/plain;charset=UTF-8",
      "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
    }
  }else{
    options.method="post"
  }
  return await fetchbase(options)
}

export default fetch;
