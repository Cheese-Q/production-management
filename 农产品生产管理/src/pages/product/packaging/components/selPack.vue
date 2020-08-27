/*产品维护所属类别选择*/
<template>
   <div style="padding-bottom:70px;min-height:470px;">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="产品名称\商品条码" style="vertical-align:bottom"  @keyup.enter.native=getTableData v-model.trim=searchkey class="input-with-select"  size="small">
          </el-input> 
          <el-button type="primary" size="small"  style="padding:5px 15px;" @click=getTableData><i class="el-icon-search f-fs20"></i></el-button>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="isAddNcp=true" round style="padding:9px 25px">新 增</el-button>
      </div>
    </div> 
     <s-table
        v-loading=loading
        class="table"
         element-loading-text="拼命加载中"
        :tableData=tableData
        :totalCount=totalCount
        :getData=getTableData
        :tableHeader="tableHeader"
     ></s-table>
    <el-dialog
      title="新增包装产品"
      :append-to-body="true"
      :visible.sync="isAddNcp"
	  :before-close="closeAddNcp"
      width="950px"
    >
      <add-sup  v-if="isAddNcp"   style="margin:0 auto;" @closeForm="isAddNcp=false;closeAddNcp()"></add-sup>
    </el-dialog>
   </div>
</template>

<script>
    import { mapGetters } from 'vuex'
	import addSup from 'pages/base/productionMaintain/component/edit.vue';
    export default {
	components:{
	  addSup,
    },
        data(){
            return {
                ncpmc:'',
                zldm:'',
                ej:'',
                searchkey:'',
				isAddNcp:false,
                zldms:[],
                ejs:[],
                //table参数
                tableHeader:[
                  {label:'产品名称',prop:'ncpmc'},
                  {label:'规格类型',prop:'ggxh'},
                  {label:'单位',prop:'dw'},
                  {label:'商品条码',prop:'goodsCode'},
                  {label:'操作',width:'120','render-column':(h,row)=>{
                     return (
                           <el-button size="mini" class="edit"  onClick={()=>{this.$emit('selPack',row)}}>选择</el-button>
                        )
                  }}
                ],
                loading:false,
                totalCount:1,
                tableData: [],
                isAddFzr:false
            }
        },
        watch:{
          sampleType(newVal){
            this.getTableData();
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
         //关闭新增农产品弹框的时候，刷新页面数据
         closeAddNcp(done){
           this.isAddNcp = false;
           this.getTableData({pageNo:this.pageNo,pageSize:this.pageSize});
           done && done();
         },
        /*
        /*
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData(obj={pageSize:10,pageNo:1}){
          this.loading = true;
           let {searchkey} = this;
          var params =  {
            scjyztId:this.userInfo.scjyztId,
			sfky:1,
			type:3,
            ncpmc:searchkey
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.cpwh_list(params).then(res=>{
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



