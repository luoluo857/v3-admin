import request from './request'

// 获取文章列表
export function getArticleList(params) {
  return request({
    url: '/api/articles',
    method: 'GET',
    params
  })
}

// 获取文章详情
export function getArticleDetail(params) {
  return request({
    url: `/api/articles/${params.id}`,
    method: 'GET'
  })
}

// 新增文章
export function createArticle(params) {
  return request({
    url: '/api/articles',
    method: 'POST',
    data: params
  })
}

// 更新文章
export function updateArticle(params) {
  return request({
    url: `/api/articles/${params.id}`,
    method: 'PUT',
    data: params
  })
}

// 删除文章
export function deleteArticle(params) {
  return request({
    url: `/api/articles/${params.id}`,
    method: 'DELETE'
  })
}
