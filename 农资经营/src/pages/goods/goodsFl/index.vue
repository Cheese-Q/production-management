/*商品信息*/
<template>
  <div>
    <v-table v-show="!isEdit" @edit=edit ref="table"></v-table>
    <v-edit class="editFzr" v-if="isEdit" @closeForm=closeForm></v-edit>
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
        editRow: '',
        // nzdlMc:'',
        // nzdlId:''
      }
    },
    methods:{
      edit(){
        this.isEdit = true;
        // if(nzdlMc == ''||nzdlMc == undefined||nzdlMc == null){
        //   this.nzdlMc = '';
        //   this.nzdlId = '';
        // }else{
        //   this.nzdlMc = nzdlMc;
        //   this.nzdlId = nzdlId;
        // }
      },
      closeForm(isRefresh){
        this.isEdit = !this.isEdit;
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



