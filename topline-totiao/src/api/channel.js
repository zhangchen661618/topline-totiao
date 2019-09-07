import request from '../utils/request'

/**
 * 获取频道列表
 * 1，用户登录，获取登陆用户的频道列表
 * 2，用户没有登陆，默认列表
 */
export const getDefaultOrUserChannels = () => {
  return request.get('/app/v1_0/user/channels')
}
// 获取所有频道
export const getAllChannels = () => {
  return request.get('/app/v1_0/channels')
}
