/**
 * 零售模块uri
 */
/*1.会员信息页面*/
export const hyxx={
    //1会员信息-初始化
  pageHyb:{
        url:"/nzsyHyb/pageHyb/",
        method:"get"
    },
    //2会员信息-保存修改
  saveHyb:{
        url:"/nzsyHyb/saveHyb/",
        method:"post"
    },
  //3会员信息-手机号唯一性校验
  checkHysjhm:{
        url:"/nzsyHyb/checkHysjhm/",
        method:"get"
  },
  //4会员信息-更新状态
  updateHybztById:{
        url:"/nzsyHyb/updateHybztById/",
        method:"post"
  }
}
/*2.零售信息页面*/
export const lsdxx={
  //1会员信息-初始化
  pageLsd:{
    url:"/nzsyLs/pageLsddb/",
    method:"get"
  }
}
