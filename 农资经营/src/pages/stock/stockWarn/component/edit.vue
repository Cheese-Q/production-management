/*编辑*/
<template>
  <el-form ref="form" :model="form" label-width="100px" class="form" style="margin: 0 auto;" :rules="rules" status-icon>
    <div class="form-title f-fs18  f-tac f-mb30 f-mt30">库存预警处理</div>
    <el-form-item label="库存数量" prop="sl">
      <el-input v-model="form.sl" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="处理数量" prop="clsl">
      <el-input v-model="form.clsl" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="处理日期" prop="clsj">
      <el-date-picker
        v-model="form.clsj"
        type="date"
        placeholder="选择日期" value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="出库方式" prop="cklx">
      <el-radio v-model="form.cklx" label="8">损耗出库</el-radio>
      <el-radio v-model="form.cklx" label="10">退货出库</el-radio>
    </el-form-item>
    <el-form-item label="经办人" prop="jbr">
      <el-input v-model="form.jbr" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="处理方式" prop="clfs">
      <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="form.clfs" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'确认中':'确 认'}}</el-button>
      <el-button round @click=close>取 消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {exec} from 'common/tools'

  export default {
    data() {

      const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
      const checkNumber = {validator: exec.checkNumber, trigger: 'blur'}

      return {
        disabled: false,
        info: [],
        rules: {
          clsl: [commonValidate, checkNumber],
          clsj: commonValidate,
          cklx: commonValidate,
          clfs: commonValidate,
          jbr: commonValidate
        }
      }
    },
    props: {
      form: {
        type: Object,
        default: function () {
          return {
            clsl: '',
            clsj: '',
            cklx: '',
            clfs: '',
            jbr: ''
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    created() {
      this.getinfo();
    },
    methods: {
      getinfo() {
        var params = {
          pckcId: this.form.id,
        };
        this.$fetch.api_stock.ckgl_yjkc(params).then(res => {
          this.info = res.bean;

        }).catch(res => {

        })
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled = true;
            //新增字段
            let {clsl, clsj, cklx, clfs, jbr} = this.form;
            //用户参数
            let cjrID = this.userInfo.bizUserId;
            let pckcId = this.form.id;
            console.log(pckcId);
            //传值参数
            let params = {pckcId, clsl, clsj, cklx, clfs, jbr, cjrID};
            if (this.form.clsl <= this.form.sl) {
              params.clsl = this.form.clsl;
            } else {
              this.$message.error('处理数量不应大于库存数');
              this.disabled = false;
              return false;
            }
            this.$fetch.api_stock.ckgl_saveyj(params).then((res) => {
              this.$message.success('操作成功！')
              this.close(true);
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
      close(fresh = false) {
        this.$emit("close", fresh);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-date-editor, .el-input, .el-input--medium, .el-input--prefix, .el-input--suffix, .el-date-editor--date {
    width: 100%;
  }
</style>

