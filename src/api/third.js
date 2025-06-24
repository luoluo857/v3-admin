import request from './request'

// 获取配置列表
export function getServiceConfigs(params) {
  return request({
    url: '/api/service-config/list',
    method: 'GET',
    params
  })
}

// 获取配置详情
// export function getServiceConfig(id) {
//   return request({
//     url: `/api/service-config/${id}`,
//     method: 'GET'
//   })
// }

// 新增配置
export function addServiceConfig(params) {
  return request({
    url: '/api/service-config',
    method: 'POST',
    data: params
  })
}

// 更新配置
export function updateServiceConfig(params) {
  return request({
    url: `/api/service-config/${params.id}`,
    method: 'PUT',
    data: params
  })
}

// 删除配置
export function deleteServiceConfig(params) {
  return request({
    url: `/api/service-config/${params.id}`,
    method: 'DELETE'
  })
}

// 获取服务类型枚举
export function getServiceTypes() {
  return request({
    url: '/api/service-config/service-types',
    method: 'GET'
  })
}
