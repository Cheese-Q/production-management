/*进货统计信息*/
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
        <el-input placeholder="请输入商品名称"
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
      //table参数
      tableHeader: [
        { label: '商品名称', prop: 'agriProdName' },
        { label: '规格', prop: 'model' },
        { label: '进货量', prop: 'purchNum' },
        { label: '单位', prop: 'unit' },
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
        agriName: this.findName,
        pageNo: this.currentPage
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_statistics.jhtj(params).then(res => {
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
