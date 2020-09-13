import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/css/global.css' // 导入全局样式表
import './assets/fonts/iconfont.css' // 导入字体图标

import axios from 'axios'

Vue.prototype.$http = axios

// 配置请求根路径
axios.defaults.baseURL = 'http://api.devlovas.com:3000/shops/admin/'
axios.interceptors.request.use(config => {
  // 为请求头添加Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
