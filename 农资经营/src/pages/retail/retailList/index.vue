<!--
 * @Author: 龚铱白
 * @Date: 2019-08-15 11:25:43
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-17 15:20:14
 * @Description: 
 -->
<template>
  <div class="panel"
       style="min-width: 1210px;">
    <div class="header f-df f-pr20">
      <div style="display:flex;">
        <div style="width: 150px;font-size: 20px; font-weight: bold;margin-top: 5px;">扫码销售</div>
        <el-input v-model="barCode"
                  style="vertical-align:bottom"
                  placeholder="请输入条码回车"
                  class="input-with-select barcode"
                  size="medium "
                  @keydown.enter.native="enterGoods()"
                  @keydown.down.native="selectGoods()">
        </el-input>
      </div>
      <div class="f-f1 f-tar">
        <el-button type="primary"
                   size="medium"
                   round
                   style="padding:9px 25px"
                   @click="selSp"
                   icon="el-icon-plus
">商品(Alt+Q)</el-button>
      </div>
    </div>

    <div class="f-mt20"
         style="min-height: 470px;max-height:500px;overflow: auto">
      <el-table class="table"
                :data="form.listDetail"
                element-loading-text="拼命加载中"
                style="width: 100%;"
                ref="listOrder"
                :row-class-name="tableRowClassName">
        <el-table-column type="index"
                         label="序号">
        </el-table-column>
        <el-table-column label="商品编码"
                         prop="nzbm">
        </el-table-column>
        <el-table-column label="商品名称"
                         prop="nzmc">
        </el-table-column>
        <el-table-column label="规格型号"
                         prop="gg">
        </el-table-column>
        <el-table-column label="单位"
                         prop="dw">
        </el-table-column>
        <el-table-column label="生产单位"
                         prop="scdw">
        </el-table-column>
        <el-table-column label="数量"
                         prop="saleNum">
          <template slot-scope="scope">
            <el-input type="digit"
                      v-model="scope.row.saleNum"
                      onkeyup="this.value=this.value.replace(/[^\d.]/g,'') "
                      onafterpaste="this.value=this.value.replace(/[^\d.]/g,'') "
                      @change="getSale"
                      @keyup.native="show($event,scope.$index)"
                      class="xssl bd"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="零售价"
                         prop="salePrice">
          <template slot-scope="scope">
            <el-input type="digit"
                      v-model="scope.row.salePrice"
                      onkeyup="this.value=this.value.replace(/[^\d.]/g,'') "
                      onafterpaste="this.value=this.value.replace(/[^\d.]/g,'') "
                      @change="getSale"
                      @keyup.native="show($event,scope.$index)"
                      class="xsjg bd"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="小计"
                         prop="saleAmount">
          <template slot-scope="scope">
            {{(Number(scope.row.saleNum)*Number(scope.row.salePrice)).toFixed(2)}}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="total">
      <div>
        <span>数量 : </span>
        <span style="margin:0 100px 0 10px; color: red;">{{totalNum}}</span>
        <span>总金额 : </span>
        <span style="margin-left:10px; color: red;">{{totalAmount}}</span>
      </div>
      <div>
        <el-button type="primary"
                   style="padding:9px 25px"
                   @click="deleteRow">删除(Del)</el-button>
        <el-button type="danger"
                   style="padding:9px 25px"
                   @click="cleaAll">清空(Alt+Del)</el-button>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="grid-content ">
            <div class="f-df f-pr20">
              <el-input style="vertical-align:bottom; width:330px;"
                        placeholder="查询手机号（Alt+X）"
                        class="input-with-select cxhy"
                        size="medium "
                        v-model="findPhone"
                        @keydown.enter.native="getMember">
              </el-input>
              <div>
                <el-button type="primary"
                           size="medium"
                           style="padding:9px 25px;"
                           @click="getMember">查询</el-button>
              </div>
            </div>
          </div>

          <div class="grid-content f-mt15">
            <div class="f-df f-pr20">
              <div style="width: 150px;line-height: 38px;">会员</div>
              <el-input style="vertical-align:bottom; width:450px;"
                        placeholder="会员"
                        class="input-with-select"
                        size="medium "
                        v-model="hymc">
              </el-input>
            </div>
          </div>

          <div class="grid-content f-mt15">
            <div class="f-df f-pr20">
              <div style="width: 150px;line-height: 38px;">手 机 号</div>
              <el-input style="vertical-align:bottom; width:450px;"
                        placeholder="手机号"
                        class="input-with-select"
                        size="medium "
                        v-model="sjhm">
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content ">
            <el-button type="success"
                       size="medium"
                       style="height: 140px; width: 100%;font-size: 1.6em;"
                       @click="addMember">新增会员<br>(Alt+2)</el-button>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content ">
            <el-button type="warning"
                       size="medium"
                       style="height: 140px; width: 100%;font-size: 1.6em;"
                       @click="guadan">挂 单<br>(Alt+3)</el-button>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content ">
            <el-button type="primary"
                       size="medium"
                       style="height: 140px; width: 100%;font-size: 1.6em;"
                       @click="openTd">提 单<br>(Alt+4)</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <el-button type="danger"
                       size="medium"
                       style="height: 140px; width: 100%;font-size: 1.6em;"
                       @click="payOrder">
              结 算(Ctrl+Enter)</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="选择商品"
               :append-to-body="true"
               :visible.sync="selProductVisable"
               width="1100px">
      <sel-product style="margin:0 auto;"
                   :hyId="this.hyId"
                   @selProduct="selProduct"></sel-product>
    </el-dialog>
    <el-dialog title="新增会员"
               :append-to-body="true"
               :visible.sync="addMemberVisable"
               width="800px">
      <add-member style="margin:0 auto;"
                  @closeMember="closeMember"
                  ref="tdMember"></add-member>
    </el-dialog>
    <el-dialog title="提单"
               :append-to-body="true"
               :visible.sync="selOrderVisable"
               width="800px">
      <sel-order style="margin:0 auto;"
                 @selOrder="selOrder"
                 ref="tdChild"></sel-order>
    </el-dialog>
    <el-dialog title="结算"
               :append-to-body="true"
               :visible.sync="payOrderVisable"
               width="800px">
      <pay-order style="margin:0 auto;"
                 @payOrder="payOrder"
                 @closeOrder="closeOrder"
                 @savepayOrder="savepayOrder"
                 :form=form
                 :jsje="totalAmount"
                 ref="tosjChild"></pay-order>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'
