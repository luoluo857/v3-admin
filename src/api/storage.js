import request from './request'

// 获取存储配置
export function getStorageConfig() {
  return request({
    url: '/api/storage/config',
    method: 'GET'
  })
}

// 保存存储配置
export function saveStorageConfig(params) {
  return request({
    url: '/api/storage/config',
    method: 'POST',
    data: params
  })
}

// 重置存储配置
export function resetStorageConfig() {
  return request({
    url: '/api/storage/config/reset',
    method: 'POST'
  })
}
