<template>
  <div>
    <div v-if="!isEditOperate">
      <div class="farm-record">
        <!-- 批次信息 -->
        <!-- <div class="subtitle">批次信息</div>-->
        <pc-info :form="form"></pc-info>
        <div class="subtitle f-mt10" v-if="form.zt==1 && page==='farm'">日常操作</div>
        <!-- <div class="farm-operate">
          <el-button @click="operate('gd',{})">耕 地</el-button>
          <el-button @click="operate('sf',{})">施 肥</el-button>
          <el-button @click="operate('fz',{})">病虫害</el-button>
          <el-button @click="operate('xj',{})">修 剪</el-button>
          <el-button @click="operate('gg',{})">灌 溉</el-button>
		  <el-button @click="operate('gl',{})">田间管理</el-button>
          <el-button @click="operate('cs',{})">采 收</el-button>
        </div> -->
        <div class="f-df "  v-if="form.zt==1 && page==='farm'">
        <div class="base-operate f-cp" @click="operate(item.operate,{})" v-for="(item,index) in operations" :key="index">
          <div class="f-fs20"> <img :src="`./static/zzy/p${index+1}.png`" alt="">{{item.title}}</div>
        </div>
      </div>
        <div class="subtitle f-mt10">田间档案</div>
        <div class="tabs">
<!--          <div @click="changeTab(1)" :class="[curTab==1?'tab-active':'']">时间轴</div>-->
          <div @click="changeTab(2)" :class="[curTab==2?'tab-active':'']">档案详情</div>
        </div>
        <div v-show="curTab==1">
          <timeline></timeline>
        </div>
        <div v-show="curTab==2" class="table-container">
          <gd-table @operate="operate" ref="gd">耕地记录</gd-table>
          <sf-table @operate="operate" ref="sf">施肥记录</sf-table>
          <fz-table @operate="operate" ref="fz">病虫害防治记录</fz-table>
          <xj-table @operate="operate" ref="xj">修 剪</xj-table>
          <gg-table @operate="operate" ref="gg">灌 溉</gg-table>
		  <gl-table @operate="operate" ref="gl">田间管理</gl-table>
          <cs-table @operate="operate" ref="cs">采 收</cs-table>
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
import csTable from "./pcTable/csTable.vue";
import gdTable from "./pcTable/gdTable.vue";
import xjTable from "./pcTable/xjTable.vue";
import ggTable from "./pcTable/ggTable.vue";
import glTable from "./pcTable/glTable.vue";

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
    gdTable,
    xjTable,
    ggTable,
	glTable,
    timeline,
  },
  data() {
    return {
      operations: [
        { title: "耕 地", operate:'gd'},
        { title: "施 肥", operate:'sf'},
        { title: "病虫害", operate:'fz'},
        { title: "修 剪", operate:'xj'},
        { title: "灌 溉", operate:'gg'},
        { title: "田间管理", operate:'gl'},
        { title: "采 收", operate:'cs'},
      ],
      curTab: 2,
      edittype: "gd",
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
