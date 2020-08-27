/*商品信息*/
<template>
   <div>
     <v-table v-show="!isEdit" @edit=edit  @editTrp=editTrp @daochu=daochu ref="table"></v-table>
     <el-dialog
       title="商品提取"
       width="900px"
       v-if="isDialog"
       :visible.sync="isDialog"
     >
     <v-edit   @close=close></v-edit>
     </el-dialog>
     <el-dialog
       title="打印"
       width="900px"
       v-if="isExportDialog"
       :visible.sync="isExportDialog"
     >
       <v-export   @closeExport=closeExport></v-export>
     </el-dialog>
     <edit class="editFzr" v-if="isEdit" :form=editRow  @closeForm=closeForm></edit>
   </div>
</template>

<script>
	import vEdit from './component/edit';
  import vExport from './component/export';
	import edit from './component/editTrp';
	import vTable from './component/table';
    export default {
        components:{
            vEdit,
            vExport,
            edit,
            vTable
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               isDialog:false, // 判断是否显示对话框
               isExportDialog:false, // 判断是否显示对话框
               editRow: ''
            }
        },
       methods:{
           edit(row={}){
               this.isEdit = false
               this.isDialog = true
               this.isExportDialog = false
               if(row.id){
                    this.editRow = row;
               }else{
                   this.editRow = {
                   }
               }    
           },
         daochu(row={}){
               this.isEdit = false
               this.isDialog = false
               this.isExportDialog = true
               if(row.id){
                    this.editRow = row;
               }else{
                   this.editRow = {
                   }
               }
           },
          editTrp(row={}){
           this.isEdit = true
            this.isDialog = false
            this.isExportDialog = false
           if(row.id){
             this.editRow = row;
           }else{
             this.editRow = {
             }
           }
          },
          close(isRefresh){
           this.isDialog = !this.isDialog;
              if(isRefresh){
                   //更新table的数据
                   this.$refs.table.getTableData();
              }
         },
         closeExport(isRefresh){
           this.isExportDialog = !this.isExportDialog;
              if(isRefresh){
                   //更新table的数据
                   this.$refs.table.getTableData();
              }
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



