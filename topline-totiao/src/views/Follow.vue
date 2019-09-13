<template>
  <div>
      <!-- 导航头 -->
    <van-nav-bar
        title="关注/粉丝"
        left-arrow
        @click-left="$router.back()"
    />
      <!-- tabs -->
    <van-tabs v-model="active" color='blue'>
        <van-tab title="关注">内容 1</van-tab>
        <van-tab title="粉丝">内容 2</van-tab>
    </van-tabs>
      <!-- list 列表 -->
  </div>
</template>

<script>
export default {
  name: 'Follow',
  data () {
    return {
      active: 1
    }
  },
  // keep-alive 的钩子函数，当组件激活的时候执行
  activated () {
    // 获取 url 上的查询字符串
    const type = this.$route.query.type
    if (type === '1') {
      this.active = 0
    } else {
      this.active = 1
    }
  }
}
</script>

<style>

</style>
