<!--
 * @Description: 5770 【商品申请】页面搜索框中的“投入品名称”改成“商品名称”
 * @Author: your name
 * @Date: 2019-07-30 09:05:09
 * @LastEditTime: 2019-08-08 11:10:49
 * @LastEditors: Please set LastEditors
 -->
/*地块负责人*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>状态</label>
        <el-select v-model="zldm"
                   size="small"
                   placeholder="请选择"
                   @change=getTableData
                   clearable>
          <el-option value=""
                     label="全部"></el-option>
          <el-option value="1"
                     label="待审批"></el-option>
          <el-option value="2"
                     label="审批通过"></el-option>
          <el-option value="3"
                     label="审批不通过"></el-option>
        </el-select>

        <el-input placeholder="商品名称"
                  @keyup.enter.native=getTableData
                  v-model=findName
                  class="input-with-select f-vab"
                  size="small">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px"
                   @click=getTableData><i class="el-icon-search f-fs20"></i></el-button>
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

export default {
  data () {
    return {
      findName: '',
      zldm: '',
      trpTypes: '',
      //table参数
      tableHeader: [
        {
          label: '申请日期', prop: 'createTimestamp', formatter: (val) => {
            val = new Date(val);
            let datetime = val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate();
            return datetime
          }
        },
        { label: '商品名称', prop: 'agriProdName' },
        { label: '规格型号', prop: 'model' },
        { label: '单位', prop: 'unit' },
        { label: '生产单位', prop: 'scdw' },
        { label: '备注', prop: 'comment' },
        {
          label: '状态', prop: 'spzt', formatter: (val) => {
            return val == 1 ? '待审批' : val == 2 ? '审批通过' : '审批不通过'
          }
        },
        { label: '审核信息', prop: 'spyj' },
        { label: '操作',prop:'delFlag',width:'100','render-column':this.renderEdit}
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

    search () {
      this.$refs.stable.pageNo = 1;
      this.getTableData();
    },
    renderEdit(h,row){
      if(row.spzt == 3){
        return (
          // <el-button size="mini" class="edit" onClick={()=>{this.$emit('select',row)}}>重提</el-button>
          <el-button size="mini" class="edit" onClick={()=>{this.$emit('select',row)}}>重提</el-button>
        )
      }
    },
    getTableData (obj = {}) {
      this.loading = true;

      let { bizId, zldm, searchKey } = this;
      let params = {
        bizId: this.userInfo.bizId,
        key: this.findName,
        spzt: zldm,
        pageNo: this.currentPage
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_goods.spsq_list(params).then(res => {
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
<style>
/* .table .el-button:hover{
    background:#ecf5ff;
    color:#60acff;
    border:1px solid #60acff;
  } */
.table .logoImg {
  width: 80px;
  height: 80px;
  /* border-radius:50%; */
}
</style>

