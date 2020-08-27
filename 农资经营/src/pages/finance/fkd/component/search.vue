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
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">查看付款单</div>
      <div
        class="f-tar"
        style="margin-right:25px;"
      >
        <el-form-item label="录单日期">
          <!--{{form.addTime.split(' ')[0]}}-->
          {{form.id?form.cjsj:'123'}}
        </el-form-item>
        <el-form-item label="订单号">
          {{form.dh}}
        </el-form-item>
      </div>
      <el-form-item
        label="供应商名称"
        class="f-pr f4"
      >
        {{form.khmc}}
      </el-form-item>
      <el-form-item
        label="付款日期"
        class="f4"
      >
        {{form.skfksj}}
      </el-form-item>
      <el-form-item
        label="经办人"
        class="f4"
      >
        {{form.jbr}}
      </el-form-item>
      <el-form-item
        label="付款方式"
        class="f4"
        prop="sfkfs"
      >
        <el-select v-model="form.sfkfs"
                   size="small"
                   class="f-vab"
                   placeholder="请选择"
                   disabled>
          <el-option :value="1"
                     label="现金"></el-option>
          <el-option :value="2"
                     label="支付宝"></el-option>
          <el-option :value="3"
                     label="微信"></el-option>
          <el-option :value="4"
                     label="银行转账"></el-option>
        </el-select>
        <!--{{form.sfkfs}}-->
      </el-form-item>
      <el-form-item
        label="备注"
        class="f4"
      >
        {{form.bz}}
      </el-form-item>

      <div class="f-df f-mb10">
        <div class="f-f1">订单总金额：<span class="f-red">{{getTotalPrice}}元</span></div>

      </div>

      <el-table
        :data="form.listDetail"
        style="width: 100%;margin-bottom: 20px;margin-top: 20px;"
      >
        <el-table-column
          type="index"
          label="序号"
           width="50"
        >
        </el-table-column>
        <el-table-column
          label="进货日期"
          prop="djsj"
        >
        </el-table-column>
        <el-table-column
          label="订单号"
          prop="djdh"
        >
        </el-table-column>
        <el-table-column
          label="经办人"
          prop="jbr"
        >
        </el-table-column>
        <el-table-column
          label="付款金额"
          prop="sfkje"
        >
        </el-table-column>
      </el-table>
      <div
        class=" f-mb30"
        style="border-top: solid 1px #efefef;"
      >
        <div style="line-height: 60px;">制单人 ：{{this.userInfo.yhxm}}</div>
      </div>
    </el-form>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
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
      totalPrice: "",
      form: {
        id: "",
        khid: "",
        khmc: "",
        cjsj: "",
        jhdh: "",
        bz: "",
        yhxm: "",
        jbr: "", //联系人
        listDetail: [],
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
    getTotalPrice: function() {
      var array = this.form.listDetail || [];
      var totalPrice = 0;
      for (var item of array) {
        totalPrice += Number(item.sfkje) 
      }
      this.totalPrice = totalPrice;
      return totalPrice;
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    // 初始化数据
    getInfo(id) {
      id = this.id;
      fetch({
        url: "/nzsyYsyfkd/getYsyfkdById/",
        method: "get",
        data: {
          ysyfkdId: id
        }
      }).then(res => {
        res.list ? (this.form = res.list) : "";
        this.form.listDetail = res.list.mx;
      });
    },

    closeForm(fresh = false) {
      this.$emit("closeForm", fresh);
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
