<!--
 * @Author: 龚铱白
 * @Date: 2019-08-12 14:13:30
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-08-12 14:13:30
 * @Description: 
 -->
/*编辑*/
<template>
  <el-form ref="form"
           :model="form"
           label-width="100px"
           class="addtrp"
           :rules="rules"
           status-icon>
    <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.nhId?'编辑':'新增'}}商品信息</div>
    <el-form-item label="商品大类"
                  prop="nzdl">
      <el-select v-model="form.nzdl"
                 placeholder="请选择类别"
                 @change="form.nzdlMc='';getfl()">
        <el-option v-for="item in zldms"
                   :key="item.sjzdBm"
                   :label="item.sjzdMc"
                   :value="item.sjzdBm">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商品分类"
                  prop="fl">
      <el-select v-model="form.fl"
                 placeholder="请选择商品分类"
                 @change="getMc"
                 value-key="agriProdId">
        <el-option v-for="item in ejs"
                   :key="item.agriProdId"
                   :label="item.agriProdName"
                   :value-key="item.agriProdCode"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商品名称"
                  prop="spmc">
      <el-input v-model="form.spmc"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="规格"
                  prop="spgg">
      <el-input v-model="form.spgg"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="生产单位"
                  prop="scdw">
      <el-input v-model="form.scdw"
                placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="登记证号"
                  prop="djzh">
      <el-input v-model="form.djzh"
                placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="品牌/商标">
      <el-input v-model="form.ppsb"
                placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="商品条码">
      <el-input v-model="form.sptm"
                placeholder="请输入"></el-input>
    </el-form-item>
    <!--<el-form-item label="单位" prop="dw">-->
    <!--<el-input v-model="form.dw" placeholder="请输入"></el-input>-->
    <!--</el-form-item>-->
    <el-form-item label="单位"
                  prop="unit">
      <el-select v-model="form.unit"
                 value-key="id"
                 placeholder="请选择基本单位"
                 @change="getDw">
        <el-option v-for="item in dws"
                   :key="item.id"
                   :label="item.unitName"
                   :value="item"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="零售价"
                  prop="lsj">
      <el-input v-model="form.lsj"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="批发价"
                  prop="pfj">
      <el-input v-model="form.pfj"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="多计量单位"
                  prop="unitType">
      <el-switch v-model="form.unitType"></el-switch>
    </el-form-item>
    <el-form-item label="多单位"
                  :hidden="form.unitType == true?false:true">
      <div class="dwtable">
        <div>1</div>
        <div>箱</div>
        <div>=</div>
        <div>
          <el-input type="number"
                    class="dwtable-input"
                    v-model="form.subUnitnum1"></el-input>
        </div>
        <div v-text="this.unit"></div>
      </div>
    </el-form-item>

    <div style="margin-bottom: 20px;"
         :hidden="form.unitType == true?false:true">
      <el-form-item label="零售价（箱）"
                    prop="unit1lsj">
        <el-input type="number"
                  v-model="form.subLsPrice1"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="批发价（箱）"
                    prop="unit1lsj">
        <el-input type="number"
                  v-model="form.subSalePrice1"
                  placeholder="请输入"></el-input>
      </el-form-item>

    </div>

    <el-form-item label="图片"
                  prop="imgList">
      <el-upload :limit="4"
                 action="''"
                 :auto-upload="true"
                 :http-request="uploadImg"
                 :before-upload="beforeAvatarUpload"
                 name="clientFile"
                 :file-list="imglists"
                 :on-preview="handlePictureCardPreview"
                 :on-remove="handleRemove"
                 multiple
                 list-type="picture-card">
        <i class="el-icon-plus"></i>
      </el-upload>
      注：图片支持的格式：JPG,PNG！图片不能大于1M，图片最多4张
    </el-form-item>

    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible"
               width="800px"
               :append-to-body="true">
      <img width="100%"
           :src="dialogImageUrl"
           alt>
    </el-dialog>

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
import { mapGetters } from 'vuex'
import { exec } from 'common/tools'
import fetch from 'fetch/axios/'

