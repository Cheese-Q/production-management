<!--
 * @Author: 龚铱白
 * @Date: 2019-08-13 14:01:48
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-08-14 19:58:31
 * @Description: 
 -->
/*查看*/
<template>
  <div class="select">
    <el-form :inline="true"
             :model="selectForm"
             class="demo-form-inline">
      <el-form-item label="日期"
                    prop="hymc">
        <el-date-picker v-model="searchDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        :clearable="false">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="findDjh">
        <el-input v-model="selectForm.findDjh"
                  placeholder="请输入单据号"
                  clearable
                  @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px"
                   @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <s-table class="table"
             ref="stable"
             element-loading-text="拼命加载中"
             :tableData="tableData"
             :totalCount="totalCount"
             :getData="getTableData"
             :tableHeader="tableHeader"></s-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import fetch from "fetch/axios/";
import { dateformat } from 'common/tools'
export default {
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      searchDate: "",
      totalCount: 1,
      tableData: [],
      tableHeader: [
        { label: "日期", prop: "crkrq" },
        { label: "单据单号", prop: "djh" },
        { label: "经办人", prop: "jbe" },
        { label: "单位", prop: "unit" },
        { label: "入库量", prop: "crksl", "render-column": this.renderRkl },
        { label: "出库量", prop: "crksl", "render-column": this.renderCkl },
        { label: "剩余库存", prop: "store" }
      ],
      selectForm: {
        date: "",
        findDjh: ""
      }
    };
  },
  props: {
    form: {
      type: Object,
      default: function () {
        return {
          nzid: ""
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
    this.getTableData();
    const start = dateformat.getFirstDayOfYear(new Date());
    const end = dateformat.timeFormat(new Date());
    this.searchDate = [start, end];
  },
  methods: {
    renderzt (h, row) {
      if (row.zt == 1) {
        return "暂存";
      } else if (row.zt == 2) {
        return "已审批";
      } else {
        return "不可用";
      }
    },
    // inoutType == 1 -》入库
    renderRkl (h, row) {
      if (row.inoutType == 1) {
        return row.crksl;
      } else {
        return "";
      }
    },
    // inoutType == 2 -》出库
    renderCkl (h, row) {
      if (row.inoutType == 2) {
        return row.crksl;
      } else {
        return "";
      }
    },


    getTableData (obj = {}) {
      this.loading = true;
      const searchDate = this.searchDate;
      let params = {
        nzId: this.form.nzid,
        startDate: searchDate[0],
        endDate: searchDate[1],
        key: this.selectForm.findDjh,
        pageNo: this.currentPage,
      };
      if (obj == true || obj == false) {
        obj = {
          pageSize: this.$refs.stable.pageSize
        }
      }
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      fetch({
        url: "/nzsyBizKcb/pageCrkmxByNzid/",
        method: "get",
        data: params
      }).then(res => {
        let { data, pageNo, totalCount } = res.list;
        this.tableData = data;
        this.totalCount = totalCount;
        this.currentPage = pageNo;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
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
    }
  }
};
</script>

<style lang="scss" scoped>
.el-button {
  line-height: 20px;
}
.el-table {
  margin: 20px 0;
}
</style>
