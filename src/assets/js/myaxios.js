import Axios from 'axios'
var myaxios = {}
myaxios.install = function (vue) {
  // 创建一个对象
  var instance = Axios.create({
    baseURL: '/web'

  })
  vue.prototype.$http = instance
}
// 暴露
export default myaxios
