/*地块负责人*/
<template>
   <div>
     <!-- 搜索头部 -->
     <div class="header f-df f-pr20">
       <div>
          <el-input style="vertical-align:bottom" placeholder="请输入地块名称" @keyup.enter.native=search v-model.trim=positCode class="input-with-select"  size="small">
          </el-input> 
          <el-button type="primary" size="small" @click=search style="padding:5px 15px"><i class="el-icon-search f-fs20"></i></el-button>
          <el-checkbox v-model.trim=sfky class="f-ml20"  @change=search>不显示停用的地块信息</el-checkbox>
       </div>
      <div class="f-f1 f-tar">
        <el-button type="primary" size="medium" @click=editRow round style="padding:9px 25px">新 增</el-button>
      </div>
    </div> 
    <!-- 列表 -->
    <div class="f-mt20">
      <el-table   
       class="table"    
      :data="tableData"
      ref="stable"
      v-loading="loading"
      element-loading-text="拼命加载中"
      style="width: 100%">
      <el-table-column
        prop="csmc"
        label="地块名称（场所名称/水塘名称）">
      </el-table-column>
      <el-table-column
        prop="cslxmc"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="fzr"
        label="负责人">
      </el-table-column>
      <el-table-column
        prop="mj"
        label="面积（亩）">
      </el-table-column>
      <el-table-column
        prop="sfky"
        label="状态">
        <template slot-scope="scope">
          <span v-text="scope.row.sfky==1?'可用':'停用'" :class="scope.row.sfky==1?'':'f-red'"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sfky"
        label="启用">
        <template slot-scope="scope">
            <el-switch
               active-color="#090"
               @change="stateChange(scope.$index)"
               v-model.trim="scope.row.sfky==1?true:false">
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="操作">
      <template slot-scope="scope">
        <el-button  size="mini" type="info" plain @click="editRow(scope.row)">编 辑</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="prevChange(-1)"
            @next-click="prevChange(1)"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
     </el-pagination>
    </div> 
   </div>
</template>

<script>
	  import { mapGetters } from 'vuex'
    export default {
        data(){
            return {
                sfky:false,
                positCode:'',
                pageNo:1,
                pageSize:10,
                totalCount:1,
                tableData: [],
                loading:false
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
         //编辑
         editRow(row={}){
             this.$emit('edit',row)
         },
         //状态是否可用
         stateChange(index){
           let currentItem = this.tableData[index];
           let {sccsId,sfky} = currentItem;
           //修改当前的状态
           sfky=sfky==1? 0:1;
           this.$fetch.api_base.dk_status({sccsId,sfky}).then(res=>{
              currentItem.sfky = sfky;
          })
         },
         search(){
           this.pageNo=1;
           this.getTableData();
         },
        //获取table的数据
        getTableData(obj={}){
          this.loading = true;
          let {sfky,positCode,pageNo,pageSize} = this;
          let params = {
            scjyztId:this.userInfo.scjyztId,
            positCode,
            pageNo,
            pageSize
          };
          if(sfky) params.sfky=1;
          this.$fetch.api_base.dk_list(params).then(res=>{
            let {data,pageNo,totalCount} = res.list;
            this.tableData = data;
            this.totalCount = totalCount;
            this.pageNo = pageNo;
            this.loading = false;
          }).catch(()=>{
            this.loading = false;
          })
        },
        //分页条的方法
        handleSizeChange(idx){
          this.pageSize = idx || 10;
          this.pageNo=1;
          this.getTableData();
        },
        handleCurrentChange(idx){
          this.pageNo=idx;
          this.getTableData()
        },
        prevChange(isPrev){
          if(isPrev>0){
            this.pageNo=this.pageNo+1;
          }else{
            this.pageNo=this.pageNo-1;
          }
          this.getTableData()
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

