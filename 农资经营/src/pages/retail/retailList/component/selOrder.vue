<!--
 * @Author: 龚铱白
 * @Date: 2019-08-14 19:26:40
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-08-19 16:36:44
 * @Description: 
 -->
<template>
  <div class="dkfzr"
       style="padding-bottom:70px;min-height:470px;">
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
                        value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-input placeholder="会员/联系电话"
                  @keyup.enter.native=search
                  v-model.trim=findName
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
             ref='stable'
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
      findName: '',
      searchDate: '',
      //table参数
      tableHeader: [
        { label: '单据编号', prop: 'lsdh' },
        { label: '录单时间', prop: 'cjsj' },
        { label: '营业员', prop: 'cjr' },
        { label: '联系电话', prop: 'lxdh' },
        { label: '会员', prop: 'hymc' },
        { label: '操作', prop: 'sfky', width: '120', 'render-column': this.renderEdit }
      ],
      loading: false,
      totalCount: 1,
      tableData: [],
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
    })
  },
  created () {
    const start = this.getPassYearFormatDate();
    // const start = dateformat.timeFormat(new Date());
    const end = dateformat.timeFormat(new Date());
    this.searchDate = [start, end];
    this.getTableData();
  },
  methods: {
    /*render-column开始*/
    renderEdit (h, row) {
      return (
        <el-button size="mini" class="edit" onClick={() => { this.$emit('selOrder', row) }}>选 择</el-button>
      )
    },
    /*render-column结束*/

    /*
    *获取table的数据
    *只需要修改 this.$fetch.api_base.  请求api
    *params请求参数
    */
    search () {
      this.$refs.stable.pageNo = 1;
      this.getTableData();
    },
    getTableData (obj = {}) {
      this.loading = true;
      const searchDate = this.searchDate;
      let params = {};
      if (searchDate == null || searchDate == "" || searchDate == undefined) {
        params = {
          bizId: this.userInfo.bizId,
          key: this.findName,
          startDate: "",
          endDate: "",
          zt: 1
        };
      } else {
        params = {
          bizId: this.userInfo.bizId,
          key: this.findName,
          startDate: searchDate[0],
          endDate: searchDate[1],
          zt: 1
        };
      }
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_retail.getLsd(params).then(res => {
        let { data, pageNo, totalCount } = res.list;
        this.tableData = data;
        this.totalCount = totalCount;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },




    getPassYearFormatDate () {
      var nowDate = new Date();
      var date = new Date(nowDate);
      date.setDate(date.getDate() - 365);
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
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

