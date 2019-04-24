// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'
import '../node_modules/font-awesome/css/font-awesome.min.css'
// 引入axios
import $http from '@/assets/js/http'

// 注册

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.$http = $http
/* eslint-disable no-new */
Vue.config.productionTip = false
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
