<!--
 * @Author: 龚铱白
 * @Date: 2019-08-14 19:26:40
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-08-14 19:26:40
 * @Description: 
 -->
/*商品信息*/
<template>
  <div class="dkfzr">
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <label>类型</label>
        <el-select
          v-model="zldm"
          size="small"
          placeholder="请选择"
          @change="getTableData"
          clearable
        >
          <el-option
            v-for="item in trpTypes"
            :key="item.sjzdBm"
            :label="item.sjzdMc"
            :value="item.sjzdBm"
          ></el-option>
        </el-select>
        <el-input
          placeholder="商品名称"
          @keyup.enter.native="getTableData"
          v-model="findName"
          class="input-with-select f-vab"
          size="small"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          style="padding:5px 15px"
          @click="getTableData"
        >
          <i class="el-icon-search f-fs20"></i>
        </el-button>
      </div>
    </div>
    <s-table
      v-loading="loading"
      class="table"
      ref="stable"
      element-loading-text="拼命加载中"
      :tableData="tableData"
      :totalCount="totalCount"
      :getData="getTableData"
      :tableHeader="tableHeader"
    ></s-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      findName: "",
      zldm: "",
      trpTypes: "",
      assetsURL: require("../../../../assets/images/icon-xzsp-nogoods.png"),
      //table参数
      tableHeader: [
        { label: "图片", width: "120", "render-column": this.imgPaths },
        { label: "农资大类", prop: "dlmc" },
        // {label:'农资小类',prop:'xlmc'},
        { label: "商品条码", prop: "nzbm" },
        { label: "商品名称", prop: "nzmc" },
        { label: "规格", prop: "gg" },
        { label: "生产单位", prop: "scdw" },
        { label: "库存", prop: "sl" },
        { label: "单位", prop: "dw" },
        { label: "副单位", prop: "fdw" },
        { label: "副单位数", prop: "fdwsl" },
        {
          label: "操作",
          prop: "hyzt",
          width: "100",
          "render-column": this.renderSelect
        }
      ],
      loading: false,
      totalCount: 1,
      tableData: []
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    this.getTableData();
    this.getTypes(); //获取类别
  },
  methods: {
    /*render-column开始*/
    imgPaths(h, row) {
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
    /*
     *获取table的数据
     *只需要修改 this.$fetch.api_goods.cpwh_list  请求api
     *params请求参数
     */
    search() {
      this.$refs.stable.pageNo = 1;
      this.getTableData();
    },
    getTableData(obj = {}) {
      this.loading = true;
      let { zldm } = this;
      let params = {
        bizId: this.userInfo.bizId,
        key: this.findName,
        nzdl: zldm,
        pageNo: this.currentPage
      };
      //合并组件的pageSize 和 pageNo 参数
      Object.assign(params, obj);
      this.$fetch.api_stock
        .ckgl_kclist(params)
        .then(res => {
          let { data, pageNo, totalCount } = res.list;
          this.tableData = data;
          this.totalCount = totalCount;
          this.currentPage = pageNo;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getTypes() {
      var params = {
        sjzdLxbm: "TRPLX"
      };
      this.$fetch.api_goods.get_sjzd(params).then(res => {
        this.trpTypes = res.list;
      });
    },
    //  查询单条信息
    renderSelect(h, row) {
      return (
        <el-button
          size="mini"
          class="edit"
          onClick={() => this.$emit("select", row)}
        >
          查看明细
        </el-button>
      );
    },
    renderEdits(h, row) {
      return (
        <el-button
          size="mini"
          class="edit"
          onClick={() => {
            this.$emit("edit", row);
          }}
        >
          编辑
        </el-button>
      );
    },

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


