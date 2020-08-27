<!--
 * @Author: 龚铱白
 * @Date: 2019-08-19 15:46:25
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-18 15:05:10
 * @Description: 
 -->
<template>
  <div>
    <el-form ref="form"
             :model="form"
             label-width="100px"
             inline
             class="eidtform"
             :rules="rules"
             status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt15">{{id?'编辑':'新增'}}批发出库单</div>
      <div class="f-tar"
           style="margin-right:25px;">
        <el-form-item label="录单日期">
          {{form.addTime.split(' ')[0]}}
        </el-form-item>
        <el-form-item label="订单号">
          {{form.saleSno}}
        </el-form-item>
      </div>
      <el-form-item label="客户名称"
                    prop="bizName"
                    class="f-pr f4">
        <el-input v-model.trim=form.bizName><span slot="suffix"
                class="f-fs24 f-pr10">···</span></el-input>
        <div class="f-pa"
             @click="supNameDialogVisable=true"
             style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="销售日期"
                    prop="saleDate"
                    class="f4">
        <el-date-picker v-model.trim="form.saleDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="经办人"
                    class="f4">
        <el-input v-model.trim="form.jbr"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="备注"
                    class="f4">
        <el-input v-model.trim="form.remark"
                  placeholder="请输入"></el-input>
      </el-form-item>

      <!-- 以上是订单的基础信息 -->
      <div class="f-df f-mb10">
        <div class="f-f1"
             v-if="this.form.zklv == 0 || this.form.zkje == 0">订单总金额：<span class="f-red">{{getTotalPrice}}元</span></div>
        <div class="f-f1"
             v-else>订单总金额：<span class="f-red">{{this.form.zhjze}}元</span></div>
        <div class="f-f1 f-tar">
          <el-button type="primary"
                     round
                     size="medium"
                     @click="selDj"
                     style="padding:9px 25px"
                     icon="el-icon-plus
