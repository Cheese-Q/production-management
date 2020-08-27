<!--
 * @Author: 龚铱白
 * @Date: 2019-08-16 16:05:47
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-17 10:38:39
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
      <div class="form-title f-fs18 f-tac f-mb30 f-mt15">{{id?'编辑':'新增'}}进货入库单</div>
      <div class="f-tar"
           style="margin-right:25px;">
        <el-form-item label="录单日期">
          <!--{{form.addTime.split(' ')[0]}}-->
          {{form.id?form.cjsj:addTime}}
        </el-form-item>
        <el-form-item label="订单号">{{form.jhdh}}</el-form-item>
      </div>
      <el-form-item label="供应商名称"
                    prop="khmc"
                    class="f-pr f4">
        <el-input v-model.trim="form.khmc">
          <span slot="suffix"
                class="f-fs24 f-pr10">···</span>
        </el-input>
        <div class="f-pa"
             @click="supNameDialogVisable=true"
             style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="采购日期"
                    prop="jhrq"
                    class="f4">
        <el-date-picker v-model.trim="form.jhrq"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="经办人"
                    class="f4">
        <el-input v-model.trim="form.jbr"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="备注"
                    class="f4">
        <el-input v-model.trim="form.bz"
                  placeholder="请输入"></el-input>
      </el-form-item>

      <!-- 以上是订单的基础信息 -->
      <div class="f-df f-mb10">
        <div class="f-f1"
             v-if="this.form.zklv == 0 || this.form.zkje == 0">订单总金额：<span class="f-red">{{getTotalPrice}}元</span></div>
        <div class="f-f1"
             v-else>订单总金额：<span class="f-red">{{this.form.zkhze}}元</span></div>
        <div class="f-f1 f-tar">
          <el-button type="primary"
                     round
                     size="medium"
                     @click="selNcpVisable=true"
                     style="padding:9px 25px"
                     icon="el-icon-plus
