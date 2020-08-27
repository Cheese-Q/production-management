<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      inline
      class="eidtform"
      :rules="rules"
      status-icon
    >
      <div class="form-title f-fs18 f-tac f-mb30 f-mt15">查看零售退货单</div>
      <div class="f-tar" style="margin-right:25px;">
        <el-form-item label="录单日期">
          <!--{{form.addTime.split(' ')[0]}}-->
          {{form.id?form.cjsj:addTime}}
        </el-form-item>
        <el-form-item label="订单号">{{form.jhdh}}</el-form-item>
      </div>

      <el-form-item label="退货日期" prop="jhrq" class="f4">{{form.jhrq}}</el-form-item>
      <el-form-item label="结算状态" class="f4">{{jszt}}</el-form-item>
      <el-form-item label="支付方式" class="f4">{{zffs}}</el-form-item>
      <el-form-item label="经办人" prop="jbr" class="f4">{{form.jbr}}</el-form-item>

      <!-- 以上是订单的基础信息 -->
      <div class="f-df f-mb10">
        <div class="f-f1">
          退货总金额：
          <span class="f-red">{{getTotalPrice}}元</span>
        </div>

      </div>

      <el-table :data="form.listDetail" empty-text="请选择单据" style="width: 100%;margin-bottom: 20px;">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="商品名称" prop="agriProdName"></el-table-column>
        <el-table-column label="规格型号" prop="model"></el-table-column>
        <el-table-column label="单价" prop="zhrkdj"></el-table-column>
        <el-table-column label="可退数量" prop="kthsl"></el-table-column>
        <el-table-column label="退货数量" prop="thsl"></el-table-column>

        <el-table-column label="小计" width="250" prop="jhje">
          <template
            slot-scope="scope"
          >
            {{isNaN(Number(Number(scope.row.zhrkdj)*Number(scope.row.thsl)).toFixed(2))?0.00:Number(Number(scope.row.zhrkdj)*Number(scope.row.thsl)).toFixed(2)}}
          </template>
        </el-table-column>


      </el-table>

      <div class="f-mb30" style="border-top: solid 1px #efefef;">
        <div style="line-height: 60px;">制单人 ：{{this.userInfo.yhxm}}</div>
      </div>


    </el-form>


  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {exec} from "common/tools";
  import timeFormat from "common/tools/timeFormat";
  import fetch from "fetch/axios/";

  export default {
    data() {
      const commonValidate = {
        required: true,
        message: "必填项",
        trigger: "blur"
      };
      return {
        disabled: false,
        selNcpVisable: false,
        supNameDialogVisable: false,
        totalPrice: "",
        addTime: timeFormat.one(new Date()),
        selIds: [],
        djBean: "",
        jszt:"",
        zffs:"",
        rules: {
        },
        form: {
          id: "",
          khid: "",
          khmc: "",
          khdz: "",
          xgdjh: "",
          xgdjid: "",
          jzzt: "",
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
          if (!isNaN(Number(item.zhrkdj) * Number(item.thsl))) {
            totalPrice += Number(item.zhrkdj) * Number(item.thsl);
          } else {
            totalPrice += 0;
          }
        }
        this.totalPrice = totalPrice;
        return totalPrice.toFixed(2);
      }
    },
    created() {
      this.getOrderInfo();
    },
    methods: {
      getOrderInfo() {
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
            this.form.xgdjId = res.bean.xgdjId;
            this.form.jhdh = res.bean.jhdh;
            for (var i = 0; i < this.form.listDetail.length; i++) {
              console.log(this.form.listDetail[i])
              this.form.listDetail[i].zhrkdj = this.form.listDetail[i].dj;
              this.form.listDetail[i].kthsl = this.form.listDetail[i].dqkthsl;
            }
            const jzzt = res.bean.jzzt;
            if(jzzt==1){
              this.jszt="已结算";
            }else{
              this.jszt="未结算";
            }
            const jzfs = res.bean.jzfs;
            if(jzfs==1){
              this.zffs="现金";
            }else if(jzfs==2){
              this.zffs="支付宝";
            }else if(jzfs==3){
              this.zffs="微信";
            }else if(jzfs==4){
              this.zffs="银联";
            }
          })
          .catch(() => {
            this.loading = false;
          });
      },

    },
  }
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

  .eidtform .el-date-editor.el-input, .eidtform .el-date-editor.el-input__inner {
    width: 100%;
  }
</style>
