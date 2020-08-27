/**
 * 进货模块uri
 */

/*1.往来单位页面*/
export const wldw={
  //1往来单位-初始化
  pageBizSupplier:{
    url:"/nzsyBizSupplier/pageBizSupplier/",
    method:"get"
  },
  //21往来单位-保存
  saveBizSupplier:{
    url:"/nzsyBizSupplier/saveBizSupplier/",
    method:"post"
  },
  //51往来单位-更新状态信息
  updateBizSupplier:{
    url:"/nzsyBizSupplier/updateBizSupplier/",
    method:"post"
  },
  //61往来单位-根据ID获取信息
  getBizSupplierById:{
    url:"/nzsyBizSupplier/getBizSupplierById/",
    method:"get"
  },
  //61往来单位-根据区域代码和长度查询区域信息列表
  listQybNew:{
    url:"/nzsyBizSupplier/listQybNew/",
    method:"get"
  },

}
/*1.采购入库页面*/
export const cgrk={
  //1进货单-初始化
  pagePurch:{
    url:"/nzsyPurch/pagePurch/",
    method:"get"
  },

  //1进货单-获取最新单号
  getPch:{
    url:"/nzsyPurch/getPch/",
    method:"post"
  },


}

