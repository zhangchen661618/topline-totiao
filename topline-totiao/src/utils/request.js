import axios from 'axios'
import JSONbig from 'json-bigint'
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
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  console.log(response)
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})
export default instance
