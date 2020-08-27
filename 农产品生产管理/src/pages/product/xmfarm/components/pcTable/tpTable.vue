/*sf*/
<template>
<div class="table">
    <div  class="table-header">
        <slot></slot>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="dbrq"
        label="调拨日期"
        >
      </el-table-column>
      <el-table-column
        prop="dccsmc"
        label="调出场所"
       >
      </el-table-column>
      <el-table-column
        prop="dcpc"
        label="调出批次">
      </el-table-column>
      <el-table-column
        prop="dccll"
        label="存栏数">
      </el-table-column>
      <el-table-column
        prop="dbsl"
        label="调拨数量">
      </el-table-column>
      <el-table-column
        prop="drcsmc"
        label="调入场所">
      </el-table-column>
      <el-table-column
        prop="drpc"
        label="调入批次">
      </el-table-column>
      <el-table-column
        prop="drcll"
        label="存栏数">
      </el-table-column>
      <el-table-column
        prop="address"
         width="150"
		 v-if="pcInfo.zt==1 && pageName==='farm'"
        label="操作">
      <template slot-scope="scope">
        <el-button  size="mini" class="edit"    @click="$emit('operate','tp',scope.row)">修 改</el-button>
      </template>
      </el-table-column>
    </el-table>
</div>

</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from 'fetch/axios/'
    export default {
        inject:['zzpc','pcInfo','pageName'],
        data(){
            return {
                //table参数
                loading:false,
                totalCount:0,
                tableData: [],
            }
        },
        computed:{
            ...mapGetters({
                userInfo:'getUserInfo',
            })
        },  
        created(){
            this.getTableData();
        },
        methods:{
        /*
        *获取table的数据
        */
        getTableData(obj={pageSize:10,pageNo:1}){
            this.loading = true;
            let {type,searchkey,selDateRange} = this;
            var params =  {
                scjyztId:this.userInfo.scjyztId,
                searchkey,
                type
            };
            //合并组件的pageSize 和 pageNo 参数
            Object.assign(params,obj);
            var query = {
                method:'get',
                url:'/scgl/ns/listDpjl/',
                data:{
                    zzpc:this.zzpc
                }  
            }
            fetch(query).then(res=>{
                this.tableData = res.list;
                this.loading = false;
            }).catch(()=>{
                this.loading = false;
            })
            }
        }
    }
</script>

<style scoped lang="scss">
    .table-header{
        margin: 20px 0;        
    }
</style>

