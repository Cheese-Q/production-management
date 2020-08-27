<!--
 * @Description: 【商品申请】新增申请信息页面零售价和批发价应该是必填(5630)
 * @Author: your name
 * @Date: 2019-08-06 15:10:13
 * @LastEditTime: 2019-09-17 10:50:02
 * @LastEditors: 龚铱白
 -->
/*编辑*/
<template>
  <div class="addShopping">
    <el-form ref="form"
             :model="form"
             label-width="100px"
             class="addtrp"
             :rules="rules"
             status-icon>
      <div class="form-title f-fs18 f-tac f-mb30 f-mt30">编辑商品备案</div>
      <!--<el-form-item label="类型"-->
      <!--prop="nzdl">-->
      <!--<el-select v-model="form.nzdl"-->
      <!--placeholder="请选择类别"-->
      <!--@change="getLx">-->
      <!--<el-option v-for="item in zldms"-->
      <!--:key="item.sjzdBm"-->
      <!--:label="item.sjzdMc"-->
      <!--:value="item.sjzdBm"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="农资分类"-->
      <!--prop="fenlei"-->
      <!--class="f-pr f4">-->
      <!--<el-input v-model.trim="form.fenlei">-->
      <!--<span slot="suffix"-->
      <!--class="f-fs24 f-pr10">···</span>-->
      <!--</el-input>-->
      <!--<div class="f-pa"-->
      <!--@click="open()"-->
      <!--style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>-->
      <!--</el-form-item>-->
      <el-form-item label="商品名称"
                    prop="agriProdName">
        <el-input v-model="form.agriProdName"
                  placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="规格"
                    prop="model">
        <el-input v-model="form.model"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="生产单位"
                    prop="scdw">
        <el-input v-model="form.scdw"
                  placeholder=""
                  readonly></el-input>
      </el-form-item>
      <el-form-item label="登记证号"
                    prop="djzh">
        <el-input v-model="form.djzh"
                  placeholder=""
                  readonly></el-input>
      </el-form-item>
      <el-form-item label="品牌/商标" prop="ppsb">
        <el-input v-model="form.ppsb"
                  placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="商品条码" prop="codes">
        <el-input v-model="form.codes"
                  placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="单位"
                    prop="unit">
        <el-select v-model="form.unit"
                   placeholder="请选择单位"
                   @change="getUnit">
          <el-option v-for="item in dwList"
                     :key="item.id"
                     :label="item.unitName"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保质期(天)">
        <el-input v-model="form.yxq"
                  placeholder="必输项"></el-input>
      </el-form-item>
      <!-- <el-form-item label="零售价"
                    prop="lsj">
        <el-input v-model="form.lsj"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="批发价"
                    prop="pfj">
        <el-input v-model="form.pfj"
                  placeholder="请输入"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="多计量单位"
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
      </el-form-item> -->

      <!-- <div style="margin-bottom: 20px;"
           :hidden="form.unitType == true?false:true">
        <el-form-item label="零售价（箱）"
                      prop="subLsPrice1">
          <el-input type="number"
                    v-model="form.subLsPrice1"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="批发价（箱）"
                      prop="subSalePrice1">
          <el-input type="number"
                    v-model="form.subSalePrice1"
                    placeholder="请输入"></el-input>
        </el-form-item>

      </div> -->

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
                   @click="submitForm"
                   :disabled="disabled">{{disabled?'提交中':'提 交'}}
        </el-button>
        <el-button round
                   @click="closeForm">取 消
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择农资分类"
               :append-to-body="true"
               :disabled="disabled1"
               :visible.sync="chooseDialogVisable"
               width="1000px">
      <choose style="margin:0 auto;"
              :agriProdCode="sjbm"
              @selsup="selsup"></choose>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {exec} from "common/tools";
  import fetch from "fetch/axios/";
  import choose from "./choose";

  export default {
    data() {
      const commonValidate = {
        required: true,
        message: "必填项",
        trigger: "blur"
      };
      return {
        options: [{
          value: '毫升',
          label: '毫升'
        }, {
          value: '升',
          label: '升'
        }, {
          value: '克',
          label: '克'
        }, {
          value: '千克',
          label: '千克'
        }],
        value: '',
        sjbm: "",
        chooseDialogVisable: false,
        dialogVisible: false,
        dialogImageUrl: "",
        disabled: false,
        disabled1: false,
        nzdlMc: "",
        zldms: [],
        fenlei: "",
        fl: "",
        dwList: [],
        imglists: [],
        unit: "",
        rules: {
          nzdl: commonValidate,
          nzdlMc: commonValidate,
          spmc: commonValidate,
          spgg: commonValidate,
          unitId: commonValidate,
          // scdw: commonValidate,
          // djzh: commonValidate,
          sptm: commonValidate,
          bz: commonValidate,
          unit: commonValidate,
          fenlei: commonValidate,
          yxq: commonValidate,
          // unit1lsj: commonValidate,
          // lsj: commonValidate,
          // pfj: commonValidate,
          // subLsPrice1: commonValidate,
          // subSalePrice1: commonValidate,
        }
      };
    },
    props: {
      form: {
        type: Object,

      }
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    created() {
      this.getType();
      // this.getLx();
      this.getDw();
    },
    components: {
      choose
    },
    methods: {
      // 获取类型
      getType() {
        fetch({
          url: "/utilmodel/qy/getDataByCy/",
          method: "get",
          data: {
            sjzdLxbm: "TRPLX"
          }
        }).then(res => {
          this.zldms = res.list;
        });
      },
      getLx(val) {
        // this.getFenlei(val);
        this.sjbm = val;
        this.form.fenlei = "";
        this.form.spmc = "";
      },
      open() {
        //检验
        if (this.sjbm == "" || this.sjbm == null || this.sjbm == undefined) {
          this.$message.error("请检查是否选择类型");
        } else {
          this.chooseDialogVisable = true;
        }
      },
      // 获取分类
      getFenlei(val) {
        let params = {
          agriProdCode: val
        };
        this.$fetch.api_goods.get_spfl(params).then(res => {
          this.flList = res.list;
        });
      },
      getUnit(val) {
        var obj = {};
        obj = this.dwList.find(item => {
          return item.id === val;
        });
        this.unit = obj.unitName;
      },
      // 获取单位
      getDw() {
        fetch({
          url: "/nzsyUnit/listUnit/",
          method: "get",
          data: {
            type: "1"
          }
        }).then(res => {
          this.dwList = res.bean;
        });
      },
      selsup(row) {
        let {agriProdName, agriProdCode, djzh, scdw} = row;
        this.form.fenlei = agriProdName;
        this.form.spmc = agriProdName;
        this.form.djzh = djzh;
        this.form.scdw = scdw;
        // this.form.spgg = model;
        this.fl = agriProdCode;
        this.chooseDialogVisable = false;
      },
      submitForm() {
        this.$confirm("此操作将重新提交商品申请信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: 'is-round',
          confirmButtonClass: 'is-round',
          type: "warning"
        }).then(() => {
          if (this.form.unitType == false) {
            this.form.unitType = 1;
          } else {
            this.form.unitType = 2;
          }
          // if (this.form.unitType == 2) {
          //   if (this.form.subLsPrice1 == '' || this.form.subLsPrice1 == null || this.form.subLsPrice1 == undefined) {
          //     this.$message.error("请输入副单位零售价!!");
          //     this.form.unitType = true;
          //     return false;
          //   } else if (this.form.subSalePrice1 == '' || this.form.subSalePrice1 == null || this.form.subSalePrice1 == undefined) {
          //     this.$message.error("请输入副单位批发价!!");
          //     this.form.unitType = true;
          //     return false;
          //   }
          // }
          if (this.form.ppsb != '' && this.form.ppsb != undefined) {
            this.form.spmc = this.form.ppsb + '·' + this.form.spmc;
          } else {
            this.form.spmc = this.form.spmc;
          }
          this.$refs.form.validate(valid => {
            if (valid) {
              //防止二次提交
              this.disabled = true;
              //新增字段
              let params = this.form;
              this.form.nzdlMc = this.nzdlMc;
              //用户参数
              let {bizId, bizName, areaCode, bizUserId} = this.userInfo;
              //系统时间
              Object.assign(params, {
                scdw: this.form.scdw,
                fl: this.form.agriProdCode, //分类:系统农资库提取10位农资编码
                sysUnitId: this.form.sysUnitId,
                spzt: "1", //审批通过
                bizId,
                bizName,
                areaCode,
                agriProdType: this.form.nzdl,
                category: this.form.nzdlMc,
                agriProdName: this.form.agriProdName,
                model: this.form.model,
                unit: this.form.unit,
                djzh: this.form.djzh,
                codes: this.form.codes,
                comment: this.form.comment,
                delFlag: 1,
                createUserId: bizUserId,
                modifyUserId: bizUserId,
                imgPaths: this.form.imgPaths,
                sysUnitId: this.form.sysUnitId,
                // lsj: this.form.lsj,
                // pfj: this.form.pfj,
                subunitId: "10",
                subUnit1: "箱",
                ppsb: this.form.ppsb,
                yxq: this.form.yxq + "",
              });
              var query = {
                url: "/nzsyBizAgriLib/saveNzsqb/",
                method: "post",
                data: params
              };

              // console.log(params);
              // this.disabled = false;
              // return false;
              fetch(query).then(res => {
                this.$message.success("操作成功！");
                this.closeForm(true);
                this.disabled = false;
              });
            } else {
              this.$message.error("请按要求填写");
              this.form.unitType = true;
              return false;
            }
          });

        }).catch(() => {
        });


      },
      closeForm(fresh = false) {
        this.$emit("closeForm", fresh);
      },
      beforeAvatarUpload(file) {
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
      uploadImg(item, picType) {
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
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleRemove(file, fileList) {
        var attaUrl = [];
        fileList.forEach(item => {
          attaUrl.push(item.url);
        });
        attaUrl = attaUrl.join(",");
        this.form.imgPaths = attaUrl;
      },
      //上传图片成功
      addImg(response, file) {
        this.form.imgPaths =
          this.form.imgPaths != "" && this.form.imgPaths != undefined
            ? this.form.imgPaths + "," + response.bean
            : response.bean;
      },
    }
  };
</script>

<style lang="scss">
  .addtrp {
    width: 550px;

    .el-select {
      width: 100%;
    }
  }
</style>
