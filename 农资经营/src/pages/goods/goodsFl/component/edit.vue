<template>
  <div class="addShopping">
    <el-form ref="form"
             :model="form"
             label-width="100px"
             class="addtrp"
             :rules="rules"
             status-icon>
      <div class="form-title f-fs18 f-tac f-mb30 f-mt30">新增分类备案</div>
      <el-form-item label="类型"
                    prop="nzdl">
        <el-select v-model="form.nzdl"
                   placeholder="请选择类别"
                   @change="getLx">
          <el-option v-for="item in zldms"
                     :key="item.sjzdBm"
                     :label="item.sjzdMc"
                     :value="item.sjzdBm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小类"
                    prop="fl"
                    class="f-pr f4">
        <el-select v-model="form.fl"
                   placeholder="请选择类别"
                   @change="getXl">
          <el-option v-for="item in xldms"
                     :key="item.sjzdBm"
                     :label="item.sjzdMc"
                     :value="item.sjzdBm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称"
                    prop="agriProdName">
        <el-input v-model="form.agriProdName"
                  placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="生产单位"
                    prop="scdw">
        <el-input v-model="form.scdw"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="登记证号"
                    prop="djzh">
        <el-input v-model="form.djzh"
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
              :agriProdCode="this.form.nzdl"
              :nzdl="this.form.nzdlMc"
              @selsup="selsup"></choose>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {exec} from "common/tools";
  import fetch from "fetch/axios/";

  export default {
    data() {
      const commonValidate = {
        required: true,
        message: "必填项",
        trigger: "blur"
      };
      return {
        chooseDialogVisable: false,
        dialogVisible: false,
        disabled: false,
        disabled1: false,
        zldms: [],
        xldms:[],
        form: {
          nzdl: "",
          nzdlMc: "",
          fenlei: "",
          agriProdName: "",
          scdw: "",
          djzh: "",
          fl: "",
        },
        rules: {
          nzdl: commonValidate,
          nzdlMc: commonValidate,
          fl: commonValidate,
          agriProdName: commonValidate,
          scdw: commonValidate,
          djzh: commonValidate,
        }
      }
    },
    props: {},
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    created() {
      this.jylx();
    },
    methods: {
      jylx(){
        fetch({
          url: "/nzsyBizmanagement/getManagementById/",
          method: "get",
          data: {
            bizId: this.userInfo.bizId+''
          }
        }).then(res => {
          this.getType(res.bean.jylx);
        });
      },
      getType(val) {
        fetch({
          url: "/utilmodel/qy/getDataByCy/",
          method: "get",
          data: {
            sjzdLxbm: "TRPLX",
            hy: val + "",
          }
        }).then(res => {
          this.zldms = res.list;
          console.log(this.zldms)
        });
      },
      getLx(){
        this.form.fl='';
        this.form.feilei='';
        this.getXl(this.form.nzdl)
      },
      getXl(val) {
        fetch({
          url: "/utilmodel/qy/getDataByCy/",
          method: "get",
          data: {
            sjzdLxbm: "TRPLX",
            zldm: val + "",
          }
        }).then(res => {
          this.xldms = res.list;
          console.log(this.xldms)
        });
      },

      selsup(row) {
        let {agriProdName, category, djzh, scdw} = row;
        this.form.fenlei = agriProdName;
        this.form.agriProdName = agriProdName;
        this.form.djzh = djzh;
        this.form.scdw = scdw;
        this.form.fl = category;
        this.chooseDialogVisable = false;
      },
      submitForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.disabled = true;
            let {areaCode} = this.userInfo;
            let params = {
              agriProdName: this.form.agriProdName,
              agriProdType: this.form.nzdl,
              areaCode,
              category: this.form.fl,
              djzh: this.form.djzh,
              scdw: this.form.scdw,
              spzt: "2",
              bizId: this.userInfo.bizId
            };

            var query = {
              url: "/sysNzsq/saveSysNzsq/",
              method: "post",
              data: params
            };
            fetch(query).then(res => {
              this.$message.success("操作成功！");
              this.closeForm(true);
              this.disabled = false;
            });
          }
        });
      },

      closeForm(fresh = false) {
        this.$emit("closeForm", fresh);
      },
    }
  }
</script>

<style scoped>

</style>
