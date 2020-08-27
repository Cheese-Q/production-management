/*投入品维护*/
<template>
   <div>
     <!-- tab2 -->
       <!-- 搜索头部 -->
        <div class="header f-df f-pr20">
          <div>
              <label>挂码日期</label>
             <date-picker @selChange="(val)=>{query2.selDateRange=val}" style="vertical-align:bottom"></date-picker> 

              <label>挂码类型</label>
              <el-select  v-model.trim="query2.lx" size="small" class=" f-mr20 f-vab" placeholder="请选择" style="vertical-align:bottom"  @change=search2>
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="成品挂码"></el-option>
                <el-option value="2" label="原材料挂码"></el-option>
            </el-select>
              <el-input  placeholder="请输入包装产品名称"  @keyup.enter.native=search2 v-model.trim=query2.searchKey style="vertical-align:bottom" class="input-with-select f-vab"  size="small">
              </el-input> 
              <el-button type="primary" size="small" style="padding:5px 15px" @click=search2><i class="el-icon-search f-fs20"></i></el-button>
          </div>
          <div class="f-f1 f-tar">
            <el-button type="primary" size="medium" @click="$emit('csedit',{})" round style="padding:9px 25px">新 增</el-button>
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
                  lx:'',
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
                  {label:'挂码日期',prop:'gmrq',width:120},
                  {label:'产品名称',prop:'hcNcpmc'},
                  {label:'开始码',prop:'codeStart'},
                  {label:'结束码',prop:'codeEnd'},
                  {label:'挂码数（枚）',prop:'codeTotalNum'},
                  {label:'批次号',prop:'zzpc','width':235,'render-column':(h,row)=>{
                    if(row.gmlx==1){
                      return String(row.zzpc)+'-'+row.remark;
                    }else{
                      return row.zzpc;
                    }
                  }},
                  {label:'类型',prop:'gmlx',formatter(val){return val==1?'成品挂码':'原材料挂码'}},
                  {label:'备注',prop:'bz'},
                  {label:'操作',prop:'sfky','render-column':this.renderCsEdit}
                ],
                loading2:false,
                totalCount2:1,
                tableData2: [],
            }
        },
        computed:{
          ...mapGetters({
              userInfo:'getUserInfo',
          })
        },  
        created(){
          setTimeout(()=>{
              this.getTableData2();
          },100)
          
          this.getTypes();  //获取类别
        },
       methods:{
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
        renderTrpEdit(h,row){
          return (
            <div>
                <el-button size="mini" type="info" plain  onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>              
            </div>
          )
        },
        renderCsEdit(h,row){
          return (
            <el-button size="mini" type="info" plain onClick={()=>{this.$emit('csedit',row)}}>编辑</el-button>
          )
        },
       /*render-column结束*/
      search2(){
         this.$refs.table2.pageNo = 1;
         this.getTableData2();
       },
        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_base.dkfzr_list  请求api
        *params请求参数
        */
        getTableData2(obj={}){
          this.loading2 = true;
          let {lx,searchKey,selDateRange} = this.query2;
          let {scjyztId} =  this.userInfo;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            lx,
            searchKey,
            startDate:selDateRange?selDateRange[0]:'',
            endDate:selDateRange?selDateRange[1]:'',
          };
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          fetch({
            url:'/Bzgm/wl/pageHungCode/',
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



