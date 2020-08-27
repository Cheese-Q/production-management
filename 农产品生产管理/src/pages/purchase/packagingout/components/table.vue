/*加工管理（外来）*/
<template>
   <div>
     <!-- tab2 -->
       <!-- 搜索头部 -->
        <div class="header f-df f-pr20">
          <div>
              <label>包装日期</label>
             <date-picker @selChange="(val)=>{query2.selDateRange=val}" style="vertical-align:bottom"></date-picker> 

              <label>包装类型</label>
              <el-select  v-model.trim="query2.packType" size="small" class=" f-mr20 f-vab" placeholder="请选择" style="vertical-align:bottom"  @change=search2>
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="加工包装"></el-option>
                <el-option value="2" label="分拣包装"></el-option>
            </el-select>
              <el-input  placeholder="请输入包装产品名称" style="vertical-align:bottom"  @keyup.enter.native=search2 v-model.trim=query2.searchKey class="input-with-select f-vab"  size="small">
              </el-input> 
              <el-button type="primary" size="small" style="padding:5px 15px" @click=search2><i class="el-icon-search f-fs20"></i></el-button>
          </div>
          <div class="f-f1 f-tar">
            <el-button type="primary" size="medium" @click="$emit('edit',{},'2')" round style="padding:9px 25px">新 增</el-button>
          </div>
        </div> 
        <s-table
          style="margin-top:0"
          v-loading=loading2
          ref="table2"
          class="table"
          element-loading-text="拼命加载中"
          :tableData=tableData2
          :totalCount=totalCount2
          :getData=getTableData2
          :tableHeader=tableHeader2>
        </s-table>
     </div>
  
</template>

<script>
	  import { mapGetters } from 'vuex'
	  import fetch from 'fetch/axios'
    export default {
        data(){
            return {
                trpTypes:[
                  {'key':'qpzz','label':'起批种植'}
                ],
                query2:{
                  searchKey:'',
                  packType:'',
                  selDateRange:''
                },
                zldm1:'',
                trpmc1:'',
                zldm2:'',
                trpmc2:'',
                currentTab:1,
                //table参数
                loading1:false,
                totalCount1:1,
                tableData1: [],
                tableHeader2:[
                  {label:'包装日期',prop:'packDate',width:150},
                  {label:'包装产品名称',prop:'ncpMc'},
                  {label:'规格',prop:'ggxh'},
                  {label:'单位',prop:'dw',width:100},
                  {label:'数量',prop:'packToProductNum',width:150},
                  // {label:'采购批次',prop:'zzpc'},
				  {label:'包装类型',prop:'packType',formatter:(val)=>{return val==1?'加工包装':'分拣包装'},width:120},
                  {label:'包装批次',prop:'packSno','render-column':(h,row)=>{return String(row.zzpc)+'-'+row.packSno}},
                  {label:'操作',prop:'sfky','render-column':this.renderTrpEdit2,width:200}
                ],
                loading2:false,
                totalCount2:1,
                tableData2: [],
                selDateRanges:[]
            }
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
        created(){
        
          this.selDateRanges = [this.getDay(-365),this.getDay(-1)]
          setTimeout(()=>{
              this.getTableData2();
          },100)
          // this.getTypes();  //获取类别
        },
       methods:{
       /*render-column开始*/
        renderState(h,row){
          return (<span class={row.sfky==1?'':'f-red'}>{row.sfky==1?'可用':'停用'}</span>)
        },
        renderSfkyBtn(h,row){
          return  h('el-switch',{
            attrs:{
              value:row.sfky==1?true:false,
              activeColor:"#13ce66"
            },
            on:{
              change:(value)=>{
                let {nhId,sfky} = row;
                sfky=sfky==1?0:1;
                this.$fetch.api_base.dkfzr_status({nhId,sfky}).then(res=>{
                    row.sfky = sfky;
                })
              }
            }
          })
        },
        renderTrpEdit2(h,row){
          return (
            <div>
                 <el-button size="mini" type="info" plain onClick={()=>{this.$emit('edit',row,'2')}}>编辑</el-button>  
                <el-button size="mini" plain onClick={()=>{this.$emit('edit',row,'2','info')}}>查看</el-button> 
            </div>
          )
        },
        renderXzEdit(h,row){
          return (
              <el-button size="mini" type="danger" onClick={()=>{
                    this.$confirm("此操作将删除该条新增投入品申请信息, 是否继续?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      cancelButtonClass:'is-round',
                      confirmButtonClass:'is-round',
                      type: "warning"
                    }).then(() => {
                      this.$fetch.api_base.trp_xzdelete({id:row.id}).then(res=>{
                        this.$message({"type":'success',message:'删除成功！'})
                        this.getTableData2();
                      }).catch(res=>{
                        this.$message.error(res.errorMess);  
                      }) 
                    }).catch(() => {});
                }}>删除</el-button>  
          )
        },
       /*render-column结束*/
        search2(){
          this.$refs.table2.pageNo=1;
          this.$refs.table2.getDataByPage();
        },
        //获取时间
        getDay(day){
        　　var today = new Date();
        　　var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
        　　today.setTime(targetday_milliseconds); //注意，这行是关键代码
        　　var tYear = today.getFullYear();
        　　var tMonth = today.getMonth();
        　　var tDate = today.getDate();
        　　tMonth = this.doHandleMonth(tMonth + 1);
        　　tDate = this.doHandleMonth(tDate);
        　　return tYear+"-"+tMonth+"-"+tDate;
       },
      doHandleMonth(month){  
    　　var m = month;
    　　if(month.toString().length == 1){
    　　　　m = "0" + month;
    　　}
    　　return m;
     },
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData2(obj={}){
          this.loading2 = true;
          let {packType,searchKey,selDateRange} = this.query2;
          console.log(this.selDateRanges,'444444')
          let {scjyztId} =  this.userInfo;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            packType,
            searchKey,
            startDate:this.query2.selDateRange?this.query2.selDateRange[0]:'',
            endDate:this.query2.selDateRange?this.query2.selDateRange[1]:'',
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            url:'/Bzgm/gm/pagePackRecordOut/',
            method:'get',
            data:params
          }).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData2 = data;
            this.totalCount2 = totalCount;
            this.currentPage2 = pageNo;
            this.loading2 = false;
          }).catch(()=>{
            this.loading2 = false;
          })
        },
        getTypes(){
          var params = {
            sjzdLxbm:'TRPLX',
            hy:1
          }
          this.$fetch.api_base.cpwh_type(params).then(res=>{
            this.trpTypes = res.list;
          })
        }
       }
    }
</script>

<style lang="scss" scoped>
  .tabs{
     height:40px;
     margin-top:15px;
     margin-bottom:30px;
     background:#d7d7d7;
    color:#333;
     .tab-item{
       padding: 0 10px;
       line-height:40px;
       border-right:1px solid #fff; 
     }
     .tab-active{
       color:#fff;
       background:#679936;
     }
   }
   .header{
     margin-bottom:20px;
     .input-with-select{
       width:240px;
    }
   }

   .ncp-img{
     width:50px;
     height:50px;
     border-radius:50%;
   }
</style>



