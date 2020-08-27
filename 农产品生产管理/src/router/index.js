import Vue from "vue";
import VueRouter from "vue-router";
import store from "store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

//页面的壳
import viewPageComponent from "pages/App";

//home
import homeComponent from "pages/home";
//login
import loginComponent from "pages/login/index";

// import printInfo from "pages/base/printInfo"

//动态加载农事操作的组件
// var farmPageByVersion = ["zzyfarm", "scfarm", "xmfarm", "syjfarm", "fmfarm"];
// var userInfo = localStorage.userInfo;
// var pageName = userInfo ? farmPageByVersion[JSON.parse(userInfo).nyVersion - 1] : "zzyfarm";
Vue.use(VueRouter);
const routes = [
  {
    path: '/redirect',
    component: viewPageComponent,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('pages/redirect/index')
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: loginComponent
  },
  {
    path: "/",
    component: viewPageComponent,
    redirect: "/home",
    name:'home',
    children: [
      {
        path: "/home",
        name: "home",
        component: homeComponent,
        meta: {
          title: "首页",
          auth: true
        }
      },
      {
        path: "/home/navigation",
        name: "navigation",
        component: resolve => require(["pages/navigation/index"], resolve),
        meta: { 
          title: "新手导航",
          keepAlive: true
         }
      }
    ]
  },
  {
    path: "/notice",
    component: viewPageComponent,
    name: "notice",
    children: [
      {
        path: "/notice",
        name: "notice",
        component: resolve => require(["pages/notice"], resolve),
        meta: {
          title: "通知消息",
          keepAlive: true
         }
      }
    ]
  },
  {
    path: "/base",
    component: viewPageComponent,
    name: "base",
    children: [
      {
        path: "/base/mainInfo",
        name: "mainInfo",
        component: resolve => require(["pages/base/mainInfo"], resolve),
        meta: { 
          title: "主体信息",
          keepAlive: true }
      },
      {
        path: "/base/display",
        name: "display",
        component: resolve => require(["pages/base/display"], resolve),
        meta: { 
          title: "企业展示",
          keepAlive: true }
      },
      {
        path: "/base/landPerson",
        name: "landPerson",
        component: resolve => require(["pages/base/landPerson"], resolve),
        meta: { 
          title: "地块负责人",
          keepAlive: true }
      },
      {
        path: "/base/landInfo",
        name: "landInfo",
        component: resolve => require(["pages/base/landInfo"], resolve),
        meta: { 
          title: "地块维护",
          keepAlive: true }
      },
      {
        path: "/base/productionMaintain",
        name: "productionMaintain",
        component: resolve =>
          require(["pages/base/productionMaintain"], resolve),
          meta: {
          title: "产品维护",          
          keepAlive: true }
      },
      {
        path: "/base/storeMaintain",
        name: "storeMaintain",
        component: resolve => require(["pages/base/storeMaintain"], resolve),
        meta: { 
          title: "商铺维护",          
          keepAlive: true }
      },
       {
        path: "/base/printInfo",
        name: "printInfo",
        component: resolve => require(["pages/base/printInfo"], resolve),
        meta: { 
          title: "打印机维护",          
          keepAlive: true }
      }
    ]
  },
  {
    path: "/user",
    component: viewPageComponent,
    name: "账户管理",
    children: [
      {
        path: "/user/userManage",
        name: "userManage",          
        component: resolve => require(["pages/user/userManage"], resolve),
        meta: { 
          title: "账户管理",          
          keepAlive: true }
      }
    ]
  },
  {
    path: "/purchase",
    component: viewPageComponent,
    name: "采购",
    children: [
      {
        path: "/purchase/farmproducts",
        name: "farmproducts",
        component: resolve => require(["pages/purchase/farmproducts"], resolve),
        meta: { 
          title: "原料采购",          
          keepAlive: true }
      },
      {
        path: "/purchase/selfout",
        name: "selfout",
        component: resolve => require(["pages/purchase/selfout"], resolve),
        meta: { 
          title: "企业自检(外来)",          
          keepAlive: true }
      },
      {
        path: "/purchase/entrustout",
        name: "entrustout",
        component: resolve => require(["pages/purchase/entrustout"], resolve),
        meta: { 
          title: "委托检测(外来)",          
          keepAlive: true }
      },
      {
        path: "/purchase/packagingout",
        name: "packagingout",
        component: resolve => require(["pages/purchase/packagingout/"], resolve),
        meta: { 
          title: "加工包装(外来)",          
          keepAlive: true }
      },
      {
        path: "/purchase/hangingCodeout",
        name: "hangingCodeout",
        component: resolve =>
          require(["pages/purchase/hangingCodeout/"], resolve),
          meta: { 
            title: "产品挂码(外来)",            
            keepAlive: true }
      },
      {
        path: "/purchase/parterInfoout",
        name: "parterInfoout",
        component: resolve =>
          require(["pages/purchase/parterInfoout/"], resolve),
          meta: { 
            title: " 原料供应商",            
            keepAlive: true }
      },
    ]
  },
  {
    path: "/inputs",
    component: viewPageComponent,
    name: "投入品",
    children: [
      {
        path: "/inputs/inputMaintain",
        name: "inputMaintain",
        component: resolve =>
          require(["pages/inputs/inputMaintain/"], resolve),
        meta: { 
          title: "投入品维护",          
          keepAlive: true }
      },
      {
        path: "/inputs/inputproducts",
        name: "inputproducts",
        component: resolve =>
          require(["pages/inputs/inputproducts"], resolve),
        meta: { 
          title: "投入品采购",          
          keepAlive: true }
      },
      {
        path: "/inputs/inputApplication",
        name: "inputApplication",
        component: resolve =>
          require(["pages/inputs/inputApplication/"], resolve),
        meta: { 
          title: "投入品领用",          
          keepAlive: true }
      },
      {
        path: "/inputs/parterInfo",
        name: "parterInfo",
        component: resolve =>
          require(["pages/inputs/parterInfo/"], resolve),
        meta: { 
          title: "投入品供应商",          
          keepAlive: true }
      },
    ]
  },
  {
    path: "/count",
    component: viewPageComponent,
    name: "统计",
    children: [
      {
        path: "/count/sale",
        name: "countSale",
        component: resolve => require(["pages/count/sale/"], resolve),
        meta: { 
          title: "销售统计",          
          keepAlive: true }
      },
      {
        path: "/count/input",
        name: "countInput",
        component: resolve => require(["pages/count/input/"], resolve),
        meta: { 
          title: "投入品统计",          
          keepAlive: true }
      }
    ]
  },
  {
    path: "/certificate",
    component: viewPageComponent,
    name: "合格证",
    children: [
      {
        path: "/certificate/print",
        name: "print",
        component: resolve => require(["pages/certificate/print/"], resolve),
        meta: {
          title: "打印合格证",
          keepAlive: true }
      }
    ]
  },
  {
    path: "/product",
    component: viewPageComponent,
    name: "生产",
    children: [
      {
        path: "/product/self",
        name: "self",
        component: resolve => require(["pages/product/self"], resolve),
        meta: { 
          title: "企业自检(基地)",          
          keepAlive: true }
      },
      {
        path: "/product/entrust",
        name: "entrust",
        component: resolve => require(["pages/product/entrust"], resolve),
        meta: { 
          title: "委托检测(基地)",          
          keepAlive: true }
      },
      {
        path: "/product/packaging",
        name: "packaging",
        component: resolve => require(["pages/product/packaging/"], resolve),
        meta: { 
          title: "加工包装(基地)",          
          keepAlive: true }
      },
      {
        path: "/product/hangingCode",
        name: "hangingCode",
        component: resolve =>
          require(["pages/product/hangingCode/"], resolve),
          meta: { 
            title: "产品挂码(基地)",            
            keepAlive: true }
      },
      {
        path: "/product/zxInfo",
        name: "zxInfo",
        component: resolve => require(["pages/product/zxInfo/"], resolve),
        meta: { 
          title: "质询信息",          
          keepAlive: true }
      }
    ]
  },
  {
    path: "/sale",
    component: viewPageComponent,
    name: "销售",
    children: [
      {
        path: "/sale/saleList",
        name: "saleList",
        component: resolve => require(["pages/sale"], resolve),
        meta: { 
          title: "销售单",          
          keepAlive: true }
      },
      {
        path: "/sale/customer",
        name: "customer",
        component: resolve => require(["pages/sale/customer/"], resolve),
        meta: { 
          title: "客户管理",          
          keepAlive: true }
      }	  
    ]
  }
];

