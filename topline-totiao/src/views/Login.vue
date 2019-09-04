<template>
  <div>
    <!-- 导航头 -->
    <van-nav-bar title="登陆"/>
    <!--输入框  -->
    <van-cell-group>
        <van-field v-model="user.mobile"  left-icon="phone-o" placeholder="请输入手机号码" />
        <van-field v-model="user.code"  left-icon="star-o" placeholder="请输入验证码" >
            <van-button slot="button" type="default" size='small'>发送验证码</van-button>
        </van-field>
    </van-cell-group>
    <!-- 登陆按钮 -->
    <div class="login-btn">
        <van-button class="btn" type="info" @click="handleLogin">登陆</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '../api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    // 点击按钮处理登陆
    async handleLogin () {
      try {
        // data 就是接口返回数据中的data 因为响应拦截器做了处理
        const data = await login(this.user)
        // 存储登陆的状态
        //  1,vuex
        // 2,本地存储  这两件事在 store 中完成
        // this.$store.commit('setUser', data)
        this.setUser(data)

        // 跳转到首页
        this.$router.push('/')
        this.$toast.fail('登陆成功')
      } catch (err) {
        this.$toast.fail('登陆失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .login-btn{
        padding: 15px;
        .btn{
            width: 100%;
        }
    }
</style>
