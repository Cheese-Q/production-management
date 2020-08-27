/*商品信息*/
<template>
  <div>
    <v-table @edit=edit  ref="table"></v-table>
    <el-dialog
      title="预警处理"
      width="800px"
      v-if="isDialog"
      :visible.sync="isDialog">
      <v-edit :form=editRow @close=close></v-edit>
    </el-dialog>
  </div>
</template>

<script>
  import vEdit from './component/edit';
  import vTable from './component/table';
  export default {
    components:{
      vEdit,
      vTable
    },
    data(){
      return {
        isEdit:false,   // 判断显示table 还是 编辑弹框
        isDialog:false, // 判断是否显示对话框
        editRow: {
          clsl: '',
          clsj: '',
          cklx: '',
          clfs: '',
          jbr:''
        }
      }
    },
    methods:{
      edit(row={}){
        this.isEdit = false
        this.isDialog = true
        if(row.id){
          console.log(row.id);
          this.editRow = row;
        }else{
          this.editRow = {
            clsl: '',
            clsj: '',
            cklx: '',
            clfs: '',
            jbr:''
          }
        }
      },

      close(isRefresh){
        this.isEdit = !this.isEdit;
        this.isDialog = !this.isDialog;
        if(isRefresh){
          //更新table的数据
          this.$refs.table.getTableData();
        }
      },

    }
  }
</script>

<style lang="scss" scoped>
  .input-with-select{
    width:240px;
  }
  .ncp-img{
    width:50px;
    height:50px;
    border-radius:50%;
  }
  .editFzr{
    margin-left:150px;
  }
</style>



