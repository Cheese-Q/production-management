<!--
 * @Author: 龚铱白
 * @Date: 2019-08-13 14:01:39
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-08-13 14:05:07
 * @Description: 
 -->
/*用户信息*/
<template>
  <div style="position: relative;">
    <div style="position:absolute;top:-5px;right:40px; ">
      <el-button v-if="isEdit"
                 @click="closeForm(false)"
                 type="primary"
                 size="medium">返回列表
      </el-button>
    </div>
    <v-table v-show="!isEdit"
             @select="select"
             ref="table"></v-table>

    <v-select v-if="isEdit"
              :form=editRow
              :id="editId"
              @closeForm=closeForm></v-select>
  </div>
</template>

<script>
import vSelect from "./component/select";
import vTable from "./component/table";
export default {
  components: {
    vSelect,
    vTable
  },
  data () {
    return {
      isEdit: false, // 判断显示table 还是 编辑弹框
      editRow: "",
      editId: "",
    };
  },
  methods: {
    select (row = {}) {
      this.isEdit = true;
      if (row.id) {
        this.editRow = row;
      } else {
        this.editRow = {
          nzid: "",
        };
      }
    },
    closeForm (isRefresh) {
      this.isEdit = !this.isEdit;
      if (isRefresh) {
        //更新table的数据
        this.$refs.table.getTableData();
      }
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
.editFzr {
  margin-left: 150px;
}
</style>



