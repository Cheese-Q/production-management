<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px" inline class="eidtform" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 ">提交批发出库单</div>
      <div class="f-tar" style="margin-right:25px;">
        <el-form-item label="录单日期">
          <!--{{form.addTime.split(' ')[0]}}-->
          {{form.addTime}}
        </el-form-item>
        <el-form-item label="订单号">
          {{form.saleSno}}
        </el-form-item>
      </div>
      <el-form-item label="客户名称" prop="khmc" class="f-pr f4">
        <span style="margin-right: 80px;">{{form.khmc}}</span>

      </el-form-item>
      <el-form-item label="销售日期" prop="saleDate" class="f4">
        <span style="margin-right: 80px;">{{form.saleDate}}</span>
      </el-form-item>
      <el-form-item label="经办人" class="f4">
        <span style="margin-right: 80px;">{{form.jbr}}</span>
      </el-form-item>
      <el-form-item label="备注" class="f4">
        <span>{{form.remark}}</span>
      </el-form-item>

      <!-- 以上是订单的基础信息 -->
      <div class="f-df f-mb10">
        <div class="f-f1">订单总金额：<span class="f-red">{{form.saleAmount}}元</span></div>

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
          width="100"
          prop="agriCode">
        </el-table-column>
        <el-table-column
          label="产品名称"
          width="120"
          prop="agriName">
        </el-table-column>
        <el-table-column
          label="规格型号"
          prop="model">
        </el-table-column>
        <el-table-column
          label="单位"
          width="80"
          prop="unit">
        </el-table-column>
        <el-table-column
          label="数量"
          width="80"
          prop="saleNum">
          <template slot-scope="scope">
            {{scope.row.saleNum}}
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          width="100"
          prop="salePrice">
          <template slot-scope="scope">
            {{scope.row.salePrice}}
          </template>
        </el-table-column>
        <el-table-column
          label="金额"
          width="80"
          prop="saleTotalAmount">
          <template slot-scope="scope">
            {{scope.row.saleTotalAmount}}
          </template>
        </el-table-column>
        <el-table-column
          label="批次信息"
          prop="pch">
          <template slot-scope="scope">
            {{scope.row.pch}}
          </template>
        </el-table-column>
        <el-table-column
          label="生产日期"
          prop="scrq">
          <template slot-scope="scope">
            {{scope.row.scrq}}
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="折扣率（%）" prop="zklv" class="f-pr f4">
        <span style="margin-right: 80px;">{{form.zklv}}</span>
      </el-form-item>
      <el-form-item label="折扣金额" prop="zkje" class="f4">
        <span style="margin-right: 80px;">{{form.zkje}}</span>

      </el-form-item>
      <el-form-item label="折前价总额" prop="saleAmount" class="f4">
        <span style="margin-right: 80px;">{{form.saleAmount}}</span>

      </el-form-item>
      <el-form-item label="折后价总额" prop="zhjze" class="f4">
        <span>{{form.zhjze}}</span>

      </el-form-item>

      <div class=" f-mb30" style="border-top: solid 1px #efefef;">
        <div style="line-height: 60px;">制单人 ：{{this.userInfo.yhxm}}</div>
      </div>

      <div class="f-tac f-mt20">
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提取中':'提 取'}}</el-button>
        <el-button round @click="cannel">作 废</el-button>
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
      return {
        disabled: false,
        jhrq: null,
        totalPrice: '',
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
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      }),

    },
    created() {
      this.getOrderInfo();
    },
    methods: {
      getOrderInfo() {
        fetch({
          url: '/nzsySale/getSaleInfoById/',
          method: 'get',
          data: {
            id: this.id
          }
        }).then(res => {
          res.bean ? this.form = res.bean : '';
          this.form.listDetail = res.bean.listDetail
        }).catch(() => {
          this.loading = false;
        })
      },
      cannel(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled = true;
            fetch({
              method: 'post',
              url: '/nzsySale/updateSaleInfoById/',
              data: {
                saleId: this.form.id,
                khid:this.form.cusId,
                je: this.form.zhjze,
                zt:4
              }
            }).then(() => {
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled = false;
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
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled = true;
            fetch({
              method: 'post',
              url: '/nzsySale/tqSaleInfotoPurch/',
              data: {
                saleId: this.form.id,
                bizid: this.userInfo.bizId,
                createUserId: this.userInfo.bizUserId,
              }
            }).then(() => {
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled = false;
              this.$router.push({ path: 'pages/purchase/purchaseUnit/component/table.vue' })
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

      closeForm(isRefresh = true) {
        this.$emit("closeForm", isRefresh);
      }
    },
  }
</script>

<style scoped>

</style>
