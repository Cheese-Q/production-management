<template>
  <div style="padding-bottom:100px" class="main-info">
    <!-- 头部切换页面 -->
    <div class="tabs  f-df f-cp">
      <div :class="[currentTab==1?'tab-active':'','tab-item']" @click="currentTab=1">基本信息</div>
      <div :class="[currentTab==2?'tab-active':'','tab-item']" @click="currentTab=2">许可证信息</div>
    </div>
    <div v-show="currentTab==1">
      <base-info></base-info>
    </div>
    <div v-show="currentTab==2">
      <main-pic></main-pic>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import baseInfo from './base.vue'
  import mainPic from './mainpic.vue'

  export default {
    components: {
      baseInfo,
      mainPic
    },
    data() {
      return {
        currentTab: 1,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tabs {
    height: 40px;
    margin-top: 15px;
    margin-bottom: 30px;
    background: #d7d7d7;
    color: #333;

    .tab-item {
      padding: 0 10px;
      line-height: 40px;
      border-right: 1px solid #fff;
    }

    .tab-active {
      color: #fff;
      background: #00aac7;
    }
  }
</style>



