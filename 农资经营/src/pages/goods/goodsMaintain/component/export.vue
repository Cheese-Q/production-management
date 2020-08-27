<!--导出信息-->
<template>
  <div>
    <!-- 搜索头部 -->
    <div class="header f-df f-pr20">
      <div>
        <el-select v-model="zldm" size="small" class="f-vab f-mr20" style="width:150px;" placeholder="请选择类别">
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in zldms"
            :key="item.sjzdBm"
            :label="item.sjzdMc"
            :value="item.sjzdBm">
          </el-option>
        </el-select>
        <el-checkbox v-model="yestn" class="f-ml20" style="line-height: 32px;">过滤有条码的商品</el-checkbox>
      </div>
      <div class="f-f1 f-center">
        <el-button type="primary" size="medium" @click="dc()" round style="padding:9px 25px" :disabled="disabled">查询</el-button>
        <el-button type="primary" size="medium" v-print="'#pdfDom'" round style="padding:9px 25px">打印</el-button>
      </div>
    </div>

    <div class="row" id="pdfDom" style="margin-top: 20px;">
      <table border="1" id="tab">
        <tr>
          <td style="width:8%">类别</td>
          <td style="width:5%">排序</td>
          <td style="width:20%">商品名称</td>
          <td style="width:12%">规格</td>
          <td style="width:10%">单位</td>
          <td style="width:20%">生产企业</td>
          <td style="width:25%">条码SKU</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import fetch from 'fetch/axios/'
  import $ from 'jquery'
  import QRCode from 'qrcode'

  export default {
    data() {
      return {
        disabled:false,
        zldm: '',
        zldms: [],
        yestn: true,
        list: [],
        loading: false,
        htmlTitle: '商品信息',
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo',
      })
    },
    created() {
      this.getTypes('dalei');
    },
    mounted() {
    },
    methods: {
      //导出
      dc() {
        this.disabled=true;
        var resident_data = '<tr style=\' height: 120px;\'><td style="width:8%">类别</td><td style="width:5%">排序</td><td style="width:20%">商品名称</td><td style="width:12%">规格</td><td style="width:10%">单位</td>';
        resident_data += '<td style="width:20%">生产企业</td><td style="width:25%">条码SKU</td> </tr>';
        $("#tab").html(resident_data);
        this.loading = true;
        let {zldm, yestn} = this;
        yestn = yestn ? "2" : "1";
        let {bizId} = this.userInfo;
        var params = {
          bizId,
          agriProdType: zldm,
          lx: yestn
        };
        var query = {
          method: 'get',
          url: '/nzsyBizAgriLib/listAgriStandard/',
          data: params
        }
        fetch(query).then(res => {
          this.loading = false;
          for (var i = 0; i < res.list.length + 1; i++) {
            var bean = res.list[i];
            var agriProdCode = bean.agriProdCode;
            var agriProdName = bean.agriProdName;
            var return_data = " <tr style=' height: 120px;'><td>" + bean.sjzdMc + "</td><td>" + bean.szm + "</td><td>" +agriProdName + "</td><td>" + bean.model + "</td><td>"
              + bean.unit + "</td><td>" + bean.scdw + "</td>";
            if (agriProdCode != null && agriProdCode != '') {
              return_data += "<td><svg id=\"barCode" + agriProdCode + "\"></svg></td></tr>";//条码
              // return_data += "<td><canvas id=\"barCode" + agriProdCode + "\" class=\"qrcode\"></canvas><div style='margin-top: -5px'>"+agriProdName+"</div></td></tr>";//二维码
            } else {
              return_data += "<td></td></tr>";
            }
            if ((i+2) % 10 == 0) {
              var pageNo = parseInt((i+2) / 10);
              if(pageNo==1){
                return_data += "<tr style=' height: 47px; border-left: 1px solid white;border-right: 1px solid white;'><td colspan='7'>" + pageNo + "</td></tr>";
              }else{
                return_data += "<tr style=' height: 54px; border-left: 1px solid white;border-right: 1px solid white;'><td colspan='7'>" + pageNo + "</td></tr>";
              }
            }
            $("#tab").append(return_data);
            var JsBarcode = require('jsbarcode')
            if (agriProdCode != "" && agriProdCode != null) {

              // //二维码
              // var msg= document.getElementById("barCode" + agriProdCode);
              // // 将获取到的数据（val）画到msg（canvas）上
              // QRCode.toCanvas(msg, agriProdCode, function (error) {
              // })

              //条码
              if(agriProdName.length>16){
                agriProdName= agriProdName.substring(0,16);
              }
              JsBarcode("#barCode" + agriProdCode, agriProdCode, {
                format: "CODE128",//选择要使用的条形码类型               
                text: agriProdName,
                height: 55,
                width: 1.0,
                fontSize: 12,
                displayValue: true,//是否在条形码下方显示文字               
                textPosition: "bottom"//设置文本的垂直位置           
              })
              this.disabled=false;
            }
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      getTypes(typeText) {
        var params = {
          sjzdLxbm: 'TRPLX'
        }
        if (typeText === 'dalei') {
          params.hy = 1;
        } else {
          params.zldm = this.zldm;
        }
        this.$fetch.api_goods.get_sjzd(params).then(res => {
          this[typeText === 'dalei' ? 'zldms' : 'ejs'] = res.list;
        })
      }
    }
  }
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

  table {
    width: 100%;
    text-align: center;
    table-layout: fixed;
    word-break: break-all;
    word-wrap: break-word;
    border-collapse: collapse;
    width: 860px;
  }

  tr {
    height: 120px;
  }
</style>



