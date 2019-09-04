import Vue from 'vue'
import Router from 'vue-router'
import Tabbar from '../views/Tabbar.vue'
import Home from '../views/home/index.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tabber',
      component: Tabbar,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    }
  ]
})
