<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px" inline class="eidtform" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">查看进货入库单</div>
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
        <div class="f-f1">订单总金额：<span class="f-red">{{form.zkhze}}元</span></div>

      </div>

      <el-table
        :data="form.listDetail"
        empty-text="请添加商品"
        style="width: 100%;margin-bottom: 20px;margin-top: 20px;">
        <el-table-column label="图片" width="120" prop="imgPaths">
          <template slot-scope="scope">
            <img  :src="scope.row.imgPaths" alt="" style="width: 100px;height: 100px">
          </template>
        </el-table-column>
        <el-table-column
          label="投入品编号"
          width="100"
          prop="agriProdCode">
        </el-table-column>
        <el-table-column
          label="产品名称"
          width="120"
          prop="agriProdName">
        </el-table-column>
        <el-table-column
          label="规格型号"
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
        assetsURL: require('../../../../assets/images/icon-xzsp-nogoods.png'),
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
        this.totalPrice = Number(totalPrice);
        return totalPrice.toFixed(2);
      }

    },
    created() {
        this.getOrderInfo();
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
          let listDetail = [] ;
          res.bean.records.map(item => {
            if(item.imgPath.length == 0){
              item.imgPaths = this.assetsURL;
            }else{
              item.imgPaths = item.imgPath[0].tpdz;
            }
            listDetail.push(item);
          })
          this.form.listDetail = listDetail
        }).catch(() => {
          this.loading = false;
        })
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
