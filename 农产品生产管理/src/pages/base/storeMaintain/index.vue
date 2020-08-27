/*往来单位*/
<template>
   <div>
       <page-name v-model="isEdit"></page-name>
       <v-table v-if="!isEdit" @edit=edit ref="table" ></v-table>
       <v-edit class="editFzr"  v-if="isEdit" :form=editRow  @closeForm=closeForm></v-edit>
   </div>
</template>

<script>
	import vEdit  from './component/edit.vue';
	import vTable from './component/table';
    export default {
        name:'storeMaintain',
        components:{
            vEdit,
            vTable
        },
        data(){
            return {
               isEdit:false,   // 判断显示table 还是 编辑弹框
               editRow: {
                    type: '',
                    scMc: '',
                    scDz:'',
                    logoImg: '',
                    xcxImg: '', 
                    addUser:'',
                    addTime:'',
                    logoImg:'',
                    xcxImg:'',
                   }
            }
        },
       methods:{
           edit(row={}){
               this.isEdit = true
               if(row.scMc){
                    this.editRow = row;
               }else{
                   this.editRow = {
                    type: '',
                    scMc: '',
                    scDz:'',
                    logoImg: '',
                    xcxImg: '', 
                    addUser:'',
                    addTime:'',
                    logoImg:'',
                    xcxImg:'',
                   }
               }    
           },
           closeForm(isRefresh){
               this.isEdit = !this.isEdit;
               if(isRefresh){
                    //更新table的数据
                    this.$refs.table.$refs.stable.getDataByPage();
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



