<!--
 * @Author: 龚铱白
 * @Date: 2019-08-14 19:26:40
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-06 10:18:05
 * @Description: 
 -->
/*结算*/
<template>
  <el-form ref="form"
           :model="form"
           label-width="100px"
           class="form"
           :rules="rules"
           status-icon
           style="height:210px;">
    <el-form-item label="应收金额"
                  style="width:50%;float:left;">
      <label style="font-weight: bolder;">￥{{form.zje}}</label>
    </el-form-item>
    <el-form-item label="支付方式"
                  style="width:50%;float:left;">
      <el-select v-model="zffs"
                 placeholder="请选择">
        <el-option v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="结算金额"
                  style="width:50%;float:left;">
      <el-input v-model="jsje"
                placeholder="请输入"
                onkeyup="this.value=this.value.replace(/[^\d.]/g,'') "
                onafterpaste="this.value=this.value.replace(/[^\d.]/g,'') "></el-input>
    </el-form-item>
    <el-form-item label="实收金额"
                  style="width:50%;float:left;">
      <el-input v-model="ssje"
                placeholder="请输入"
                onkeyup="this.value=this.value.replace(/[^\d.]/g,'') "
                onafterpaste="this.value=this.value.replace(/[^\d.]/g,'') "
                class="ssjeinput"
                @keydown.enter.native="submitForm"></el-input>
    </el-form-item>
    <el-form-item label="找零"
                  style="width:50%;float:left;">
      <label style="font-weight: bolder;">￥{{(Number(ssje)-Number(jsje)).toFixed(2)}}</label>
    </el-form-item>
    <el-form-item style="width:50%;float:left;">
      <el-checkbox v-model="szChecked">赊账</el-checkbox>
      <el-checkbox v-model="xpChecked">打印小票</el-checkbox>
    </el-form-item>
    <el-form-item style="width:100%;float:left;">
      <el-button round
                 type="primary"
                 @click=submitForm
                 :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
      <el-button round
                 @click=closeForm>取 消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapGetters } from 'vuex'
import fetch from 'fetch/axios/'
export default {
  data () {
    return {
      options: [{
        value: 1,
        label: '现金'
      }, {
        value: 2,
        label: '支付宝'
      }, {
        value: 3,
        label: '微信'
      }, {
        value: 4,
        label: '银联支付'
      }, {
        value: 5,
        label: '聚合支付'
      },],
      szChecked: false,
      xpChecked: true,
      disabled: false,
      zffs: this.form.zffs,
      ssje: this.form.zje,
      rules: {
      }
    }
  },
  props: {
    form: {
      type: Object,
      default: function () {
        return {
        }
      }
    },
    jsje: '',
  },
  watch: {
    'jsje': function (newVal, oldVal) {
      this.jsje = newVal;
      this.ssje = newVal;
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  mounted: function () {
  },
  methods: {
    autofocus () {
      let input = document.querySelector('.ssjeinput input');
      input.focus();
      input.select();
    },
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //新增字段
          var hyid = this.form.hyId;
          var hymc = this.form.hymc;
          var lxdh = this.form.sjhm;
          var libIds = [];
          var saleNums = [];
          var salePrices = [];

          var saleAmounts = [];
          this.form.listDetail.forEach(item => {
            libIds.push(item.nzid);
            salePrices.push(item.salePrice);
            saleNums.push(item.saleNum);
            saleAmounts.push(Number(item.salePrice) * Number(item.saleNum));
          });
          var jszt = this.szChecked ? 2 : 1;
          var dyzt = this.xpChecked ? 1 : 2;

          fetch({
            url: '/nzsyLs/saveLsddb/',
            method: 'post',
            data: {
              id: this.form.id,
              lsdh: this.form.lsdh,
              qyid: this.userInfo.bizId,
              hyid: hyid,
              hymc: hymc,
              lxdh: lxdh,
              zffs: this.zffs,//默认现金
              zje: this.form.zje,
              jsje: this.jsje,
              libIds: libIds,
              salePrices: salePrices,
              saleNums: saleNums,
              saleAmounts: saleAmounts,
              zt: 2,//提交
              dyzt: dyzt,//打印小票 1 是 2否
              jzzt: jszt,//结算
              cjrid: this.userInfo.bizUserId,
              cjr: this.userInfo.yhxm,
            }
          })
            .then(res => {
              var resCode = res.resCode;
              if (resCode == "000000") {
                if (res.bean == 1) {
                  this.$message.success("结算成功");
                  this.szChecked = false;
                  this.xpChecked = false;
                  this.disabled = false;
                  this.$emit('savepayOrder');
                  this.$root.reload();
                } else {
                  this.$message.warning("库存不足");
                  this.disabled = false;
                  return false;
                }
              } else {
                this.$message.error(res.errorMess);
                this.disabled = false;
                return false;
              }
            }).catch(() => {
              this.loading = false;
            })
        } else {
          this.$message.error('请按要求填写')
          return false;
        }
      });
    },
    closeForm () {
      this.$emit("closeOrder");
    }
  }
}
</script>

