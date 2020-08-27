/*会员信息*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <label style="margin-right: 10px;margin-top:5px;">基本单位</label>
      <el-select v-model="dw" placeholder="全部">
        <el-option
          v-for="item in basicUnitList"
          :key="item.unitCode"
          :label="item.unitName"
          :value="item.unitCode"
        ></el-option>
      </el-select>
      <el-button type="primary" size="small" style="padding:5px 15px" @click="search">查询</el-button>
      <div class="f-f1 f-tar">
        <div class="f-f1 f-tar">
          <el-button
            type="primary"
            size="medium"
            @click="$emit('edit')"
            round
            style="padding:9px 25px"
          >新 增
          </el-button>
        </div>
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table"
      ref="stable"
      element-loading-text="拼命加载中"
      :data="tableData"
      :totalCount="totalCount"
      :getData="getTableData"
      :header-cell-style="{background:'#F2F2F2',color:'#333'}"
      style="width: 100%"
    >
      <el-table-column prop="baseUnit" label="基本单位"></el-table-column>
      <el-table-column prop="subUnitNum1" label="副单位">
        <template slot-scope="scope">
          <span
            v-if="scope.row.subUnit2 != null"
          >1{{scope.row.subUnit2}} = {{scope.row.subUnitNum1+scope.row.subUnit1}} = {{scope.row.subUnitNum2+scope.row.baseUnit}}</span>
          <span v-else>1{{scope.row.subUnit1 }} = {{scope.row.subUnitNum1 }} {{scope.row.baseUnit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unitType" label="级别">
        <template slot-scope="scope">{{scope.row.unitTppe == 1?'系统级':'企业级'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteInfo(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="prevChange(false)"
      @next-click="prevChange(true)"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
  </div>
</template>


<script>
  import {mapGetters} from "vuex";
  import fetch from "fetch/axios/";

  export default {
    data() {
      return {
        dw: "",
        basicUnitList: [], //获取基本单位
        // findName: "",
        loading: false,
        totalCount: 1,
        tableData: [],
        pageNo: 1,
        pageSize: 10
      };
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    created() {
      this.getTableData();
      // 获取基本单位
      // this.getInfo();
    },
    methods: {
      handleCurrentChange(idx) {
        this.pageNo = idx;
        this.getTableData();
      },
      handleSizeChange(idx) {
        this.pageSize = idx || 10;
        this.pageNo = 1;
        this.getTableData();
      },
      prevChange(isPrev) {
        if (isPrev) {
          this.pageNo = this.pageNo + 1;
        } else {
          this.pageNo = this.pageNo - 1;
        }
        this.getTableData();
      },
      // 跳转新增页面
      addDw(row) {
        this.$emit("addDw", row);
      },
      /*
       *获取table的数据
       *只需要修改 this.$fetch.api_base.yhxx_list  请求api
       *params请求参数
       */
      search() {
        this.$refs.stable.pageNo = 1;
        this.getTableData();
        // this.getInfo();
      },
      // 删除
      deleteInfo(row) {
        this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "is-round",
          confirmButtonClass: "is-round",
          type: "warning"
        })
          .then(() => {
            fetch({
              url: "/nzsyUnit/updateSysUnit/",
              method: "post",
              data: {
                id: row.id,
                status: row.status
              }
            })
              .then(() => {
                this.$message({type: "success", message: "删除成功！"});
                this.getTableData();
              })
              .catch(() => {
                this.$message.error("删除失败");
              });
          })
          .catch(() => {
          });
      },
      // 查询表格信息
      getTableData() {
        this.loading = true;
        this.getInfo();
        fetch({
          url: "/nzsyUnit/pageMultipleUnit/",
          method: "get",
          data: {
            bizId: this.userInfo.bizId,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            key: this.dw,
            type: "1"
          }
        }).then(res => {
          let {data, pageNo, totalCount} = res.bean;
          this.tableData = data;
          this.totalCount = totalCount;
          this.currentPage = pageNo;
          this.loading = false;
        });
      },
      // 获取下拉信息
      getInfo() {
        fetch({
          url: "/nzsyUnit/listUnit/",
          method: "get",
          data: {
            findName: this.findName,
            type: ""
          }
        }).then(res => {
          this.basicUnitList = res.bean;
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

  .el-button--small {
    margin-left: 30px;
  }

  .header {
    .input-with-select {
      margin-left: 10px;
    }
  }

  .el-table {
    margin-top: 20px;
  }
</style>
