import request from './request'

// 获取协议分类列表
export function getProCategories(params) {
  return request({
    url: '/api/pro-categories',
    method: 'GET',
    params
  })
}

// 新增协议分类
export function addProCategory(params) {
  return request({
    url: '/api/pro-categories',
    method: 'POST',
    data: params
  })
}

// 更新协议分类
export function updateProCategory(params) {
  return request({
    url: `/api/pro-categories/${params.id}`,
    method: 'PUT',
    data: params
  })
}

// 删除协议分类
export function deleteProCategory(params) {
  return request({
    url: `/api/pro-categories/${params.id}`,
    method: 'DELETE'
  })
}
