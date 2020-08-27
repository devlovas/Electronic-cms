import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/home', component: Home },
    { path: '/login', component: Login }
  ]
})

// 挂载路由导航守卫
router.beforeEach(function (to, from, next) {
  if (to.path === '/login') return next() // 当前如果是登录页则放行

  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) next('/login')
  else next()
})

export default router
