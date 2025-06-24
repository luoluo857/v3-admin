import request from './request'

// 获取分类列表
export function getCategories(params) {
  return request({
    url: '/api/categories',
    method: 'GET',
    params
  })
}

// 添加分类
export function addCategory(params) {
  return request({
    url: '/api/categories',
    method: 'POST',
    data: params
  })
}

// 修改分类
export function updateCategory(params) {
  return request({
    url: `/api/categories/${params.id}`,
    method: 'PUT',
    data: params
  })
}

// 删除分类
export function deleteCategory(params) {
  return request({
    url: `/api/categories/${params.id}`,
    method: 'DELETE'
  })
}
