<!--
 * @Author: 龚铱白
 * @Date: 2019-07-30 09:05:09
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-08-12 15:52:56
 * @Description: 
 -->
/*活跃客户统计信息*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <el-date-picker v-model="searchDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        :clearable="false">
        </el-date-picker>
        <el-select v-model="searchType"
                   placeholder="请选择客户类型"
                   size="small"
                   @change=getTableData
                   clearable>
          <el-option label="全部"
                     value=""></el-option>
          <el-option label="生产商"
                     value="1"></el-option>
          <el-option label="经销商"
                     value="2"></el-option>
          <el-option label="门店"
                     value="3"></el-option>
          <el-option label="农业企业"
                     value="4"></el-option>
          <el-option label="农户"
                     value="5"></el-option>
        </el-select>
        <el-input placeholder="请输入客户名称"
                  @keyup.enter.native=search
                  v-model=findName
                  class="input-with-select f-vab"
                  size="small">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px"
                   @click=search><i class="el-icon-search f-fs20"></i></el-button>
      </div>
    </div>
    <s-table v-loading=loading
             class="table"
             ref="stable"
             element-loading-text="拼命加载中"
             :tableData=tableData
             :totalCount=totalCount
             :getData=getTableData
             :tableHeader=tableHeader></s-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      findName: '',
      searchDate: '',
      searchType: '',
      //table参数
      tableHeader: [
        { label: '客户名称', prop: 'bizName' },
        { label: '客户类型', prop: 'supplierType', 'render-column': this.renderType },
        { label: '购买数量', prop: 'buyNum' },
        { label: '购买金额', prop: 'buyTotalAmount' },
      ],
      loading: false,
      totalCount: 1,
      tableData: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
    })
  },
  created () {
    const start = dateformat.getFirstDayOfYear(new Date());
    const end = dateformat.timeFormat(new Date());
    this.searchDate = [start, end];
    this.getTableData();
  },
  methods: {
    /*
    *获取table的数据
    *params请求参数
    */

    /*render-column开始*/
    renderType (h, row) {
      // 1-生产商  2-经销商  3-门店  4-农业企业  5-农户
      var bizTypeShow;
      if (row.supplierType == 1) {
        bizTypeShow = '生产商';
      } else if (row.supplierType == 2) {
        bizTypeShow = '经销商';
      } else if (row.supplierType == 31) {
        bizTypeShow = '门店';
      } else if (row.supplierType == 4) {
        bizTypeShow = '农业企业';
      } else if (row.supplierType == 5) {
        bizTypeShow = '农户';
      }
      return bizTypeShow
    },
    /*render-column结束*/
    search () {
      this.$refs.stable.pageNo = 1;
      this.getTableData();
    },
    getTableData (obj = {}) {
      this.loading = true;
      let { bizId, key } = this;
      const searchDate = this.searchDate;

      let params = {
        bizId: this.userInfo.bizId,
        startDate: searchDate[0],
        endDate: searchDate[1],
        cusName: this.findName,
        khlx: this.searchType,
        type: this.searchType,
        pageNo: this.currentPage
      };
      console.log("客户类型===" + this.searchType);
      // return false;
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_statistics.hykhtj(params).then(res => {
        let { data, pageNo, totalCount } = res.list;
        this.tableData = data;
        this.totalCount = totalCount;
        this.currentPage = pageNo;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
}
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
