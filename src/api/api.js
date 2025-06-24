import request from '@/api/request'

// 登录接口
export function login(params) {
  return request({
    url: '/api/login',
    method: 'POST',
    data: params
  })
}

//用户
// 获取用户
export function getUser(params) {
  return request({
    url: '/api/users',
    method: 'GET',
    params
  })
}
// 添加用户
export function addUser(params) {
  return request({
    url: '/api/users',
    method: 'POST',
    data: params
  })
}
// 修改用户
export function updateUser(params) {
  return request({
    url: '/api/users/' + params.id,
    method: 'PUT',
    data: params
  })
}
// 删除用户
export function deleteUser(params) {
  return request({
    url: '/api/users/' + params.id,
    method: 'DELETE',
    data: params
  })
}

//角色
// 获取角色
export function getRoles(params) {
  return request({
    url: '/api/roles',
    method: 'GET',
    params
  })
}
// 添加角色
export function addRole(params) {
  return request({
    url: '/api/roles/add',
    method: 'POST',
    data: params
  })
}
// 修改角色
export function updateRole(params) {
  return request({
    url: '/api/roles/edit',
    method: 'PUT',
    data: params
  })
}
// 删除角色
export function deleteRole(params) {
  return request({
    url: '/api/roles/' + params.id,
    method: 'DELETE',
    data: params
  })
}

//菜单
//获取菜单
export function getMenus() {
  return request({
    url: '/api/menus',
    method: 'GET'
  })
}
// 添加菜单
export function addMenu(params) {
  return request({
    url: '/api/menus',
    method: 'POST',
    data: params
  })
}
// 修改菜单
export function updateMenu(params) {
  return request({
    url: '/api/menus/edit',
    method: 'PUT',
    data: params
  })
}
// 删除菜单
export function deleteMenu(params) {
  return request({
    url: '/api/menus/' + params.id,
    method: 'DELETE',
    data: params
  })
}

