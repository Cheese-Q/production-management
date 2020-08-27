<!--
 * @Description:  【收款单】新增/编辑选择单据页面录单时间的选择框和搜索框的样式保持一致
 * @Author: your name
 * @Date: 2019-08-07 16:08:32
 * @LastEditTime: 2019-09-04 10:33:35
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
                  v-model.trim=findName
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
    <div v-if="rIndex ==2">
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
                         label="零售时间">
        </el-table-column>
        <el-table-column prop="lsdh"
                         label="订单号">
        </el-table-column>
        <el-table-column prop="ysk"
                         label="应收总金额">
        </el-table-column>
        <el-table-column prop="cjr"
                         label="经办人">
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
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
        <el-table-column prop="saleDate"
                         label="销售时间">
        </el-table-column>
        <el-table-column prop="saleSno"
                         label="订单号">
        </el-table-column>
        <el-table-column prop="ysk"
                         label="应收总金额">
        </el-table-column>
        <el-table-column prop="addUserName"
                         label="经办人">
        </el-table-column>
      </el-table>
    </div>
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
      findName: "",
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
    },
    rIndex: {
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
  created () {
    // this.getTypes();
    this.getTableData();
    const start = dateformat.getFirstDayOfYear(new Date());
    const end = dateformat.timeFormat(new Date());
    this.searchDate = [start, end];
  },
  watch: {
    khid: function () {
      this.getTableData();
    },
    rIndex: function () {
      this.getTableData();
    }
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
          if (this.rIndex != 2) {
            this.taskData.push(key);
          } else {
            this.taskData.push(key);
          }
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
    /**
     * 1.从往来单位获取会员id到edit.vue页面
     * 2.获取从edit.vue的传值
     * 3.掉接口  显示到tableData上
     * 4.在edit.vue页面接收本页面的传值并赋值
     */
    getLsDj () {
      const searchDate = this.searchDate;
      let params = {
        bizId: this.userInfo.bizId,
        key: this.findName + "", //未传值
        startDate: searchDate[0],
        endDate: searchDate[1],
        lx: "2",
        hyId: this.khid, //未传值
        zt: "2"
      };
      fetch({
        url: "/nzsyBizSupplier/pageGldj/",
        method: "get",
        data: params
      }).then(res => {
        this.tableData = res.list.data;
      });
    },

    getPfDj () {
      const searchDate = this.searchDate;
      fetch({
        url: "/nzsyBizSupplier/pageGldj/",
        method: "get",
        data: {
          bizId: this.userInfo.bizId,
          key: this.findName + "",
          startDate: searchDate[0],
          endDate: searchDate[1],
          zt: "1",
          lx: "3",
          khId: this.khid
        }
      }).then(res => {
        this.tableData = res.list.data;
      });
    },

    getTableData () {
      if (this.rIndex == 2) {
        this.getLsDj();
      } else {
        this.getPfDj();
      }
    },
    // TODO:查看this.taskData是否为一条数据
    selNcp () {
      this.$emit("addTrp", this.taskData);
      this.$message.success("添加成功!");
    },
    clear () {
      this.taskData = [];
      // this.$refs.multipleTable.clearSelection()
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

