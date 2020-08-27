<!--
 * @Description: 【零售查询】订单详情页面多了一个取消按钮，把“取消”改成“返回(5237)
 * @Author: your name
 * @Date: 2019-07-30 09:05:09
 * @LastEditTime: 2019-08-13 11:08:07
 * @LastEditors: 龚铱白
 -->

/*查看*/
<template>
  <div class="select">
    <el-form :inline="true"
             :model="form"
             class="demo-form-inline">

      <div style="position: relative;">
        <div style="position:absolute;top:-5px;right:40px; ">
          <el-button @click="closeForm"
                     type="primary"
                     size="medium">返 回</el-button>
        </div>
      </div>
      <div class="form-title f-fs18 f-tac f-mb30 f-mt30">查看零售单</div>
      <el-form-item label="购买人员"
                    prop="hymc">
        <el-input v-model="form.hymc"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="手机号码"
                    prop="lxdh">
        <el-input v-model="form.lxdh"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="录单日期"
                    prop="cjsj">
        <el-input v-model="form.cjsj"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="订单号"
                    prop="lsdh">
        <el-input v-model="form.lsdh"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="订单总金额"
                    prop="jsje">
        <el-input v-model="form.zje"
                  :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column label="图片"
                       width="120"
                       prop="imgPaths">
        <template slot-scope="scope">
          <img :src="scope.row.imgPaths"
               alt=""
               style="width: 100px;height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="nzid"
                       label="商品编码"></el-table-column>
      <el-table-column prop="nzmc"
                       label="商品名称"></el-table-column>
      <el-table-column prop="gg"
                       label="规格型号"></el-table-column>
      <el-table-column prop="dw"
                       label="单位"></el-table-column>
      <el-table-column prop="xssl"
                       label="数量"></el-table-column>
      <el-table-column prop="xsdj"
                       label="单价"></el-table-column>
      <el-table-column prop="xsje"
                       label="金额"></el-table-column>
    </el-table>
    <el-form :inline="true"
             :model="form"
             class="demo-form-inline">
      <el-form-item label="收款方式"
                    prop="zffs">
        <el-input v-model="form.zffs"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="结算金额"
                    prop="jsje">
        <el-input v-model="form.jsje"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="收款金额"
                    prop="zje">
        <el-input v-model="form.zje"
                  :disabled="true"
                  @click="shoukuan"></el-input>
      </el-form-item>
      <el-form-item label="制单人"
                    prop="hymc">
        <el-input v-model="form.hymc"
                  :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <!-- <el-button @click="closeForm">取 消</el-button> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import fetch from "fetch/axios/";
export default {
  data () {
    return {
      disabled: false,
      tableData: [],
      assetsURL: require('../../../../assets/images/icon-xzsp-nogoods.png'),
      bean: ''
    };
  },
  props: {
    form: {
      type: Object,
      default: function () {
        return {
          hymc: "",
          lxdh: "",
          cjsj: "",
          lsdh: "",
          zje: ""
        };
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  mounted () {
    if (this.form.zffs == 1) {
      this.form.zffs = "现金";
    } else if (this.form.zffs == 2) {
      this.form.zffs = "支付宝";
    } else {
      this.form.zffs = "微信";
    }
    this.getTableData();
  },
  methods: {
    closeForm (fresh = false) {
      this.$emit("closeForm", fresh);
    },
    getTableData () {
      fetch({
        url: "/nzsyLs/getLsddbById/",
        method: "get",
        data: {
          saleId: this.form.id
        }
      }).then(res => {
        res.bean ? this.bean = res.bean : '';
        let listDetail = [];
        res.bean.lsddSpmxbs.map(item => {
          console.log(item)
          if (item.imgPath.length == 0) {
            item.imgPaths = this.assetsURL;
          } else {
            item.imgPaths = item.imgPath[0].tpdz;
          }
          listDetail.push(item);
        })
        this.tableData = listDetail
      }).catch(() => {
        this.loading = false;
      });
    },
    shoukuan (h, row) {
      if (row.zje == 1) {
        return "暂存";
      } else if (row.zt == 2) {
        return "已审批";
      } else {
        return "不可用";
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  margin: 20px 0;
}

.input-with-select {
  width: 240px;
}
.ncp-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.editFzr {
  margin-left: 150px;
}
</style>
