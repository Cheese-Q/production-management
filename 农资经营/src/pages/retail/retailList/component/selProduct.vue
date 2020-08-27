<!--
 * @Description: 5658 【零售】-【零售单】新增选择商品页面生产单位过长时页面样式需要调整
 * @Author: your name
 * @Date: 2019-07-30 09:05:09
 * @LastEditTime: 2019-08-08 16:48:14
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="dkfzr"
       style="padding-bottom:70px;min-height:470px;">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>类别</label>
        <el-select v-model="zldm"
                   size="small"
                   placeholder="请选择"
                   @change=getTableData
                   clearable>
          <el-option v-for="item in trpTypes"
                     :key="item.sjzdBm"
                     :label="item.sjzdMc"
                     :value="item.sjzdBm">
          </el-option>
        </el-select>
        <el-input placeholder="商品名称"
                  @keyup.enter.native=search
                  v-model.trim=findName
                  class="input-with-select f-vab"
                  size="small">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="padding:5px 15px"
                   @click=search><i class="el-icon-search f-fs20"></i></el-button>
      </div>
    </div>
    <s-table v-loading=loading
             class="table"
             ref='stable'
             element-loading-text="拼命加载中"
             :tableData=tableData
             :totalCount=totalCount
             :getData=getTableData
             :tableHeader=tableHeader></s-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      findName: "",
      zldm: "",
      trpTypes: "",
      assetsURL: require("../../../../assets/images/icon-xzsp-nogoods.png"),
      //table参数
      tableHeader: [
        {
          label: "图片",
          width: "100",
          "render-column": this.render
        },
        { label: "商品名称", prop: "nzmc", },
        { label: "商品条码", prop: "codes" },
        // { label: "农资大类", prop: "dlmc" },
        { label: "规格型号", prop: "gg" },
        { label: "单位", prop: "dw" },
        { label: "库存数量", prop: "sl" },
        { label: "生产单位", prop: "scdw", },
        { label: "操作", prop: "sfky", fixed: 'right', "render-column": this.renderEdit },
      ],
      loading: false,
      totalCount: 1,
      tableData: []
    };
  },
  props: {
    hyId: {
      type: [String, Number],
      default: ""
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created () {
    this.getTableData();
    this.getTypes();
    console.log(this.hyId);
  },
  methods: {
    render (h, row) {
      if (row.tp != null) {
        let arr = row.tp.split(",");
        if (arr instanceof Array == true) {
          //为数组
          return h("img", {
            attrs: {
              src: arr[0],
              width: 70,
              height: 70
            }
          });
        } else {
          return h("img", {
            attrs: {
              src: row.tp,
              width: 70,
              height: 70
            }
          });
        }
      } else {
        return h("img", {
          attrs: {
            src: this.assetsURL,
            width: 70,
            height: 70
          }
        });
      }
    },
    /*render-column开始*/

    renderEdit (h, row) {
      return (
        <el-button
          size="mini"
          class="edit"
          onClick={() => {
            this.$emit("selProduct", row);
          }}
        >
          选 择
        </el-button>
      );
    },
    /*render-column结束*/

    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_base.  请求api
     *params请求参数
     */
    search () {
      this.$refs.stable.pageNo = 1;
      this.getTableData();
    },
    getTableData (obj = {}) {
      this.loading = true;
      let params = {
        bizId: this.userInfo.bizId,
        key: this.findName,
        nzdl: this.zldm,
        hyId: this.hyId,
        slzt: 1 //数量状态0全部 1有库存，2无库存
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_stock
        .ckgl_kclist(params)
        .then(res => {
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getTypes () {
      var params = {
        sjzdLxbm: "TRPLX"
      };
      this.$fetch.api_goods.get_sjzd(params).then(res => {
        this.trpTypes = res.list;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 240px;
}
.ncp-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
<style scoped>
/* .table .el-button:hover{
  background:#ecf5ff;
  color:#60acff;
  border:1px solid #60acff;
} */
.table .logoImg {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}

.cell:nth-child(7) {
  width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>

