import request from '../utils/request'

/**
 * 获取文章列表(登陆和不登陆)
 * @param {*} 参数是  channel_id, timestamp, with_top
 */
export const getArticles = ({
  // 频道id  时间戳  是否包含置顶1  0不包含
  channel_id,
  timestamp,
  with_top
}) => {
  return request.get('/app/v1_1/articles', {
    params: {
      channel_id,
      timestamp,
      with_top
    }
  })
}

// 不喜欢的文章
export const dislikeArticle = (id) => {
  return request.post('/app/v1_0/article/dislikes', {
    target: id // 文章的id
  })
}

// 举报文章
export const reportArtice = ({
  target, // 文章id
  type // 举报类型
}) => {
  return request.post('/app/v1_0/article/reports', {
    target,
    type
  })
}
