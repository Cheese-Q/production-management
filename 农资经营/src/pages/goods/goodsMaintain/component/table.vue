<!--
 * @Author: 龚铱白
 * @Date: 2019-08-14 19:26:40
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-17 10:36:22
 * @Description: 
 -->
/*商品信息*/
<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
         <label>类型</label>
         <el-select v-model="zldm" size="small"  @change=getTableData clearable>
           <el-option value="" label="全部" ></el-option>
           <el-option
             v-for="item in trpTypes"
             :key="item.sjzdBm"
             :label="item.sjzdMc"
             :value="item.sjzdBm">
           </el-option>
         </el-select>
          <el-input placeholder="商品名称" @keyup.enter.native=getTableData v-model=findName class="input-with-select f-vab"  size="small">
          </el-input>
          <el-button type="primary" size="small" style="padding:5px 15px" @click=getTableData><i class="el-icon-search f-fs20"></i></el-button>
          <el-checkbox v-model=delFlag class="f-ml20"  @change=getTableData>不显示停用的商品</el-checkbox>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="$emit('edit',{})" round style="padding:9px 25px">提 取</el-button>
        <el-button type="primary" size="medium" @click="$emit('daochu',{})" round style="padding:9px 25px">导出</el-button>
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
     >

     </s-table>
   </div>
</template>

<script>
	  import { mapGetters } from 'vuex'
    export default {
        data(){
            return {
                delFlag:false,
                findName:'',
                zldm:'',
                trpTypes:'',
                assetsURL: require('../../../../assets/images/icon-xzsp-nogoods.png'),
                //table参数
                tableHeader:[
                  {label:'商品图片',width:'100','render-column':this.imgPaths},
                  {label:'商品名称',prop:'agriProdName'},
                  {label:'规格型号',prop:'model'},
                  {label:'单位',prop:'unit'},
                  {label:'助记码',prop:'sptm'},
                  {label:'生产单位',prop:'scdw'},
                  {label:'零售价',prop:'lsj'},
                  {label:'状态',prop:'delFlag',width:'100','render-column':this.renderState},
                  {label:'启用',prop:'delFlag',width:'100','render-column':this.renderDelFlagBtn},
                  {label:'操作',prop:'delFlag',width:'100','render-column':this.renderEdit}
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
          this.getTypes();  //获取类别
        },
       methods:{
       /*render-column开始*/
         imgPaths(h,row){

           if(row.imgPaths != null){
             let arr = row.imgPaths.split(',');
             if(arr instanceof Array == true){//为数组
               return h('img',{
                 attrs:{
                   src:arr[0],
                   width:70,
                   height:70,
                 },

               })
             }else{
               return h('img',{
                 attrs:{
                   src:row.imgPaths,
                   width:70,
                   height:70,
                 },

               })
             }
           }else{
             return h('img',{
               attrs:{
                 src:this.assetsURL,
                 width:70,
                 height:70,
               },

             })
           }

         },
         renderState(h,row){
           return (<span class={row.delFlag==1?'':'f-red'}>{row.delFlag==1?'可用':'停用'}</span>)
         },
         renderDelFlagBtn(h,row){
           return  h('el-switch',{
             attrs:{
               value:row.delFlag==1?true:false
             },
             on:{
               change:(value)=>{
                 let delFlag= row.delFlag;
                 delFlag=delFlag==1?2:1;
                 const id = row.id;
                 this.$fetch.api_goods.spwh_updatestatus({id,delFlag}).then(res=>{
                   row.delFlag = delFlag;
                 })
               }
             }
           })
         },
        renderEdit(h,row){
          return (
            <el-button size="mini" class="edit" onClick={()=>{this.$emit('editTrp',row)}}>编辑</el-button>
          )
        },
       /*render-column结束*/

        /*
        *获取table的数据
        *只需要修改 this.$fetch.api_goods.cpwh_list  请求api
        *params请求参数
        */
        search(){
          this.$refs.stable.pageNo=1;
          this.getTableData();
        },
        getTableData(obj={}){
          this.loading = true;
          let {bizId,delFlag,zldm,searchKey} = this;
          let params = {
            bizId:this.userInfo.bizId,
            key:this.findName,
            sjzdBm:zldm,
            pageNo:this.currentPage
          };
          if(obj==true||obj==false){
            obj={
              pageSize:this.$refs.stable.pageSize
            }
          }
          if(delFlag)params.delFlag=1;
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_goods.spwh_list(params).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData = data;
            this.totalCount = totalCount;
            this.currentPage = pageNo;
            this.loading = false;
          }).catch(()=>{
            this.loading = false;
          })
        },
        getTypes(){
           var params = {
             sjzdLxbm:'TRPLX',
           }
           this.$fetch.api_goods.get_sjzd(params).then(res=>{
             this.trpTypes = res.list;
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
  .cell-img{
    width: 150px !important;
    height: 150px !important;
  }
</style>


