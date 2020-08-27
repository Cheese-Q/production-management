<template>
  <div>
    <el-form ref="editForm"
             :model="editForm"
             label-width="100px"
             inline
             class="eidtform"
             status-icon
             :rules="rules">
      <div class="form-title f-fs18 f-tac f-mb30 f-mt15">{{id?'编辑':'新增'}}付款单</div>
      <div class="f-tar"
           style="margin-right:25px;">
        <el-form-item label="录单日期">
          {{editForm.id?editForm.cjsj:addTime}}
        </el-form-item>
        <el-form-item label="订单号">{{editForm.dh}}</el-form-item>
      </div>
      <el-form-item label="供应商名称"
                    prop="khmc"
                    class="f-pr f4">
        <el-input v-model.trim="editForm.khmc">
          <span slot="suffix"
                class="f-fs24 f-pr10">···</span>
        </el-input>
        <div class="f-pa"
             @click="supNameDialogVisable=true"
             style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="付款日期"
                    class="f4"
                    prop="skfksj">
        <el-date-picker v-model.trim="editForm.skfksj"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="经办人"
                    class="f4">
        <el-input v-model.trim="editForm.jbr"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="收款方式"
                    class="f4"
                    prop="sfkfs">
        <el-select v-model="editForm.sfkfs"
                   size="small"
                   class="f-vab"
                   clearable>
          <el-option v-for="item in zfList"
                     :key="item.code"
                     :label="item.name"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注"
                    class="f4"
                    prop="bz">
        <el-input v-model.trim="editForm.bz"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <div class="f-df f-mb10">
        <div class="f-f1">
          付款总金额：
          <span class="f-red">{{getTotalPrice}}元</span>
        </div>
        <div class="f-f1 f-tar">
          <el-button type="primary"
                     round
                     size="medium"
                     @click="checkSelNcpVisable"
                     style="padding:9px 25px"
                     icon="el-icon-plus">关联单据</el-button>
        </div>
      </div>

      <el-table :data="editForm.listDetail"
                empty-text="请添加商品"
                style="width: 100%;margin-bottom: 20px;">
        <el-table-column type="index"
                         label="序号"
                         width="50"></el-table-column>
        <el-table-column label="进货日期"
                         prop="djsj"></el-table-column>
        <el-table-column label="订单号"
                         prop="djdh"></el-table-column>
        <el-table-column label="经办人"
                         prop="jbr"></el-table-column>
        <el-table-column label="应付金额"
                         prop="ysfkje"></el-table-column>
        <el-table-column label="付款金额"
                         prop="sfkje">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sfkje"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
                   @click="submitForm"
                   :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button round
                   @click="closeForm(false)">取 消</el-button>
      </div>
    </el-form>
    <el-dialog title="选择相关单据"
               :append-to-body="true"
               :visible.sync="selNcpVisable"
               width="800px">
      <!-- :selIds="selIds"  传值给selNcp.vue页面 -->
      <sel-ncp style="margin:0 auto;"
               @addTrp="addTrp"
               @close="selNcpVisable=false"
               :selIds="selIds"
               :khid="this.khid"></sel-ncp>
    </el-dialog>
    <el-dialog title="往来单位选择"
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
import timeFormat from "common/tools/timeFormat";
import fetch from "fetch/axios/";
import selNcp from "./selNcp";
import selSupname from "./selSupname";

