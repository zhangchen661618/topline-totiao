import request from '../utils/request'

// 获取评论列表
export const getComments = ({
  isArticle,
  source, // 源id，文章id或评论id
  offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
  limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
}) => {
  return request.get('/app/v1_0/comments', {
    params: {
      // a 文章的评论  c 评论的评论
      type: isArticle ? 'a' : 'c',
      source,
      offset,
      limit
    }
  })
}

// 发布评论
export const sendComment = ({
  target, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
  content, // 评论内容
  artId // 文章id
}) => {
  return request.post('/app/v1_0/comments', {
    target,
    content,
    art_id: artId
  })
}