import { exec } from 'common/tools'
import selProduct from './component/selProduct'
import addMember from './component/addMember'
import selOrder from './component/selOrder'
import payOrder from './component/payOrder'
import fetch from 'fetch/axios/';
export default {
  components: {
    selProduct,
    addMember,
    selOrder,
    payOrder
  },
  data () {
    return {
      selProductVisable: false,
      selOrderVisable: false,
      addMemberVisable: false,
      payOrderVisable: false,
      barCode: '',
      totalNum: 0,
      totalAmount: 0.00,
      findPhone: '',
      hymc: '',
      sjhm: '',
      hyId: '',
      id: 0,
      lsdh: '',
      selectIndex: -1,
      tableValid: false,
      form: {
        totalNum: 0,
        zje: 0.00,
        hymc: '',
        sjhm: '',
        hyId: '',
        id: 0,
        lsdh: '',
        listDetail: []
      },
      spmc: "",
      num: 0
    }
  },
  created () {
    var _self = this;
    document.onkeydown = function (e) {
      const keyCode = e.keyCode || e.which || e.charCode;
      const altKey = e.altKey;
      const ctrlKey = e.ctrlKey || e.metaKey;
      // 新增商品
      if (altKey && keyCode == 81) {
        _self.selProductVisable = true;

        // 新增会员
      } else if (altKey && keyCode == 50) {
        _self.addMember();

        // 挂单
      } else if (altKey && keyCode == 51) {
        _self.guadan();

        // 提单
      } else if (altKey && keyCode == 52) {
        _self.openTd();

        // 清空
      } else if (altKey && keyCode == 46) {
        _self.cleaAll();

        // 会员
      } else if (altKey && keyCode == 88) {
        let inputAll = document.querySelector('.cxhy input')
        inputAll.focus();
        inputAll.select();

        // 结算
      } else if (ctrlKey && keyCode == 13) {
        _self.payOrder();

        // 删除
      } else if (keyCode == 46) {
        _self.deleteRow();

        // 扫码回车
      } else if (!_self.payOrderVisable && keyCode == 13) {
        this.tableValid = false;
        this.selectIndex = -1;
        let inputAll = document.querySelector('.barcode input')
        inputAll.focus();
        inputAll.select();
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  methods: {
    //回车添加商品
    enterGoods () {
      var barCode = this.barCode;
      if (barCode != "") {
        fetch({
          url: '/nzsyLs/getKcByTm/',
          method: 'get',
          data: {
            codes: barCode,
            qyid: this.userInfo.bizId,
            slzt: '1'
          }
        }).then(res => {
          if (res.resCode == "000000") {
            if (res.bean == 1) {
              this.$message.warning("商品未备案或停用");
              return false;
            }
            if (res.bean == 2) {
              this.$message.warning("商品库存不足");
              return false;
            }
            this.barCode = "";
            var row = res.bean;
            let { nzbm, nzmc, gg, dw, scdw, lsdj, nzid } = row;
            var newlistDetail = [];
            var bl = true;
            this.form.listDetail.forEach(item => {
              if (item.nzid == nzid) {
                newlistDetail.push({
                  "nzid": item.nzid,
                  "nzbm": item.nzbm,
                  "nzmc": item.nzmc,
                  "gg": item.gg,
                  "dw": item.dw,
                  "scdw": item.scdw,
                  "salePrice": item.salePrice,
                  "saleNum": item.saleNum + 1
                })
                bl = false;
              } else {
                newlistDetail.push({
                  "nzid": item.nzid,
                  "nzbm": item.nzbm,
                  "nzmc": item.nzmc,
                  "gg": item.gg,
                  "dw": item.dw,
                  "scdw": item.scdw,
                  "salePrice": item.salePrice,
                  "saleNum": item.saleNum
                })
              }
            });
            if (bl) {
              newlistDetail.push({
                "nzid": nzid,
                "nzbm": nzbm,
                "nzmc": nzmc,
                "gg": gg,
                "dw": dw,
                "scdw": scdw,
                "salePrice": lsdj,
                "saleNum": 1
              })
            }
            this.form.listDetail = newlistDetail;
            this.totalNum = (Number(this.totalNum) + 1).toFixed(2);
            this.totalAmount = (Number(this.totalAmount) + Number(lsdj)).toFixed(2);
          }
        }).catch((res) => {
          this.$message.warning(res.errorMess)
        })
      }
    },
    //扫码框方向下键
    selectGoods () {
      this.selectIndex = 0;
      //获取全部input
      let inputAll = document.querySelectorAll('.bd input');
      inputAll[0].focus();
      inputAll[0].select();
    },
    getSale () {
      var listDetail = this.form.listDetail;
      var num = 0
      var total = 0.00;
      // var sl = this.num;
      for (var ite in listDetail) {
        var item = listDetail[ite];
        console.log(item)
        if (Number(item.kcNum) < Number(item.saleNum)) {
          this.$message.warning(item.nzmc + "数量不足");
          item.saleNum = 1;
          return
        }
        num += Number(item.saleNum);
        total += (Number(item.saleNum) * Number(item.salePrice));
      };
      this.totalNum = num.toFixed(2);
      this.totalAmount = total.toFixed(2);

    },
    //清空
    cleaAll () {
      this.form.listDetail = [];
      this.totalNum = 0;
      this.totalAmount = 0.00;
    },
    //打开提单框
    openTd () {
      this.selOrderVisable = true;
      setTimeout(() => {
        this.$refs.tdChild.getTableData();
      }, 10);
    },
    //提单
    selOrder (row) {
      this.loading = true;
      this.form.listDetail = [];
      let { id } = row;
      console.log(row)
      fetch({
        url: '/nzsyLs/getLsddbById/',
        method: 'get',
        data: {
          saleId: id,
        }
      }).then(res => {
        var bean = res.bean;
        var num = 0;
        var lsddSpmxbs = bean.lsddSpmxbs;
        for (var ite in lsddSpmxbs) {
          var item = lsddSpmxbs[ite];
          this.form.listDetail.push({
            "nzid": item.nzid,
            "nzbm": item.nzbm,
            "nzmc": item.nzmc,
            "gg": item.gg,
            "dw": item.dw,
            "scdw": item.scdw,
            "salePrice": item.xsdj,
            "saleNum": item.xssl,
          })
          num += item.xssl;
        };
        this.id = bean.id;
        this.lsdh = bean.lsdh;
        this.hyId = bean.hyid;
        this.hymc = bean.hymc;
        this.sjhm = bean.lxdh;
        this.totalNum = num;
        this.totalAmount = bean.zje;
        this.selOrderVisable = false;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    selSp(){
      if (this.hyId == '') {
        this.$message.warning('请输入手机号选择会员！');
        return false;
      }
      this.selProductVisable = true;
    },

    //添加商品
    selProduct (row) {
      let { nzbm, nzmc, gg, dw, scdw, lsdj, nzid,sl } = row;
      //判断页面中是否有该商品
      if (this.form.listDetail.findIndex(item => { return item.nzid === nzid }) != -1) {
        this.$message.error('该商品已添加！')
        return;
      }
      this.form.listDetail.push({
        "nzid": nzid,
        "nzbm": nzbm,
        "nzmc": nzmc,
        "gg": gg,
        "dw": dw,
        "scdw": scdw,
        "salePrice": lsdj,
        "saleNum": 1,
        "kcNum": sl,
      })
      // this.num = row.sl;
      this.spmc = nzmc;
      this.totalNum = (Number(this.totalNum) + 1).toFixed(2);
      this.totalAmount = (Number(this.totalAmount) + Number(lsdj)).toFixed(2);
      this.selProductVisable = false;
    },
    //新增会员框
    addMember () {
      this.addMemberVisable = true;
      setTimeout(() => {
        // this.$refs.tdMember.init();
      }, 100);
    },
    //关闭会员框
    closeMember () {
      this.addMemberVisable = false;
    },
    //关闭结算框
    closeOrder () {
      this.payOrderVisable = false;
    },
    //结算
    payOrder () {
      if (this.form.listDetail.length == 0) {
        this.$message.warning('请扫码添加或选择商品');
        return false;
      }
      if (this.hyId == '') {
        this.$message.warning('请输入手机号选择会员！');
        return false;
      }
      this.form.totalNum = this.totalNum;
      this.form.zje = this.totalAmount;
      this.form.jsje = this.totalAmount;
      this.form.hymc = this.hymc;
      this.form.zffs = 1;
      this.form.sjhm = this.sjhm;
      this.form.hyId = this.hyId;
      this.form.id = this.id;
      this.form.lsdh = this.lsdh;
      this.payOrderVisable = true;
      setTimeout(() => {
        this.$refs.tosjChild.autofocus();
      }, 100);
    },
    // 查询会员
    getMember () {
      if (this.findPhone == '') {
        this.$message.warning('请输入手机号！');
        return false;
      }
      fetch({
        url: '/nzsyHyb/getHybBySj/',
        method: 'get',
        data: {
          sjhm: this.findPhone,
          bizId: this.userInfo.bizId,
        }
      }).then(res => {
        if (res.bean != null && res.bean.hyzt == '1') {
          var hy = res.bean;
          this.hymc = hy.hymc;
          this.sjhm = hy.sjhm;
          this.hyId = hy.id;
        } else {
          this.$message.warning('会员不存在！')
        }
      }).catch(() => {
        this.loading = false;
      })
    },
    // 挂单
    guadan () {
      if (this.form.listDetail.length == 0) {
        this.$message.warning('请扫码添加或选择商品');
        return false;
      }
      if (this.hyId == '') {
        this.$message.warning('请输入手机号选择会员！');
        return false;
      }
      var qyid = this.userInfo.bizId;
      var hyid = this.hyId;
      var hymc = this.hymc;
      var lxdh = this.sjhm;
      var libIds = [];
      var saleNums = [];
      var salePrices = [];
      var saleAmounts = [];

      this.form.listDetail.forEach(item => {
        libIds.push(item.nzid);
        salePrices.push(item.salePrice);
        saleNums.push(item.saleNum);
        saleAmounts.push(Number(item.salePrice) * Number(item.saleNum).toFixed(2));
      });
      fetch({
        url: '/nzsyLs/saveLsddb/',
        method: 'post',
        data: {
          id: this.id,
          lsdh: this.lsdh,
          qyid: qyid,
          hyid: hyid,
          hymc: hymc,
          lxdh: lxdh,
          zffs: 1,//默认现金
          zje: this.totalAmount,
          jsje: this.totalAmount,
          libIds: libIds,
          salePrices: salePrices,
          saleNums: saleNums,
          saleAmounts: saleAmounts,
          zt: 1,//暂存
          jzzt: 2,//未结算
          cjrid: this.userInfo.bizUserId,
          cjr: this.userInfo.yhxm,
        }
      }).then(res => {
        var resCode = res.resCode;
        if (resCode == "000000") {
          this.$message.success("挂单成功");
          this.form.listDetail = [];
          this.hyId = "";
          this.hymc = "";
          this.sjhm = "";
          this.findPhone = "";
          this.totalNum = 0;
          this.totalAmount = 0.00;
        } else {
          this.$message.error(bean1.errorMess);
        }
      }).catch(() => {
        this.loading = false;
      })
    },
    savepayOrder () {
      this.form.listDetail = [];
      this.hyId = "";
      this.hymc = "";
      this.sjhm = "";
      this.findPhone = "";
      this.totalNum = 0;
      this.totalAmount = 0.00;
      this.payOrderVisable = false;
    },

    //键盘触发事件
    show (ev, index) {

      //每一列
      let newIndex;
      //通过ev 获取 当前input 名称 用于判断属于哪列
      let clssName = ev.target.offsetParent.className;
      if (clssName.indexOf('xssl') != -1) {
        newIndex = index * 2;
      } else if (clssName.indexOf('xsjg') != -1) {
        newIndex = index * 2 + 1;
      }
      //获取全部input
      let inputAll = document.querySelectorAll('.bd input');

      //向上 =38
      if (ev.keyCode == 38) {
        //当焦点在第一行的时候 按向上的时候焦点要聚焦到前一列的最后一个
        if (newIndex >= 2) {
          newIndex -= 2;
        }
        if (inputAll[newIndex]) {
          inputAll[newIndex].focus();
        }
        //选中选择
        if (index == 0) {
          this.selectIndex = index;
        } else {
          this.selectIndex = index - 1;
        }
      }
      //向下 = 40
      if (ev.keyCode == 40) {
        //当newIndex 在最后一行的时候 焦点要聚焦到 下一列的第一个
        if (newIndex <= inputAll.length / 2) {
          newIndex += 2;
        }
        if (!this.tableValid) {
          newIndex -= 2;
          this.selectIndex = index;
        } else {
          if ((index + 1) == inputAll.length / 2) {
            this.selectIndex = index;
          } else {
            this.selectIndex = index + 1;
          }
        }
        this.tableValid = true;
        if (inputAll[newIndex]) {
          inputAll[newIndex].focus();
        }
      }

      //左 = 37
      if (ev.keyCode == 37) {
        newIndex -= 1;
        if (inputAll[newIndex]) {
          inputAll[newIndex].focus();
        }
        if (clssName.indexOf('xssl') != -1 && index != 0) {
          this.selectIndex = index - 1;
        } else {
          this.selectIndex = index;
        }

      }

      //右 = 39
      if (ev.keyCode == 39) {
        newIndex += 1;
        if (inputAll[newIndex]) {
          inputAll[newIndex].focus();
        }
        if (clssName.indexOf('xsjg') != -1 && index != inputAll.length / 2 - 1) {
          this.selectIndex = index + 1;
        } else {
          this.selectIndex = index;
        }
      }
    },
    tableRowClassName (row) {
      var selectIndex = this.selectIndex;
      if (row.rowIndex === selectIndex) {
        return 'warning-row'
      } else {
        return ''
      }
    },
    deleteRow () {
      var deleIndex = this.selectIndex;
      this.form.listDetail.splice(deleIndex, 1);
      if (this.form.listDetail.length == 1) {
        this.selectIndex = 0;
      } else {
        this.selectIndex = deleIndex;
      }
      this.getSale();
    }
  }
}
</script>
<style>
.total {
  background: #efefef;
  padding: 30px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 20px;
}

.input-with-select {
  width: 100%;
  margin-right: 30px;
}
.warning-row > td {
  background: oldlace;
}
</style>
