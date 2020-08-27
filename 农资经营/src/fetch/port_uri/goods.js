/**
 * 商品模块uri
 */

/*1.商品维护页面*/
export const spwh = {
  //1商品维护-初始化
  pageBizAgriLib: {
    url: "/nzsyBizAgriLib/pageBizAgriLib/",
    method: "get"
  },
  //2商品维护-提取保存
  saveBizAgriLib: {
    url: "/nzsyBizAgriLib/saveBizAgriLib/",
    method: "post"
  },
  //3商品维护-更新信息
  updateBizAgriLib: {
    url: "/nzsyBizAgriLib/updateBizAgriLib/",
    method: "post"
  },
  //4商品维护-数据字典
  getDataByCy: {
    url: "/utilmodel/qy/getDataByCy/",
    method: "get"
  },
  //4获取商品分类
  get_spfl: {
    url: "/nzsyBizAgriLib/pageSysAgriLib/",
    method: "get"
  },

  //5商品维护-更新状态信息
  updateBizAgriLibDelFlag: {
    url: "/nzsyBizAgriLib/updateBizAgriLibDelFlag/",
    method: "post"
  },
  //6商品维护-获取商品信息
  getBizAgriLibById: {
    url: "/nzsyBizAgriLib/getBizAgriLibById/",
    method: "get"
  },
  //1商品申请-初始化
  pageNzsqb: {
    url: "/nzsyBizAgriLib/pageNzsqb/",
    method: "get"
  },
  //2商品申请-保存
  saveNzsqb: {
    url: "/nzsyBizAgriLib/saveNzsqb/",
    method: "post"
  },
  //3 多单位保存
  saveDw: {
    url: "/nzsyUnit/saveMultipleUnit/",
    method: "post"
  },

}