export default {
  data () {
    const commonValidate = { required: true, message: '必填项', trigger: 'blur' }
    return {
      disabled: false,
      dialogVisible: false,
      dialogImageUrl: "",
      zldms: [],
      ejs: [],
      baseUnitId: "",
      fl: "",
      unit: "",
      dws: [],
      imglists: [],
      rules: {
        nzdl: commonValidate,
        nzdlMc: commonValidate,
        spmc: commonValidate,
        spgg: commonValidate,
        dw: commonValidate,
        scdw: commonValidate,
        djzh: commonValidate,
        sptm: commonValidate,
        bz: commonValidate,
        unit: commonValidate,
        fl: commonValidate,
      }
    }
  },
  props: {
    form: {
      type: Object,
      default: function () {
        return {
          nzdl: '',
          nzdlMc: '',
          fl: '',
          unit: '',
          spmc: '',
          spgg: '',
          dw: '',
          scdw: '',
          djzh: '',
          sptm: '',
          delFlag: 1,
          bz: '',
          ppsb: '',
          attaUrl: '',
          imgList: [],
          lsj: '',
          pfj: '',
          subUnitnum1: '',
          subLsPrice1: '',
          subSalePrice1: '',
          unitType: false
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
    this.getTypes();
  },
  methods: {
    getDw (e) {
      this.baseUnitId = e.id;
      this.unit = e.unitName;
      console.log(e);
    },
    getMc (e) {
      console.log(e);
      this.form.spmc = e.agriProdName;
      this.form.scdw = e.scdw;
      this.form.djzh = e.djzh;
    },
    getfl () {
      console.log(this.form.nzdl);
      fetch({
        url: "/nzsyBizAgriLib/pageSysAgriLib/",
        method: "get",
        data: {
          agriProdCode: this.form.nzdl + ""
        }
      }).then(res => {
        this.ejs = res.list.data;
      });
    },

    getTypes () {
      var params = {
        sjzdLxbm: 'TRPLX'
      }

      this.$fetch.api_goods.get_sjzd(params).then(res => {
        this.zldms = res.list;
      })

      fetch({
        url: "/nzsyUnit/listUnit/",
        method: "get",
        data: {
          type: "1"
        }
      }).then(res => {
        this.dws = res.bean;
      });

    },

    submitForm () {
      if (this.form.unitType == false) {
        this.form.unitType = 1;
      } else {
        this.form.unitType = 2;
      }
      console.log(this.form.unitType)
      if (this.form.unitType == 2) {
        if (this.form.subLsPrice1 == '' || this.form.subLsPrice1 == null || this.form.subLsPrice1 == undefined) {
          this.$message.error("请输入副单位零售价!!");
          return false;
        } else if (this.form.subSalePrice1 == '' || this.form.subSalePrice1 == null || this.form.subSalePrice1 == undefined) {
          this.$message.error("请输入副单位批发价!!");
          return false;
        }
      }
      if (this.form.ppsb != '') {
        this.form.spmc = this.form.ppsb + '·' + this.form.spmc;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //新增字段
          let params = this.form;
          //用户参数
          let { bizId, bizName, areaCode, bizUserId } = this.userInfo;
          //系统时间
          Object.assign(params, {
            bizId,
            bizName,
            areaCode,
            agriProdType: this.form.nzdl,
            category: this.form.nzdlMc,
            agriProdName: this.form.spmc,
            model: this.form.spgg,
            unit: this.unit,
            djzh: this.form.djzh,
            codes: this.form.sptm,
            comment: this.form.bz,
            delFlag: 1,
            createUserId: bizUserId,
            modifyUserId: bizUserId,
            sysUnitId: this.baseUnitId,
            fl: this.form.fl.agriProdCode,
            imgPaths: this.form.attaUrl,
            lsj: this.form.lsj,
            pfj: this.form.pfj,
            subunitId: "10",
            subUnit1: "箱",
            subSalePrice1: this.form.subSalePrice1,
            subLsPrice1: this.form.subLsPrice1,
            subUnitnum1: this.form.subUnitnum1,
            ppsb: this.form.ppsb,
          });

          var query = {
            url: '/nzsyBizAgriLib/saveNzsqb/',
            method: 'post',
            data: params
          }
          fetch(query).then(res => {
            this.$message.success('操作成功！')
            this.closeForm();
          })
        } else {
          this.$message.error('请按要求填写')
          return false;
        }
      });
    },
    closeForm (fresh = false) {
      this.$emit("closeForm", fresh);
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 或者 PNG 格式!!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt2M;
    },
    //上传图片
    uploadImg (item, picType) {
      let formData = new FormData();
      formData.append("clientFile", item.file);
      var query = {
        url: "/utilmodel/uploadFile/",
        method: "upload",
        data: formData
      };
      fetch(query).then(res => {
        this.addImg(res);
        this.$message.success("操作成功！");
      });
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove (file, fileList) {
      var attaUrl = [];
      fileList.forEach(item => {
        attaUrl.push(item.url);
      });
      attaUrl = attaUrl.join(",");
      this.form.attaUrl = attaUrl;
    },
    //上传图片成功
    addImg (response, file) {
      this.form.attaUrl =
        this.form.attaUrl != "" && this.form.attaUrl != undefined
          ? this.form.attaUrl + "," + response.bean
          : response.bean;
    },
  }
}
</script>

<style lang="scss">
.addtrp {
  width: 550px;

  .el-select {
    width: 100%;
  }
}

.dwtable {
  display: flex;
  align-items: center;
  text-align: center;
}

.dwtable div {
  width: 33.33%;
  line-height: 40px;
}

.dwtable-input {
  width: 95% !important;
}
</style>
