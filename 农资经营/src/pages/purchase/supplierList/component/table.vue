<!--
 * @Description: 5775 【往来单位】页面的样式不对
 * @Author: your name
 * @Date: 2019-07-30 09:05:09
 * @LastEditTime: 2019-08-08 11:47:41
 * @LastEditors: Please set LastEditors
 -->
/*用户信息*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>类型</label>
        <el-select width="212px"
                   v-model="type"
                   size="small"
                   placeholder="请选择"
                   class="input-with-select"
                   @change=getTableData
                   clearable>
          <el-option value="2"
                     label="供应商"></el-option>
          <el-option value="3"
                     label="客户和供应商"></el-option>
        </el-select>

        <el-input placeholder="请输入单位名称"
                  @keyup.enter.native=search
                  v-model=findName
                  class="input-with-select"
                  size="small">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px"
                   @click=search><i class="el-icon-search f-fs20"></i></el-button>
        <el-checkbox v-model=delFlag
                     class="f-ml20"
                     @change=getTableData>不显示停用的往来单位</el-checkbox>
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
        delFlag: false,
        type: '',
        findName: '',
        //table参数
        tableHeader: [
          { label: '单位名称', prop: 'bizName', width: '200' },
          { label: '企业类型', prop: 'delFlag', width: '180', 'render-column': this.renderStateQy },
          { label: '供应商类别', prop: 'delFlag', width: '180', 'render-column': this.renderStateGys },
          { label: '联系人', prop: 'contPerson' },
          { label: '联系电话', prop: 'contNumber' },
          { label: '状态', prop: 'delFlag', width: '100', 'render-column': this.renderState },
          { label: '启用', prop: 'delFlag', width: '100', 'render-column': this.renderDelFlagBtn },
          { label: '操作', prop: 'delFlag', width: '100', 'render-column': this.renderEdit }
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
      renderStateQy (h, row) {
        if (row.bizType == 1) {
          return ('客户')
        } else if (row.bizType == 2) {
          return ('供应商')
        } else {
          return ('客户和供应商')
        }
      },

      renderStateGys (h, row) {
        if (row.supplierType == 1) {
          return ('生产商')
        } else if (row.supplierType == 2) {
          return ('经销商')
        } else if (row.supplierType == 3) {
          return ('门店')
        } else if (row.supplierType == 4) {
          return ('农业企业')
        } else {
          return ('农户')
        }
      },
      renderState (h, row) {
        return (<span class={row.delFlag == 1 ? '' : 'f-red'}>{row.delFlag == 1 ? '可用' : '停用'}</span>)
      },
      renderDelFlagBtn (h, row) {
        return h('el-switch', {
          attrs: {
            value: row.delFlag == 1 ? true : false
          },
          on: {
            change: (value) => {
              let delFlag = row.delFlag;
              delFlag = delFlag == 1 ? 2 : 1;
              const id = row.id;
              this.$fetch.api_purchase.wldw_updatestatus({ id, delFlag }).then(res => {
                row.delFlag = delFlag;
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
        this.getTableData();
      },
      getTableData (obj = {}) {
        this.loading = true;
        let { delFlag, findName, type } = this;
        if(type == ''){
          type = '2,3'
        }
        let params = {
          bizId: this.userInfo.bizId,
          key: findName,
          type: type,
          pageNo: this.currentPage
        };
        if (obj == true || obj == false) {
          obj = {
            pageNo: this.$refs.stable.pageNo,
            pageSize: this.$refs.stable.pageSize
          }
        }
        if (delFlag) params.flag = 1;
        //合并组件的pageSize 和 pageNo 参数
        Object.assign(params, obj);
        this.$fetch.api_purchase.wldw_list(params).then(res => {
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          this.currentPage = pageNo;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .f-vab {
    width: 250px !important;
  }

  .input-with-select {
    width: 240px;
  }
  .ncp-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .el-input--small {
    width: 215px !important;
  }
</style>

