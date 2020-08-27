/*商品信息*/
<template>
  <div style="position: relative;">
    <div style="position:absolute;top:-5px;right:40px; " >
      <el-button v-if="isEdit || isEdit1 || isEdit2" @click="closeForm(false)" type="primary" size="medium">返回列表</el-button>
    </div>

    <div v-if="isEdit == false">
      <v-table v-show="!isEdit && !isEdit1 && !isEdit2" :id="editId" @addCgd=addCgd @submitCgd=submitCgd @check="check"  ref="table"></v-table>
    </div>
    <div v-else>
      <v-table v-show="isEdit && isEdit1 && isEdit2" :id="editId" @addCgd=addCgd @submitCgd=submitCgd @check="check"  ref="table"></v-table>
    </div>
    <!--<v-table v-show="!isEdit" @edit=edit ref="table"></v-table>-->

    <edit v-if="isEdit" :form=editRow :id="editId" @closeForm=closeForm></edit>
    <sEdit v-if="isEdit1" :form=editRow1 :id="editId" @closeForm=closeForm></sEdit>
    <check v-if="isEdit2" :form=editRow1 :id="editId" @closeForm=closeForm></check>
  </div>
</template>

<script>
  import vTable from './component/table';
  import sEdit from './component/submitCgd';
  import edit from './component/edit';
  import check from './component/check';
  export default {
    components:{
      edit,
      vTable,
      sEdit,
      check
    },
    data(){
      return {
        isEdit:false,   // 判断显示table 还是 编辑弹框
        isEdit1:false,   // 判断显示table 还是 编辑弹框
        isEdit2:false,   // 判断显示table 还是 编辑弹框
        editRow: '',
        editRow1: '',
        editId:'',
      }
    },
    methods:{
      edit(row={}){
        this.isEdit = true
        if(row.id){
          this.editId = row.id || '';
        }else{
          this.editRow = {
          }
        }
      },
      submitCgd(row={}){
        this.isEdit = false
        this.isEdit1 = true
        if(row.id){
          this.editId = row.id || '';
          this.editRow1 = row;
        }else{
          this.editRow1 = {
          }
        }
      },

      check(row={}){
        this.isEdit = false
        this.isEdit1 = false
        this.isEdit2 = true
        if(row.id){
          this.editId = row.id || '';
          this.editRow1 = row;
        }else{
          this.editRow1 = {
          }
        }

      },
      addCgd(row = {}) {
        this.isEdit = true
        this.isEdit1 = false
        if (row != '') {
          if (row.id) {
            this.editId = row.id || '';
          } else {
            this.editRow = {}
          }
        }else{
          this.editId = '';
        }

      },
      close(isRefresh){
        if(isRefresh){
          //更新table的数据
          this.$refs.table.getTableData();
        }
      },
      closeForm(isRefresh){
        this.isEdit = false;
        this.isEdit1 = false;
        this.isEdit2 = false;
        if(isRefresh){
          //更新table的数据
          this.$refs.table.getTableData();
        }
      }
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



