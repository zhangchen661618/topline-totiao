<template>
  <div>
    <!-- 导航头 -->
    <van-nav-bar title="登陆"/>
    <!--输入框  -->
    <van-cell-group>
        <!-- 使用 VeeValidate  1.通过v-validate 设置验证规则  2.设置文本框的name属性  3.展示验证错误信息-->
        <van-field
         v-validate="'required|digits:11'"
         name="mobile"
         :error-message="errors.first('mobile')"
         clearable
         v-model="user.mobile"
         left-icon="phone-o"
         placeholder="请输入手机号码" />

        <van-field
         v-validate="'required|digits:6'"
         name="code"
         :error-message="errors.first('code')"
        v-model="user.code"
        left-icon="star-o"
        placeholder="请输入验证码" >
            <van-button slot="button" type="default" size='small'>获取验证码</van-button>
        </van-field>
    </van-cell-group>
    <!-- 登陆按钮 -->
    <div class="login-btn">
        <van-button
         :loading="loading"
         loading-type="spinner"
         loading-text="登录中..."
         class="btn"
         type="info"
         @click="handleLogin">登陆</van-button>
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
      },
      loading: false // 控制登陆按钮是否显示加载
    }
  },
  created () {
    // 配置 VeeValidate 的验证信息
    const dict = {
      custom: {
        // 验证的文本信息
        mobile: {
          // 验证规则之后失败的提示信息
          required: '请输入手机号码',
          digits: '手机号码为11位数字'
        },
        code: {
          // 验证规则之后失败的提示信息
          required: '请输入验证码',
          digits: '验证码为6位数字'
        }
      }
    }
    this.$validator.localize('custom', dict)
  },
  methods: {
    ...mapMutations(['setUser']),
    // 点击按钮处理登陆
    async handleLogin () {
      this.loading = true
      try {
        // 表单验证
        // validate() 返回的是promise对象，所有可以使用 await调用
        const valid = await this.$validator.validate()
        if (!valid) {
          this.loading = false
          return // 验证失败直接出去
        }
        // 验证成功
        const data = await login(this.user)
        // 存储登陆的状态  1,vuex 2,本地存储  这两件事在 store 中完成
        this.setUser(data)
        // 跳转到首页
        // 获取url上的查询字符串 redirect
        // 如果获取到redirect ，跳转到redirect指向地址
        // 如果没有redirect跳转首页
        this.$router.push(this.$route.query.redirect || '/')
        this.$toast.success('登陆成功')
      } catch (err) {
        this.$toast.fail('登陆失败')
      }
      this.loading = false
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