const createRouter =()=> new VueRouter({
  routes,
  scrollBehavior: () => {
    return { x: 0, y: 0 };
  }
});

const router = createRouter();

//全局路由配置
//路由开始之前的操作
//是否是第一次进入
let hasAddrouter = true;

router.beforeEach((to, from, next) => {
  let toName = to.name;
  //每个模块的子标题不跳转，拦截
  //导航时设置副标题，不能跳转
  if (/none/gi.test(to.path)) {
    return;
  }
  NProgress.done().start();
  let user_info = store.state.userInfo.user_info;
  if (!user_info && toName !== "login") {
    //1.考虑用户刷新浏览器，vuex数据丢失，用户数据本地存储，刷新提取本地的数据
    //2.动态注册的页面丢失，重新进行注册
    if (localStorage.ncpUserInfo) {
      var userInfo = JSON.parse(localStorage.ncpUserInfo);
      store.dispatch("setUserInfo", userInfo);
      setTimeout(function(){
        store.dispatch("setUnreadNotice");
      },100)  //dispatch是异步的，防止userInfo没有获取到
      addRoute(router);
      next({ ...to, replace: true }); //动态注册完成，第一次需要重新定位一下
    } else {
      next({
        name: "login"
      });
    }
  } else {
    if (/login/gi.test(to.path)) {
      next();
    } else {
      if (!hasAddrouter) {
        //更新已经未阅读的通知数量
        addRoute(router);
        store.dispatch("setUnreadNotice");
        hasAddrouter = true;
        next({ ...to, replace: true }); //动态注册完成，第一次需要重新定位一下
      } else {
        next();
      }
    }
  }
});

function addRoute(router) {
  var userInfo = JSON.parse(localStorage.ncpUserInfo);
  var farmPageByVersion = ["zzyfarm", "scfarm", "xmfarm", "syjfarm", "fmfarm"];
  var pageName = farmPageByVersion[userInfo.nyVersion - 1];
  router.addRoutes([
    {
      path: "/product",
      component: viewPageComponent,
      name: "生产",
      children: [
        {
          path: "/product/farm",
          name: "nsjl",
          component: resolve =>
            require(["pages/product/" + pageName + "/index.vue"], resolve),
            meta: {
              title:'农事记录',
              keepAlive: true }
        }
      ]
    }
  ]);
}

//路由完成之后的操作
router.afterEach(route => {
  NProgress.done();
});

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  addRoute(router);
}

export default router;
