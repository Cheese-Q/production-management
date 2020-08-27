/*会员信息*/
<template>
   <div class="dkfzr" style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="会员名"  @keyup.enter.native=search v-model.trim=khmc class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
    </div>
     <s-table
        v-loading=loading
        class="table"
        ref="stable"
         element-loading-text="拼命加载中"
        :tableData=tableData
        :totalCount=totalCount
        :getData=getTableData
        :tableHeader=tableHeader
     ></s-table>
   </div>

</template>

<script>
      import { mapGetters } from 'vuex'
    export default {
        data(){
            return {
                khlx:'',
                khmc:'',
                type:'',
                //table参数
                tableHeader:[
                  {label:'会员名',prop:'hymc'},
                  {label:'手机号',prop:'sjhm'},
                  {label:'身份证',prop:'sfz'},
                  {label:'操作',prop:'delFlag',width:'120','render-column':this.renderEdit}
                ],
                loading:false,
                totalCount:1,
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
       /*render-column开始*/
        renderEdit(h,row){
          return (
            <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selsup',row)}}>选择</el-button>
          )
        },
       /*render-column结束*/
      
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        search(){
          this.$refs.stable.pageNo=1;
          this.getTableData();
        },
        getTableData(obj={}){
          this.loading = true;
          let params = {
            bizId:this.userInfo.bizId,
            key:this.khmc,
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_retail.hyxx_list(params).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData = data;
            this.totalCount = totalCount;
            this.currentPage = pageNo;
            this.loading = false;
          }).catch(()=>{
            this.loading = false;
          })
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
</style>
<style>
/* .table .el-button:hover{
  background:#ecf5ff;
  color:#60acff;
  border:1px solid #60acff;
} */
</style>

