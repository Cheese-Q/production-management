<!--
 * @Description: 【付款单】新增/编辑选择单据页面录单时间的选择框和搜索框的样式保持一致
 * @Author: your name
 * @Date: 2019-08-06 15:10:13
 * @LastEditTime: 2019-08-14 11:02:18
 * @LastEditors: 龚铱白
 -->

<template>
  <div class="dkfzr"
       style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>录单时间</label>
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
        <el-input placeholder="请输入订单号"
                  @keyup.enter.native=search
                  v-model.trim=ncpmc
                  class="input-with-select f-vab"
                  size="small">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px"
                   @click=search><i class="el-icon-search f-fs20"></i></el-button>
      </div>
      <!-- <div class="f-f1 f-tar">
        <el-button
          type="primary"
          size="medium"
          @click="addNcpDialogVisable=true"
          round
          style="padding:9px 25px"
        >新 增
        </el-button>
      </div> -->
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
      <el-table-column prop="cjsj"
                       label="进货时间">
      </el-table-column>
      <el-table-column prop="jhdh"
                       label="订单号">
      </el-table-column>
      <!-- <el-table-column
        prop="khmc"
        label="供应商单位"
      >
      </el-table-column> -->
      <el-table-column prop="yfk"
                       label="应付总金额">
      </el-table-column>
      <el-table-column prop="jbr"
                       label="经办人">
      </el-table-column>
    </el-table>
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

    <el-dialog title="新增农产品"
               :append-to-body="true"
               :visible.sync="addNcpDialogVisable"
               width="800px">
      <add-goods style="margin:0 auto;"
                 v-if="addNcpDialogVisable"
                 @closeForm="addNcpDialogVisable=false;search()"></add-goods>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import addGoods from "pages/goods/goodsMaintain/component/add.vue";
import fetch from "fetch/axios/";
import { dateformat } from 'common/tools'

export default {
  components: {
    addGoods
  },
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
      searchDate: '',
      ncpmc: "",
      skfksj: "",
      addNcpDialogVisable: false,
      loading: false,
      totalCount: 1,
      pageSize: 10,
      pageNo: 1,
      tableData: [],
      multipleSelection: [],
      taskData: []
    };
  },
  props: {
    selIds: {
      type: Array,
      default: function () {
        return [];
      }
    },
    khid: {
      type: [String, Number],
      default: function () {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  watch: {
    khid: function () {
      this.getTableData();
    }
  },
  created () {
    // this.getTypes();
    console.log(this.khid);
    this.getTableData();
    const start = dateformat.getFirstDayOfYear(new Date());
    const end = dateformat.timeFormat(new Date());
    this.searchDate = [start, end];
  },
  methods: {
    search () {
      this.pageNo = 1;
      this.getTableData({ pageNo: 1, pageSize: this.pageSize });
    },
    toggleSelection (rows) {
      rows = rows.concat(this.selIds);
      if (rows) {
        rows.forEach(row => {
          this.$nextTick(() => {
            var checked = this.tableData.find(
              tableRow => tableRow.id === row.id
            );
            this.$refs.multipleTable.toggleRowSelection(checked);
          });
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 表格单选事件
    select (selection, row) {
      let allRows = selection.filter(item => !!item);
      // 根据表格单选事件确定取消是取消了哪一行
      if (allRows.find(item => item.id === row.id)) {
        // 选中新增一行
        this.addRows([row]);
      } else {
        // 取消删除一行
        this.removeRows([row]);
      }
    },
    // 表格全选事件
    selectAll (selection) {
      // 如果有则是全选否则就是全取消
      if (selection.length > 1) {
        this.addRows(this.tableData);
      } else {
        this.removeRows(this.tableData);
      }
    },
    // 添加选中行
    addRows (rows) {
      for (let key of rows) {
        // 如果选中的数据中没有这条就添加进去
        if (!this.taskData.find(item => item.id === key.id)) {
          this.taskData.push(key);
        }
      }
    },
    // 取消选中行
    removeRows (rows) {
      if (this.taskData.length > 0) {
        for (let row of rows) {
          this.taskData = this.taskData.filter(item => item.id !== row.id);
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
      const searchDate = this.searchDate;
      fetch({
        url: "/nzsyBizSupplier/pageGldj/",
        method: "get",
        data: {
          bizId: this.userInfo.bizId,
          key: this.ncpmc + "",
          lx: "1",
          khId: this.khid + "",
          zt: "1",
          startDate: searchDate[0],
          endDate: searchDate[1],
          method: "get"
        }
      }).then(res => {
        this.tableData = res.list.data;
      });
    },
    selNcp () {
      this.$emit("addTrp", this.taskData);
      this.$message.success("添加成功!");
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
</style>
<style>
.table .logoImg {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 240px;
}

.el-input--medium .el-input__inner {
  height: 32px;
  line-height: 32px;
}
</style>

