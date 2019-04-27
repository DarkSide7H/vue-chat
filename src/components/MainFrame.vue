<template>
  <div>
    <h1>这是新路由页面</h1>
    <a @click="goHome">跳转首页</a>
  </div>
</template>

<script>
export default {
  name: 'demo',
  methods: {
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
