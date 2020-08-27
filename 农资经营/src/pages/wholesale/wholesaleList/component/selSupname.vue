/*地块负责人*/
<template>
   <div class="dkfzr" style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="单位名称"  @keyup.enter.native=search v-model.trim=khmc class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="supNameDialogVisable=true" round style="padding:9px 25px">新 增</el-button>
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
    <el-dialog
      title="新增客户信息"
      :append-to-body="true"
      :visible.sync="supNameDialogVisable"
      width="800px"
    >
      <add-sup  v-if="supNameDialogVisable" :khtype="khtype" :isSup="'04'" style="margin:0 auto;" @closeForm="supNameDialogVisable=false;search()"></add-sup>  
    </el-dialog> 
   </div>

</template>

<script>
      import { mapGetters } from 'vuex'
      import addSup from 'pages/wholesale/customerList/component/edit.vue';
    export default {
        components:{
            addSup
        },
        data(){
            return {
                 khtype:[
                  {label:'销售商',value:'01'},
                  {label:'农资销售商',value:'02'},
                  {label:'检测机构',value:'03'},
                  {label:'农产品供应商',value:'04'},
                ],
                sfky:false,
                khlx:'',
                khmc:'',
                type:'',
                supNameDialogVisable:false,
                //table参数
                tableHeader:[
                  {label:'单位名称',prop:'bizName'},
                  {label:'企业类型',prop:'delFlag',width:'180','render-column':this.renderStateQy},
                  {label:'联系人',prop:'contPerson'},
                  {label:'联系电话',prop:'contNumber'},
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

         renderStateQy(h,row){
           if(row.bizType==1){
             return ('客户')
           }else if(row.bizType==2){
             return ('供应商')
           }else{
             return ('客户和供应商')
           }
         },

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
          let {delFlag} = this;
          let params = {
            bizId:this.userInfo.bizId,
            key:this.khmc,
            type:'1,3',
            flag:'1'
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_purchase.wldw_list(params).then(res=>{
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

