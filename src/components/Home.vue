<template>
  <div>
    <el-button type='info' @click='logout'>退出系统</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout: function () {
      // 清除客户端中的Token 即出系统
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang='less' scoped>
</style>
