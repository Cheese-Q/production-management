/**
 * 基础模块uri
 */

/*1.用户信息页面*/
export const yhxx={
    //1用户信息-初始化
  pageBizUser:{
        url:"/nzsyBizUser/pageBizUser/",
        method:"get"
    },
    //2用户信息-保存修改
  saveBizUser:{
        url:"/nzsyBizUser/saveBizUser/",
        method:"post"
    },
  //3用户信息-唯一性校验
  checkDataIsExist:{
        url:"/nzsyBizUser/checkDataIsExist/",
        method:"get"
  },
  //4用户信息-更新状态
  updateBizUserZt:{
        url:"/nzsyBizUser/updateBizUserZt/",
        method:"post"
  },
  //4用户登陆s
  userLogin:{
    url:"/nzsyBizUser/bizUserLogin/",
    method:"get"
  },
  //5修改密码
  updatePwd:{
    url:"/nzsyBizUser/updateBizUserPwd/",
    method:"post"
  }
}
/*1.企业信息页面*/
export const ztxx={
  //1企业信息-初始化
  getManagementById:{
    url:"/nzsyBizmanagement/getManagementById/",
    method:"get"
  },
  //2企业信息-保存修改
  saveManagement:{
    url:"/nzsyBizmanagement/saveManagement/",
    method:"post"
  },


}
export const cssz={
  //1参数设置-初始化
  getNzsyParamByBizId:{
    url:"/nzsyBizParam/getNzsyParamByBizId/",
    method:"get"
  },
  //2企业信息-保存修改
  saveNzsyParam:{
    url:"/nzsyBizParam/saveNzsyParam/",
    method:"post"
  },
}

/*4.许可证页面*/
export const xkz={
  //1许可证信息-初始化
  pageQyzsb:{
    url:"/nzsyBizmanagement/pageQyzsb/",
    method:"get"
  },
  //2许可证信息-保存修改
  saveQyzsb:{
    url:"/nzsyBizmanagement/saveQyzsb/",
    method:"post"
  },
  //3许可证信息-保存修改
  getQyzsb:{
    url:"/nzsyBizmanagement/getQyzsbById/",
    method:"get"
  }
}

/*5.打印机信息*/
export const dyjxx={
  //1打印机信息-初始化
  pageZtdyj:{
    url:"/nzsyBizDyj/pageZtdyj/",
    method:"get"
  },
  //2打印机信息-保存修改
  saveZtdyj:{
    url:"/nzsyBizDyj/saveZtdyj/",
    method:"post"
  },
  //3打印机信息-默认打印机
  updateMrZtdyj:{
    url:"/nzsyBizDyj/updateMrZtdyj/",
    method:"post"
  }
}

