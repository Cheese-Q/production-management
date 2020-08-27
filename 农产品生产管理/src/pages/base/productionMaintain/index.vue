/*往来单位*/
<template>
   <div>
       <page-name v-model="isEdit"></page-name>

       <v-table v-if="!isEdit" @edit=edit ref="vtable" :khtype="khtype"></v-table>
       <v-edit class="editFzr" :khtype="khtype" v-if="isEdit" :form=editRow  @closeForm=closeForm></v-edit>
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
               khtype:[
                  {label:'销售商',value:'01'},
                  {label:'农资销售商',value:'02'},
                  {label:'农产品供应商',value:'04'},
                ],
               editRow: {
                    nhId: '',
                    nhxm: '',
                    sfzh:'',
                    xb:'1',
                    dz: '',
                    bz: '',
                    lxdh: '',
					bzqlx:2,
                    sfky:1
                   }
            }
        },
       methods:{
           edit(row={}){
               this.isEdit = true
               if(row.ncpmc){
                    var imglists = row.attaUrl.split(',');
                    imglists.forEach((item,index)=>{
                         imglists[index]={"name":index+'.jpg',"url":item};
                    })
                    row.imglists = imglists;
                    this.editRow = row;
               }else{
                   this.editRow = {
                    nhId: '',
                    nhxm: '',
                    sfzh:'',
                    xb:'1',
                    dz: '',
                    bz: '',
                    lxdh: '',
					bzqlx:2,
                    sfky:1,
                    imglists:[],
                    attaUrl:''
                   }
               }    
           },
           closeForm(isRefresh){
               this.isEdit = !this.isEdit;
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



