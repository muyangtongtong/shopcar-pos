// 封装ajax请求
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

let baseURL = '/web'
// 2018-9-29 16:34:07 单点登录统一拦截
let instance = axios.create({
  baseURL,
  timeout: 300000,
  withCredentials: true,
  headers: {'Content-Type': 'application/json;charset=UTF-8'}
})
instance.interceptors.response.use(function (response) {
  if (response.headers.sessionstatus === 'timeout' || response.headers.Sessionstatus === 'timeout') {
    window.location.href = window.location.origin + `${baseURL}/login`
  }
  return response
}, function (error) {
  Message.error('网络异常，请重试')
  return Promise.reject(error)
})
// 2018-9-29 16:44:50 重置组件库的instance
// http.axiosInstance = instance
function queue (source) { // 负责存队列
  const _id = `${+new Date()}${Math.ceil(Math.random() * 10000)}`
  xhrQueue[_id] = source
  return _id
}
function queueCleaner (id) { // 删除队列中某个source
  delete xhrQueue[id]
}
function xhrCancel () { // 清除所有队列
  Object.keys(xhrQueue).forEach(id => {
    let source = xhrQueue[id]
    source.cancel() // 退订
  })
}
let xhrQueue = {}
let loading = {show: 0, fullShow: 0}
function requet (method, url, params = {}, options = {}) {
  loading.fullShow++
  if (!store.state.loading.fullShow) {
    store.commit('setLoadingFull', true)
  }
  if (method === 'get') {
    options.params = params
  } else {
    options.data = params
  }
  const config = Object.assign({
    url,
    method
  }, options)
  return new Promise((resolve, reject) => {
    let source = axios.CancelToken.source()
    config.cancelToken = source.token
    const queueId = queue(source) // 存进队列
    instance.request(config).then(res => {
      resolve(res)
    }).catch(error => {
      if (error.message.indexOf('timeout') === 0) {
        Message({
          message: '请求超时，请稍后重试',
          type: 'warning',
          duration: 2000
        })
      }
      reject(error)
    }).finally(() => {
      queueCleaner(queueId)
      setTimeout(() => {
        loading.fullShow--
        if (loading.fullShow < 1) {
          store.commit('setLoadingFull', false)
          loading.fullShow = 0
        }
      }, 10)
    })
  })
}

let $http = {
  post: requet.bind(null, 'post'),
  get: requet.bind(null, 'get'),
  cancel: xhrCancel,
  baseURL
}
export default $http