export default {
  components: {
    selSupname,
    selNcp
  },
  data () {
    return {
      disabled: false,
      supNameDialogVisable: false,
      selNcpVisable: false,
      selIds: [],
      khid: "",
      totalPrice: 0,
      addTime: timeFormat.one(new Date()),
      rules: {
        khmc: [{ required: true, message: "必填项", trigger: "blur" }],
        skfksj: [{ required: true, message: "必填项", trigger: "blur" }],
        sfkfs: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      zfList:[
        {"code":1,"name":"现金"},
        {"code":2,"name":"支付宝"},
        {"code":3,"name":"微信"},
        {"code":4,"name":"银联转账"},
      ],
      editForm: {
        id: 0,
        dh:"",
        cjsj: "",
        khid: "",
        khmc: "", // 用户姓名
        skfksj: "", //付款时间
        jbr: "", //经办人
        sfkfs: 1, //收款方式
        bz: "", //备注
        listDetail: []
      }
    };
  },
  props: {
    id: {
      type: [String, Number],
      default: ""
    },
    khId: {
      type: [String, Number],
      default: ""
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    }),
    getTotalPrice: function () {
      var array = this.editForm.listDetail;
      var totalPrice = 0;
      if (array.length != 0) {
        for (var item of array) {
          totalPrice += Number(item.sfkje);
        }
        this.totalPrice = totalPrice;
        return totalPrice.toFixed(2); 0.
      } else {
        this.totalPrice = 0;
        return totalPrice.toFixed(2);
      }
    }
  },
  created () {
    if (this.id) {
      this.getInfo();
      console.log("编辑时的khid===" + this.khId);
    }
    this.editForm.jbr = this.userInfo.yhxm;
  },
  methods: {
    // 判断是否选择了供应商
    checkSelNcpVisable () {
      if (!this.editForm.khmc) {
        this.$message.warning("请先选择供应商");
      } else {
        this.selNcpVisable = true;
      }
    },
    // 初始化数据
    getInfo (id) {
      id = this.id;
      fetch({
        url: "/nzsyYsyfkd/getYsyfkdById/",
        method: "get",
        data: {
          ysyfkdId: id
        }
      }).then(res => {
        res.list ? (this.editForm = res.list) : "";
        this.editForm.listDetail = res.list.mx;
      });
    },
    //删除商品
    deleteNcp (index) {
      this.editForm.listDetail.splice(index, 1);
    },
    selsup (row) {
      let { id, bizName } = row;
      // 判断listDetail是否清空
      if (this.editForm.khid != id) {
        this.editForm.listDetail = [];
      }
      this.editForm.khid = id;
      this.khid = id;
      this.editForm.khmc = bizName;
      this.supNameDialogVisable = false;
    },
    closeForm (fresh = false) {
      this.$emit("closeForm", fresh);
    },

    addTrp (rowlist) {
      console.log(rowlist)
      rowlist.map(row => {
        // 页面添加的某一行数据，从弹框返回过来
        let { cjsj, jhdh, khmc, yfk, jbr, id, khid} = row;
        //判断是否同一个用户
        if(this.khid != khid){
          this.editForm.listDetail = []; // 清空列表
          return;
        }
        //判断页面中是否有该商品
        if (
          this.editForm.listDetail.findIndex(item => {
            return item.djId === id;
          }) != -1
        ) {
          // this.$message.warning("已有该商品");
          return;
        }
        this.editForm.listDetail.push({
          djsj: cjsj,
          jbr: jbr,
          ysfkje: yfk,
          sfkje: yfk,
          djdh: jhdh,
          djId: id,
          ddh: jhdh,
          jhsj: cjsj
        });
      });
    },
    submitForm () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (!this.editForm.listDetail.length) {
            this.$message.error("请添加关联单据！");
            return false;
          }
          //防止二次提交
          this.disabled = true;
          //新增字段
          let { id, khid, khmc, sfksj, jbr, bz, sfkfs, skfksj,dh} = this.editForm;
          //用户参数
          var isValid = 1; //判断添加时候输入信息是否完整
          var djIds = []; //选择单据的ID串
          var jes = []; //收/付款金额串
          // var dh = []; //单号
          var skfkje = []; //收付款金额
          var fkje = []; //应付金额
          this.editForm.listDetail.forEach(item => {
            if (
              item.sfkje == "" ||
              item.djId == "" ||
              item.djdh == "" ||
              item.ysfkje == ""
            ) {
              isValid = 2; //isValid = 2 -> 判断输入信息为空并且提醒
              return;
            }
            if (item.ysfkje < item.sfkje) {
              isValid = 3; //isValid = 3 -> 判断输入的收款金额不能大于应收金额
              return;
            }
            jes.push(item.sfkje);
            skfkje.push(item.sfkje);
            djIds.push(item.djId);
            // dh.push(item.djdh);
            fkje.push(item.ysfkje);
          });
          if (isValid == 2) {
            this.$message.warning("请完善订单商品信息");
            this.disabled = false;
            return;
          }
          if (isValid == 3) {
            this.$message.error("付款金额不应超出应付金额");
            this.disabled = false;
            return false;
          }
          let params = {
            id,
            khid,
            skfksj,
            khmc,
            sfksj,
            jbr,
            sfkfs,
            jbr,
            bz,
            dh,
            szlx: "2", //1.收款2 付款
            ywlx: "3", //1.销售 2零售 3采购
            zt: "0", //状态 0-保存 1-提交 2-删除 默认0
            qyid: this.userInfo.bizId,
            cjrid: this.userInfo.bizUserId,
            zdr: this.userInfo.yhxm,
            djIds: String(djIds),
            jes: String(jes),
            skfkje: this.totalPrice
          };
          // if (skfkje < fkje) {
          //   this.$message.error("付款金额不应大于应付金额");
          //   this.disabled = false;
          //   return false;
          // }
          console.log("params==" + JSON.stringify(params));
          console.log("form.id===" + this.editForm.id);
          console.log("id===" + params.id);
          fetch({
            method: "post",
            url: "/nzsyYsyfkd/saveYsyfkd/",
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
    }
  }
};
</script>


<style scoped lang="scss">
.eidtform {
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
