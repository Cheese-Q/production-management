/*地块负责人*/
<template>
  <div class="dkfzr" style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <el-input
          placeholder="分类名称"
          @keyup.enter.native="search"
          v-model.trim="findName"
          class="input-with-select f-vab"
          size="small"
        ></el-input>
        <el-button type="primary" size="small" style="padding:5px 15px" @click="search">
          <i class="el-icon-search f-fs20"></i>
        </el-button>
      </div>

      <div class="f-f1 f-tar" >
        <router-link :to="{path:'/goods/goodsFl'}"><el-button type="primary" size="medium" round style="padding:9px 25px">申 请</el-button></router-link>
      </div>

    </div>
    <s-table
      v-loading="loading"
      class="table"
      ref="stable"
      element-loading-text="拼命加载中"
      :tableData="tableData"
      :totalCount="totalCount"
      :getData="getTableData"
      :tableHeader="tableHeader"
    ></s-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      totalCount: 1,
      pageSize: 10,
      pageNo: 1,
      findName: "",
      //table参数
      tableHeader: [
        { label: "名称", prop: "agriProdName" },
        {
          label: "规格型号",
          prop: "model"
        },
        { label: "单位", prop: "unit" },
        {
          label: "操作",
          prop: "delFlag",
          "render-column": this.renderEdit
        }
      ],
      loading: false,
      totalCount: 1,
      tableData: []
    };
  },
  props: {
    agriProdCode: "",
    nzdl:""
    // sjbm: ""
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  watch:{
    agriProdCode: function () {
      this.getTableData();
    }
  },
  created() {
    console.log(this.agriProdCode);
    console.log(this.nzdl);
    this.getTableData();
  },
  methods: {
    renderEdit(h, row) {
      return (
        <el-button size="mini" class="edit" onClick={() => {this.$emit("selsup", row);}}>
          选择
        </el-button>
      );
    },

    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
     *params请求参数
     */
    search() {
      this.$refs.stable.pageNo = 1;
      this.getTableData();
    },

    getTableData(obj = {}) {
      this.loading = true;
      let { delFlag } = this;
      let params = {
        agriProdCode: this.agriProdCode,
        findName: this.findName,
        pageNo: this.currentPage
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_goods
        .get_spfl(params)
        .then(res => {
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          this.currentPage = pageNo;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
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
