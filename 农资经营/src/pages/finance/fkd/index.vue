/*商品信息*/
<template>
  <div style="position: relative;">
    <div style="position:absolute;top:-5px;right:40px; ">
      <el-button v-if="isEdit || isEdit1 || isEdit2"
                 @click="closeForm(false)"
                 type="primary"
                 size="medium">返回列表
      </el-button>
    </div>
    <div v-if="isEdit == false">
      <v-table v-show="!isEdit && !isEdit1 && !isEdit2"
               :id="editId"
               @edit=edit
               :khid="khid"
               @addFkd=addFkd
               @shFkd=shFkd
               @see="see"
               ref="table"></v-table>
    </div>
    <div v-else>
      <v-table v-show="isEdit && isEdit1 && isEdit2"
               :id="editId"
               @edit=edit
               :khid="khid"
               @addFkd=addFkd
               @shFkd=shFkd
               @see="see"
               ref="table"></v-table>
    </div>
    <el-dialog title="进货单提取"
               width="900px"
               v-if="isDialog"
               :visible.sync="isDialog">
      <v-edit @close=close></v-edit>
    </el-dialog>
    <edit v-if="isEdit"
          :form=editRow
          :id="editId"
          :khId="khid"
          @closeForm=closeForm></edit>
    <sEdit v-if="isEdit1"
           :form=editRow1
           :id="editId"
           @closeForm=closeForm></sEdit>
    <search v-if="isEdit2"
            :form=editRow1
            :id="editId"
            @closeForm=closeForm></search>
  </div>
</template>

<script>
import sEdit from "./component/shFkd";
import edit from "./component/edit";
import vTable from "./component/table";
import search from "./component/search";

export default {
  components: {
    edit,
    vTable,
    sEdit,
    search
  },
  data () {
    return {
      isEdit: false, // 判断显示table 还是 编辑弹框
      isEdit1: false, // 判断显示table 还是 编辑弹框
      isEdit2: false, // 判断显示table 还是 编辑弹框
      isDialog: false, // 判断是否显示对话框
      editRow: "",
      editRow1: "",
      editId: "",
      khid: ""
    };
  },
  methods: {
    edit (row = {}) {
      this.isEdit = false;
      this.isEdit1 = false;
      this.isEdit2 = false;
      this.isDialog = true;
      this.editId = row.id || "";
    },
    // 审核
    shFkd (row = {}) {
      this.isEdit = false;
      this.isEdit1 = true;
      this.isEdit2 = false;
      this.isDialog = false;
      if (row.id) {
        this.editId = row.id || "";
      } else {
        this.editRow1 = {};
      }
    },
    // 查看
    see (row = {}) {
      this.isEdit = false;
      this.isEdit1 = false;
      this.isEdit2 = true;
      this.isDialog = false;
      if (row.id) {
        this.editId = row.id || "";
        // this.editRow1 = row;
      } else {
        this.editRow1 = {};
      }
    },
    //编辑/新增
    addFkd (row = {}) {
      this.isEdit = true;
      this.isEdit1 = false;
      this.isDialog = false;
      if (row != "") {
        if (row.id) {
          this.editId = row.id || "";
          this.khid = row.khid || "";
          console.log("初始化khid---" + this.khid);
        } else {
          this.editRow = {};
        }
      } else {
        this.editId = "";
      }
    },
    close (isRefresh) {
      this.isDialog = !this.isDialog;
      if (isRefresh) {
        //更新table的数据
        this.$refs.table.getTableData();
      }
    },
    closeForm (isRefresh) {
      this.isEdit = false;
      this.isEdit1 = false;
      this.isEdit2 = false;
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



