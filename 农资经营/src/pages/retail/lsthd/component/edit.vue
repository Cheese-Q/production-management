<!--
 * @Author: 龚铱白
 * @Date: 2019-08-15 09:15:56
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-03 16:38:37
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
      <div class="form-title f-fs18 f-tac f-mb30 f-mt15">{{id?'编辑':'新增'}}零售退货单</div>
      <div class="f-tar"
           style="margin-right:25px;">
        <el-form-item label="录单日期">
          {{form.id?form.cjsj:addTime}}
        </el-form-item>
        <el-form-item label="订单号">{{form.jhdh}}</el-form-item>
      </div>

      <el-form-item label="会员"
                    prop="khmc"
                    class="f-pr f4">
        <el-input v-model.trim="form.khmc"
                  placeholder="请选择会员">
          <span slot="suffix"
                class="f-fs24 f-pr10">···</span>
        </el-input>
        <div class="f-pa"
             @click="supNameDialogVisable=true"
             style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="退货日期"
                    prop="jhrq"
                    class="f4">
        <el-date-picker v-model.trim="form.jhrq"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="结算状态"
                    prop="jzzt"
                    class="f4">
        <el-select v-model="form.jzzt"
                   placeholder="请选择">
          <el-option v-for="item in jzzts"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式"
                    prop="jzfs"
                    class="f4">
        <el-select v-model="form.jzfs"
                   placeholder="请选择">
          <el-option v-for="item in jzfss"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经办人"
                    prop="jbr"
                    class="f4">
        <el-input v-model.trim="form.jbr"
                  placeholder="请输入"></el-input>
      </el-form-item>

      <!-- 以上是订单的基础信息 -->
      <div class="f-df f-mb10">
        <div class="f-f1">
          退货总金额：
          <span class="f-red">{{getTotalPrice}}元</span>
        </div>
        <div class="f-f1 f-tar">
          <el-button type="primary"
                     round
                     size="medium"
                     @click="selDj"
                     style="padding:9px 25px"
                     icon="el-icon-plus
