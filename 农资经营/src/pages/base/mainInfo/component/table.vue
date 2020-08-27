/*用户信息*/
<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="$emit('edit')" round style="padding:9px 25px">新 增</el-button>
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
                delFlag:false,
                findName:'',
                //table参数
                tableHeader:[
                  {label:'许可证类型',prop:'zslx','render-column':this.renderZslx},
                  {label:'有效期',prop:'','render-column':this.renderYxq},
                  {label:'经营范围',prop:'jyfw'},
                  // {label:'状态',prop:'delFlag',width:'200','render-column':this.renderState},
                  {label:'操作',prop:'delFlag',width:'200','render-column':this.renderEdit}
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
         renderZslx(h,row){
           var zslx;
           // 1-农药经营许可证 2-兽药经营许可证 3-肥料经营许可证
           if(row.zslx==1){
             zslx="农药经营许可证 ";
           }else if(row.zslx==2){
             zslx="兽药经营许可证 ";
           }else if(row.zslx==3){
             zslx="肥料经营许可证 ";
           }
           return zslx
         },
         renderYxq(h,row){
           return row.ksyxq+"~"+row.jsyxq
         },
         renderState(h,row){
           return (<span class={row.zt==1?'':'f-red'}>{row.zt==1?'正常':'过期'}</span>)
         },
        renderEdit(h,row){
          return (
            <el-button size="mini" class="edit" onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>
          )
        },
       /*render-column结束*/
      
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.yhxx_list  请求api
        *params请求参数
        */
        search(){
          this.$refs.stable.pageNo=1;
          this.getTableData();
        },
        getTableData(obj={}){
          this.loading = true;
          let {bizId,searchKey} = this;
          let params = {
            bizId:this.userInfo.bizId,
            pageNo: this.currentPage
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.xkz_list(params).then(res=>{
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


