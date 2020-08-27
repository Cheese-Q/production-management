/*地块负责人*/
<template>
  <div class="dkfzr"
       style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <el-input placeholder="单位名称"
                  @keyup.enter.native=search
                  v-model.trim=khmc
                  class="input-with-select f-vab"
                  size="small">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px"
                   @click=search><i class="el-icon-search f-fs20"></i></el-button>
      </div>
      <!-- <div class="f-f1 f-tar">
        <el-button
          type="primary"
          size="medium"
          @click="supNameDialogVisable=true"
          round
          style="padding:9px 25px"
        >新 增</el-button>
      </div> -->
    </div>
    <div v-if="rIndex==2">
      <s-table v-loading=loading
               class="table"
               ref="stable"
               element-loading-text="拼命加载中"
               :tableData=tableData
               :totalCount=totalCount
               :getData=getTableData
               :tableHeader=lsHeader></s-table>
    </div>
    <div v-else>
      <s-table v-loading=loading
               class="table"
               ref="stable"
               element-loading-text="拼命加载中"
               :tableData=tableData
               :totalCount=totalCount
               :getData=getTableData
               :tableHeader=pfHeader></s-table>
    </div>
    <el-dialog title="新增往来单位"
               :append-to-body="true"
               :visible.sync="supNameDialogVisable"
               width="800px">
      <add-sup v-if="supNameDialogVisable"
               :khtype="khtype"
               :isSup="'04'"
               style="margin:0 auto;"
               @closeForm="supNameDialogVisable=false;search()"></add-sup>
    </el-dialog>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import fetch from "fetch/axios/";
import addSup from "pages/purchase/purchaseUnit/component/edit.vue";
export default {
  components: {
    addSup
  },
  data () {
    return {
      khtype: [
        { label: "销售商", value: "01" },
        { label: "农资销售商", value: "02" },
        { label: "检测机构", value: "03" },
        { label: "农产品供应商", value: "04" }
      ],
      sfky: false,
      khlx: "",
      khmc: "",
      type: "",
      supNameDialogVisable: false,
      //table参数
      lsHeader: [
        { label: "联系人", prop: "hymc" },
        { label: "联系电话", prop: "sjhm" },
        {
          label: "操作",
          prop: "delFlag",
          width: "120",
          "render-column": this.renderEdit
        }
      ],
      pfHeader: [
        {
          label: "企业类型",
          prop: "delFlag",
          width: "180",
          "render-column": this.renderStateQy
        },
        { label: "联系人", prop: "bizName" },
        { label: "联系电话", prop: "contNumber" },
        {
          label: "操作",
          prop: "delFlag",
          width: "120",
          "render-column": this.renderEdit
        }
      ],
      loading: false,
      totalCount: 1,
      tableData: []
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  props: {
    rIndex: {
      type: [String, Number],
      default: function () {
        return [];
      }
    }
  },
  created () {
    this.getTableData();
  },
  watch: {
    // 监听rIndex,如果rIndex有变化会执行该方法
    rIndex: function () {
      this.getTableData();
    }
  },
  methods: {
    /*render-column开始*/
    renderStateQy (h, row) {
      if (row.bizType == 1) {
        return "客户";
      } else if (row.bizType == 2) {
        return "供应商";
      } else {
        return "客户和供应商";
      }
    },

    renderEdit (h, row) {
      return (
        <el-button
          size="mini"
          class="edit"
          onClick={() => {
            this.$emit("selsup", row);
          }}
        >
          选择
        </el-button>
      );
    },
    /*render-column结束*/

    search () {
      this.$refs.stable.pageNo = 1;
      this.getTableData();
    },

    /**
     * 思路:
     *  1.从上一个页面传一个字段如index去判断他是零售收款还是批发收款
     *  2.当index == 2 -> 零售收款
     *  3.当index == 1 -> 批发收款
     *  4.如果是零售收款  -> /nzsyHyb/pageHyb/
     *  5.如果是批发收款  -> /nzsyBizSupplier/pageBizSupplier/
     * */
    //零售收款
    getLs () {
      this.loading = true;
      fetch({
        url: "/nzsyHyb/pageHyb/",
        method: "get",
        data: {
          bizId: this.userInfo.bizId,
          key: this.khmc,
          hyzt: "1", //会员状态
          sfsfk: "1", //是否收付款， 0 -否， 1-是
          type: "2,3",
          pageNo: this.currentPage
        }
      }).then(res => {
        let list = res.list;
        this.tableData = list.data;
        this.totalCount = list.totalCount;
        this.currentPage = list.pageNo;
        this.loading = false;
      });
    },
    // 批发收款
    getPf () {
      this.loading = true;
      fetch({
        url: "/nzsyBizSupplier/pageBizSupplier/",
        method: "get",
        data: {
          bizId: this.userInfo.bizId,
          key: this.khmc,
          flag: "1",
          type: "1,3",
          sfysyfk: "1",
          pageNo: this.currentPage
        }
      }).then(res => {
        let list = res.list;
        this.tableData = list.data;
        this.totalCount = list.totalCount;
        this.currentPage = list.pageNo;
        this.loading = false;
      });
    },
    /**
     * 零售收款 -> getLs()
     * 批发收款 -> getPf()
     */

    getTableData (index) {
      index = this.rIndex;
      if (index == 2) {
        this.getLs();
      } else {
        this.getPf();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 240px;
}
.ncp-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
