<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      inline
      class="eidtform"
      status-icon
    >
      <div class="form-title f-fs18 f-tac f-mb30 f-mt15">查看盘点单</div>
      <div class="f-tar" style="margin-right:25px;">
        <el-form-item label="录单日期">{{form.pdrq}}</el-form-item>
        <el-form-item label="订单号">{{form.pddh}}</el-form-item>
      </div>

      <el-form-item label="盘点日期" class="f4">{{form.pdrq}}</el-form-item>
      <el-form-item label="经办人" class="f4">{{form.jbr}}</el-form-item>
      <el-form-item label="备注" class="f4">{{form.bz}}</el-form-item>


      <el-table :data="form.listDetail" empty-text="" style="width: 100%;margin-bottom: 20px;">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="商品名称" prop="nzMc"></el-table-column>
        <el-table-column label="规格型号" prop="ggxh"></el-table-column>
        <el-table-column label="单位" prop="jbdwMc"></el-table-column>
        <el-table-column label="库存数量" prop="kcsl"></el-table-column>
        <el-table-column label="盘点数量" prop="pdsl"></el-table-column>


        <el-table-column label="盈亏数量" prop="pypksl"></el-table-column>

      </el-table>

      <div class="f-mb30" style="border-top: solid 1px #efefef;">
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
      const commonValidate = {
        required: true,
        message: "必填项",
        trigger: "blur"
      };
      return {
        disabled: false,
        disabled1: false,
        selNcpVisable: false,
        selIds: [],
        form: {
          id: 0,
          bz: "",
          jbr: "", //联系人
          pddh: "",//盘点单号
          pdrq: "",
          listDetail: []
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
    created() {
      this.getOrderInfo();
    },
    methods: {
      getOrderInfo(){
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
      closeForm(fresh = false) {
        this.$emit("closeForm", fresh);
      }
    },
  }
</script>

<style scoped>

</style>
