<template>
  <div class="login_page"
       @keyup.enter="submit_form">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <img src="../../../static/login/loginbg.png" alt="">
        </div>
        <!-- 登录form -->
        <el-form class="login-form  f-fs18" :rules="rules" ref="form" :model="form" label-width="0">

          <el-form-item prop="userName">
            <el-input size="medium" :readonly="readonly" @focus="readonly=false" prefix-icon="icon-ny-user"
                      v-model.trim="form.userName" auto-complete="off" :maxlength="20">
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input size="medium" :readonly="readonly" @focus="readonly=false" prefix-icon="icon-ny-pwd"
                      type="password" v-model.trim="form.pwd" auto-complete="off" :maxlength="20">
            </el-input>
          </el-form-item>
          <el-form-item prop="verifycode" v-if="errTimes>=3">
            <div class="f-df" style="position:relative">
              <el-input type="loginCode" class="f-f1" prefix-icon="icon-ny-yzm" :readonly="readonly"
                        @focus="readonly=false" v-model="form.verifycode"/>
              <div style="width:120px;background:#fff;border-radius:4px;margin-left:10px" @click="getCode">
                <img :src="imgUrl" v-if="imgUrl" alt=""
                     style="vertical-align: middle;width:120px;height:48px;border-radius:4px">
              </div>
            </div>
          </el-form-item>
          <el-checkbox v-model.trim="checked" style="color:#fff;">记住账号</el-checkbox>
          <el-form-item class="f-tac">
            <div class="f-submit-btn f-cp f-select-not submit-btn" v-if="!load_data" @click="submit_form">登 录</div>
            <div class="f-submit-btn f-cp f-select-not submit-btn" v-else><i class="el-icon-loading"></i>登录中</div>
          </el-form-item>
        </el-form>
      </section>
    </transition>



  </div>
