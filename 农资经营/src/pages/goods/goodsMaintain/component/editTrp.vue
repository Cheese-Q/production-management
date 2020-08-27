<!--
 * @Author: 龚铱白
 * @Date: 2019-08-14 13:44:42
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-08-15 15:01:14
 * @Description: 
 -->
/*编辑*/
<template>
  <div>
    <el-form ref="form"
             :model="form"
             label-width="100px"
             class="form"
             :rules="rules"
             status-icon>
      <div class="form-title f-fs18 f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}商品信息</div>
      <el-form-item label="商品名称"
                    prop="agriProdName">
        <el-input v-model="form.agriProdName"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="规格"
                    prop="model">
        <el-input v-model="form.model"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="生产单位"
                    prop="scdw">
        <el-input v-model="form.scdw"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="单位"
                    prop="unit">
        <el-select v-model="form.unit"
                   value-key="id"
                   placeholder="请选择基本单位"
                   @change="getDw"
                   disabled>
          <el-option v-for="item in list"
                     :key="item.id"
                     :label="item.unitName"
                     :value="item.id"></el-option>
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
      <el-form-item label="代理价"
                    prop="dlj">
        <el-input v-model="form.dlj"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <!--<el-form-item label="价格1"-->
      <!--prop="jg1">-->
      <!--<el-input v-model="form.jg1"-->
      <!--placeholder="请输入"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="价格2"-->
      <!--prop="jg2">-->
      <!--<el-input v-model="form.jg2"-->
      <!--placeholder="请输入"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="多计量单位"
                    prop="unitType">
        <!--:hidden="form.unitType == 1?false:true">-->
        <el-switch v-model="form.unitType"
                   :disabled="this.ddwZt"></el-switch>
        <!--:hidden="ddwzt == 1?true:false"></el-switch>-->
      </el-form-item>
      <el-form-item label="多单位"
                    :hidden="form.unitType == 1?false:true">
        <div class="dwtable">
          <div>1</div>
          <div>箱</div>
          <div>=</div>
          <div>
            <el-input type="number"
                      class="dwtable-input"
                      v-model="form.subUnitNum1"></el-input>
          </div>
          <div v-text="this.form.unit"></div>
        </div>
      </el-form-item>

      <div style="margin-bottom: 20px;"
           :hidden="form.unitType == 1?false:true">
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
        <el-form-item label="代理价（箱）"
                      prop="subDlPrice1">
          <el-input type="number"
                    v-model="form.subDlPrice1"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <!--<el-form-item label="价格1（箱）"-->
        <!--prop="subJg1Price1">-->
        <!--<el-input type="number"-->
        <!--v-model="form.subJg1Price1"-->
        <!--placeholder="请输入"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="价格2（箱）"-->
        <!--prop="subJg2Price1">-->
        <!--<el-input type="number"-->
        <!--v-model="form.subJg2Price1"-->
        <!--placeholder="请输入"></el-input>-->
        <!--</el-form-item>-->
      </div>

      <el-form-item label="商品条码"
                    prop="codes">
        <el-input v-model="form.codes"
                  :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="保质期(天)"
                    prop="yxq">
        <el-input v-model="form.yxq"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <!-- <el-form-item label="助记码" prop="sptm">
        <el-input v-model="form.sptm" placeholder="请输入"></el-input>
      </el-form-item> -->
      <el-form-item label="助记码"
                    prop="sptm">
        <el-input v-model="form.sptm"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="图片"
                    prop="imgList">
        <!-- <img :src="form.imgPaths"
             width="146"
             height="146"> -->
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
      <el-form-item label="备注">
        <el-input type="textarea"
                  :autosize="{ minRows: 3, maxRows: 10}"
                  v-model="form.comment"
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
      <!-- 图片预览 -->
      <el-dialog :visible.sync="dialogVisible"
                 width="800px"
                 :append-to-body="true">
        <img width="100%"
             :src="dialogImageUrl"
             alt>
      </el-dialog>
    </el-form>

    <el-dialog title="选择单位"
               :append-to-body="true"
               :visible.sync="selNcpVisable"
               width="800px">
      <sel-ddw style="margin:0 auto;"
               @addDdw="addDdw"
               @close="selNcpVisable=false"
               :baseUnitId="baseUnitId"></sel-ddw>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {exec} from "common/tools";
  import fetch from "fetch/axios/";
  import selDdw from "./selDdw";

  export default {
    components: {
      selDdw
    },
    data() {
      const sptmIsExist = (rule, value, callback) => {
        let {id, bizId, sptm} = this.form;
        fetch({
          method: "get",
          url: "/nzsyBizAgriLib/checkRepeat/",
          data: {
            id: id,
            bizId: this.userInfo.bizId,
            sptm: sptm
          }
        }).then(res => {
          if (res.bean == 1) {
            callback(new Error("助记码重复！"));
          } else {
            callback();
          }
        });
      };
      const commonValidate = {
        required: true,
        message: "必填项",
        trigger: "blur"
      };
      const checkPositiveNumber = {
        validator: exec.checkPositiveNumber,
        trigger: "blur"
      };
      const checkNumber = {validator: exec.checkNumber, trigger: "blur"};
      return {
        ddwZt: false,
        disabled: false,
        dialogImageUrl: "",
        dialogVisible: false,
        selNcpVisable: false,
        units: 1,
        dwIds: [],
        imglists: [],
        baseUnitId: "",
        list: [],
        subUnitId1: "",
        subUnit1: "",
        unit1lsj: "",
        unit1pfj: "",
        subUnitId2: "",
        subUnit2: "",
        unit2lsj: "",
        unit2pfj: "",
        unitId: "",
        unit: "",
        ddwzt: "",
        rules: {
          lsj: [commonValidate, checkNumber],
          pfj: [commonValidate, checkNumber],
          yxq: [commonValidate, checkPositiveNumber],
        }
      };
    },
    props: {
      form: {
        type: Object,
        default: function () {
          return {
            imgList: [],
            attaUrl: ""
          };
        }
      }
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    created() {
      this.getInfos();
      if (this.form.unitType == 2) {
        console.log(this.form.unitType)
        this.ddwZt = true;
        this.form.unitType = true;
      } else {
        console.log(this.form.unitType)
        this.ddwZt = false;
      }
      this.baseUnitId = this.form.sysUnitId;
      this.unitId = this.form.unitId;
      if (this.form.comment == 'undefined') {
        this.form.comment = '';
      }

    },

    methods: {
      getDw(val) {
        var obj = {};
        obj = this.list.find(item => {
          return item.id === val;
        });
        this.unit = obj.unitName;
      },
      getInfos() {
        fetch({
          url: "/nzsyBizAgriLib/checkAgriUsed/",
          method: "get",
          data: {
            agriId: this.form.id + ""
          }
        }).then(res => {
          if (res.bean == 1) {
            this.ddwzt == 1;//1隐藏
          }
        });

        fetch({
          url: "/nzsyUnit/listUnit/",
          method: "get",
          data: {
            type: "1"
          }
        }).then(res => {
          this.list = res.bean;
        });
        this.getinfo()
      },
      submitForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            //防止二次提交
            this.disabled = true;
            //新增字段
            let unitType = this.form.unitType;
            if (unitType == true || unitType == 2) {
              unitType = 2;
            } else {
              unitType = 1;
            }
            if (unitType == 2) {
              if (this.form.subLsPrice1 == '' || this.form.subLsPrice1 == null || this.form.subLsPrice1 == undefined) {
                this.$message.error("请输入副单位零售价!!");
                this.disabled = false;
                return false;
              } else if (this.form.subSalePrice1 == '' || this.form.subSalePrice1 == null || this.form.subSalePrice1 == undefined) {
                this.$message.error("请输入副单位批发价!!");
                this.disabled = false;
                return false;
              }
            }
            let {id, codes, lsj, pfj, yxq, sptm, comment, attaUrl, subUnitNum1, subLsPrice1, subSalePrice1, dlj, jg1, jg2, subDlPrice1, subJg1Price1, subJg2Price1} = this.form;
            //用户参数
            // let {bizId, bizName} = this.userInfo;
            //传值参数
            let params = {
              id,
              codes,
              lsj,
              pfj,
              dlj,
              jg1: 0 + "",
              jg2: 0 + "",
              subDlPrice1,
              subJg1Price1: 0 + "",
              subJg2Price1: 0 + "",
              yxq,
              sptm,
              comment,
              tpdzs: attaUrl,
              subLsPrice1,
              subSalePrice1,
              subUnitnum1: subUnitNum1
            };
            params.bizId = this.userInfo.bizId + "";
            params.bizName = this.userInfo.bizName + "";
            params.sysUnitId = this.baseUnitId + "";
            params.unitType = unitType + "";
            params.unitId = this.form.unitId + "";
            params.subLsPrice2 = "0.00";
            params.subSalePrice2 = "0.00";
            params.unit = this.unit + "";
            params.subUnit1 = "箱";
            params.subunitId = "10";


            this.$fetch.api_goods
              .updateBizAgriLib(params)
              .then(res => {
                this.$message.success("操作成功！");
                this.closeForm(true);
                this.disabled = false;
              })
              .catch(() => {
                this.$message.error("操作失败！");
                this.disabled = false;
              });
          } else {
            this.$message.error("请按要求填写");
            this.disabled = false;
            return false;
          }
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
        this.dialogImageUrl = file.tpdz;
        this.dialogVisible = true;
      },
      handleRemove(file, fileList) {
        var attaUrl = [];
        fileList.forEach(item => {
          attaUrl.push(item.url);
        });
        attaUrl = attaUrl.join(",");
        this.form.attaUrl = attaUrl;
      },
      //上传图片成功
      addImg(response, file) {
        this.form.attaUrl =
          this.form.attaUrl != "" && this.form.attaUrl != undefined
            ? this.form.attaUrl + "," + response.bean
            : response.bean;
      },
      getinfo() {
        var attaUrl = "";
        var params = {
          id: this.form.id
        };
        this.$fetch.api_goods
          .getBizAgriLib(params)
          .then(res => {
            res.bean.nzsyTpbs.forEach(item => {
              item.url = item.tpdz;
              item.name = item.tpmc;
              if (attaUrl === "") {
                attaUrl = item.url;
              } else {
                attaUrl = attaUrl + "," + item.url;
              }
            });
            this.form.attaUrl = attaUrl;
            this.imglists = res.bean.nzsyTpbs;
          })
          .catch(res => {
          });
      },
      addDdw(rowlist) {
        rowlist.map(row => {
          let {
            subUnitId1,
            subUnit1,
            subUnitId2,
            subUnit2,
            baseUnitId,
            id
          } = row;
          this.subUnitId1 = subUnitId1;
          this.subUnit1 = subUnit1;
          this.subUnitId2 = subUnitId2;
          this.subUnit2 = subUnit2;
          this.baseUnitId = baseUnitId;
          this.unitId = id;
          // //判断页面中是否有该商品
          // this.form.listDetail = [];
          // if (this.form.listDetail.findIndex(item => {
          //   return item.id === id
          // }) != -1) {
          //   return;
          // }
          // this.form.listDetail.push({
          //   "id": id,
          //   "subUnitId1": subUnitId1,
          //   "subUnit1": subUnit1,
          //   "subUnitId2": subUnitId2,
          //   "subUnit2": subUnit2,
          //   "lsj": '',
          //   "pfj": ''
          // })
        });
      }
    }
  };
</script>

<style scoped>
  .ddw {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 0 0 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .el-select,
  .el-select--medium {
    width: 100%;
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

