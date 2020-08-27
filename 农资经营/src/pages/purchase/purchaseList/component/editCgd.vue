<template>
  <div style="padding-bottom:70px;min-height:522px;">
    <div class="header f-df f-pr20">
      <div>
        录单时间 ：
        <el-date-picker
          v-model="searchDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="height: 32px;"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-input placeholder="请输入单位名称\联系人\电话" style="vertical-align:bottom;width: 250px;"  @keyup.enter.native=search v-model=findName class="input-with-select"  size="small">
        </el-input>
        <el-button type="primary" size="small"  style="padding:5px 15px;" @click=search><i class="el-icon-search f-fs20"></i></el-button>
      </div>
    </div>

    <s-table
      v-loading=loading
      class="table"
      ref="stable"
      :element-loading-text="hasSel?'提取中':'拼命加载中'"
      :tableData=tableData
      :totalCount=totalCount
      :getData=getTableData
      :tableHeader=tableHeader></s-table>


    <el-dialog
      title="采购单提取"
      :append-to-body="true"
      :visible.sync="isAdd"
      width="1000px">
      <extract style="margin:0 auto;" v-if="isAdd" :id="this.id"  @closeForm=closeForm></extract>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import fetch from 'fetch/axios/'
  import { dateformat } from 'common/tools'
  import extract  from './extract.vue';
  export default {
    components:{
      extract
    },
    data(){
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        hasSel:false,
        findName:'',
        searchDate:'',
        tableHeader:[
          {label:'进货日期',prop:'saleDate'},
          {label:'单据编号',prop:'saleSno'},
          {label:'供应商单位',prop:'cusName'},
          {label:'订单总金额',prop:'zhjze'},
          {label:'操作',width:'120','render-column':(h,row)=>{
              return (
                <el-button size="mini" class="edit"  onClick={this.funSelect.bind(this,row)}>选择</el-button>
              )
          }}
        ],
        loading:false,
        totalCount:1,
        tableData: [],
        isAdd:false,
        id:''
      }
    },
    computed:{
      ...mapGetters({
        userInfo:'getUserInfo',
      })
    },
    created(){
      const  start =dateformat.getFirstDayOfYear(new Date());
      const  end =dateformat.timeFormat(new Date());
      this.searchDate = [start,end];
      this.getTableData();
    },
    methods:{
      getTableData(){
        // this.loading = true;
        const searchDate = this.searchDate;
        fetch({
          url:'/nzsySale/pageSaleInfoForCusterm/',
          method:'get',
          data:{
            key:this.findName,
            startDate:searchDate[0],
            endDate:searchDate[1],
            bizId:this.userInfo.bizId
          }
        }).then(res=>{
          this.tableData = res.list.data;
        }).catch(()=>{
          this.loading = false;
        })

      },
      // //提取农产品
      funSelect(row){
        this.hasSel = true;
        this.isAdd=true;
        console.log(JSON.stringify(row));
        this.id = row.id;
      },
      search(){
        this.$refs.stable.pageNo = 1;
        this.getTableData();
      },
      // closeForm(isRefresh){
      //   this.isAdd = !this.isAdd;
      //   if(isRefresh){
      //     //更新table的数据
      //     this.getTableData();
      //   }
      // },
      closeForm(isRefresh = true) {
        this.$emit("close", isRefresh);
      }


    },
  }
</script>

<style scoped>

</style>
