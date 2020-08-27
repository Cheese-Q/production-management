/*往来单位*/
<template>
   <div>
       <page-name v-model="isEdit"></page-name>
       <v-table v-if="!isEdit" @edit=edit ref="table" :khtype="khtype"></v-table>
       <v-edit :khtype="khtype" v-if="isEdit" :form=editRow :id="editId"  @closeForm=closeForm></v-edit>
      <!-- 选择所属分类 -->
      <el-dialog
        title="批发提货"
        width="950px"
        :visible.sync="extractMultiDialog"
        :before-close="()=>{extractMultiDialog = false;$refs.table.search()}"
      >
       <extractList  @close="extractMultiDialog = false;$refs.table.search()" />
      </el-dialog>
	        <el-dialog
        title="散买提货"
        width="1100px"
        :visible.sync="extractSingleDialog"
        :before-close="()=>{extractSingleDialog = false;$refs.table.search()}"
      >
       <extractlsList  @close="extractSingleDialog = false;$refs.table.search()" />
      </el-dialog>
   </div>
</template>

<script>
	import vEdit  from './component/edit.vue';
	import extractList  from './component/extractList.vue';
	import extractlsList  from './component/extractlsList.vue';
	import vTable from './component/table';
    export default {
        name:'purchaseInput',
        components:{
            vEdit,
            vTable,
            extractList,
			extractlsList
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               editId:'',
               khtype:[
                  {label:'销售商',value:'01'},
                  {label:'农资供应商',value:'02'},
                  {label:'农产品供应商',value:'04'},
                ],
                extractDialog:false,
                extractSingleDialog:false,
                extractMultiDialog:false,
               editRow: {
                    nhId: '',
                    nhxm: '',
                    sfzh:'',
                    xb:'1',
                    dz: '',
                    bz: '',
                    lxdh: '',
                    sfky:1
                   }
            }
        },
       methods:{
           edit(row={},extract){
               if(extract =='single'){
                 this.extractSingleDialog = true;
               }else if(extract === 'multi'){
                 this.extractMultiDialog = true;
               }else{
                this.isEdit = true
                this.editId = row.jhzbId || '';
               }
           },
           closeForm(isRefresh){
               this.isEdit = !this.isEdit;
             //  if(isRefresh){
             //       //更新table的数据
             //       this.$refs.table.$refs.stable.getDataByPage();
             //  }  
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



