/*
 * @Author: 龚铱白
 * @Date: 2019-08-14 19:26:40
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-08-15 09:56:19
 * @Description: 
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//页面的壳
import viewPageComponent from 'pages/App'

//home
import homeComponent from 'pages/home'
//login
import loginComponent from 'pages/login/index'

//base基础模块的页面
import mainInfo from 'pages/base/mainInfo'
import userInfo from 'pages/base/userInfo'
import settingInfo from 'pages/base/settingInfo'
import printInfo from 'pages/base/printInfo'
import bpurchaseUnit from 'pages/base/purchaseUnit'

//goods商品模块的页面
import goodsMaintain from 'pages/goods/goodsMaintain'
import goodsJl from 'pages/goods/goodsJl'
import goodsApply from 'pages/goods/goodsApply'
import goodsFl from 'pages/goods/goodsFl'

//purchase模块的页面
import purchaseUnit from 'pages/purchase/purchaseUnit'
import purchaseList from 'pages/purchase/purchaseList'
import jhthd from 'pages/purchase/jhthd'
import supplierList from 'pages/purchase/supplierList'

//wholesale批发模块的页面
import wholesaleList from 'pages/wholesale/wholesaleList'
import wholesaleUnit from 'pages/wholesale/wholesaleUnit'
import xsthd from 'pages/wholesale/xsthd'
import customerList from 'pages/wholesale/customerList'

//retail零售模块的页面
import member from 'pages/retail/member'
import retailList from 'pages/retail/retailList'
import retailSearch from 'pages/retail/retailSearch'
import lsthd from 'pages/retail/lsthd'
//stock模块的页面
import stockInfo from 'pages/stock/stockInfo'
import stockWarn from 'pages/stock/stockWarn'
import pddInfo from 'pages/stock/pddInfo'

//finance财务模块的页面
import ysyfk from 'pages/finance/ysyfk'
import hyysk from 'pages/finance/hyysk'
import fkd from 'pages/finance/fkd'
import skd from 'pages/finance/skd'

//statistics统计模块的页面
import xstj from 'pages/statistics/xstj'
import jhtj from 'pages/statistics/jhtj'
import hykhtj from 'pages/statistics/hykhtj'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: loginComponent
}, {
  path: '/',
  component: viewPageComponent,
  redirect: '/home',
  children: [{
    path: '/home',
    name: '首页',
    component: homeComponent,
    meta: {
      title: "主页",
      auth: true
    }
  }]
},
{
  path: '/base', component: viewPageComponent, name: '基础信息',
  children: [
    { path: '/base/mainInfo', name: "主体信息", component: mainInfo, meta: { keepAlive: true } },
    { path: '/base/userInfo', name: "用户信息", component: userInfo, meta: { keepAlive: true } },
    { path: '/base/purchaseUnit', name: "往来单位", component: bpurchaseUnit, meta: { keepAlive: true } },
    { path: '/base/settingInfo', name: "参数设置", component: settingInfo, meta: { keepAlive: true } },
    { path: '/base/printInfo', name: "打印机配置", component: printInfo, meta: { keepAlive: true } }
  ]
},
{
  path: '/goods', component: viewPageComponent, name: '商品信息',
  children: [
    { path: '/goods/goodsMaintain', name: "商品维护", component: goodsMaintain, meta: { keepAlive: false } },
    { path: '/goods/goodsApply', name: "商品备案", component: goodsApply, meta: { keepAlive: false } },
    { path: '/goods/goodsJl', name: "多单位计量", component: goodsJl, meta: { keepAlive: false } },
    { path: '/goods/goodsFl', name: "分类申请", component: goodsFl, meta: { keepAlive: false } },
  ]
},
{
  path: '/purchase', component: viewPageComponent, name: '进货管理',
  children: [
    { path: '/purchase/purchaseList', name: "进货入库单", component: purchaseList, meta: { keepAlive: true } },
    { path: '/purchase/jhthd', name: "进货退货单", component: jhthd, meta: { keepAlive: true } },
    { path: '/purchase/supplierList', name: "供应商管理", component: supplierList, meta: { keepAlive: true } },
  ]
},
{
  path: '/wholesale', component: viewPageComponent, name: '批发管理',
  children: [
    { path: '/wholesale/wholesaleList', name: "批发出库单", component: wholesaleList, meta: { keepAlive: true } },
    { path: '/wholesale/xsthd', name: "批发退货单", component: xsthd, meta: { keepAlive: true } },
    { path: '/wholesale/customerList', name: "客户管理", component: customerList, meta: { keepAlive: true } },
  ]
},
{
  path: '/retail', component: viewPageComponent, name: '零售管理',
  children: [
    { path: '/retail/retailList', name: "零售单", component: retailList, meta: { keepAlive: true } },
    { path: '/retail/lsthd', name: "零售退货单", component: lsthd, meta: { keepAlive: true } },
    { path: '/retail/member', name: "会员信息", component: member, meta: { keepAlive: true } },
    { path: '/retail/retailSearch', name: "零售查询", component: retailSearch, meta: { keepAlive: true } },
  ]
},
{
  path: '/stock', component: viewPageComponent, name: '仓库管理',
  children: [
    { path: '/stock/stockInfo', name: "库存", component: stockInfo, meta: { keepAlive: true } },
    { path: '/stock/stockWarn', name: "库存预警", component: stockWarn, meta: { keepAlive: true } },
    { path: '/stock/pddInfo', name: "盘点单", component: pddInfo, meta: { keepAlive: true } },
  ]
},
{
  path: '/finance', component: viewPageComponent, name: '财务管理',
  children: [
    { path: '/finance/ysyfk', name: "应收应付款", component: ysyfk, meta: { keepAlive: true } },
    { path: '/finance/hyysk', name: "会员应付款", component: hyysk, meta: { keepAlive: true } },
    { path: '/finance/fkd', name: "付款单", component: fkd, meta: { keepAlive: true } },
    { path: '/finance/skd', name: "收款单", component: skd, meta: { keepAlive: true } },
  ]
},
{
  path: '/statistics', component: viewPageComponent, name: '统计管理',
  children: [
    { path: '/statistics/xstj', name: "销售统计", component: xstj, meta: { keepAlive: true } },
    { path: '/statistics/jhtj', name: "进货统计", component: jhtj, meta: { keepAlive: true } },
    { path: '/statistics/hykhtj', name: "活跃客户统计", component: hykhtj, meta: { keepAlive: true } },
  ]
},
{ path: '/404', name: 'notPage' },
{ path: '*', redirect: '/404' }
]

const router = new VueRouter({
  routes,
  scrollBehavior: () => {
    return { x: 0, y: 0 }
  }
})

//全局路由配置
//路由开始之前的操作
router.beforeEach((to, from, next) => {
  let toName = to.name
  //每个模块的子标题不跳转，拦截
  if (toName === 'notPage') {
    return;
  }
  NProgress.done().start()
  let user_info = store.state.userInfo.user_info;
  if (!user_info && toName !== 'login') {
    //1.考虑用户刷新浏览器，vuex数据丢失，用户数据本地存储，刷新提取本地的数据
    //2.动态注册的页面丢失，重新进行注册
    if (localStorage.userInfo) {
      store.dispatch('setUserInfo', JSON.parse(localStorage.userInfo))
      next();
    } else {
      next({
        name: 'login'
      })
    }
  } else {
    if (user_info && toName === 'login') {
      return;
    } else {
      next()
    }
  }
})

//路由完成之后的操作
router.afterEach(route => {
  NProgress.done()
})

export default router
