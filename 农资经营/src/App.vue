<template>
  <section class="body-warp">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
  <router-view v-if="isRouterAlive"/>
</template>
<template>
  <router-view v-if="isRouterAlive"/>
</template>
<script type="text/javascript">
  export default {
    name: 'app',
    data () {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      }
    }
  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .body-warp {
    animation: fadeIn .5s ease;
    height:100%;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
</style>
