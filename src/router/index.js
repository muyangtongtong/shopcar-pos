import Vue from 'vue'
import Router from 'vue-router'
// 导入组件
import Home from '@/views/home.vue'
import Index from '@/views/index.vue'
Vue.use(Router)

export default new Router({
  routes: [
    // 首页路径
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: 'index',
      name: 'index',
      component: Index
    }
  ]
})
