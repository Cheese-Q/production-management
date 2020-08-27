<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px" inline class="eidtform" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt15">提交进货入库单</div>
      <div class="f-tar" style="margin-right:25px;">
        <el-form-item label="录单日期">
          <!--{{form.addTime.split(' ')[0]}}-->
          {{form.id?form.cjsj:'123'}}
        </el-form-item>
        <el-form-item label="订单号">
          {{form.jhdh}}
        </el-form-item>
      </div>
      <el-form-item label="供应商名称" prop="khmc" class="f-pr f4">
        {{form.khmc}}
      </el-form-item>
      <el-form-item label="采购日期" prop="jhrq" class="f4">
        {{form.jhrq}}
      </el-form-item>
      <el-form-item label="经办人" class="f4">
        {{form.jbr}}
      </el-form-item>
      <el-form-item label="备注" class="f4">
        {{form.bz}}
      </el-form-item>

      <!-- 以上是订单的基础信息 -->
      <div class="f-df f-mb10">
        <div class="f-f1">订单总金额：<span class="f-red">{{getTotalPrice}}元</span></div>

      </div>

      <el-table
        :data="form.listDetail"
        empty-text="请添加商品"
        style="width: 100%;margin-bottom: 20px;margin-top: 20px;">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          label="投入品编号"
          width="200"
          prop="agriProdCode">
        </el-table-column>
        <el-table-column
          label="产品名称"
          prop="agriProdName">
        </el-table-column>
        <el-table-column
          label="规格型号"
          width="120"
          prop="model">
        </el-table-column>
        <el-table-column
          label="单位"
          width="100"
          prop="unit">
        </el-table-column>
        <el-table-column
          label="数量"
          width="100"
          prop="purchNum">
          <template slot-scope="scope">
            {{scope.row.purchNum}}
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          width="100"
          prop="jhdj">
          <template slot-scope="scope">
            {{scope.row.jhdj}}
          </template>
        </el-table-column>
        <el-table-column
          label="金额"
          width="100"
          prop="jhje">
          <template slot-scope="scope">
            {{scope.row.jhje}}
          </template>
        </el-table-column>
        <el-table-column
          label="批次信息"
          prop="purchSno">
          <template slot-scope="scope">
            {{scope.row.purchSno}}
          </template>
        </el-table-column>
        <el-table-column
          label="生产日期"
          prop="prodDate">
          <template slot-scope="scope">
            {{scope.row.prodDate}}
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="折扣率（%）" prop="zklv" class="f-pr f4">
        {{form.zklv}}
      </el-form-item>
      <el-form-item label="折扣金额" prop="zkje" class="f4">
        {{form.zkje}}
      </el-form-item>
      <el-form-item label="折前价总额" prop="zkqze" class="f4">
        {{form.zkqze}}
      </el-form-item>
      <el-form-item label="折后价总额" prop="zkhze" class="f4">
        {{form.zkhze}}
      </el-form-item>

      <div class=" f-mb30" style="border-top: solid 1px #efefef;">
        <div style="line-height: 60px;">制单人 ：{{this.userInfo.yhxm}}</div>
      </div>

      <div class="f-tac f-mt20">
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button round @click="closeForm(false)">取 消</el-button>
      </div>


    </el-form>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {exec} from 'common/tools'
  import fetch from 'fetch/axios/';

  export default {
    data() {
      const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
      return {
        disabled: false,
        jhrq: null,
        totalPrice: '',
        rules: {
          jhrq: commonValidate,
          khmc: commonValidate,
          jbr: commonValidate,
          radio: commonValidate,
        },
        form: {
          id: '',
          khid: '',
          khmc: '',
          cjsj: '',
          jhrq: '',
          jhdh: '',
          bz: '',
          yhxm: '',
          radio: '',
          jbr: '',  //联系人
          listDetail: [],
          zklv: '',
          zkje: '',
          zkqze: '',
          zkhze: '',
        }

      }
    },
    props: {

      id: {
        type: [String, Number],
        default: ''
      },
      // khtype:{
      //   type:Array,
      //   default:()=>{
      //     return []
      //   }
      // }
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      }),
      getTotalPrice: function () {
        var array = this.form.listDetail || [];
        var totalPrice = 0;
        for (var item of array) {
          totalPrice += Number(item.jhdj) * Number(item.purchNum)
        }
        this.totalPrice = totalPrice;
        return Number(totalPrice).toFixed(2);
      }
    },
    created() {
      if (this.id) {
        this.getOrderInfo();
      } else {
        this.getPurchNo();
      }
    },
    methods: {
      // 初始化数据
      getOrderInfo() {
        fetch({
          url: '/nzsyPurch/getPurchById/',
          method: 'get',
          data: {
            purchId: this.id
          }
        }).then(res => {
          res.bean ? this.form = res.bean : '';
          this.form.listDetail = res.bean.records
        }).catch(() => {
          this.loading = false;
        })
      },
      zklJs() {
        if (this.totalPrice != 0) {
          this.form.zkqze = this.totalPrice;
          this.form.zkje = Number((Number(this.form.zklv) * Number(this.form.zkqze)) / 100);
          this.form.zkhze = Number(this.form.zkqze) - Number(this.form.zkje);
        }
      },
      zkJs() {
        if (this.totalPrice != 0) {
          this.form.zkqze = this.totalPrice;
          this.form.zklv = Number(Number(this.form.zkje) / Number(this.form.zkqze)) * 100;
          this.form.zkhze = Number(this.form.zkqze) - Number(this.form.zkje);
        }
      },
      getPurchNo() {
        let params = {};
        params.bizId = this.userInfo.bizId;
        params.type = 1;
        params.year = new Date().getFullYear(),
          this.$fetch.api_purchase.cgrk_getPch(params).then(res => {
            this.form.jhdh = res.bean;
          })
      },
      //删除商品
      deleteNcp(index) {
        this.form.listDetail.splice(index, 1);
      },

      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled = true;
            fetch({
              method: 'post',
              url: '/nzsyPurch/updatePurchById/',
              data: {
                purchId: this.form.id,
                khid: this.form.khid,
                je: this.form.zkhze,
                zt: 1
              }
            }).then(() => {
              if(res.resCode=='000000'){
                this.$message.success('操作成功！');
                this.closeForm(true);
                this.disabled = false;
              }else{
                this.$message.warning(res.bean);
              }
            }).catch(() => {
              this.$message.error('操作失败！')
              this.disabled = false;
            })
          } else {
            this.$message.error('请按要求填写')
            return false;
          }
        });
      },

      closeForm(fresh = false) {
        this.$emit("closeForm", fresh);
      }
    }
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
