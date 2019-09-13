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
        <van-tab title="关注">
          <user-list :type="type"></user-list>
        </van-tab>
        <van-tab title="粉丝">
          <user-list :type="type"></user-list>
        </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import UserList from './component/UserList'
export default {
  name: 'Follow',
  components: {
    UserList
  },
  data () {
    return {
      active: 0,
      // 1显示关注 2粉丝
      type: '1'
    }
  },
  // keep-alive 的钩子函数，当组件激活的时候执行
  activated () {
    // 获取 url 上的查询字符串
    this.type = this.$route.query.type
    if (this.type === '1') {
      this.active = 0
    } else {
      this.active = 1
    }
  }
}
</script>

<style>

</style>
