/*地块负责人*/
<template>
   <div class="dkfzr">
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input placeholder="产品名称\商品条码"  @keyup.enter.native=search v-model.trim=ncpmc class="input-with-select f-vab"  size="small">
          </el-input> 
          <el-button type="primary" size="small" style="padding:5px 15px" @click=search><i class="el-icon-search f-fs20"></i></el-button>
          <el-checkbox v-model.trim=sfky class="f-ml20"  @change=search>不显示停用的农产品</el-checkbox>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click="$emit('edit')" round style="padding:9px 25px">新 增</el-button>
      </div>
    </div> 
     <s-table
        v-loading=loading
        class="table"
        ref='stable'
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
                sfky:false,
                ncpmc:'',
                //table参数
                tableHeader:[
                  {label:'产品图片',prop:'imgurl',"render-column":this.renderImg,width:'120'},
                  {label:'产品代码',prop:'ncpdm',"render-column":this.renderNcpdm,width:'130'},
                  {label:'产品名称',prop:'ncpmc'},
                  {label:'规格型号',prop:'ggxh'},
                  {label:'单位',prop:'dw',width:'100'},
                  {
                    label: '类型', prop: 'ncpdm', width: '100', 'render-column': (h, row) => {
                      if (row.ncpdm.length == 10) {
                        return "散货";
                      } else if (row.ncpdm.length == 12) {
                        return "成品";
                      }
                    }
                  },
                  {label:'商品条码',prop:'goodsCode'},
                  {
                    label: '保质期', prop: 'bzq', width: '100', 'render-column': (h, row) => {
                      if (row.bzqlx == 0) {
                        return '未设置';
                      } else {
                        let bzqlxList = {
                          '1': '年',
                          '2': '个月',
                          '3': '天',
                          '4': '小时',
                        }
                        return String(row.bzq) + bzqlxList[row.bzqlx];
                      }
                    }
                  },
                  //{label:'产品介绍',prop:'intRoduce'},
                  {
                    label: '产品分类', prop: 'zlmc', 'render-column': (h, row) => {
                      return String(row.zlmc) + '/' + row.ncpEjZlmc + '/' + row.ncpSjmc
                    }
                  },
                  {label: '状态', prop: 'sfky', width: '120', 'render-column': this.renderState},
                  {label: '启用', prop: 'sfky', width: '120', 'render-column': this.renderSfkyBtn},
                  {label: '操作', prop: 'sfky', width: '120', 'render-column': this.renderEdit}
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
        renderImg(h,row){
            var imgSrc=row.attaUrl.split(',')[0];
            if(imgSrc){
              return (<img class="logoImg"  src={imgSrc}></img>)
            }else{
              return  (<img class="logoImg"  src="./static/noimg.png"></img>)
            }
        },
         renderNcpdm(h,row){
           var ncpdm=row.ncpdm;
           if(ncpdm.length==12){
             return  ncpdm.substring(0,10)+"-"+ncpdm.substring(10,12);
           }else{
             return  ncpdm;
           }
         },
        renderState(h,row){
          return (<span class={row.sfky==1?'':'f-red'}>{row.sfky==1?'可用':'停用'}</span>)
        },
        renderSfkyBtn(h,row){
          return  h('el-switch',{
            attrs:{
              value:row.sfky==1?true:false,
              activeColor:"#090"
            },
            on:{
              change:(value)=>{
                let {ztncpId,sfky} = row;
                sfky=sfky==1?0:1;
                this.$fetch.api_base.cpwh_status({ztncpId,sfky}).then(res=>{
                    row.sfky = sfky;
                })
              }
            }
          })
        },

        renderEdit(h,row){
          return (
            <el-button size="mini" type="info" plain onClick={()=>{this.$emit('edit',row)}}>编辑</el-button>
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
          this.$refs.stable.getDataByPage();
        },
        getTableData(obj={}){
          this.loading = true;
          let {sfky,ncpmc} = this;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            ncpmc:ncpmc,
            zt:0,
            // type:'all'
          };
          if(sfky) params.sfky=1;
          //合并组件的pageSize 和 pageNo 参数
          Object.assign(params,obj);
          this.$fetch.api_base.cpwh_list(params).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData = data;
            this.totalCount = totalCount;
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
.table .logoImg{
       width:80px;
       height:80px;
       border-radius:5px;
   }
</style>