</template>
<script type="text/javascript">
  import {mapActions} from 'vuex'
  import fetch from 'fetch/axios/'
  import cookie from 'common/tools/cookie'
  import {pjConfig} from 'fetch/axios/config.js';
  import router, {resetRouter} from 'src/router/'


  export default {
    data() {
      return {
        form: {
          userName: null,
          pwd: null,
          verifycode: null
        },
        errTimes: 0,
        readonly: true,
        checked: false,
        imgUrl: '',
        rules: {
          userName: [{required: true, message: '请输入账户名！', trigger: 'blur'}],
          pwd: [{required: true, message: '请输入账户密码！', trigger: 'blur'}],
          verifycode: [{required: true, message: '请输入验证码！', trigger: 'blur'}]
        },
        //请求时的loading效果
        load_data: false,
        showLogin: false,
        //登录报错类型
        loginErrorType: {
          '2': '该账号不存在或登录密码不正确',
          '3': '该账号不存在或登录密码不正确',
          '4': '该企业未订购'
        }
      }
    },
    created() {
      this.getCode();
    },
    mounted() {
      this.showLogin = true;
      this.loadAccountInfo();
    },
    methods: {
      //提交
      submit_form() {
        this.$refs.form.validate((valid) => {
          if (!valid) return false
          this.load_data = true
          //登录提交
          this.$fetch.api_user.user_login({
            userName: this.form.userName,
            pwd: this.$md5(this.form.pwd),
            verifycode: this.form.verifycode
          }).then((resp) => {
            if (resp.status === '1') {
              let {yhxm, ztyhId, scjyztId, qyid, qydm, ztdm, csid, ztmc, nyVersion, csmc, areaCode, industryId, hydm} = resp.bean;
              let syxy = resp.syxy;
              let {logIp, optTime} = resp.logBean;
              var userInfo = {
                yhxm,
                userId: ztyhId,
                scjyztId,
                qyid,
                qydm,
                hydm,
                ztdm,
                optTime,
                logIp,
                sessionKey: resp.sessionKey,  //存储登录失效的code
                scjyztId, qyid, ztmc, csmc, csid, areaCode, industryId, nyVersion,syxy
              };
              console.log(userInfo)
              //记住密码  开始
              var accountInfo = this.form.userName + "&" + this.form.pwd;
              if (this.checked) {
                cookie.setCookie('ncpaccountInfo', accountInfo, 365);
              } else {
                cookie.delCookie('ncpaccountInfo');
              }

              //记住密码  结束
              this.getBaseLand(userInfo.qyid).then((res)=>{
              	if(!res || !res.length){
              			this.$message.error('请联系管理员，未分配版本！')
              			return;
              	}

              	//去切换版本
              	if(res.length>1){
              			this.$store.dispatch('changeVersion',true);
              	}else{
              		var {hydm,industryId,ztdm,scjyztId,nyVersion,ztmc} = res[0];
              		var changefield={hydm,hy:hydm,industryId,ztdm:ztdm,scjyztId,nyVersion,ztmc};
              		userInfo = Object.assign({...userInfo},changefield)
              	}
              	//防止用户刷新网页vuex数据丢失，本地存储
              	localStorage.setItem('ncpUserInfo',JSON.stringify(userInfo));
              	this.$store.dispatch('setUserInfo',userInfo);
              	this.$message.success('登录成功')
              	resetRouter();
              	setTimeout(this.$router.push({path: '/home'}), 500)
              })
            } else {
              console.log(2);
              this.errTimes = this.errTimes + 1;

              this.$message.error(this.loginErrorType[resp.status])
            }
            this.load_data = false;
          }).catch((res) => {
            if (res.resCode == '100003') {
              this.errTimes = 3;
              this.getCode();
            }
            this.$message.error(res.errorMess)
            this.load_data = false;
          })
        })
      },
      getCode() {
        this.imgUrl = '';
        this.$nextTick(() => {
          this.imgUrl = `${pjConfig.server_base_url + pjConfig.serviceName}/utilmodel/VerifyCode/{"t":"${new Date().getTime()}"}`
        })
      },
      loadAccountInfo() {
        let mySelf = this;
        let accountInfo = cookie.getCookie('ncpaccountInfo');
        //如果cookie里没有账号信息
        if (Boolean(accountInfo) == false) {
          return false;
        } else {
          //如果cookie里有账号信息
          let userName = "";
          let passWord = "";
          let index = accountInfo.indexOf("&");

          userName = accountInfo.substring(0, index);
          passWord = accountInfo.substring(index + 1);
          mySelf.form.userName = userName;
          mySelf.form.pwd = passWord;
          mySelf.checked = true;
        }
      },
      getBaseLand(qyid) {
        return new Promise((resolve) => {
          fetch({
            url: '/jcqy/zt/getScjyztByQyId/',
            method: 'get',
            data: {
              qyid
            }
          }).then(res => {
            resolve(res.list)
          })
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .login_page {
    background: url('../../../static/login/login_bg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .form_contianer {
    width: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -285px;
    margin-left: -300px;
  }

  .manage_tip {
    text-align: center;
    // margin-bottom:80px;
    margin-bottom: 65px;

    .login-title {
      font-size: 36px;
      letter-spacing: 2px;
      color: #fff;
    }

    .login-title-en {
      font-size: 14px;
      letter-spacing: 5px;
      color: #fff;
    }
  }

  .tip {
    font-size: 12px;
    color: #5acdc5;
  }

  .login-submit {
    width: 80%;
    margin: 10px;
    border-radius: 28px;
  }

  .login-form {
    padding: 0 125px;
    margin: 10px 0;

    .submit-btn {
      background: #ffa200;
      margin: 20px auto 0;
      font-size: 18px;
    }
  }

  // 初始加载动画
  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }

  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
</style>
// 修改ele的样式
<style lang="scss">
  .login-form {
    input {
      background: #9fe4dd;
      border: none;
      height: 50px;
    }

    .el-input--medium .el-input__inner {
      height: 48px;
      line-height: 48px;
    }

    .el-checkbox__inner {
      background: #9fe4dd;
    }

    .login-submit button {
      background-color: #ffa200;
      border-color: #ffa200;
    }

    .el-input--medium .el-input__icon {
      font-size: 24px;
      line-height: 48px;
    }

    .el-input--prefix .el-input__inner {
      padding-left: 35px;
      font-size: 18px;
    }
  }

</style>
