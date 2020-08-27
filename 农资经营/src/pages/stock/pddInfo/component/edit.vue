<!--
 * @Author: 龚铱白
 * @Date: 2019-08-19 09:31:26
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-18 14:46:42
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
      <div class="form-title f-fs18 f-tac f-mb30 f-mt15">{{id?'编辑':'新增'}}盘点单</div>
      <div class="f-tar"
           style="margin-right:25px;">
        <el-form-item label="录单日期">
          {{form.id?form.pdrq:addTime}}
        </el-form-item>
        <el-form-item label="订单号">{{form.pddh}}</el-form-item>
      </div>

      <el-form-item label="盘点日期"
                    prop="pdrq"
                    class="f4">
        <el-date-picker v-model.trim="form.pdrq"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="经办人"
                    prop="jbr"
                    class="f4">
        <el-input v-model.trim="form.jbr"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="备注"
                    prop="bz"
                    class="f4">
        <el-input v-model.trim="form.bz"
                  placeholder=""></el-input>
      </el-form-item>

      <div class="f-df f-mb10">
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
                empty-text="请选择商品"
                style="width: 100%;margin-bottom: 20px;">
        <el-table-column type="index"
                         label="序号"
                         width="50"></el-table-column>
        <el-table-column label="商品名称"
                         prop="nzMc"></el-table-column>
        <el-table-column label="规格型号"
                         prop="ggxh"></el-table-column>
        <el-table-column label="单位"
                         prop="jbdwMc"></el-table-column>
        <el-table-column label="库存数量"
                         prop="kcsl"></el-table-column>
        <el-table-column label="盘点数量"
                         prop="pdsl">
          <template slot-scope="scope">
            <el-input type="number"
                      v-model="scope.row.pdsl"
                      @change="jsxx(scope.$index, scope.row)"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="盈亏数量"
                         prop="pypksl">
          <template slot-scope="scope">
            <el-input type="number"
                      v-model="scope.row.pypksl"
                      readonly
                      placeholder="0"></el-input>
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
        <!--<el-button-->
        <!--round-->
        <!--type="primary"-->
        <!--@click="submitForm(1)"-->
        <!--:disabled="disabled1"-->
        <!--&gt;{{disabled1?'审批中':'审 批'}}</el-button>-->
        <el-button round
                   @click="closeForm(false)">取 消</el-button>
      </div>
    </el-form>

    <el-dialog title="选择商品"
               :append-to-body="true"
               :visible.sync="selNcpVisable"
               width="950px">
      <sel-ncp style="margin:0 auto;"
               @addTrp="addTrp"
               @close="selNcpVisable=false"
               :selIds="selIds"></sel-ncp>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import selNcp from "./selNcp";
import timeFormat from "common/tools/timeFormat";
import fetch from "fetch/axios/";

export default {
  components: {
    selNcp
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
      addTime: timeFormat.one(new Date()),
      selIds: [],
      form: {
        id: 0,
        bz: "",
        jbr: "", //联系人
        pddh: "",//盘点单号
        pdrq: "",
        listDetail: []
      },
      rules: {
        pdrq: commonValidate,
      },
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
  },
  created () {
    this.form.pdrq = timeFormat.one(new Date());
    this.form.jbr = this.userInfo.yhxm;
    if (this.id) {
      this.getOrderInfo();
    } else {
      // this.getPurchNo();
      this.form.jbr = this.userInfo.yhxm;
    }
  },
  methods: {
    getOrderInfo () {
      fetch({
        url: "/nzsyPdd/getPddById/",
        method: "get",
        data: {
          id: this.id
        }
      })
        .then(res => {
          res.bean ? (this.form = res.bean) : "";

          this.form.listDetail = listDetail;
          console.log(this.form.listDetail)
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getPurchNo () {
      fetch({
        url: "/nzsyYsyfkd/getYsyfkdPch/",
        method: "get",
        data: {
          bizId: this.userInfo.bizId,
          type: '3',
          year: new Date().getFullYear()
        }
      })
        .then(res => {
          this.form.pddh = res.bean;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    jsxx (index, row) {
      this.form.listDetail[index].pypksl = Number(row.pdsl) - Number(row.kcsl);
    },
    selDj () {
      this.selNcpVisable = true;
    },
    closeForm (fresh = false) {
      this.$emit("closeForm", fresh);
    },
    close (isRefresh = true) {
      this.$emit("close", isRefresh);
    },
    addTrp (rowlist) {
      rowlist.map(row => {
        //判断页面中是否有该商品
        if (
          this.form.listDetail.findIndex(item => {
            return item.pckcbId === row.id;
          }) != -1
        ) {
          return;
        } else {
          this.form.listDetail.push({
            "nzMc": row.nzmc,
            "pckcbId": row.id,
            "ggxh": row.gg,
            "jbdwMc": row.dw,
            "pdsl": "",
            "kcsl": row.sl,
            "pypksl": "",
            "unitId": row.unitId,
            "fdwsl": row.fdwsl
          });
        }

      })

      console.log(this.form.listDetail)


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
          //用户参数
          var isValid = 1;
          let { id, pdrq, pddh, jbr, bz } = this.form;
          let qyid = this.userInfo.bizId;//
          var pckcbIds = [];
          var nums = [];
          var fdwsls = [];
          var pypksls = [];
          this.form.listDetail.forEach(item => {
            if (
              item.pckcbId == "" ||
              item.pdsl == ""
            ) {
              isValid = 2;
              return;
            }
            pckcbIds.push(item.pckcbId);
            nums.push(item.pdsl);
            if (item.fdwsl == '' || item.fdwsl == undefined || item.fdwsl == null) {
              fdwsls.push(" ");
            } else {
              fdwsls.push(item.fdwsl);
            }
            pypksls.push(
              Number(item.pdsl) - Number(item.kcsl)
            );
          });
          if (isValid == 2) {
            this.$message.warning("请完善订单商品信息");
            this.disabled = false;
            return;
          }

          console.log(this.form.listDetail);
          let params = {
            id: id + "",
            pddh,
            pdrq,
            jbr,
            qyid: qyid + "",
            bz,
            zdr: this.userInfo.yhxm,
            zt: zt + "",
            cjrid: this.userInfo.bizUserId + "",
            pckcbIds: pckcbIds + "",
            nums: nums + "",
            fdwsls: fdwsls + "",
            pypksls: pypksls + ""
          };
          fetch({
            method: "post",
            url: "/nzsyPdd/savePdd/",
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
      })
    },
    deleteNcp (index) {
      this.form.listDetail.splice(index, 1);
    },
  },
}
</script>

<style scoped>
</style>
