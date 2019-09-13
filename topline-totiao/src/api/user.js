import request from '@/utils/request'

/**
 * 登陆的方法
 * @param {*} 登陆提交服务器的数据，mobile code
 */
export const login = ({
  mobile,
  code
}) => {
  return request.post('/app/v1_0/authorizations', {
    mobile,
    code
  })
}

// 拉黑作者 id 是 作者的id
export const blacklists = (id) => {
  return request.post('/app/v1_0/user/blacklists', {
    target: id
  })
}

// 关注用户
export const followUser = (id) => {
  return request.post('/app/v1_0/user/followings', {
    // 关注用户的id
    target: id
  })
}

// 取消关注用户
export const unFollowUser = (id) => {
  return request.delete(`/app/v1_0/user/followings/${id}`)
}

// 获取当前登录的用户信息
export const getUserInfo = () => {
  return request.get('/app/v1_0/user')
}

// 获取当前登录的用户的资料
export const getUserProfile = () => {
  return request.get('/app/v1_0/user/profile')
}

// 上传图片文件
export const uploadPhoto = (key, file) => {
  const formData = new FormData()
  formData.append(key, file)
  return request.patch('/app/v1_0/user/photo', formData)
}

// 获取关注用户列表
export const getFollowings = ({
  page,
  perpage
}) => {
  return request.get('/app/v1_0/user/followings', {
    page,
    per_page: perpage
  })
}

// 获取粉丝用户列表
export const getFollowers = ({
  page,
  perpage
}) => {
  return request.get('/app/v1_0/user/followers', {
    page,
    per_page: perpage
  })
}
