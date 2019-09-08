// 获取搜索建议
import request from '../utils/request'
export const getSuggestion = (q) => {
  return request.get('/app/v1_0/suggestion', {
    params: {
      q
    }
  })
}

// 获取搜索结果
export const getSearchResults = ({
  page, // 页面
  per_page, // 每条显示多少页
  q // 搜索的关键字
}) => {
  return request.get('/app/v1_0/search', {
    params: {
      page, // 页面
      per_page, // 每条显示多少页
      q // 搜索的关键字
    }
  })
}
