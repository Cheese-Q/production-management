<!--
 * @Description: 页面的“请输入退货单号/相关单号/供应商名称”改成“请输入订单号/客户名称”（5694）
 * @Author: 龚铱白
 * @Date: 2019-08-06 15:10:13
 * @LastEditTime: 2019-08-07 15:52:16
 * @LastEditors: Please set LastEditors
 -->

/*商品信息*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>收款日期</label>
        <el-date-picker v-model="searchDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        style="height: 32px;vertical-align:bottom;"
                        :picker-options="pickerOptions"
                        :clearable="false">
        </el-date-picker>
        <label>收款类型</label>
        <el-select v-model="ywlx"
                   size="small"
                   placeholder="请选择"
                   @change=getTableData
                   clearable>
          <el-option value=""
                     label="全部"></el-option>
          <el-option value="2"
                     label="零售收款"></el-option>
          <el-option value="1"
                     label="批发收款"></el-option>
          <el-option value="6"
                     label="进货退货"></el-option>
        </el-select>
        <label>状态</label>
        <el-select v-model="zt"
                   size="small"
                   placeholder="请选择"
                   @change=getTableData
                   clearable>
          <el-option value=""
                     label="全部"></el-option>
          <el-option value="0"
                     label="暂存"></el-option>
          <el-option value="1"
                     label="已审批"></el-option>
        </el-select>
        <el-input placeholder="请输入订单号/客户名称"
                  @keyup.enter.native=getTableData
                  v-model=findName
                  class="input-with-select f-vab"
                  size="small">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px;vertical-align: middle;"
                   @click=getTableData><i class="el-icon-search f-fs20"></i></el-button>
      </div>
      <div class="f-f1 f-tar">
        <el-button type="primary"
                   size="medium"
                   @click="$emit('addFkd','')"
                   round
                   style="padding:9px 25px">新 增</el-button>
      </div>
    </div>
    <el-table v-loading=loading
              class="table"
              style="margin-top: 20px;"
              element-loading-text="拼命加载中"
              :data="tableData"
              :totalCount=totalCount>
      <el-table-column prop="skfksj"
                       label="收款日期">
      </el-table-column>
      <el-table-column prop="dh"
                       label="订单号">
      </el-table-column>
      <el-table-column prop="szlx"
                       label="收款类型">
        <template slot-scope="scope">
          <div v-if="scope.row.ywlx==1">批发收款</div>
          <div v-if="scope.row.ywlx==2">零售收款</div>
          <div v-if="scope.row.ywlx==6">进货退货</div>
          <!--{{scope.row.ywlx==1?'批发收款':'零售收款'}}-->
        </template>
      </el-table-column>
      <el-table-column prop="khmc"
                       label="客户名称">
      </el-table-column>
      <el-table-column prop="skfkje"
                       label="收款金额">
      </el-table-column>
      <el-table-column prop="zdr"
                       label="制单人">
      </el-table-column>
      <el-table-column prop="zt"
                       label="状态">
        <template slot-scope="scope">
          {{scope.row.zt==0?'暂存':'已审批'}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="250">
        <template slot-scope="scope">
          <div v-if="scope.row.zt == 0">
            <el-button size="mini"
                       @click="addFkd(scope.row)">编辑</el-button>
            <el-button size="mini"
                       @click="shFkd(scope.row)">审核</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="deleteSj(scope.row)">删除</el-button>
          </div>
          <div v-else>
            <el-button size="mini"
                       @click="see(scope.row)">查看</el-button>
          </div>

        </template>
      </el-table-column>

    </el-table>

    <!-- <el-pagination
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
    >
    </el-pagination> -->
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   @prev-click="prevChange(false)"
                   @next-click="prevChange(true)"
                   :current-page="pageNo"
                   :page-sizes="[10, 20, 30, 40]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalCount">
    </el-pagination>
    <!-- <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pageNo"
                   :page-sizes="[10, 20, 30, 40]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalCount">
    </el-pagination> -->

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dateformat } from "common/tools";
import fetch from "fetch/axios/";
export default {
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      findName: "",
      searchDate: "",
      zt: "",
      ywlx: "",
      // zt: "0,1",
      // ywlx: "1,2,6",

      //table参数
      loading: false,
      tableData: [],
      totalCount: 0,
      pageSize: 10, //当前页码
      pageNo: 1 // 每页显示多少数据
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created () {
    const start = dateformat.getFirstDayOfYear(new Date());
    const end = dateformat.timeFormat(new Date());
    this.searchDate = [start, end];
    this.getTableData();
  },

  methods: {
    deleteSj (row) {
      this.$confirm("此操作将删除该条付款单信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "is-round",
        confirmButtonClass: "is-round",
        type: "warning"
      })
        .then(() => {
          fetch({
            url: "/nzsyYsyfkd/updateYsyfkdById/",
            method: "post",
            data: {
              ysyfkdId: row.id,
              khid: row.khid,
              je: row.zkhze,
              zt: 2
            }
          })
            .then(() => {
              this.$message({ type: "success", message: "删除成功！" });
              this.getTableData();
            })
            .catch(() => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => { });
    },
    addFkd (row) {
      this.$emit("addFkd", row);
    },

    shFkd (row) {
      this.$emit("shFkd", row);
    },
    see (row) {
      this.$emit("see", row);
    },
    /*render-column结束*/

    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_goods.cpwh_list  请求api
     *params请求参数
     */
    search () {
      this.pageNo = 1;
      this.getTableData();
    },
    handleSizeChange (idx) {
      this.pageSize = idx || 10;
      this.pageNo = 1;
      this.getTableData();
    },
    handleCurrentChange (idx) {
      this.pageNo = idx;
      this.getTableData();
    },
    prevChange (isPrev) {
      if (isPrev) {
        this.pageNo = this.pageNo + 1;
      } else {
        this.pageNo = this.pageNo - 1;
      }
      this.getTableData();
    },
    getTableData () {
      this.loading = true;
      fetch({
        url: "/nzsyYsyfkd/pageYsyfkd/",
        method: "get",
        data: {
          bizId: this.userInfo.bizId,
          startDate: this.searchDate[0],
          endDate: this.searchDate[1],
          key: this.findName,
          lx: this.ywlx == ""?"1,2,6":this.ywlx+"",
          zt: this.zt == ""?"0,1":this.zt+"",
          szlx: "1",
          pageNo: this.pageNo,
          pageSize: this.pageSize

        }
      }).then(res => {
        let { data, pageNo, totalCount, pageSize } = res.list;
        this.tableData = data;
        this.totalCount = totalCount;
        this.pageSize = pageSize;
        this.pageNo = pageNo;
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


