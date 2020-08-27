/*销售统计信息*/
<template>
   <div>
       <v-table  ref="table"></v-table>
   </div>
</template>

<script>
	import vTable from './component/table';
    export default {
        components:{
            vTable
        },
        data(){
            return {
            }
        },
       methods:{}
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



