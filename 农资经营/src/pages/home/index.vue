<template>
  <div class="panel">
    <el-container>
      <el-header style="height: auto">
        <div>
          <el-row class="el-row">
            <el-col class="el-colhead el-xsje">
              <div>销售金额</div>
              <div>{{dayDate.je == null ?0:dayDate.je}}</div>
              <div>昨日：{{dayDate.zrje == null ?0:dayDate.zrje}}</div>
            </el-col>
            <el-col class="el-colhead el-ddsl">
              <div>订单数量</div>
              <div>{{dayDate.sl == null ?0:dayDate.sl}}</div>
              <div>昨日：{{dayDate.zrsl == null ?0:dayDate.zrsl}}</div>
            </el-col>
            <el-col class="el-colhead el-tkje">
              <div>退款金额</div>
              <div>{{dayDate.tkje == null ?0:dayDate.tkje}}</div>
              <div>昨日：{{dayDate.zrtkje == null ?0:dayDate.zrtkje}}</div>
            </el-col>
            <el-col class="el-colhead el-tkdd">
              <div>退款订单</div>
              <div>{{dayDate.tksl == null ?0:dayDate.tksl}}</div>
              <div>昨日：{{dayDate.zrtksl == null ?0:dayDate.zrtksl}}</div>
            </el-col>
            <el-col class="el-colhead el-xzkh">
              <div>新增会员</div>
              <div>{{dayDate.hysl == null ?0:dayDate.hysl}}</div>
              <div>昨日：{{dayDate.zrhysl == null ?0:dayDate.zrhysl}}</div>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col class="el-lj">
              <div><img src="../../assets/images/icon-xsje.png"></div>
              <div style="text-align: left">
                <div style="font-size:24px;">{{dayDate.zje == null ?0:dayDate.zje}}</div>
                <div style="font-size:14px;">累计销售金额( ¥ )</div>
              </div>
            </el-col>
            <el-col class="el-lj">
              <div><img src="../../assets/images/icon-xsdd.png"></div>
              <div style="text-align: left">
                <div style="font-size:24px;">{{dayDate.zsl == null ?0:dayDate.zsl}}</div>
                <div style="font-size:14px;">累计销售订单</div>
              </div>
            </el-col>
            <el-col class="el-lj">
              <div><img src="../../assets/images/icon-tkje.png"></div>
              <div style="text-align: left">
                <div style="font-size:24px;">{{dayDate.ztkje == null ?0:dayDate.ztkje}}</div>
                <div style="font-size:14px;">累计退款金额( ¥ )</div>
              </div>
            </el-col>
            <el-col class="el-lj">
              <div><img src="../../assets/images/icon-tkdd.png"></div>
              <div style="text-align: left">
                <div style="font-size:24px;">{{dayDate.ztksl == null ?0:dayDate.ztksl}}</div>
                <div style="font-size:14px;">累计退款订单</div>
              </div>
            </el-col>
            <el-col class="el-lj">
              <div><img src="../../assets/images/icon-ljhy.png"></div>
              <div style="text-align: left">
                <div style="font-size:24px;">{{dayDate.zhysl == null ?0:dayDate.zhysl}}</div>
                <div style="font-size:14px;">累计会员</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-header>

      <el-container style="margin-top: 40px;padding: 0 10px;">
        <el-main class="el-mainr">
          <el-tabs v-model="activeName">
            <el-tab-pane label="销售"
                         name="1">
              <div style="line-height:40px;font-size: 20px;">
                销售排名
              </div>
              <div class="el-colPm">
                <div class="el-colrr">
                  <el-row v-for="(item,index) in leftlist"
                          :key="index">
                    <el-col :span="2"
                            v-if="index==0">
                      <div class="grid-content top1">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="index==1">
                      <div class="grid-content top2">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="index==2">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else>
                      <div class="grid-content">&nbsp;{{index+1}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>{{item.agriName}}</div>
                        <div class="el-price">{{item.amount}}</div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row v-for="(item,index) in leftcount"
                          :key="item">
                    <el-col :span="2"
                            v-if="leftcount==5&&index==0">
                      <div class="grid-content top1">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==5&&index==1">
                      <div class="grid-content top2">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==5&&index==2">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==4&&index==0">
                      <div class="grid-content top2">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==4&&index==1">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==3&&index==0">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else>
                      <div class="grid-content">&nbsp;{{6-leftcount+index}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>暂无商品信息</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>

                <div class="el-colrr">

                  <el-row v-for="(item,index) in rightlist"
                          :key="index">
                    <el-col :span="2">
                      <div class="grid-content">&nbsp;{{index+6}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>{{item.agriName}}</div>
                        <div class="el-price">{{item.amount}}</div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row v-for="(item,index) in rightcount"
                          :key="item">
                    <el-col :span="2">
                      <div class="grid-content ">&nbsp;{{11-rightcount+index}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>暂无商品信息</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="采购"
                         name="2">

              <div style="line-height:40px;font-size: 20px;">
                采购排名
              </div>
              <div class="el-colPm">
                <div class="el-colrr">

                  <el-row v-for="(item,index) in leftlist"
                          :key="index">
                    <el-col :span="2"
                            v-if="index==0">
                      <div class="grid-content top1">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="index==1">
                      <div class="grid-content top2">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="index==2">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else>
                      <div class="grid-content">&nbsp;{{index+1}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>{{item.agriName}}</div>
                        <div class="el-price">{{item.amount}}</div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row v-for="(item,index) in leftcount"
                          :key="item">
                    <el-col :span="2"
                            v-if="leftcount==5&&index==0">
                      <div class="grid-content top1">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==5&&index==1">
                      <div class="grid-content top2">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==5&&index==2">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==4&&index==0">
                      <div class="grid-content top2">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==4&&index==1">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==3&&index==0">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else>
                      <div class="grid-content">&nbsp;{{6-leftcount+index}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>暂无商品信息</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>

                <div class="el-colrr">

                  <el-row v-for="(item,index) in rightlist"
                          :key="index">
                    <el-col :span="2">
                      <div class="grid-content">&nbsp;{{index+6}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>{{item.agriName}}</div>
                        <div class="el-price">{{item.amount}}</div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row v-for="(item,index) in rightcount"
                          :key="item">
                    <el-col :span="2">
                      <div class="grid-content ">&nbsp;{{11-rightcount+index}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>暂无商品信息</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>

            </el-tab-pane>
            <el-tab-pane label="库存"
                         name="3">

              <div style="line-height:40px;font-size: 20px;">
                库存排名
              </div>
              <div class="el-colPm">
                <div class="el-colrr">

                  <el-row v-for="(item,index) in leftlist"
                          :key="index">
                    <el-col :span="2"
                            v-if="index==0">
                      <div class="grid-content top1">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="index==1">
                      <div class="grid-content top2">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="index==2">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else>
                      <div class="grid-content">&nbsp;{{index+1}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>{{item.agriName}}</div>
                        <div class="el-price">{{item.sl}}</div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row v-for="(item,index) in leftcount"
                          :key="item">
                    <el-col :span="2"
                            v-if="leftcount==5&&index==0">
                      <div class="grid-content top1">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==5&&index==1">
                      <div class="grid-content top2">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==5&&index==2">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==4&&index==0">
                      <div class="grid-content top2">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==4&&index==1">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else-if="leftcount==3&&index==0">
                      <div class="grid-content top3">&nbsp;</div>
                    </el-col>
                    <el-col :span="2"
                            v-else>
                      <div class="grid-content">&nbsp;{{6-leftcount+index}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>暂无商品信息</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>

                <div class="el-colrr">

                  <el-row v-for="(item,index) in rightlist"
                          :key="index">
                    <el-col :span="2">
                      <div class="grid-content">&nbsp;{{index+6}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>{{item.agriName}}</div>
                        <div class="el-price">{{item.sl}}</div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row v-for="(item,index) in rightcount"
                          :key="item">
                    <el-col :span="2">
                      <div class="grid-content ">&nbsp;{{11-rightcount+index}}</div>
                    </el-col>
                    <el-col :span="22"
                            class="backgroundGary">
                      <div class="grid-content el-colPm">
                        <div>暂无商品信息</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-main>
        <el-aside width="500px">
          <div class="cygn">
            常用功能
          </div>
          <div class="aside">
            <div>
              <el-button @click="goodsMaintain">商品维护</el-button>
            </div>
            <div>
              <el-button @click="goodsApply">商品申请</el-button>
            </div>
            <div>
              <el-button @click="purchaseList">采购单</el-button>
            </div>
            <div>
              <el-button @click="wholesaleList">销售单</el-button>
            </div>
            <div>
              <el-button @click="retailList">零售单</el-button>
            </div>
            <div>
              <el-button @click="stockInfo">库存信息</el-button>
            </div>
            <div>
              <el-button @click="purchaseUnit">往来单位</el-button>
            </div>
            <div>
              <el-button @click="member">会员信息</el-button>
            </div>
          </div>
        </el-aside>
      </el-container>
    </el-container>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { dateformat } from 'common/tools'
import fetch from 'fetch/axios/';

export default {
  data () {
    return {
      dayDate: '',
      activeName: '1',
      leftcount: 0,
      rightcount: 0,
      leftlist: [],
      rightlist: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
    }),
  },
  created () {
    this.getOrderInfo();
    this.getRankDataByYear();
  },
  methods: {
    // 初始化数据
    getOrderInfo () {
      fetch({
        url: '/nzsyStatistics/getDayDataByDate/',
        method: 'get',
        data: {
          bizId: this.userInfo.bizId
        }
      }).then(res => {
        this.dayDate = res.bean
      }).catch(() => {
      })
    },
    getRankDataByYear () {
      this.leftlist = [];
      this.rightlist = [];
      fetch({
        url: '/nzsyStatistics/getRankDataByYear/',
        method: 'get',
        data: {
          type: 1,
          bizId: this.userInfo.bizId
        }
      }).then(res => {
        const llist = [];
        const rlist = [];
        if (res.list.length == 0) {
          this.leftcount = 5;
          this.rightcount = 5;
        } else if (res.list.length > 0 && res.list.length <= 5) {
          this.leftlist = res.list;
          this.leftcount = 5 - res.list.length;
          this.rightcount = 5;
        } else if (res.list.length > 5 && res.list.length <= 10) {
          this.leftcount = 0;
          this.rightcount = 10 - res.list.length;
          for (let index in res.list) {
            if (index < 5) {
              llist.push(res.list[index]);
            } else {
              rlist.push(res.list[index]);
            }
          }
          this.leftlist = llist;
          this.rightlist = rlist;
        } else {
          this.leftcount = 0;
          this.rightcount = 0;
          for (let index in res.list) {
            if (index < 5) {
              llist.push(res.list[index]);
            } else if (index < 10) {
              rlist.push(res.list[index]);
            }
          }
          this.leftlist = llist;
          this.rightlist = rlist;
        }
      }).catch(() => {
      })

    },
    goodsMaintain: function () {
      this.$router.push({ path: '/goods/goodsMaintain' })
    },
    goodsApply: function () {
      this.$router.push({ path: '/goods/goodsApply' })
    },
    purchaseList: function () {
      this.$router.push({ path: '/purchase/purchaseList' })
    },
    wholesaleList: function () {
      this.$router.push({ path: '/wholesale/wholesaleList' })
    },
    retailList: function () {
      this.$router.push({ path: '/retail/retailList' })
    },
    stockInfo: function () {
      this.$router.push({ path: '/stock/stockInfo' })
    },
    purchaseUnit: function () {
      this.$router.push({ path: '/purchase/purchaseUnit' })
    },
    member: function () {
      this.$router.push({ path: '/retail/member' })
    },

  },
  watch: {
    'activeName': function (val) {
      this.leftlist = [];
      this.rightlist = [];
      //监听切换状态-计划单
      fetch({
        url: '/nzsyStatistics/getRankDataByYear/',
        method: 'get',
        data: {
          type: val,
          bizId: this.userInfo.bizId
        }
      }).then(res => {
        const llist = [];
        const rlist = [];
        if (res.list.length == 0) {
          this.leftcount = 5;
          this.rightcount = 5;
        } else if (res.list.length > 0 && res.list.length <= 5) {
          this.leftlist = res.list;
          this.leftcount = 5 - res.list.length;
          this.rightcount = 5;
        } else if (res.list.length > 5 && res.list.length <= 10) {
          this.leftcount = 0;
          this.rightcount = 10 - res.list.length;
          for (let index in res.list) {
            if (index < 5) {
              llist.push(res.list[index]);
            } else {
              rlist.push(res.list[index]);
            }
          }
          this.leftlist = llist;
          this.rightlist = rlist;
        } else {
          this.leftcount = 0;
          this.rightcount = 0;
          for (let index in res.list) {
            if (index < 5) {
              llist.push(res.list[index]);
            } else if (index < 10) {
              rlist.push(res.list[index]);
            }
          }
          this.leftlist = llist;
          this.rightlist = rlist;
        }
      }).catch(() => {
      })
    },
  }
}
</script>
<style>
.el-xsje {
  background: #45cbb6;
}

.el-ddsl {
  background: #be82df;
}

.el-tkje {
  background: #ff8e28;
}

.el-tkdd {
  background: #ffd300;
}

.el-xzkh {
  background: #49cbdf;
}

.el-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-colhead {
  padding: 10px 0;
  margin: 10px 10px 20px;
  border-radius: 8px;
}

.el-colhead > div {
  line-height: 40px;
  color: #fff;
  font-size: 18px;
}

.el-colhead > div:nth-child(2) {
  font-weight: bold;
  font-size: 25px;
}

.el-colhead > div:nth-child(3) {
  font-size: 16px;
}

.el-lj {
  color: #333333;
  font-size: 20px;
  line-height: 30px;
  /*margin: 0 10px;*/
  border-right: solid 1px #efefef;
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
}

.el-lj:nth-child(5) {
  border: none;
}

.el-lj > div > img {
  width: 60px;
  height: 60px;
  margin-right: 20px;
}

.el-header,
.el-footer {
  color: #333;
  text-align: center;
  padding: 0;
}

.el-aside {
  color: #333;
  text-align: center;
  border: solid 1px #efefef;
  margin: 9px 0;
  box-shadow: 2px 2px 2px #efefef, 2px -2px 2px #efefef, -2px 2px 2px #efefef,
    -2px -2px 2px #efefef;
}

.el-mainr {
  color: #333;
  text-align: center;
  padding: 0 20px 0 0;
}

.el-tabs {
  margin: 10px;
  padding: 0 15px 10px;
  border: solid 1px #efefef;
  box-shadow: 2px 2px 2px #efefef, 2px -2px 2px #efefef, -2px 2px 2px #efefef,
    -2px -2px 2px #efefef;
}

.el-tabs__nav {
  border-left: 5px solid #409eff;
  margin: 15px 0 20px 0;
  height: 35px;
}

.el-tabs--top .el-tabs__item.is-top:nth-child(2),
.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2) {
  padding-left: 15px !important;
  line-height: 0;
}

.el-tabs__item {
  font-size: 16px;
}

.el-tabs__item:hover {
  color: #333;
}

.el-tabs__item.is-active {
  color: #333333;
  font-size: 18px;
  font-weight: bold;
}

.el-tabs--border-card > .el-tabs__content {
  padding: 0 15px 15px 15px !important;
}

.top1 {
  background: url("../../assets/images/icon-top1.png") center center no-repeat;
  background-size: 33px 28px;
}

.top2 {
  background: url("../../assets/images/icon-top2.png") center center no-repeat;
  background-size: 33px 28px;
}

.top3 {
  background: url("../../assets/images/icon-top3.png") center center no-repeat;
  background-size: 33px 28px;
}

.el-colPm {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-colrr {
  width: 50%;
  line-height: 40px;
  font-size: 16px;
}

.el-price {
  color: #60acff;
  font-size: 18px;
}

.backgroundGary {
  background: #efefef;
  padding: 0 15px;
  margin: 12px 10px;
  line-height: 45px;
}

.aside {
  margin: 0 15px;
  border-top: solid 2px #e4e7ed;
}

.aside > div {
  margin: 15px 5px;
  width: 47%;
  float: left;
}

.aside > div > .el-button {
  width: 90%;
  padding: 20px 0;
  font-size: 18px;
  margin: 10px 5px 0;
  background: #45cbb6;
  color: #ffffff;
  border: none;
}

.cygn {
  font-size: 20px;
  text-align: left;
  text-indent: 20px;
  border-left: 5px solid #409eff;
  margin: 20px 15px;
  font-weight: bold;
}

.el-tabs__active-bar {
  background: #ffffff;
}
</style>
