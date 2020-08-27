<!--
 * @Description:页面搜索框中的“请输入订单号/供应商名称”改成“请输入订单号/手机号/会员名称”（5239）
 * @Author: your name
 * @Date: 2019-07-30 09:05:09
 * @LastEditTime: 2019-08-14 18:59:45
 * @LastEditors: 龚铱白
 -->

/*会员信息*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <label style="margin-right: 10px;margin-top:5px;">销售日期</label>
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
      <label style="margin-right: 10px;margin-top:5px;">状态</label>
      <el-select v-model="zt"
                 size="small"
                 placeholder="全部"
                 :clearable="false"
                 @change="getTableData">
        <el-option value="0"
                   label="全部"></el-option>
        <el-option value="1"
                   label="暂存"></el-option>
        <el-option value="2"
                   label="已审批"></el-option>
      </el-select>
      <el-input placeholder="请输入订单号/手机号/会员名称"
                @keyup.enter.native="search"
                v-model="findName"
                class="input-with-select f-vab"
                size="small"></el-input>
      <el-button type="primary"
                 size="small"
                 style="padding:5px 15px"
                 @click="search">
        <i class="el-icon-search f-fs20"></i>
      </el-button>
    </div>
    <s-table v-loading="loading"
             class="table"
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
      value: "",
      zt: "",
      hyzt: false,
      findName: "",
      skfksj: "",
      searchDate: '',
      //table参数
      tableHeader: [
        { label: "销售时间", prop: "cjsj", },
        {          label: "订单号", prop: "lsdh",
          // width: "150"
        },
        { label: "会员名称", prop: "hymc" },
        { label: "联系方式", prop: "lxdh" },
        {
          label: "结算金额",
          prop: "jsje",
          // width: "100"
        },
        {
          label: "结算状态",
          prop: "jzzt",
          // width: "100",
          "render-column": this.renderJzzt
        },
        {
          label: "制单人",
          prop: "cjr",
        },
        {
          label: "状态",
          prop: "zt",
          // width: "100",
          "render-column": this.renderzt
        },
        {
          label: "操作",
          prop: "hyzt",
          // width: "100",
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
  created () {
    this.getTableData();
    const start = dateformat.getFirstDayOfYear(new Date());
    const end = dateformat.timeFormat(new Date());
    this.searchDate = [start, end];
  },
  methods: {
    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_base.yhxx_list  请求api
     *params请求参数
     */
    search () {
      this.$refs.stable.pageNo = 1;
      this.getTableData();
    },
    // 查询表格信息
    getTableData (obj = {}) {
      this.loading = true;
      const searchDate = this.searchDate;
      let params = {
        bizId: this.userInfo.bizId,
        pageNo: this.currentPage,
        startDate: searchDate[0],
        endDate: searchDate[1],
        zt: this.zt,
        key: this.findName
      };
      if (obj == true || obj == false) {
        obj = {
          pageSize: this.$refs.stable.pageSize
        }
      }
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_retail.getLsd(params).then(res => {
        let { data, pageNo, totalCount } = res.list;
        this.tableData = data;
        this.totalCount = totalCount;
        this.currentPage = pageNo;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },

    // 获取状态转换
    renderzt (h, row) {
      if (row.zt == 1) {
        return "暂存";
      } else if (row.zt == 2) {
        return "已审批";
      } else {
        return "不可用";
      }
    },
    renderJzzt (h, row) {
      if (row.jzzt == 1) {
        return "结算";
      } else if (row.jzzt == 2) {
        return "未结算";
      }
    },
    //  查询单条信息
    renderEdit (h, row) {
      return (
        <el-button
          size="mini"
          class="edit"
          onClick={() => this.$emit("edit", row)}
        >
          查看
        </el-button>
      );
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

.header {
  .date {
    margin: 0 10px;
  }
  .input-with-select {
    margin-left: 10px;
  }
}
</style>
