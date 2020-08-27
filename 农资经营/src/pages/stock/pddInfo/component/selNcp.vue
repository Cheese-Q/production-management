<!--
 * @Author: 龚铱白
 * @Date: 2019-08-09 09:07:32
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-08-16 11:18:46
 * @Description: 
 -->
<template>
  <div class="dkfzr"
       style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>

        <el-input placeholder="请输入商品名称"
                  @keyup.enter.native=search
                  v-model.trim=djh
                  class="input-with-select f-vab"
                  size="small">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px"
                   @click=search><i class="el-icon-search f-fs20"></i></el-button>
      </div>

    </div>
    <el-table class="f-mt20"
              :data="tableData"
              stripe
              check
              ref="multipleTable"
              v-loading=loading
              style="width: 100%"
              @select="select"
              @select-all="selectAll">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="pch"
                       label="批次号">
      </el-table-column>
      <el-table-column prop="nzmc"
                       label="商品名称">
      </el-table-column>
      <el-table-column prop="gg"
                       label="规格">
      </el-table-column>
      <el-table-column prop="dw"
                       label="单位">
      </el-table-column>
      <el-table-column prop="sl"
                       label="库存数量">
      </el-table-column>
    </el-table>
    <!-- <div style="height:75px;"> -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pageNo"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   background
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalCount">
    </el-pagination>

    <div class="f-mt30">
      <el-button round
                 type="primary"
                 @click=selNcp>选 中</el-button>
      <el-button round
                 @click="$emit('close')">关 闭</el-button>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import fetch from 'fetch/axios/';
export default {
  data () {
    return {
      djh: '',
      //table参数
      // tableHeader:[
      //   {label:'投入品名称',prop:'agriProdName'},
      //   {label:'规格',prop:'model'},
      //   {label:'单位',prop:'unit'},
      //   {label:'生产单位',prop:'scdw',width:'120'},
      //   {label:'批次信息',prop:'scdw',width:'120'},
      // ],
      loading: false,
      totalCount: 1,
      pageSize: 10,
      pageNo: 1,
      tableData: [],
      multipleSelection: [],
      taskData: [],
      selRows: []
    }
  },
  props: {
    selIds: {
      type: Array,
      default: function () {
        return []
      }
    },

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
      this.pageNo = 1;
      this.getTableData({ pageNo: 1, pageSize: this.pageSize });
    },
    toggleSelection (rows) {
      rows = rows.concat(this.selIds)
      if (rows) {
        rows.forEach(row => {
          this.$nextTick(() => {
            var checked = this.tableData.find(
              tableRow => tableRow.id === row.id
            )
            this.$refs.multipleTable.toggleRowSelection(checked)
          })
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 表格单选事件
    select (selection, row) {
      let allRows = selection.filter(item => !!item)
      // 根据表格单选事件确定取消是取消了哪一行
      if (allRows.find(item => item.id === row.id)) {
        // 选中新增一行
        this.addRows([row])
      } else {
        // 取消删除一行
        this.removeRows([row])
      }
    },
    // 表格全选事件
    selectAll (selection) {
      // 如果有则是全选否则就是全取消
      if (selection.length > 1) {
        this.addRows(this.tableData)
      } else {
        this.removeRows(this.tableData)
      }
    },
    // 添加选中行
    addRows (rows) {
      for (let key of rows) {
        // 如果选中的数据中没有这条就添加进去
        if (
          !this.taskData.find(
            item => item.id === key.id
          )
        ) {
          this.taskData.push(key)
        }
      }
    },
    // 取消选中行
    removeRows (rows) {
      if (this.taskData.length > 0) {
        for (let row of rows) {
          this.taskData = this.taskData.filter(item => item.id !== row.id)
        }
      }
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.getTableData({ pageSize, pageNo: this.pageNo });
    },
    handleCurrentChange (pageNo) {
      this.pageNo = pageNo;
      this.getTableData({ pageNo, pageSize: this.pageSize });
    },

    getTableData () {
      this.loading = true;
      fetch({
        url: "/nzsyBizKcb/pagePckcb/",
        method: "get",
        data: {
          bizId: this.userInfo.bizId + "",
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          key: this.djh + "",
          type: "1",
        }
      }).then(res => {
        let { data, totalCount } = res.list;
        this.tableData = data;
        this.totalCount = totalCount;
        console.log(this.tableData)
        if (this.taskData.length || this.selIds.length) {
          this.toggleSelection(this.taskData)
        }
        this.loading = false;
      });


    },
    selNcp () {
      this.$emit('addTrp', this.taskData);
      this.$message.success('添加成功!')
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
  border-radius: 5px;
}
</style>
