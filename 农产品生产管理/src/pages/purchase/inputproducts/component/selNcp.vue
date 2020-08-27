<template>
  <div class="dkfzr" style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <el-input
          placeholder="投入品名称\生产单位"
          @keyup.enter.native="search"
          v-model.trim="ncpmc"
          class="input-with-select f-vab"
          size="small"
        ></el-input>
        <el-button type="primary" size="small" style="padding:5px 15px" @click="search">
          <i class="el-icon-search f-fs20"></i>
        </el-button>
      </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="isAddNcp=true" round style="padding:9px 25px">新 增</el-button>
      </div>
    </div>
    <el-table
      class="f-mt20"
      :data="tableData"
      stripe
      check
      ref="multipleTable"
      v-loading="loading"
      style="width: 100%"
      @select="select"
      @select-all="selectAll"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="trpmc" label="投入品名称"></el-table-column>
      <el-table-column prop="ggxh" label="规格型号"></el-table-column>
      <el-table-column prop="dw" label="单位"></el-table-column>
      <el-table-column prop="scdw" label="生产单位"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
    <div class="f-mt30">
      <el-button round type="primary" @click="selNcp">选 中</el-button>
      <el-button round @click="$emit('close')">关 闭</el-button>
    </div>
	    <el-dialog
      title="投入品提取"
      :append-to-body="true"
      :visible.sync="isAddNcp"
      :before-close="closeAddNcp"
      width="900px"
    >
      <add-ncp style="margin:0 auto;" v-if="isAddNcp"  @close="closeAddNcp()"></add-ncp>  
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fetch from "fetch/axios/";
  import addNcp from './addNcp.vue'

  import muiltsel from './muiltsel.js';
export default {
  mixins:[muiltsel],
	components:{
      addNcp,
    },
  data() {
    return {
      sfky: false,
      ncpmc: "",
      isAddNcp:false,
      addNcpDialogVisable: false,
      loading: false,
      totalCount: 1,
      pageSize: 10,
      pageNo: 1,
      tableData: [],
    };
  },
  props: {
    selIds: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    this.getTableData();
  },
  methods: {
         //关闭新增农产品弹框的时候，刷新页面数据
         closeAddNcp(done){
           this.isAddNcp = false;
           this.getTableData({pageNo:this.pageNo,pageSize:this.pageSize});
		   if (done){
           done();
		   }
         },
    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
     *params请求参数
     */
        search(){
          this.pageNo=1;
          this.getTableData();
        },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableData({ pageSize, pageNo: this.pageNo });
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.getTableData({ pageNo, pageSize: this.pageSize });
    },
    getTableData(obj = {}) {
      this.loading = true;
      let { ncpmc } = this;
      let { scjyztId } = this.userInfo;
      let params = {
        scjyztId,
        trpmc: ncpmc
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      fetch({
        url: "/JcTrpWh/pageZttrp/",
        method: "get",
        data: params
      })
        .then(res => {
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          this.currentPage = pageNo;
          if (this.taskData.length || this.selIds.length) {
            this.toggleSelection(this.taskData);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    selNcp() {
      this.$emit("selNcp", this.taskData);
      this.$message.success("添加成功！");
      this.taskData = [];
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
<style>
/* .table .el-button:hover{
  background:#ecf5ff;
  color:#60acff;
  border:1px solid #60acff;
} */
.table .logoImg {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}
</style>

