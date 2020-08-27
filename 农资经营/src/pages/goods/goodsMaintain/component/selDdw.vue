<template>
  <div class="dkfzr" style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="addNcpDialogVisable=true" round style="padding:9px 25px">新 增
        </el-button>
      </div>
    </div>
    <el-table
      class="f-mt20"
      :data="tableData"
      stripe
      check
      ref="multipleTable"
      v-loading=loading
      style="width: 100%"
      @select="select"
      @select-all="selectAll">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="baseUnit"
        label="基本单位">
      </el-table-column>
      <el-table-column prop="subUnit1,subUnitNum1,baseUnit,subUnit2,subUnitNum2" label="副单位">
        <template slot-scope="scope">
          <span v-if="scope.row.subUnit2 == null">{{scope.row.subUnit1}}={{scope.row.subUnitNum1}}{{scope.row.baseUnit}}</span>
          <span v-else>{{scope.row.subUnit2}}={{parseInt(Number(scope.row.subUnitNum2)/Number(scope.row.subUnitNum1))}}{{scope.row.subUnit1}}={{scope.row.subUnitNum2}}{{scope.row.baseUnit}}</span>
        </template>
      </el-table-column>
    </el-table>


    <div class="f-mt30">
      <el-button round type="primary" @click=selDdw>选 中</el-button>
      <el-button round @click="$emit('close')">关 闭</el-button>
    </div>

    <el-dialog
      title="新增多单位"
      :append-to-body="true"
      :visible.sync="addNcpDialogVisable"
      width="800px"
    >
      <add-dws style="margin:0 auto;" v-if="addNcpDialogVisable"
               @closeForm="addNcpDialogVisable=false;search()"></add-dws>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import addGoods from 'pages/goods/goodsJl/component/edit.vue';
  import fetch from 'fetch/axios/';

  export default {
    components: {
      addGoods
    },
    data() {
      return {
        addNcpDialogVisable: false,
        loading: false,
        tableData: [
          // {
          //   id: 1,
          //   bizId: 3,
          //   unitType: 2,
          //   baseUnitId: 11,
          //   baseUnit: '瓶',
          //   subUnitId1: 22,
          //   subUnit1: '盒',
          //   subUnitNum1: 3,
          //   subUnitId2: 33,
          //   subUnit2: '箱',
          //   subUnitNum2: 5,
          //   status: 1
          // },
          // {
          //   id: 2,
          //   bizId: 3,
          //   unitType: 2,
          //   baseUnitId: 21,
          //   baseUnit: '克',
          //   subUnitId1: 32,
          //   subUnit1: '斤',
          //   subUnitNum1: 3,
          //   subUnitId2: 43,
          //   subUnit2: '吨',
          //   subUnitNum2: 5,
          //   status: 1
          // },
        ],
        multipleSelection: [],
        taskData: [],
        selRows: [],

      }
    },

    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo',
      })
    },
    props: {
      baseUnitId: {
        type: [String, Number]
      },

    },
    created() {
      this.getTableData();
    },

    methods: {

      // 表格单选事件
      select(selection, row) {
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
      selectAll(selection) {
        // 如果有则是全选否则就是全取消
        if (selection.length > 1) {
          this.addRows(this.tableData)
        } else {
          this.removeRows(this.tableData)
        }
      },
      // 添加选中行
      addRows(rows) {
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
      removeRows(rows) {
        if (this.taskData.length > 0) {
          for (let row of rows) {
            this.taskData = this.taskData.filter(item => item.id !== row.id)
          }
        }
      },
      getTableData() {
        fetch({
          url: "/nzsyUnit/listMultipleUnit/",
          method: "get",
          data: {
            baseUnitId: this.baseUnitId+"",
            bizId: this.userInfo.bizId + "",
          }
        }).then(res => {
          this.tableData = res.bean;
          console.log(res.bean);
        });
      },

      selDdw() {
        this.$emit('addDdw', this.taskData)
        this.$message.success('添加成功!')
      },
    },
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