">商 品
          </el-button>
        </div>
      </div>

      <el-table :data="form.listDetail"
                empty-text="请添加商品"
                style="width: 100%;margin-bottom: 20px;">

        <el-table-column label="图片"
                         width="120"
                         prop="imgPaths">
          <template slot-scope="scope">
            <img :src="scope.row.imgPaths"
                 alt=""
                 style="width: 70px;height: 70px">
          </template>
        </el-table-column>
        <el-table-column label="产品名称"
                         prop="agriName">
        </el-table-column>
        <el-table-column label="批次号"
                         prop="pch">
        </el-table-column>
        <el-table-column label="规格型号"
                         width="120"
                         prop="model">
        </el-table-column>
        <el-table-column label="数量"
                         width="150"
                         prop="saleNum">
          <template slot-scope="scope">
            <el-input type="number"
                      v-model="scope.row.saleNum"
                      @change="jsxx(scope.$index, scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单价"
                         width="150"
                         prop="salePrice">
          <template slot-scope="scope">
            <el-input type="number"
                      v-model="scope.row.salePrice"
                      @change="jsxx(scope.$index, scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="金额"
                         width="150"
                         prop="jhje">
          <template slot-scope="scope">
            {{(Number(scope.row.salePrice)*Number(scope.row.saleNum)).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column label="单位"
                         width="100"
                         prop="unit">
          <template slot-scope="scope">
            <span v-if="scope.row.unitType == 1">
              <el-input v-model="scope.row.unit"
                        readonly="readonly"></el-input>
            </span>
            <span v-else>
              <el-select v-model="scope.row.unitId"
                         placeholder="全部"
                         @change="selectDw(scope.$index, scope.row.unitId)">
                <el-option v-for="item in scope.row.dwList"
                           :key="item.unitId"
                           :label="item.unit"
                           :value="item.unitId"></el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="追溯批次号"
                         prop="saleBackSno">
        </el-table-column>
        <el-table-column label="操作"
                         width="100">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="danger"
                       @click="deleteNcp(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="折扣率（%）"
                    prop="zklv"
                    class="f-pr f4">
        <el-input v-model.trim="form.zklv"
                  @change=zklJs></el-input>
      </el-form-item>
      <el-form-item label="折扣金额"
                    prop="zkje"
                    class="f4">
        <el-input v-model.trim="form.zkje"
                  @change=zkJs></el-input>
      </el-form-item>
      <el-form-item label="折前价总额"
                    prop="saleAmount"
                    class="f4">
        <el-input v-model.trim="form.saleAmount"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="折后价总额"
                    prop="zhjze"
                    class="f4">
        <el-input v-model.trim="form.zhjze"
                  :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="支付方式"
                    prop="jsfs"
                    class="f4">
        <el-select v-model="form.jsfs"
                   size="small"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="item in zfList"
                     :key="item.code"
                     :label="item.name"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算状态"
                    prop="saleStatus"
                    class="f4">
        <el-select v-model="form.saleStatus"
                   size="small"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="item in sfList"
                     :key="item.code"
                     :label="item.name"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <div class=" f-mb30"
           style="border-top: solid 1px #efefef;">
        <div style="line-height: 60px;">制单人 ：{{this.userInfo.yhxm}}</div>
      </div>

      <div class="f-tac f-mt20">
        <el-button round
                   type="primary"
                   @click=submitForm(0)
                   :disabled="disabled">{{disabled?'提交中':'提 交'}}
        </el-button>
        <el-button round
                   type="primary"
                   @click="submitForm(1)"
                   :disabled="disabled1">{{disabled1?'审批中':'审 批'}}</el-button>
        <el-button round
                   @click="closeForm(false)">取 消
        </el-button>
      </div>

    </el-form>

    <el-dialog title="选择商品"
               :append-to-body="true"
               :visible.sync="selNcpVisable"
               width="1000px">
      <sel-ncp style="margin:0 auto;"
               @addTrp=addTrp
               :selIds="selIds"
               :khId="this.form.supId"
               @closeNcp=closeNcp></sel-ncp>
    </el-dialog>
    <el-dialog title="选择客户"
               :append-to-body="true"
               :visible.sync="supNameDialogVisable"
               width="800px">
      <sel-supname style="margin:0 auto;"
                   @selsup=selsup
                   @closesup=closesup></sel-supname>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import selNcp from "./selNcp";
import selSupname from "./selSupname";
import timeFormat from "common/tools/timeFormat";
import fetch from "fetch/axios/";

export default {
  components: {
    selNcp,
    selSupname
  },
  data () {
    const commonValidate = {
      required: true,
      message: "必填项",
      trigger: "blur"
    };
    return {
      assetsURL: require('../../../../assets/images/icon-xzsp-nogoods.png'),
      disabled: false,
      disabled1: false,
      selNcpVisable: false,
      supNameDialogVisable: false,
      oldkhmc: "",
      tableData2: [],
      saleDate: null,
      totalPrice: "",
      selIds: [],
      rules: {
        saleDate: commonValidate,
        bizName: commonValidate,
      },
      zfList:[
        {"code":1,"name":"现金"},
        {"code":2,"name":"支付宝"},
        {"code":3,"name":"微信"},
        {"code":4,"name":"银联转账"}
      ],
      sfList:[
        {"code":"2","name":"已结算"},
        {"code":"1","name":"未结算"}
      ],
      form: {
        id: 0,
        bizName: "",
        addTime: timeFormat.one(new Date()),
        saleDate: "",
        saleSno: "",
        remark: "",
        yhxm: "",
        jbr: "", //联系人
        listDetail: [],
        zklv: 0,
        zkje: 0,
        saleAmount: 0,
        zhjze: 0,
        supId: "",
        contPerson: "",
        tel: "",
        addr: "",
        shtydm: "",
        createUserId: "",
        zfss: "",
        jsfs: 1,
        saleStatus: "1",
        shuliang: ""
      },
    };
  },
  props: {
    id: {
      type: [String, Number],
      default: ""
    },
    khtype: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    }),
    getTotalPrice: function () {
      var array = this.form.listDetail || [];
      var totalPrice = 0;
      console.log(JSON.stringify(this.form.listDetail));
      for (var item of array) {
        totalPrice += Number(item.salePrice) * Number(item.saleNum);
      }
      console.log(array)
      console.log(totalPrice)
      this.totalPrice = totalPrice;
      return totalPrice.toFixed(2);
    }
  },
  created () {
    if (this.id) {
      this.getOrderInfo();

    } else {
      this.getPurchNo();
    }
    this.form.jbr = this.userInfo.yhxm;
  },
  methods: {
    //初始化数据
    getOrderInfo () {
      fetch({
        url: "/nzsySale/getSaleInfoById/",
        method: "get",
        data: {
          id: this.id
        }
      })
        .then(res => {
          res.bean ? (this.form = res.bean) : "";
          this.form.bizName = res.bean.khmc;
          this.form.supId = res.bean.cusId;
          let listDetail = [];
          res.bean.listDetail.map(item => {
            if (item.imgPath.length == 0) {
              item.imgPaths = this.assetsURL;
            } else {
              item.imgPaths = item.imgPath[0].tpdz;
            }
            if (item.unitType == 2) {
              fetch({
                url: "/nzsyUnit/getUnitById/",
                method: "get",
                data: {
                  id: item.ddwid + ""
                }
              }).then(res => {
                let bean = res.bean;
                let obj = {};
                let list = [];
                obj = {
                  unitId: bean.baseUnitId,
                  unit: bean.baseUnit,
                  pfj: item.basezhxsdj
                };
                list.push(obj);
                obj = {
                  unitId: bean.subUnitId1,
                  unit: bean.subUnit1,
                  pfj: item.salePrice
                };
                list.push(obj);
                item.dwList = list;
                listDetail.push(item);
              });
            } else {
              listDetail.push(item);
            }
          });
          this.form.listDetail = listDetail;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    selDj () {
      const khid = this.form.supId;
      if (khid == "" || khid == null) {
        this.$message.warning("请选择客户！");
        return false;
      }
      this.selNcpVisable = true;
    },

    selectDw (index, row) {
      for (var i = 0; i < this.form.listDetail[index].dwList.length; i++) {
        if (this.form.listDetail[index].dwList[i].unitId == row) {//判断选择副单位
          this.form.listDetail[index].salePrice = this.form.listDetail[index].dwList[i].pfj;
        }
      }
      this.zklJs();
      this.zkJs();
    },
    jsxx (index, row) {
      if (this.id) {
        if (row.saleNum > row.pckcsl) {
          this.shuliang = row.pckcsl;
          this.$message.error("库存数量不足！");
          return false;
        }
      } else {
        if (row.saleNum > row.sl) {
          this.shuliang = row.sl;
          this.$message.error("库存数量不足！");
          this.form.listDetail[index].saleNum = 0;
          return false;
        }
      }

      this.zklJs();
      this.zkJs();
    },
    zklJs () {
      if (this.totalPrice != 0) {
        this.form.saleAmount = Number(this.totalPrice).toFixed(2);
        this.form.zkje = (
          (Number(this.form.zklv) * Number(this.form.saleAmount)) /
          100
        ).toFixed(2);
        this.form.zhjze = (
          Number(this.form.saleAmount) - Number(this.form.zkje)
        ).toFixed(2);
      }
    },
    zkJs () {
      if (this.totalPrice != 0) {
        this.form.saleAmount = Number(this.totalPrice).toFixed(2);
        this.form.zklv = (
          (Number(this.form.zkje) / Number(this.form.saleAmount)) *
          100
        ).toFixed(2);
        this.form.zhjze = (
          Number(this.form.saleAmount) - Number(this.form.zkje)
        ).toFixed(2);
      }
    },
    getPurchNo () {
      let params = {};
      params.bizId = this.userInfo.bizId;
      params.type = 2;
      (params.year = new Date().getFullYear()),
        this.$fetch.api_purchase.cgrk_getPch(params).then(res => {
          this.form.saleSno = res.bean;
        });
    },
    //删除商品
    deleteNcp (index) {
      this.form.listDetail.splice(index, 1);
    },

    submitForm (zt) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.listDetail.length) {
            this.$message.error("请添加商品！");
            return false;
          }
          //防止二次提交
          this.disabled = true;
          //新增字段
          let {
            id,
            saleSno,
            saleDate,
            supId,
            bizName,
            jbr,
            remark,
            zklv,
            zkje,
            saleAmount,
            zhjze,
            contPerson,
            tel,
            addr,
            shtydm
          } = this.form;
          //用户参数
          var isValid = 1;
          let bizId = this.userInfo.bizId;
          let cjrid = this.userInfo.bizUserId;
          var pckcbIds = [];
          var salePrices = [];
          var saleNums = [];
          var saleTotalAmounts = [];
          var unitIds = [];
          var xlhs = [];
          this.form.listDetail.forEach(item => {
            if (
              item.pckcbId == "" ||
              item.unitId == "" ||
              item.salePrice == "" ||
              item.saleNum == ""
            ) {
              isValid = 2;
              return;
            }
            if (
              item.saleNum > this.shuliang
            ) {
              isValid = 3;
              return;
            }
            pckcbIds.push(item.pckcbId);
            salePrices.push(item.salePrice);
            saleNums.push(item.saleNum);
            if (item.xlh instanceof Array) {
              xlhs.push(" ");
            } else {
              xlhs.push(item.xlh);
            }
            saleTotalAmounts.push(
              (Number(item.salePrice) * Number(item.saleNum)).toFixed(2)
            );
            unitIds.push(item.unitId);
          });
          if (isValid == 2) {
            this.$message.warning("请完善订单商品信息");
            this.disabled = false;
            return;
          }
          if (isValid == 3) {
            this.$message.warning("请检查库存数量");
            this.disabled = false;
            return false;
          }
          let params = {
            id,
            saleSno,
            saleDate,
            cusId: supId,
            khmc: bizName,
            jbr: jbr,
            remark,
            status: zt,
            zklv: Number(zklv).toFixed(2),
            zkje: Number(zkje).toFixed(2),
            saleAmount: Number(saleAmount).toFixed(2),
            zhjze: Number(zhjze).toFixed(2),
            pckcbIds: String(pckcbIds),
            salePrices: String(salePrices),
            saleNums: String(saleNums),
            saleAmounts: String(saleTotalAmounts),
            unitIds: String(unitIds),
            bizId: bizId,
            contanct: contPerson,
            tel,
            addr,
            shtydm: shtydm,
            addUserId: cjrid,
            xlhs: String(xlhs),
            jsfs: this.form.jsfs,
            saleStatus: this.form.saleStatus
          };
          // console.log(params);
          // return false;
          fetch({
            method: "post",
            url: "/nzsySale/saveSaleInfo/",
            data: params
          }).then(res => {
            if (res.resCode == "000000") {
              var bean = res.bean;
              if (bean != null && bean == "2") {
                this.$message.error(res.beanstr);
                this.disabled = false;
              } else if (bean == "3") {
                this.$message.error(res.beanstr);
                this.disabled = false;
              } else {
                this.$message.success("操作成功！");
                this.closeForm(true);
                this.disabled = false;
              }
            } else {
              this.$message.error("操作失败！");
              this.disabled = false;
            }

          })
            .catch(() => {
              this.$message.error("操作失败！");
              this.disabled = false;
            });
        } else {
          this.$message.error("请按要求填写");
          return false;
        }
      });
    },
    addTrp (rowlist) {
      console.log(rowlist)
      rowlist.map(row => {
        let { nzmc, pch, gg, dw, unitId, ddwid, unitType, id, tp, sl, xsdj, fdwxsdj } = row;
        //判断页面中是否有该商品
        if (
          this.form.listDetail.findIndex(item => {
            return item.pckcbId === id;
          }) != -1
        ) {
          return;
        }
        let dwList = [];
        if (unitType == 2) {
          fetch({
            url: "/nzsyUnit/getUnitById/",
            method: "get",
            data: {
              id: ddwid + ""
            }
          }).then(res => {
            let obj = {};
            let bean = res.bean;
            obj = {
              unitId: bean.baseUnitId,
              unit: bean.baseUnit,
              pfj: xsdj
            };
            dwList.push(obj);
            obj = {
              unitId: bean.subUnitId1,
              unit: bean.subUnit1,
              pfj: fdwxsdj
            };
            dwList.push(obj);

          });
        }
        if (tp == null) {
          tp = this.assetsURL;
        }
        this.form.listDetail.push({
          agriName: nzmc,
          pch: pch,
          pckcbId: id,
          model: gg,
          unit: dw,
          unitId: unitId,
          unitType: unitType,
          salePrice: xsdj,
          saleTotalAmount: "",
          saleNum: "",
          dwList: dwList,
          xlh: " ",
          imgPaths: tp,
          sl: sl,
          subSalePrice1: fdwxsdj
        });

      });

    },

    selsup (row) {
      let {
        id,
        bizName,
        contPerson,
        contNumber,
        bizAddress,
        icCreditCode,
        createUserId
      } = row;
      this.form.supId = id;
      this.form.bizName = bizName;
      this.supNameDialogVisable = false;
      this.form.contPerson = contPerson;
      this.form.tel = contNumber;
      this.form.addr = bizAddress;
      this.form.shtydm = icCreditCode;
      this.form.createUserId = createUserId;
    },
    closeForm (fresh = false) {
      this.$emit("closeForm", fresh);
    },
    closeNcp () {
      this.selNcpVisable = false;
    },
    closesup () {
      this.supNameDialogVisable = false;
    }
  }
};
</script>

<style scoped lang="scss">
.eidtform {
  // width:100%;
  margin: 0 30px;
  box-sizing: border-box;
}

.f4 {
  width: calc(25% - 15px);
  box-sizing: border-box;
}

.f2 {
  width: calc(50% - 15px);
  box-sizing: border-box;
}
</style>

<style>
.eidtform .el-form-item .el-form-item__content {
  width: calc(100% - 100px);
}

.eidtform .el-date-editor.el-input,
.eidtform .el-date-editor.el-input__inner {
  width: 100%;
}
</style>
