<!--
 * @Description:选择商品页面新增商品后选择商品页面图片显示是张破图，点击添加商品后新增进货单页面没有把图片显示出来(5717)
 * @Author: your name
 * @Date: 2019-07-30 09:05:09
 * @LastEditTime: 2019-08-12 13:59:53
 * @LastEditors: 龚铱白
 -->
<template>
  <div class="dkfzr"
       style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>类型</label>
        <el-select v-model="zldm"
                   size="small"
                   placeholder="请选择"
                   @change=getTableData
                   clearable>
          <el-option v-for="item in trpTypes"
                     :key="item.sjzdBm"
                     :label="item.sjzdMc"
                     :value="item.sjzdBm">
          </el-option>
        </el-select>
        <el-input placeholder="请输入产品名称"
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
        <el-button type="primary"
                   size="medium"
                   @click="addNcpDialogVisable=true"
                   round
                   style="padding:9px 25px">新 增
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
      <el-table-column width="100"
                       label="图片">
        <template slot-scope="scope">
          <div v-if="scope.row.nzsyTpbs.length>0">
            <img :src="scope.row.nzsyTpbs[0].tpdz"
                 alt=""
                 width="70"
                 height="70">
          </div>
          <div v-else>
            <img :src="assetsURL"
                 alt=""
                 width="70"
                 height="70">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="agriProdName"
                       label="投入品名称">
      </el-table-column>
      <el-table-column prop="model"
                       width="100"
                       label="规格型号">
      </el-table-column>
      <el-table-column prop="unit"
                       width="100"
                       label="单位">
      </el-table-column>
      <el-table-column prop="scdw"
                       label="生产单位">
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
                 @click=selNcp>选 中
      </el-button>
      <el-button round
                 @click="$emit('close')">关 闭
      </el-button>
    </div>

    <!-- <el-dialog title="新增农产品"
               :append-to-body="true"
               :visible.sync="addNcpDialogVisable"
               width="800px">
      <add-goods style="margin:0 auto;"
                 v-if="addNcpDialogVisable"
                 @closeForm="addNcpDialogVisable=false;search()"></add-goods>
    </el-dialog> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fetch from "fetch/axios/";

export default {
  components: {
    // addGoods
  },
  data () {
    return {
      assetsURL: require('../../../../assets/images/icon-xzsp-nogoods.png'),
      ncpmc: "",
      zldm: "",
      trpTypes: "",
      addNcpDialogVisable: false,
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
      selRows: [],
      tp: []
    };
  },
  props: {
    selIds: {
      type: Array,
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
    this.getTypes();
    this.getTableData();
  },
  mounted () {

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
    getTypes () {
      var params = {
        sjzdLxbm: "TRPLX"
      };
      this.$fetch.api_goods.get_sjzd(params).then(res => {
        this.trpTypes = res.list;
      });
    },
    getTableData (obj = {}) {
      this.loading = true;
      let { zldm } = this;
      let params = {
        bizId: this.userInfo.bizId,
        key: this.ncpmc,
        sjzdBm: zldm,
        delFlag: 1
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_goods
        .spwh_list(params)
        .then(res => {
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          if (this.taskData.length || this.selIds.length) {
            this.toggleSelection(this.taskData);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
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

