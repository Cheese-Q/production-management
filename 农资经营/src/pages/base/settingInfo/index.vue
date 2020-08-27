<template>
  <div>
    <div class="baseinfo">
      <div class="f-df row">
        <div class="title">功能</div>
        <div class="f-f1">操作</div>
        <div class="title">说明</div>
      </div>
      <div class="f-df row">
        <div class="title">保质期预警天数</div>
        <div class="f-f1">
          <el-checkbox v-model="checked" @change="checkk"></el-checkbox>
        </div>
        <div class="title">请输入保质期预警天数
          <el-input
            placeholder="请输入内容"
            v-model="input1"
            :disabled="edit">
          </el-input>
        </div>
      </div>
    </div>
    <div>

      <div class="f-tac f-mt80">
        <el-button @click="submit" type="primary" size="medium">保 存</el-button>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {

    data() {
      return {
        infos: {},
        checked: false,
        input1: '',
        edit: true,
        sfgx: '',
        id: ''
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo',
      })
    },
    created() {
      this.getZtInfo();
    },
    methods: {
      getZtInfo() {
        var params = {bizId: this.userInfo.bizId};
        this.$fetch.api_base.cssz_get(params).then((res) => {
          let infos = res.bean;
          if (infos != null) {
            this.infos = infos;
            if (infos.sfBzqyj == 1) {
              this.checked = true;
              this.edit = false;
              this.sfgx = infos.sfBzqyj;
              this.input1 = infos.bzqyjTs;
              this.id = infos.id;
            } else {
              this.checked = false;
              this.edit = true;
              this.sfgx = infos.sfBzqyj;
              this.input1 = infos.bzqyjTs;
              this.id = infos.id;
            }
          } else {
            this.checked = false;
            this.edit = true;
          }


        })
      },
      checkk(val) {
        this.checked = val;
        if (val == true) {
          this.edit = false;
          this.sfgx = 1;
        } else {
          this.edit = true;
          this.sfgx = 2;
        }
      },
      submit() {
        let params;
        if(this.id===""){
          params = {
            qyid: this.userInfo.bizId,
            sfBzqyj: this.sfgx,
            bzqyjTs: this.input1
          };
        }else{
          params = {
            id: this.id,
            qyid: this.userInfo.bizId,
            sfBzqyj: this.sfgx,
            bzqyjTs: this.input1
          };
        }
        //检验参数是否存在
        var isPass = true;
        for (var item in this.reqiredKeys) {
          if (!params[item]) {
            isPass = false;
            this.reqiredKeys[item] = true;
          } else {
            this.reqiredKeys[item] = false;
          }
        }
        if (!isPass) {
          this.$message.error('请按要求填写信息！');
          return
        }
        this.$fetch.api_base.cssz_save(params).then(res => {
          this.$message.success('保存成功！')
        }).catch(res => {
          this.$message.error('保存失败！');
          return false;
        })


      }

    }

  }
</script>

<style lang="scss" scoped>
  .baseinfo {
    border-top: 1px solid #ececec;
    border-left: 1px solid #ececec;
    line-height: 36px;
    text-align: center;

    .title {
      width: 500px;
      line-height: 40px;
      height: 40px;
    }

    .row > div {
      border-right: 1px solid #ececec;
      border-bottom: 1px solid #ececec;
    }

    .row span {
      padding-left: 10px;
    }
  }

  .subtitle {
    margin-bottom: 16px;
    font-weight: bold;
    color: #383838;
  }

  .el-input {
    width: 30%;
    margin-left: 10px;
  }

  .f-mt80 {
    margin-top: 80px;
  }

</style>



