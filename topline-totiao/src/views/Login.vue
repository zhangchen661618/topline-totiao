<template>
  <div>
    <!-- 导航头 -->
    <van-nav-bar title="登陆"/>
    <!--输入框  -->
    <van-cell-group>
        <van-field v-model="value"  left-icon="phone-o" placeholder="请输入手机号码" />
        <van-field v-model="value"  left-icon="star-o" placeholder="请输入验证码" >
            <van-button slot="button" type="default" size='small'>发送验证码</van-button>
        </van-field>
    </van-cell-group>
    <!-- 登陆按钮 -->
    <div class="login-btn">
        <van-button class="btn" type="info">登陆</van-button>
    </div>
  </div>
</template>

<script>
export default {

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
