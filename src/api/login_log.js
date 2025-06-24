import request from './request'

// 获取登录日志列表
export function getLoginLogs(params) {
  return request({
    url: '/api/log/login',
    method: 'get',
    params
  })
}
