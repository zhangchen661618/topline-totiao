import axios from 'axios'

// 创建一个axios 的实例 设置不同的 baseURL
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})
export default instance
