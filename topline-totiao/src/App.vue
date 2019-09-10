<template>
  <div id="app">
    <!-- 使用keep-alive缓存动态切换的组件 -->
    <keep-alive exclude="Detail">
       <router-view/>
    </keep-alive>

  </div>
</template>

<style lang="less">

</style>
