<template>
  	<div class="login_page"
         @keyup.enter="submit_form">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
            <img src="../../assets/images/icon_login.png" class="logo-img"/>
		  		</div>
					<!-- 登录form -->
					<el-form class="login-form  f-fs18" :rules="rules" ref="form" :model="form" label-width="0">
						<el-form-item prop="userName">
							<el-input size="medium" prefix-icon="icon-ny-user" v-model="form.userName" auto-complete="off" :maxlength="20">
							</el-input>
						</el-form-item>
						<el-form-item prop="pwd">
						<el-input size="medium"   prefix-icon="icon-ny-pwd" type="password" v-model="form.pwd" auto-complete="off" :maxlength="20">
						</el-input>
						</el-form-item>
						<el-checkbox v-model="checked" style="color:#12f7ce;">记住账号</el-checkbox>
						<el-form-item class="f-tac">
            	 <div class="f-submit-btn f-cp f-select-not submit-btn" v-if="!load_data"  @click="submit_form">登 录</div>
            	 <div class="f-submit-btn f-cp f-select-not submit-btn" v-else><i class="el-icon-loading"></i>登录中</div>
						</el-form-item>
					</el-form>
	  		</section>
	  	</transition>
  	</div>
</template>
<script type="text/javascript">
  import {mapActions} from 'vuex'
  export default{
    data(){
      return {
        form: {
          userName: null,
					pwd: null
        },
        checked:false,
        rules: {
          userName: [{required: true, message: '请输入账户名！', trigger: 'blur'}],
          pwd: [{required: true, message: '请输入账户密码！', trigger: 'blur'}]
        },
        //请求时的loading效果
        load_data: false,
				showLogin:false,
				//登录报错类型
				loginErrorType:{
					'2':'密码不正确，请重新输入',
					'3':'该用户不存在'
				}
      }
    },
    mounted(){
			this.showLogin = true;
      var sessionipUser=sessionStorage.getItem('yhm');
      var sessionipPwd=sessionStorage.getItem('mm');
      if(""!=sessionipUser && sessionipUser !=null&&
        ""!=sessionipPwd && sessionipPwd !=null){
        this.checked=true;
        this.form.userName=sessionipUser;
        this.form.pwd=sessionipPwd;
      }
      localStorage.setItem('sessionKey','');
		},
    methods: {
      //提交
      submit_form() {
        this.$refs.form.validate((valid) => {
          if (!valid) return false
          this.load_data = true
          if(this.checked){
            var userName=this.form.userName;
            var password=this.form.pwd;
            sessionStorage.setItem('yhm',userName);
            sessionStorage.setItem('mm',password);
          }else{
            sessionStorage.removeItem('yhm');
            sessionStorage.removeItem('mm');
          }
					//登录提交
          this.form.pwd = this.$md5(this.form.pwd);
          this.$fetch.api_base.user_login(this.form).then((resp) => {
							if(resp.status==='1'){
								this.$message.success('登录成功')
								let {bizUserId,registerName,bizId,bizName,yhxm,bizCity} = resp.bean;
								var userInfo = {
                  bizUserId,
                  bizId,
                  bizName,
                  registerName,
                  yhxm,
                  areaCode:bizCity
								};
								//防止用户刷新网页vuex数据丢失，本地存储
                localStorage.setItem('userInfo',JSON.stringify(userInfo));
                localStorage.setItem('sessionKey',resp.sessionKey);
								this.$store.dispatch('setUserInfo',userInfo);
              	setTimeout(this.$router.push({path: '/home'}), 500)
							}else{
								this.$message.error(this.loginErrorType[resp.status]);
								 this.form.pwd='';
                sessionStorage.removeItem('yhm');
							}
							this.load_data = false;
            })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
	.login_page{
    background: url('../../assets/images/login_bg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
		position:fixed;
		top:0;
		right:0;
		left:0;
		bottom:0;
	}
	.form_contianer{
    width: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -285px;
    margin-left: -300px;
	}
	.manage_tip{
		text-align:center;
		margin-bottom:65px;
		.login-title{
			font-size: 36px;
			letter-spacing:2px;
			color: #fff;
		}
		.login-title-en{
			font-size: 14px;
			letter-spacing:5px;
			color: #fff;
		}
	}
	.tip{
		font-size: 12px;
		color: #5acdc5;
	}
	.login-submit {
		width: 80%;
		margin: 10px;
		border-radius: 28px;
	}
	.login-form {
		padding:0 125px;
		margin: 10px 0;
	.submit-btn{
		background:#ffa200;
		margin:20px auto 0;
		font-size:18px;
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
		input{
				background:#9fe4dd;
				border:none;
				height:50px;
		}
		.el-input--medium .el-input__inner {
			height: 48px;
			line-height: 48px;
		}
		.el-checkbox__inner{
				background:#9fe4dd;			
			}
		.login-submit  button{
			background-color: #ffa200;
			border-color:#ffa200;
		}
		.el-input--medium .el-input__icon{
			font-size:24px;
			line-height:48px;
		}
		.el-input--prefix .el-input__inner {
				padding-left: 35px;
				font-size: 18px;
		}
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #b1eef9;
    }
	}

</style>
