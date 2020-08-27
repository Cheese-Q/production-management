<!--
 * @Author: 龚铱白
 * @Date: 2019-08-15 10:05:25
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-02 17:19:40
 * @Description: 
 -->
/*编辑*/
<template>
  <el-form ref="form"
           :model="form"
           label-width="100px"
           class="form"
           :rules="rules"
           status-icon>
    <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}供应商信息</div>
    <el-form-item label="单位名称"
                  prop="bizName">
      <el-input v-model="form.bizName"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="类型"
                  prop="bizType">
      <el-select v-model="form.bizType"
                 size="small"
                 class="f-vab f-mr20"
                 style="width:100%;"
                 placeholder="请选择">
        <el-option v-for="item in khtype"
                   :key="item.key"
                   :label="item.value"
                   :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>

    <!-- <el-form-item label="类别"
                  prop="supplierType">
      <el-select v-model="form.supplierType"
                 size="small"
                 class="f-vab f-mr20"
                 style="width:100%;"
                 placeholder="请选择">
        <el-option v-for="item in gystype"
                   :key="item.key"
                   :label="item.value"
                   :value="item.key">
        </el-option>
      </el-select>
    </el-form-item> -->

    <el-form-item label="价格级别"
                  prop="jgjb">
      <el-select v-model="form.jgjb"
                 @change="changeJgjb()"
                 size="small"
                 class="f-vab f-mr20"
                 style="width:100%;"
                 placeholder="请选择">
        <el-option v-for="item in jbList"
                   :key="item.key"
                   :label="item.value"
                   :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="社会统一代码/身份证"
                  prop="icCreditCode">
      <el-input v-model="form.icCreditCode"
                placeholder="请输入社会统一代码/身份证"></el-input>
    </el-form-item>
    <el-form-item label="联系人"
                  prop="contPerson">
      <el-input v-model="form.contPerson"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="联系电话"
                  prop="contNumber">
      <el-input v-model="form.contNumber"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="供应商地址">
      <el-select v-model="bizProvince"
                 @change="bizCity='';getTypes('sj')"
                 prop="bizProvince"
                 placeholder="省级地区"
                 style="width: 24%;">
        <el-option v-for="item in province"
                   :key="item.qyId"
                   :label="item.qymc"
                   :value="item.qydm">
        </el-option>
      </el-select>
      <el-select v-model="bizCity"
                 @change="bizCounty='';getTypes('xj')"
                 prop="bizCity"
                 placeholder="市级地区"
                 style="width: 24%;">
        <el-option v-for="item in city"
                   :key="item.qyId"
                   :label="item.qymc"
                   :value="item.qydm">
        </el-option>
      </el-select>
      <el-select v-model="bizCounty"
                 @change="bizTown='';getTypes('xxj')"
                 prop="bizCounty"
                 placeholder="县级地区"
                 style="width: 24%;">
        <el-option v-for="item in county"
                   :key="item.qyId"
                   :label="item.qymc"
                   :value="item.qydm">
        </el-option>
      </el-select>
      <el-select v-model="bizTown"
                 prop="bizTown"
                 placeholder="乡级地区"
                 style="width: 24%;"
                 @change="checkaddress">
        <el-option v-for="item in town"
                   :key="item.qyId"
                   :label="item.qymc"
                   :value="item.qydm">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="bizAddress">
      <el-input v-model="form.bizAddress"
                placeholder="请输入详细地址"></el-input>
    </el-form-item>

    <el-form-item label="备注">
      <el-input type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                v-model="form.comment"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
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
import { exec } from 'common/tools'