">商 品</el-button>
        </div>
      </div>

      <el-table :data="form.listDetail"
                empty-text="请添加商品"
                style="width: 100%;margin-bottom: 20px;">
        <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
        <el-table-column label="图片"
                         width="120"
                         prop="imgPaths">
          <template slot-scope="scope">
            <img :src="scope.row.imgPaths"
                 alt=""
                 style="width: 70px;height: 70px">
          </template>
        </el-table-column>
        <el-table-column label="投入品编号"
                         prop="agriProdCode"></el-table-column>
        <el-table-column label="产品名称"
                         prop="agriProdName"></el-table-column>
        <el-table-column label="规格型号"
                         width="120"
                         prop="model"></el-table-column>
        <el-table-column label="数量"
                         width="150"
                         prop="purchNum">
          <template slot-scope="scope">
            <el-input type="number"
                      v-model="scope.row.purchNum"
                      @change="jsxx"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单价"
                         width="150"
                         prop="jhdj">
          <template slot-scope="scope">
            <el-input type="number"
                      v-model="scope.row.jhdj"
                      @change="jsxx"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="金额"
                         width="150"
                         prop="jhje">
          <template slot-scope="scope">{{Number(Number(scope.row.jhdj)*Number(scope.row.purchNum)).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column label="单位"
                         width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.unitType == 1">
              <el-input v-model="scope.row.unit"
                        readonly="readonly"></el-input>
            </span>
            <span v-else>
              <el-select v-model="scope.row.unitId"
                         placeholder="全部">
                <el-option v-for="item in scope.row.dwList"
                           :key="item.unitId"
                           :label="item.unit"
                           :value="item.unitId"></el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="批次信息"
                         prop="purchSno">
          <template slot-scope="scope">
            <el-input v-model="scope.row.purchSno"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="生产日期"
                         prop="prodDate">
          <template slot-scope="scope">
            <el-date-picker v-model.trim="scope.row.prodDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="100">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="danger"
                       @click="deleteNcp(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="折扣率（%）"
                    prop="zklv"
                    class="f-pr f4">
        <el-input v-model.trim="form.zklv"
                  @change="zklJs"></el-input>
      </el-form-item>
      <el-form-item label="折扣金额"
                    prop="zkje"
                    class="f4">
        <el-input v-model.trim="form.zkje"
                  @change="zkJs"></el-input>
      </el-form-item>
      <!-- <el-form-item label="折前价总额"
                    prop="zkqze"
                    class="f4">
        <el-input v-model.trim="form.zkqze == 0?totalPrice:form.zkqze"
                  :disabled="true"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="折后价总额"
                    prop="zkhze"
                    class="f4">
        <el-input v-model.trim="form.zkhze == 0?totalPrice:form.zkhze"
                  :disabled="true"></el-input>
      </el-form-item> -->
      <el-form-item label="折前价总额"
                    prop="zkqze"
                    class="f4">
        <el-input v-model.trim="form.zkqze == 0?0:form.zkqze"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="折后价总额"
                    prop="zkhze"
                    class="f4">
        <el-input v-model.trim="form.zkhze == 0?0:form.zkhze"
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
                    prop="jzzt"
                    class="f4">
        <el-select v-model="form.jzzt"
                   size="small"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="item in sfList"
                     :key="item.code"
                     :label="item.name"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>

      <div class="f-mb30"
           style="border-top: solid 1px #efefef;">
        <div style="line-height: 60px;">制单人 ：{{this.userInfo.yhxm}}</div>
      </div>

      <div class="f-tac f-mt20">
        <el-button round
                   type="primary"
                   @click="submitForm(0)"
                   :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button round
                   type="primary"
                   @click="submitForm(1)"
                   :disabled="disabled1">{{disabled1?'审批中':'审 批'}}</el-button>
        <el-button round
                   @click="closeForm(false)">取 消</el-button>
      </div>
    </el-form>

    <el-dialog title="选择商品"
               :append-to-body="true"
               :visible.sync="selNcpVisable"
               width="1000px">
      <sel-ncp style="margin:0 auto;"
               @addTrp="addTrp"
               @close="selNcpVisable=false"
               :selIds="selIds"></sel-ncp>
    </el-dialog>
    <el-dialog title="选择供应商"
               :append-to-body="true"
               :visible.sync="supNameDialogVisable"
               width="800px">
      <sel-supname style="margin:0 auto;"
                   @selsup="selsup"></sel-supname>
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
      jec: [],
      jhrq: null,
      totalPrice: "0.00",
      addTime: timeFormat.one(new Date()),
      selIds: [],
      zfList:[
        {"code":1,"name":"现金"},
        {"code":2,"name":"支付宝"},
        {"code":3,"name":"微信"},
        {"code":4,"name":"银联转账"}
      ],
      sfList:[
        {"code":1,"name":"已结算"},
        {"code":2,"name":"未结算"}
      ],
      rules: {
        jbr: commonValidate,
        khmc: commonValidate,
        jhrq: commonValidate,
        prodDate: commonValidate
      },
      form: {
        id: 0,
        khid: "",
        khmc: "",
        cjsj: "",
        jhrq: "",
        jhdh: "",
        bz: "",
        yhxm: "",
        radio: "",
        jbr: "", //联系人
        zklv: 0,
        zkje: 0,
        zkqze: 0,
        zkhze: 0,
        listDetail: [],
        jsfs: 1,
        jzzt: 1
      }
    };
  },
  props: {
    id: {
      type: [String, Number],
      default: ""
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
        totalPrice += Number(item.jhdj) * Number(item.purchNum);
      }
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
    // 初始化数据
    getOrderInfo () {
      fetch({
        url: "/nzsyPurch/getPurchById/",
        method: "get",
        data: {
          purchId: this.id
        }
      })
        .then(res => {
          res.bean ? (this.form = res.bean) : "";
          this.form.khmc = res.bean.khmc;
          this.form.khid = res.bean.khid;
          let listDetail = [];
          res.bean.records.map(item => {
            if (item.imgPath.length == 0) {
              item.imgPaths = this.assetsURL;
            } else {
              item.imgPaths = item.imgPath[0].tpdz;
            }
            // this.selIds.push({id: item.id});
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
                  unit: bean.baseUnit
                };
                list.push(obj);
                obj = {
                  unitId: bean.subUnitId1,
                  unit: bean.subUnit1
                };
                list.push(obj);
                item.dwList = list;
                listDetail.push(item);
                this.form.listDetail = listDetail;
              });
            } else {
              listDetail.push(item);
              this.form.listDetail = listDetail;
            }
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    jsxx () {
      this.zklJs();
      this.zkJs();
    },
    /**
     * 折扣率计算
     * ! 根据totalPrice去判断
     * * 当totalPrice不为空时;折前价总额 == totalPrice;折后价总额 == 折前价总额 - 折扣金额
     *  */
    zklJs () {
      if (Number(this.totalPrice)>-1) {
        this.form.zkqze = Number(this.totalPrice).toFixed(2);
        this.form.zkje = (
          (Number(this.form.zklv) * Number(this.form.zkqze)) /
          100
        ).toFixed(2);
        this.form.zkhze = (
          Number(this.form.zkqze) - Number(this.form.zkje)
        ).toFixed(2);
      }
    },
    // 折扣金额计算
    zkJs () {
      if (this.totalPrice != 0) {
        this.form.zkqze = Number(this.totalPrice).toFixed(2);
        this.form.zklv = (
          (Number(this.form.zkje) / Number(this.form.zkqze)) *
          100
        ).toFixed(2);
        this.form.zkhze = (
          Number(this.form.zkqze) - Number(this.form.zkje)
        ).toFixed(2);
      }
    },
    getPurchNo () {
      let params = {};
      params.bizId = this.userInfo.bizId;
      params.type = 1;
      (params.year = new Date().getFullYear()),
        this.$fetch.api_purchase.cgrk_getPch(params).then(res => {
          this.form.jhdh = res.bean;
        });
    },
    //删除商品
    deleteNcp (index) {
      this.form.listDetail.splice(index, 1);
      this.jsxx();

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
          let { id, jhdh, jhrq, khid, khmc, jbr, bz, zklv, zkje } = this.form;
          //用户参数
          var isValid = 1;
          let bizId = this.userInfo.bizId;
          let cjrid = this.userInfo.bizUserId;
          let cjrmc = this.userInfo.yhxm;
          var agriIds = [];
          var jhdjs = [];
          var purchNums = [];
          var purchSnos = [];
          var prodDates = [];
          var jhjes = [];
          var unitIds = [];
          var xlhs = [];
          this.form.listDetail.forEach(item => {
            if (
              item.agriId == "" ||
              item.unitId == "" ||
              item.jhdj == "" ||
              item.purchNum == "" ||
              item.purchSno == undefined ||
              item.prodDate == undefined ||
              item.purchSno == "" ||
              item.prodDate == ""
            ) {
              isValid = 2;
              return;
            }
            if (item.jhdj == 0 || item.purchNum == 0) {
              isValid = 3;
            }
            agriIds.push(item.agriId);
            unitIds.push(item.unitId);
            jhdjs.push(item.jhdj);
            purchNums.push(item.purchNum);
            purchSnos.push(item.purchSno);
            prodDates.push(item.prodDate);
            if (item.xlh instanceof Array) {
              xlhs.push(" ");
            } else {
              xlhs.push(item.xlh);
            }
            jhjes.push(
              Number(item.purchNum).toFixed(2) * Number(item.jhdj).toFixed(2)
            );
          });
          if (isValid == 2) {
            this.$message.warning("请完善订单商品信息");
            this.disabled = false;
            return false;
          }
          if (isValid == 3) {
            this.$message.warning("商品数量以及订单金额不能为0");
            this.disabled = false;
            return false;
          }
          var zkqze = this.form.zkqze;
          var zkhze = this.form.zkhze;
          if (zklv == null || zklv == "" || zklv == undefined) {
            zkqze = this.totalPrice;
            zkhze = this.totalPrice;
          }
          let params = {
            id,
            jhdh,
            jhrq,
            khid,
            khmc,
            jbr,
            bz,
            zt: zt,
            zklv: Number(zklv).toFixed(2),
            zkje: Number(zkje).toFixed(2),
            zkqze: Number(zkqze).toFixed(2),
            zkhze: Number(zkhze).toFixed(2),
            cjrid: cjrid,
            cjrmc: cjrmc,
            agriIds: String(agriIds),
            jhdjs: String(jhdjs),
            purchNums: String(purchNums),
            purchSnos: String(purchSnos),
            prodDates: String(prodDates),
            jhjes: String(jhjes),
            unitIds: String(unitIds),
            qyid: bizId,
            xlhs: String(xlhs),
            jsfs: this.form.jsfs,
            jzzt: this.form.jzzt,
          };
          fetch({
            method: "post",
            url: "/nzsyPurch/savePurch/",
            data: params
          })
            .then((res) => {
              if(res.resCode=="000000"){
                var bean=res.bean;
                if(bean!=null&&bean=="2"){
                  // this.$message.error(res.beanstr);
                  this.$message.error("商品在黑名单中");
                  this.disabled = false;
                }else{
                  this.$message.success("操作成功！");
                  this.closeForm(true);
                  this.disabled = false;
                }
              } else{
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
      rowlist.map(row => {
        let {
          agriProdName,
          codes,
          model,
          unit,
          unitId,
          sysUnitId,
          unitType,
          id,
          imgPaths,
          nzsyTpbs
        } = row;
        //判断页面中是否有该商品
        if (
          this.form.listDetail.findIndex(item => {
            return item.agriId === id;
          }) != -1
        ) {
          return;
        }
        // 获取多单位
        let dwList = [];
        if (unitType == 2) {
          let obj = {};
          obj = {
            unitId: row.sysUnitId,
            unit: row.unit
          };
          dwList.push(obj);
          obj = {
            // unitId: row.subUnitId1,
            unitId: "10",
            unit: row.subUnit1
          };
          dwList.push(obj);
          // if (row.subUnit2 != null && row.subUnitId2 != 0) {
          //   obj = {
          //     unitId: row.subUnitId2,
          //     unit: row.subUnit2
          //   };
          //   dwList.push(obj);
          // }
        }
        // if (imgPaths == null) {
        //   imgPaths = this.assetsURL;
        // }

        if (nzsyTpbs.length == 0) {
          imgPaths = this.assetsURL;
        } else {
          imgPaths = nzsyTpbs[0].tpdz
        }

        this.form.listDetail.push({
          agriProdName: agriProdName,
          agriProdCode: codes,
          agriId: id,
          model: model,
          unit: unit,
          unitId: sysUnitId,
          unitType: unitType,
          jhdj: "",
          jhje: "",
          purchNum: "",
          dwList: dwList,
          xlh: " ",
          imgPaths: imgPaths,
        });
      });
    },
    selsup (row) {
      let { id, bizName } = row;
      this.form.khid = id;
      this.form.khmc = bizName;
      this.supNameDialogVisable = false;
    },
    closeForm (fresh = false) {
      this.$emit("closeForm", fresh);
    },
    close (isRefresh = true) {
      this.$emit("close", isRefresh);
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
/*.el-form-item--medium .el-form-item__label{*/
/*width: 100px!important;*/
/*}*/
/*.el-form-item--medium .el-form-item__content{*/
/*margin-left: 0px!important;*/
/*}*/
</style>
