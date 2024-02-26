<template>
  <div id="app" style="background-color: #F2F5FA;">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>


<style  lang="scss" scoped>
::v-deep .el-message--error{
  font-size: 20px;
}
</style>