">单 据
          </el-button>
        </div>
      </div>

      <el-table :data="form.listDetail"
                empty-text="请选择单据"
                style="width: 100%;margin-bottom: 20px;">
        <el-table-column type="index"
                         label="序号"
                         width="50"></el-table-column>
        <el-table-column label="商品名称"
                         prop="nzmc"></el-table-column>
        <el-table-column label="规格型号"
                         prop="gg"></el-table-column>
        <el-table-column label="单价"
                         prop="zhxsdj"></el-table-column>
        <el-table-column label="可退数量"
                         prop="kthsl"></el-table-column>
        <el-table-column label="退货数量"
                         prop="thsl">
          <template slot-scope="scope">
            <el-input type="number"
                      v-model="scope.row.thsl"
                      @change="jsxx(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="小计"
                         width="250"
                         prop="zhxsdj">
          <template slot-scope="scope">
            {{isNaN(Number(Number(scope.row.zhxsdj)*Number(scope.row.thsl)).toFixed(2))?0.00:Number(Number(scope.row.zhxsdj)*Number(scope.row.thsl)).toFixed(2)}}
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

      <div class="f-mb30"
           style="border-top: solid 1px #efefef;">
        <div style="line-height: 60px;">制单人 ：{{this.userInfo.yhxm}}</div>
      </div>

      <div class="f-tac f-mt20">
        <el-button round
                   type="primary"
                   @click="submitForm(0)"
                   :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <!--<el-button round-->
        <!--type="primary"-->
        <!--@click="submitForm(1)"-->
        <!--:disabled="disabled1">{{disabled1?'审批中':'审 批'}}</el-button>-->
        <el-button round
                   @click="closeForm(false)">取 消</el-button>

      </div>
    </el-form>

    <el-dialog title="选择单据"
               :append-to-body="true"
               :visible.sync="selNcpVisable"
               width="800px">
      <sel-ncp style="margin:0 auto;"
               @addTrp="addTrp"
               @close="selNcpVisable=false"
               :selIds="selIds"
               :hyid="form.khid"></sel-ncp>
    </el-dialog>

    <el-dialog title="选择会员"
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
      disabled: false,
      disabled1: false,
      selNcpVisable: false,
      supNameDialogVisable: false,
      totalPrice: "",
      addTime: timeFormat.one(new Date()),
      selIds: [],
      djBean: "",
      jzzts: [{
        value: 1,
        label: '已结算'
      }, {
        value: 2,
        label: '未结算'
      }],
      jzfss: [{
        value: 1,
        label: '现金'
      }, {
        value: 2,
        label: '支付宝'
      }, {
        value: 3,
        label: '微信'
      }, {
        value: 4,
        label: '银联'
      }],
      rules: {
        khmc: commonValidate,
        jhrq: commonValidate,
        prodDate: commonValidate
      },
      form: {
        id: 0,
        khid: "",
        khmc: "",
        khdz: "",
        xgdjh: "",
        xgdjid: "",
        zhxsdj: "",
        jzzt: 2,
        jzfs: 1,
        jbr: "", //联系人
        jhdh: "",//退货单号
        listDetail: []
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
      for (var item of array) {
        if (!isNaN(Number(item.zhxsdj) * Number(item.thsl))) {
          totalPrice += Number(item.zhxsdj) * Number(item.thsl);
        } else {
          totalPrice += 0;
        }
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
      this.form.jbr = this.userInfo.yhxm;
    }
  },
  methods: {
    // 初始化数据
    getOrderInfo () {
      fetch({
        url: "/nzsyTh/getThdById/",
        method: "get",
        data: {
          thdId: this.id
        }
      })
        .then(res => {
          res.bean ? (this.form = res.bean) : "";
          this.form.listDetail = res.bean.thmx;
          this.form.xgdjh = res.bean.xgdjh;
          this.form.xgdjid = res.bean.xgdjid;
          this.form.jhdh = res.bean.jhdh;
          for (var i = 0; i < this.form.listDetail.length; i++) {
            this.form.listDetail[i].zhxsdj = this.form.listDetail[i].dj;
            this.form.listDetail[i].kthsl = this.form.listDetail[i].dqkthsl;
            this.form.listDetail[i].nzmc = this.form.listDetail[i].agriProdName;
            this.form.listDetail[i].gg = this.form.listDetail[i].model;
            this.form.listDetail[i].zhxsdj = this.form.listDetail[i].basezhdj;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    jsxx (row) {
      if (row.thsl > row.kthsl) {
        this.$message.error("可退货数量不足！");
        return false;
      } else if (row.thsl == 0 || row.thsl == "0") {
        this.$message.error("退货数量不能为0！");
        return false;
      }
    },
    selDj () {
      const khid = this.form.khid;
      if (khid == "" || khid == null) {
        this.$message.error("请选择会员！");
        return false;
      }
      this.selNcpVisable = true;
    },
    selsup (row) {
      let { id, hymc } = row;
      this.form.khid = id;
      this.form.khmc = hymc;
      this.supNameDialogVisable = false;
       this.form.listDetail = []
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
    },

    submitForm (zt) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.listDetail.length) {
            this.$message.error("请选择单据！");
            return false;
          }
          //防止二次提交
          this.disabled = true;
          //用户参数
          var isValid = 1;
          let qyid = this.userInfo.bizId;
          let cjrid = this.userInfo.bizUserId;
          let cjrmc = this.userInfo.yhxm;
          var mxIds = [];
          var thNums = [];
          this.form.listDetail.forEach(item => {
            if (
              item.xgdjid == "" ||
              item.thsl == "" ||
              item.thsl == 0
            ) {
              isValid = 2;
              return;
            }
            if (item.thsl > item.kthsl) {
              isValid = 3;
              return;
            }
            if (this.id != 0 && this.id != null && this.id != undefined) {
              mxIds.push(item.xgmxId);
            } else {
              mxIds.push(item.id);
            }
            thNums.push(item.thsl);
          });
          if (isValid == 2) {
            this.$message.warning("请完善订单商品信息");
            this.disabled = false;
            return;
          }
          if (isValid == 3) {
            this.$message.warning("退货数量不能大于可退货数量");
            this.disabled = false;
            return false;
          }
          let params = {
            id: this.id,
            qyid: qyid + "",
            jhdh: this.form.jhdh + "",
            khid: this.form.khid + "",
            khmc: this.form.khmc + "",
            jhrq: this.form.jhrq + "",
            jbr: this.form.jbr,
            thlx: "2",
            zdr: cjrmc,
            xgdjId: this.form.xgdjid + "",
            xgdjh: this.form.xgdjh + "",
            zt: zt + "",
            cjrid: cjrid + "",
            cjrmc: cjrmc + "",
            je: this.totalPrice + "",
            mxIds: String(mxIds),
            thNums: String(thNums),
            jzzt: this.form.jzzt + "",
            jzfs: this.form.jzfs + "",
          };
          fetch({
            method: "post",
            url: "/nzsyTh/saveTh/",
            data: params
          })
            .then(() => {
              this.$message.success("操作成功！");
              this.closeForm(true);
              this.disabled = false;
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
      // debugger;
      //判断页面中是否有该商品
      if (
        this.form.listDetail.findIndex(item => {
          return item.lsdid === rowlist.id;
        }) != -1
      ) {
        this.$message.error("已存在该商品");
        return;
      }
      this.form.listDetail = [];
      fetch({
        method: "get",
        url: "/nzsyLs/getLsddbById/",
        data: {
          saleId: rowlist.id + "",
        }
      }).then(res => {
        this.djBean = res.bean;
        this.form.jzzt = res.bean.jzzt;
        this.form.hyid = res.bean.hyid;
        this.form.hymc = res.bean.hymc;
        this.form.xgdjid = res.bean.id;
        this.form.xgdjh = res.bean.lsdh;
        // this.form.zhxsdj = res.bean.lsddMxbs.zhxsdj;
        let recordsList = res.bean.lsddMxbs;
        for (var i = 0; i < recordsList.length; i++) {
          if (recordsList[i].kthsl > 0) {
            this.form.listDetail.push(recordsList[i]);
            this.form.zhxsdj = res.bean.lsddMxbs[i].zhxsdj;
          } else {
            // this.$message.error("商品可退货数量不足");
            continue;
          }
        }
        this.$message.success('添加成功!');
      });

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
