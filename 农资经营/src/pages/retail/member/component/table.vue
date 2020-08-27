<!--
 * @Author: 龚铱白
 * @Date: 2019-07-23 09:43:24
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-17 10:26:15
 * @Description: 
 -->
/*会员信息*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <el-input placeholder="请输入会员名称\手机号"
                  @keyup.enter.native=search
                  v-model=findName
                  class="input-with-select f-vab"
                  size="small">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px"
                   @click=search><i class="el-icon-search f-fs20"></i></el-button>
        <el-checkbox v-model=hyzt
                     class="f-ml20"
                     @change=getTableData>不显示停用的会员</el-checkbox>
      </div>
      <div class="f-f1 f-tar">
        <el-button type="primary"
                   size="medium"
                   @click="$emit('edit')"
                   round
                   style="padding:9px 25px">新 增</el-button>
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
export default {
  data () {
    return {
      hyzt: false,
      findName: '',
      //table参数
      tableHeader: [
        { label: '会员名称', prop: 'hymc', width: '150' },
        { label: '手机号', prop: 'sjhm', width: '150' },
        { label: '身份证', prop: 'sfz' },
        { label: '分组', prop: 'hydj'},
        { label: '种植作物', prop: 'zzzw' },
        { label: '种植面积', prop: 'zzmj' },
        { label: '地区', prop: 'dz' },
        { label: '备注', prop: 'bz' },
        { label: '状态', prop: 'hyzt', width: '100', 'render-column': this.renderState },
        { label: '启用', prop: 'hyzt', width: '100', 'render-column': this.renderDelFlagBtn },
        { label: '操作', prop: 'hyzt', width: '100', 'render-column': this.renderEdit }
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
    this.getTableData();
  },
  methods: {
    /*render-column开始*/
    renderState (h, row) {
      return (<span class={row.hyzt == 1 ? '' : 'f-red'}>{row.hyzt == 1 ? '可用' : '停用'}</span>)
    },
    renderArea (h, row) {
      let bizCity;
      let bizCounty;
      let bizProvince;
      let bizTown;
    },
    renderDelFlagBtn (h, row) {
      return h('el-switch', {
        attrs: {
          value: row.hyzt == 1 ? true : false
        },
        on: {
          change: (value) => {
            let hyzt = row.hyzt;
            hyzt = hyzt == 1 ? 2 : 1;
            const id = row.id;
            this.$fetch.api_retail.user_status({ id, hyzt }).then(res => {
              row.hyzt = hyzt;
            })
          }
        }
      })
    },
    renderEdit (h, row) {
      return (
        <el-button size="mini" class="edit" onClick={() => { this.$emit('edit', row) }}>编辑</el-button>
      )
    },
    /*render-column结束*/

    /*
    *获取table的数据
    *只需要修改 this.$fetch.api_base.yhxx_list  请求api
    *params请求参数
    */
    search () {
      this.$refs.stable.pageNo = 1;
      this.currentPage = 1;
      this.getTableData();
    },
    getTableData (obj = {}) {
      this.loading = true;
      let { bizId, hyzt, key } = this;
      let params = {
        bizId: this.userInfo.bizId,
        key: this.findName,
        pageNo: this.currentPage
      };
      if (obj == true || obj == false) {
        obj = {
          pageSize: this.$refs.stable.pageSize
        }
      }
      if (hyzt) params.hyzt = 1;
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_retail.hyxx_list(params).then(res => {
        let { data, pageNo, totalCount } = res.list;
        this.tableData = data;
        this.totalCount = totalCount;
        this.currentPage = pageNo;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
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
