<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-30 09:05:09
 * @LastEditTime: 2019-08-21 09:23:49
 * @LastEditors: 龚铱白
 -->
/*编辑*/
<template>
  <el-form ref="form"
           :model="form"
           label-width="100px"
           class="form"
           :rules="rules"
           status-icon>
    <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}会员信息</div>
    <el-form-item label="会员名称"
                  prop="hymc">
      <el-input v-model="form.hymc"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="手机号码"
                  prop="sjhm">
      <el-input v-model="form.sjhm"
                maxlength="11"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="身份证"
                  prop="sfz">
      <el-input v-model="form.sfz"
                minlength="11"
                maxlength="18"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="种植作物"
                  prop="zzzw">
      <el-input v-model="form.zzzw"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="种植面积(亩)"
                  prop="zzmj">
      <el-input type="number"
                v-model="form.zzmj"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="客户地址">
      <!--<el-cascader-->
      <!--:options="options"-->
      <!--@active-item-change="handleItemChange"-->
      <!--:props="props">-->
      <!--</el-cascader>-->
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

    <el-form-item label="分组"
                  prop="hydj">
      <el-select v-model="form.hydj"
                 placeholder="全部"
                 @change="changeSelect()"
                 class="f-vab f-mr20">
        <el-option v-for="item in list"
                   :key="item.id"
                   :label="item.jbmc"
                   :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="价格级别"
                  prop="jgjb">
      <el-select v-model="form.jgjb"
                 @change="changeJgjb()"
                 class="f-vab f-mr20">
        <el-option v-for="item in jbList"
                   :key="item.key"
                   :label="item.value"
                   :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="备注">
      <el-input type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                v-model="form.bz"
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
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
export default {
  data () {
    //使用了一个input没有的事件select  目的：只在最后提交之前触发会员是否存在的校验
    const sjhIsExist = (rule, value, callback) => {
      let sjhm = this.form.sjhm;
      var params = {
        sjhm: sjhm,
        bizId: this.userInfo.bizId
      };
      if (this.form.id) {
        params.id = this.form.id;
      }
      this.$fetch.api_retail.hyxx_exist(params).then(res => {
        if (res.bean) {
          callback(new Error("该手机号已被使用！"));
        } else {
          callback();
        }
      });
    };
    // TODO:身份证验证
    const sfzIsExit = (rule, value, callback) => {
      fetch({
        url: "/nzsyHyb/checkHySfz/",
        method: "get",
        data: {
          id: this.form.id,
          sfz: this.form.sfz,
          bizId: this.userInfo.bizId
        }
      }).then(res => {
        if (res.bean == true) {
          callback(new Error("该身份证号已被使用！"));
        } else {
          callback();
        }
      });
    }


    const commonValidate = {
      required: true,
      message: "必填项",
      trigger: "blur"
    };
    const checkPhone = {
      validator: exec.checkPhone,
      trigger: "blur"
    };
    const checkCardNo = {
      validator: exec.checkCardNo,
      trigger: "blur"
    };

    return {
      options: [],
      list: [],
      disabled: false,
      bizProvince: '',
      bizCity: '',
      bizCounty: '',
      bizTown: '',
      province: [],
      city: [],
      county: [],
      town: [],
      jgjbMc: '',
      props: {
        label: 'areaName',
        value: 'areaId',
        children: 'cities'
      },
      jbList: [ { key: 2, value: '零售价' }, { key: 1, value: '批发价' },{ key: 3, value: '代理价' }],
      rules: {
        jgjb: commonValidate,
        hydj:commonValidate,
        hymc: commonValidate,
        sjhm: [
          commonValidate,
          checkPhone,
          {
            validator: sjhIsExist,
            trigger: "blur"
          }
        ],
        sfz: [
          commonValidate,
          checkCardNo,
          {
            validator: sfzIsExit,
            trigger: "blur"
          }
        ],
      }
    };
  },
  created () {
    // this.getJb();
    this.getinfo();
    this.getTypes('ssj');
    // 默认分组选中第一个
    fetch({
      url: "/nzsyHyb/queryHyjbByQyId/",
      method: "get",
      data: {
        qyId: this.userInfo.bizId
      }
    }).then(res => {
      this.list = res.bean;
      this.form.hydj = res.bean[0].jbmc;
      this.form.hydjId = res.bean[0].id;
    });
  },
  props: {
    form: {
      type: Object,
      default: function () {
        return {
          hymc: "",
          sjhm: "",
          sfz: "",
          bz: "",
          zzzw: "", // 种植作物
          zzmj: "", // 种植面积
          bizProvince: "", // 省
          bizCity: "", // 市
          bizCounty: "", // 县区
          bizTown: "", // 乡镇
          hydj: "", // 会员等级
          hydjId: "", // 会员Id
          jgjb: "", // 价格级别
        };
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  methods: {
    checkaddress () {
      this.check = true;
    },
    // handleItemChange (val) {
    //   this.getPosition(val)
    // },
    // getPosition(val) {
    //   console.log(val)
    // },
    getinfo () {
      fetch({
        url: "/nzsyHyb/getHybById/",
        method: "get",
        data: {
          id: this.form.id
        }
      }).then(res => {
        this.check = true;
        this.info = res.bean;
        this.bizProvince = this.info.bizProvince;
        this.bizCity = this.info.bizCity;
        this.bizCounty = this.info.bizCounty;
        this.bizTown = this.info.bizTown;
        this.form.hydj = this.info.hydj;
        this.form.hydjId = this.info.hydjId;
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
      });

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
    getJb () {
      fetch({
        url: "/nzsyHyb/queryHyjbByQyId/",
        method: "get",
        data: {
          qyId: this.userInfo.bizId
        }
      }).then(res => {
        this.list = res.bean;
      });
    },
    /***
     *  *循环输出 jbmc id  并赋值给hydj hydjId
     */
    changeSelect () {
      let lists = this.list;
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].id == this.form.hydj) {
          this.form.hydjId = lists[i].id;
          this.form.hydj = lists[i].jbmc;
        }
      }
    },
    changeJgjb() {
      let lists = this.jbList;
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].key == this.form.jgjb) {
          this.form.jgjb = lists[i].key;
          this.jgjbMc = lists[i].value;
        }
      }
      console.log(this.form.jgjb)
    },
    // TODO: 传值地区
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //新增字段
          let {
            hymc,
            sjhm,
            sfz,
            bz,
            zzzw,
            zzmj,
            hydj,
            hydjId,
            jgjb
          } = this.form;
          let bizProvince = this.bizProvince;
          let bizCity = this.bizCity;
          let bizCounty = this.bizCounty;
          let bizTown = this.bizTown;
          //传值参数
          let params = {
            hymc,
            sjhm,
            sfz,
            bz,
            zzzw,
            zzmj,
            hydj,
            hydjId,
            bizProvince,
            bizCity,
            bizCounty,
            bizTown,
            jgjb
          };
          if (this.form.id) {
            params.id = this.form.id;
          } else {
            params.cjr = this.userInfo.id;
          }
          if (this.form.hyzt) {
            params.hyzt = this.form.hyzt;
          } else {
            params.hyzt = 1;
          }
          if (this.form.zzmj) {
            if (!/^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(this.form.zzmj)) {
              this.$message.warning("种植面积请只能输入数字");
              this.disabled = false;
              return false;
            }
          }
          if (
            this.form.hydjId == "" ||
            this.form.hydjId == null ||
            this.form.hydjId == undefined
          ) {
            this.$message.warning("请选择分组");
            this.disabled = false;
            return false;
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
          params.qyid = this.userInfo.bizId;
          this.$fetch.api_retail
            .hyxx_save(params)
            .then(res => {
              this.$message.success("操作成功！");
              this.closeForm();
              this.disabled = false;
            })
            .catch((res) => {
              this.$message.error("操作失败！");
              this.disabled = false;
            });
        } else {
          this.$message.error("请按要求填写");
          return false;
        }
      });
    },
    closeForm (fresh = false) {
      this.$emit("closeMember");
      this.$refs.form.resetFields();
    }
  }
};
</script>
<style scoped>
.f-vab {
  width: 100%;
}
</style>
