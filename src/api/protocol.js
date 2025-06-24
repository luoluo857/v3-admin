import request from './request'

// 获取协议列表
export function getProtocols(params) {
  return request({
    url: '/api/protocol/list',
    method: 'GET',
    params
  })
}

// 获取协议详情
export function getProtocol(params) {
  return request({
    url: `/api/protocol/${params.id}`,
    method: 'GET'
  })
}

// 新增协议
export function addProtocol(params) {
  return request({
    url: '/api/protocol',
    method: 'POST',
    data: params
  })
}

// 更新协议
export function updateProtocol(params) {
  return request({
    url: `/api/protocol/${params.id}`,
    method: 'PUT',
    data: params
  })
}

// 删除协议
export function deleteProtocol(params) {
  return request({
    url: `/api/protocol/${params.id}`,
    method: 'DELETE'
  })
}

