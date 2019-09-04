import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '../store'
// 创建一个axios 的实例 设置不同的 baseURL
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 获取到服务器返回的数据，并且在处理数据之前使用使用大数字
// transformResponse 在响应拦截器之前执行
instance.defaults.transformResponse = [function (data) {
  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]
// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // 判断是否有登陆状态  主要，此处是一个普通的js模块，不是组件，要导入store
  if (store.state.user) {
    // 如果有登陆状态请求的时候，自动携带token
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Do something with response data

  // 接口返回的数据中都有data，在此处统一返回接口返回的data
  // 如果接口返回数据中没有data，此时返回axios响应对象的data属性
  return response.data.data || response.data
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})
export default instance
