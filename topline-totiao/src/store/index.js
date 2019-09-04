import Vue from 'vue'
import Vuex from 'vuex'
import * as storageTools from '../utils/localStorage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // {token,refresh_token:}
    // 项目运行时，先去本地存储中获取登陆状态
    user: storageTools.getItem('user')
  },
  mutations: {
    // 通过mutation改变状态
    setUser (state, user) {
      state.user = user

      // 把登陆状态存储到本地存储中
      storageTools.setItem('user', user)
    }
  },
  actions: {

  }
})
