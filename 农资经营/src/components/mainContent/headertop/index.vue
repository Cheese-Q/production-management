<template>
  <div id="app-head" class="f-select-not">
    <!-- 左边的logo -->
    <router-link to="/home" class="left bg-main f-autoCont">
      <el-tooltip effect="light"  content="首 页" placement="bottom">
        <img src="../../../assets/images/logo.png" class="logo-img">
      </el-tooltip>
    </router-link>
    <!-- 右边的系统名字用户信息等 -->
    <div class="right">
      <div class="content f-df" sw-align="center">
        <div class="f-f1"><img src="../../../assets/images/icon_title.png"  style="padding-left: 30px;height:62px;"/></div>
        <!-- 消息 -->
        <!--<div class="f-cp sys-info">-->
          <!--<el-badge :value="1">-->
            <!--<span class="f-fs18">公告通知</span>-->
          <!--</el-badge>-->
        <!--</div>-->
        <!-- 用户中心:退出登录，修改密码 -->
        <user-info></user-info>
      </div>
    </div>
  </div>
</template>

<script>
import userInfo from "./userInfo";
export default {
  components:{
    userInfo
  },
  data() {
    return {
      title: "农资经营管理系统",
    };
  },
  methods: {
    message() {
      router.push("/manage/message/index");
    },
    markdown() {
      router.push("/manage/markdown/index");
    }
  }
};
</script>
<style lang="scss" scoped>
#app-head {
  height: 62px;
  width: 100%;
  display: flex;
  align-items: center;
  color: #fff;
  .left {
    z-index:101;
    height: 100%;
    width: 150px;
    border-bottom:1px solid #f5f7fa;
    line-height: 62px;
  }
  .logo-img {
    width:110px;
  }
  .right {
    flex: 1;
    background: url("../../../assets/images/header-bg.png");
    background-size: 100% 62px;
    .content {
      width: 100%;
      height: 62px;
      background: rgba(0, 0, 0, 0.3);
      .sys-title {
        font-size: 30px;
        padding-left: 50px;
      }
    }
  }
}
</style>
