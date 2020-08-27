<template>
  <div
    class="dkfzr"
    style="padding-bottom:70px;min-height:470px;"
  >
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>类别</label>
        <el-select
          v-model="zldm"
          size="small"
          placeholder="请选择"
          @change=getTableData
          clearable
        >
          <el-option
            v-for="item in trpTypes"
            :key="item.sjzdBm"
            :label="item.sjzdMc"
            :value="item.sjzdBm"
          >
          </el-option>
        </el-select>
        <el-input
          placeholder="商品名称"
          @keyup.enter.native=search
          v-model.trim=findName
          class="input-with-select f-vab"
          size="small"
        >
        </el-input>
        <el-button
          type="primary"
          size="small"
          style="padding:5px 15px"
          @click=search
        ><i class="el-icon-search f-fs20"></i></el-button>
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
      @select-all="selectAll"
    >
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column
        prop="tp"
        width="100"
        label="图片"
      >
        <!-- 图片的显示 -->

        <!-- TODO: V-IF -->
        <template slot-scope="scope">
          <div v-if="scope.row.tp != null">
            <img
              :src="scope.row.tp"
              width="70"
              height="70"
            />
          </div>
          <div v-else>
            <img src="../../../../assets/images/icon-xzsp-nogoods.png" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="nzmc"
        width="200"
        label="商品名称"
      >
      </el-table-column>
      <el-table-column
        prop="pch"
        label="批次号"
      >
      </el-table-column>
      <el-table-column
        prop="dlmc"
        label="农资大类"
      >
      </el-table-column>
      <el-table-column
        prop="gg"
        label="规格型号"
      >
      </el-table-column>
      <el-table-column
        prop="sl"
        label="库存数量"
      >
      </el-table-column>
      <el-table-column
        prop="scdw"
        width="200"
        label="生产单位"
      >
      </el-table-column>
    </el-table>
    <!-- <div style="height:75px;"> -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination>

    <div class="f-mt30">
      <el-button
        round
        type="primary"
        @click=selNcp
      >选 中</el-button>
      <el-button
        round
        @click="$emit('closeNcp')"
      >关 闭</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      findName: "",
      zldm: "",
      trpTypes: "",
      //table参数
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
      default: function() {
        return [];
      }
    },
    khId: {
      type: [String, Number],
      default: ""
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    this.getTableData();
    this.getTypes();
  },
  watch: {
    khId: 'getTableData',
  },
  methods: {
    /*render-column结束*/

    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_base.  请求api
     *params请求参数
     */
    search() {
      this.pageNo = 1;
      this.getTableData({ pageNo: 1, pageSize: this.pageSize });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableData({ pageSize, pageNo: this.pageNo });
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.getTableData({ pageNo, pageSize: this.pageSize });
    },
    getTableData(obj = {}) {
      this.loading = true;
      let params = {
        bizId: this.userInfo.bizId,
        key: this.findName,
        nzdl: this.zldm,
        khId: this.khId + "",
        type: 2
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_stock
        .ckgl_kc(params)
        .then(res => {
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          this.currentPage = pageNo;
          if (this.taskData.length || this.selIds.length) {
            this.toggleSelection(this.taskData);
          }
          console.log("图片===" + res.list.data.tp);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getTypes() {
      var params = {
        sjzdLxbm: "TRPLX"
      };
      this.$fetch.api_goods.get_sjzd(params).then(res => {
        this.trpTypes = res.list;
      });
    },
    selNcp() {
      this.$emit("addTrp", this.taskData);
      this.$message.success("添加成功！");
    },
    // 选中table已有数据
    toggleSelection(rows) {
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
    select(selection, row) {
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
    selectAll(selection) {
      // 如果有则是全选否则就是全取消
      if (selection.length > 1) {
        this.addRows(this.tableData);
      } else {
        this.removeRows(this.tableData);
      }
    },
    // 添加选中行
    addRows(rows) {
      for (let key of rows) {
        // 如果选中的数据中没有这条就添加进去
        if (!this.taskData.find(item => item.id === key.id)) {
          this.taskData.push(key);
        }
      }
    },
    // 取消选中行
    removeRows(rows) {
      if (this.taskData.length > 0) {
        for (let row of rows) {
          this.taskData = this.taskData.filter(item => item.id !== row.id);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog {
  width: 1000px;
}

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
</style>

