<template>
  <div>
    <div v-if="!isEditOperate">
      <div class="farm-record">
        <!-- 批次信息 -->
        <!--<div class="subtitle">批次信息</div>-->
        <pc-info :form="form"></pc-info>
        <div class="subtitle f-mt10" v-if="form.zt==1 && page==='farm'">日常操作</div>
        <!-- <div class="farm-operate">
          <el-button @click="operate('sf',{})">喂 料</el-button>
          <el-button @click="operate('fz',{})">用 药</el-button>
          <el-button @click="operate('my',{})">免 疫</el-button>
          <el-button @click="operate('zs',{})">转 舍</el-button>
          <el-button @click="operate('tp',{})">调 批</el-button>
          <el-button @click="operate('sw',{})">死 亡</el-button>
          <el-button @click="operate('cs',{})">出 栏</el-button>
        </div> -->
        <div class="f-df "  v-if="form.zt==1 && page==='farm'">
        <div class="base-operate f-cp" @click="operate(item.operate,{})" v-for="(item,index) in operations" :key="index">
          <div class="f-fs20"> <img :src="`./static/xm/p${index+1}.png`" alt="">{{item.title}}</div>
        </div>
      </div>
        <div class="subtitle f-mt10">养殖档案</div>
        <div class="tabs">
<!--          <div @click="changeTab(1)" :class="[curTab==1?'tab-active':'']">时间轴</div>-->
          <div @click="changeTab(2)" :class="[curTab==2?'tab-active':'']">档案详情</div>
        </div>
        <div v-show="curTab==1">
          <timeline></timeline>
        </div>
        <div v-show="curTab==2" class="table-container">
          <sf-table @operate="operate" ref="sf">喂料记录</sf-table>
          <fz-table @operate="operate" ref="fz">用药记录</fz-table>
          <my-table @operate="operate" ref="my">免疫记录</my-table>
          <zs-table @operate="operate" ref="zs">转舍记录</zs-table>
          <tp-table @operate="operate" ref="tp">调批记录</tp-table>
          <sw-table @operate="operate" ref="sw">死亡记录</sw-table>
          <cs-table @operate="operate" ref="cs">出栏记录</cs-table>
        </div>
      </div>
    </div>
    <div v-if="isEditOperate">
      <operate-farm
        :edittype="edittype"
        :form="operateRow"
        @closeForm="closeForm"
      ></operate-farm>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
//引入页面的组件
import pcInfo from "./components/pcInfo";
import operateFarm from "./operateForm/index.vue";

import sfTable from "./pcTable/sfTable.vue";
import fzTable from "./pcTable/fzTable.vue";
import zsTable from "./pcTable/zsTable.vue";
import tpTable from "./pcTable/tpTable.vue";
import swTable from "./pcTable/swTable.vue";
import myTable from "./pcTable/myTable.vue";
import csTable from "./pcTable/csTable.vue";

import timeline from "./components/timeline.vue";

export default {
  //将批次号注入所有子组件
  provide() {
    return {
      zzpc: this.form.zzpc,
      pcInfo: this.form,
      checkRow:this.checkRow,
      pageName:this.page
    };
  },
  components: {
    pcInfo,
    operateFarm,
    sfTable,
    fzTable,
    csTable,
    tpTable,
    zsTable,
    swTable,
    myTable,
    timeline
  },
  data() {
    return {
            operations: [
        { title: "喂 料", operate:'sf'},
        { title: "用 药", operate:'fz'},
        { title: "免 疫", operate:'my'},
        { title: "转 舍", operate:'zs'},
        { title: "调 批", operate:'tp'},
        { title: "死 亡", operate:'sw'},
        { title: "出 栏", operate:'cs'},
      ],
      curTab: 2,
      edittype: "sf",
      isEditOperate: false,
      operateRow: {}
    };
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {};
      }
  },
    checkRow:{
      type: Object,
      default: function() {
        return {};
      }
        },
      page:{
      type:String,
      default:''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  methods: {
    operate(info, row = {}) {
      this.edittype = info;
      if (JSON.stringify(row) != "{}") {
        var imglists = []; row.attaUrl ? row.attaUrl.split(",") : [];
        if(row.attaUrl){
          imglists =row.attaUrl.split(",");
        }else if(row.imagesUrl){
          imglists =row.imagesUrl.split(",");
        }
        imglists.forEach((item, index) => {
          imglists[index] = { name: index + ".jpg", url: item };
        });
        row.imglists = imglists;
      }
      this.operateRow = row;
      this.isEditOperate = true;
    },
    closeForm(){
      this.isEditOperate=!this.isEditOperate;
    },
    changeTab(val) {
      this.curTab = val;
    }
  }
};
</script>
<style scoped lang="scss">
.subtitle {
  height:35px;
  margin:20px 0 20px 0;
  line-height:35px;
  font-size:18px;
  color:#fff;
  padding:0 20px;
  display:inline-block;
  background:#417f04;
  border-top-right-radius: 18px;
}
.base-operate{
  border-radius:10px;
  height: 80px;
  line-height: 80px;
  width:170px;
  margin-right:20px;
  color:#fff;
  text-align:center;
  font-size:20px;
  background: #a9cd06;
  img{
    vertical-align:middle;
    width:35px;
    margin-right:5px;
  }
}
.farm-operate button {
  padding-right: 20px;
  padding-left: 20px;
}
.tabs {
  width: 150px;
  /*width: 300px;*/
  display: flex;
  background: aliceblue;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  & > div {
    flex: 1;
  }
  .tab-active {
    background: #679936;
    color: #fff;
  }
}
</style>