export default {
  data () {

    const commonValidate = { required: true, message: '必填项', trigger: 'blur' }
    const checkPhone = { validator: exec.checkPhone, trigger: 'blur' }

    return {
      disabled: false,
      bizProvince: '',
      bizCity: '',
      bizCounty: '',
      bizTown: '',
      province: [],
      city: [],
      county: [],
      town: [],
      delFlag: 1,
      info: '',
      id: 0,
      check: false,
      jbList: [ { key: 2, value: '零售价' }, { key: 1, value: '批发价' },{ key: 3, value: '代理价' }],
      khtype: [ { key: '2', value: '供应商' }, { key: '3', value: '客户和供应商' }],
      gystype: [{ key: '1', value: '生产商' }, { key: '2', value: '经销商' }, { key: '3', value: '门店' }, { key: '4', value: '农业企业' }, { key: '5', value: '农户' }],
      rules: {
        jgjb: commonValidate,
        bizName: [commonValidate],
        bizType: [commonValidate],
        supplierType: [commonValidate]
      }
    }
  },
  props: {
    form: {
      type: Object,
      default: function () {
        return {
          bizName: '',
          contPerson: '',
          contNumber: '',
          icCreditCode: '',
          bizType: '',
          supplierType: '',
          comment: '',
          jgjb: "", // 价格级别
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created () {
    this.check = false;
    this.getinfo();
    this.getTypes('ssj');
  },
  methods: {
    checkaddress () {
      this.check = true;
    },
    getinfo () {
      var params = {
        id: this.form.id,
      };
      this.$fetch.api_purchase.wldw_getBizAgriLib(params).then(res => {
        this.check = true;
        this.info = res.bean;
        this.bizProvince = this.info.bizProvince;
        this.bizCity = this.info.bizCity;
        this.bizCounty = this.info.bizCounty;
        this.bizTown = this.info.bizTown;
        this.form.jgjb = this.info.jgjb;
        if (this.bizProvince != '') {
          this.getTypes('sj');
        }
        if (this.bizCity != '') {
          this.getTypes('xj');
        }
        if (this.bizCounty != '') {
          this.getTypes('xz');
        }
      }).catch(res => {
      })
    },
    changeJgjb() {
      let lists = this.jbList;
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].key == this.form.jgjb) {
          this.form.jgjb = lists[i].key;
        }
      }
      console.log(this.form.jgjb)
    },
    getTypes (typeText) {
      let params = {};
      if (typeText === 'ssj') {
        params.len = 2;
      } else if (typeText === 'sj') {
        params.len = 4;
        params.areaCode = this.bizProvince;
      } else if (typeText === 'xj') {
        params.len = 6;
        params.areaCode = this.bizCity;
      } else {
        params.len = 9;
        params.areaCode = this.bizCounty;
      }
      this.$fetch.api_purchase.wldw_slistQybNew(params).then(res => {
        if (typeText === 'ssj') {
          this.province = res.list;
        } else if (typeText === 'sj') {
          this.city = res.list;
        } else if (typeText === 'xj') {
          this.county = res.list;
        } else {
          this.town = res.list;
        }
      })
    },
    submitForm () {
      // if (!this.check) {
      //   this.$message.error('请选择完整地址')
      //   return false;
      // }
      this.$refs.form.validate((valid) => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //新增字段
          let { bizName, bizType, supplierType, icCreditCode, contPerson, contNumber, comment, bizAddress, jgjb} = this.form;
          //用户参数
          let bizId = this.userInfo.bizId;
          let bizProvince = this.bizProvince;
          let bizCity = this.bizCity;
          let bizCounty = this.bizCounty;
          let bizTown = this.bizTown;
          let delFlag = 1;
          let createUserId = this.userInfo.bizUserId;
          let id = this.id;
          if (this.form.id == null || this.form.id == '' || this.form.id == undefined) {
            id = this.id;
          } else {
            id = this.form.id;
          }
          //传值参数
          let params = { id, bizName, bizAddress, bizType, supplierType, icCreditCode, bizId, contPerson, contNumber, comment, bizProvince, bizCity, bizCounty, bizTown, delFlag, createUserId, jgjb};
          if (this.form.createUserId) {
            params.createUserId = this.userInfo.bizUserId;
          } else {
          }
          if (this.form.delFlag) {
            params.delFlag = this.form.delFlag;
          } else {
            params.delFlag = 1;
          }
          if (
            this.form.jgjb == "" ||
            this.form.jgjb == null ||
            this.form.jgjb == undefined
          ) {
            this.$message.warning("请选择价格级别");
            this.disabled = false;
            return false;
          }
          // console.log(params);
          this.$fetch.api_purchase.wldw_save(params).then((res) => {
            this.$message.success('操作成功！')
            this.closeForm(true);
            this.disabled = false;
          }).catch(() => {
            this.$message.error('操作失败！')
            this.disabled = false;
          })
        } else {
          this.$message.error('请按要求填写')
          return false;
        }
      });
    },
    closeForm (fresh = false) {
      this.$emit("closeForm", fresh);
    }
  }
}
</script>
<style>
/*.el-form-item--medium .el-form-item__label{*/
/*width: 200px;*/
/*}*/
/*.el-form-item--medium .el-form-item__content{*/
/*margin-left: 200px;*/
/*}*/
/*.form{*/
/*width: 650px!important;*/
/*}*/
</style>

